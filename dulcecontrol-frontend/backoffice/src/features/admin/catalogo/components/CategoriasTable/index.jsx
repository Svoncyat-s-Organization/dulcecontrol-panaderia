import { useEffect, useMemo, useState } from 'react';
import { App, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CategoriasTableView from './CategoriasTableView.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { createCategoria, getCategorias, deleteCategoria } from '../../api/categorias.api.js';
import { getProductoById, getProductos, putProducto } from '../../api/productos.api.js';
import { CATEGORIA_KEYS } from '../../constants/queryKeys.js';
import { PRODUCTO_KEYS } from '../../constants/queryKeys.js';
import { mapCategoriasResponse } from '../../utils/categoriaMappers.js';
import {
  buildProductoPayload,
  getProductoFormInitialValues,
  mapProductoResponse,
  mapProductosResponse,
} from '../../utils/productoMappers.js';
import CategoriaForm from '../CategoriaForm/index.jsx';

const CategoriasTable = () => {
  const { modal } = App.useApp();
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  // No se si esto sirva para paginar pero meh
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const { current, pageSize } = pagination;

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: CATEGORIA_KEYS.lists(tiendaId),
    queryFn: () => getCategorias(tiendaId),
    enabled: Boolean(tiendaId),
    select: (response) => mapCategoriasResponse(response ?? []),
  });

  const deleteMutation = useMutation({
    mutationFn: (categoriaId) => {
      if (!tiendaId) {
        throw new Error('No se pudo identificar la tienda activa');
      }
      return deleteCategoria(tiendaId, categoriaId);
    },
    onSuccess: () => {
      message.success('Categoría eliminada');
      queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.lists(tiendaId) });
      queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.lists(tiendaId) });
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo eliminar';
      message.error(detail);
    },
    onSettled: () => {
      setPendingDeleteId(null);
    },
  });

  const deletingId = pendingDeleteId;

  const handleCreate = () => {
    setSelectedCategoria(null);
    setIsModalOpen(true);
  };

  const handleEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoria(null);
  };

  const handleDelete = (categoria) => {
    if (!tiendaId) {
      message.error('No se pudo identificar la tienda activa');
      return;
    }

    if (pendingDeleteId) {
      message.warning('Ya hay una eliminación en curso. Espera un momento.');
      return;
    }

    const categoriaId =
      categoria?.id ??
      categoria?.categoriaId ??
      categoria?.idCategoria ??
      categoria?.categoria_id ??
      null;

    if (!categoriaId) {
      message.error('No se pudo identificar la categoría a eliminar');
      return;
    }

    const productosCount = Number(categoria?.productosCount ?? categoria?.productos_count ?? 0);

    const ensureSinCategoriaId = async () => {
      const response = await getCategorias(tiendaId);
      const mapped = mapCategoriasResponse(response ?? []);
      const found = mapped.find((c) => {
        const nombre = (c?.nombre ?? '').toString().trim().toLowerCase();
        const slug = (c?.slug ?? '').toString().trim().toLowerCase();
        return slug === 'sin-categoria' || nombre === 'sin categoria' || nombre === 'sin categoría';
      });
      if (found?.id) return found.id;

      const created = await createCategoria(tiendaId, {
        nombre: 'Sin categoría',
        slug: 'sin-categoria',
        descripcion: 'Categoría por defecto para productos sin asignación.',
        urlImagen: '',
        activa: true,
        ordenVisual: 0,
      });
      return created?.id;
    };

    const reassignProductos = async (targetCategoriaId) => {
      const productosRaw = await getProductos(tiendaId);
      const productosList = Array.isArray(productosRaw)
        ? productosRaw
        : productosRaw?.content ?? productosRaw?.items ?? productosRaw?.data ?? [];
      const productos = mapProductosResponse(productosList ?? []);
      const afectados = productos.filter((p) => (p?.categoriaId ?? null) === categoriaId);
      if (!afectados.length) return 0;

      for (const producto of afectados) {
        // Backend exige payload completo (ProductoUpdateRequest). Preservamos slug actual.
        try {
          const values = getProductoFormInitialValues(producto);
          values.categoriaId = targetCategoriaId;
          values.slug = producto?.slug;
          const payload = buildProductoPayload(values, producto);
          payload.categoriaId = targetCategoriaId;
          await putProducto(tiendaId, producto.id, payload);
        } catch {
          // Fallback: traer producto completo y reintentar con datos completos.
          const fullRaw = await getProductoById(tiendaId, producto.id);
          const fullProducto = mapProductoResponse(fullRaw) ?? fullRaw;
          const values = getProductoFormInitialValues(fullProducto);
          values.categoriaId = targetCategoriaId;
          values.slug = fullProducto?.slug;
          const payload = buildProductoPayload(values, fullProducto);
          payload.categoriaId = targetCategoriaId;
          await putProducto(tiendaId, producto.id, payload);
        }
      }

      return afectados.length;
    };

    modal.confirm({
      title: `Eliminar ${categoria.nombre}?`,
      content:
        Number.isFinite(productosCount) && productosCount > 0
          ? `Esta categoría tiene ${productosCount} producto(s). Antes de eliminarla, los productos se reasignarán a “Sin categoría”. Esta acción no se puede deshacer.`
          : 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        setPendingDeleteId(categoriaId);
        try {
          if (Number.isFinite(productosCount) && productosCount > 0) {
            try {
              const count = await reassignProductos(null);
              if (count > 0) {
                message.success(`Reasignados ${count} producto(s) a “Sin categoría”.`);
              }
            } catch (error) {
              // Fallback: si backend no acepta categoriaId null, usar una categoría real "Sin categoría".
              const sinCategoriaId = await ensureSinCategoriaId();
              if (!sinCategoriaId) {
                throw error;
              }
              const count = await reassignProductos(sinCategoriaId);
              if (count > 0) {
                message.success(`Reasignados ${count} producto(s) a “Sin categoría”.`);
              }
              queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.lists(tiendaId) });
            }
            queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.lists(tiendaId) });
          }
          await deleteMutation.mutateAsync(categoriaId);
        } catch (error) {
          const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo completar la operación';
          message.error(detail);
          setPendingDeleteId(null);
        }
      },
    });
  };

  const categorias = useMemo(() => data, [data]);

  useEffect(() => {
    setPagination((prev) => {
      if (!categorias.length) {
        return prev.current === 1 ? prev : { ...prev, current: 1 };
      }

      const maxPage = Math.max(1, Math.ceil(categorias.length / prev.pageSize));
      if (prev.current > maxPage) {
        return { ...prev, current: maxPage };
      }
      return prev;
    });
  }, [categorias.length]);

  const handlePaginate = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const tablePagination = useMemo(
    () => ({
      current,
      pageSize,
      total: categorias.length,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50'],
      showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} categorías`,
    }),
    [categorias.length, current, pageSize]
  );

  return (
    <>
      <CategoriasTableView
        categorias={categorias}
        loading={isLoading}
        isError={isError}
        onRetry={refetch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
        pagination={tablePagination}
        onPaginate={handlePaginate}
      />

      <CategoriaForm
        open={isModalOpen}
        onClose={handleCloseModal}
        tiendaId={tiendaId}
        categoria={selectedCategoria}
      />
    </>
  );
};

export default CategoriasTable;
