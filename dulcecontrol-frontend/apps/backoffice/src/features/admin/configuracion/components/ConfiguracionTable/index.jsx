import { useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ConfiguracionTableView from './ConfiguracionTableView.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getConfiguracionTienda, updateConfiguracionTienda } from '../../api/configuracion.api.js';
import { getPaginasStorefront, updatePaginaStorefront } from '../../api/paginas-storefront.api.js';
import { CONFIGURACION_KEYS, PAGINAS_STOREFRONT_KEYS } from '../../constants/queryKeys.js';
import { mapConfiguracionTiendaResponse, mapPaginasStorefrontResponse } from '../../utils/configuracionMappers.js';
import ConfiguracionViewModal from '../ConfiguracionViewModal/index.jsx';
import ConfiguracionEditModal from '../ConfiguracionEditModal/index.jsx';

const ConfiguracionTable = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const queryClient = useQueryClient();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState(null); // 'configuracion' or 'pagina'

  // Fetch configuración tienda
  const {
    data: configuracionData,
    isLoading: isLoadingConfiguracion,
    isError: isErrorConfiguracion,
    refetch: refetchConfiguracion
  } = useQuery({
    queryKey: CONFIGURACION_KEYS.tienda(tiendaId),
    queryFn: () => getConfiguracionTienda(tiendaId),
    enabled: Boolean(tiendaId),
    select: (response) => mapConfiguracionTiendaResponse(response ?? {}),
  });

  // Fetch páginas storefront
  const {
    data: paginasData = [],
    isLoading: isLoadingPaginas,
    isError: isErrorPaginas,
    refetch: refetchPaginas
  } = useQuery({
    queryKey: PAGINAS_STOREFRONT_KEYS.lists(tiendaId),
    queryFn: () => getPaginasStorefront(tiendaId),
    enabled: Boolean(tiendaId),
    select: (response) => mapPaginasStorefrontResponse(response ?? []),
  });

  // Mutations
  const updateConfiguracionMutation = useMutation({
    mutationFn: (payload) => updateConfiguracionTienda(tiendaId, payload),
    onSuccess: () => {
      message.success('Configuración actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: CONFIGURACION_KEYS.tienda(tiendaId) });
      setIsEditModalOpen(false);
      setSelectedItem(null);
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Error al actualizar configuración';
      message.error(detail);
    },
  });

  const updatePaginaMutation = useMutation({
    mutationFn: ({ paginaId, payload }) => updatePaginaStorefront(tiendaId, paginaId, payload),
    onSuccess: () => {
      message.success('Página actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: PAGINAS_STOREFRONT_KEYS.lists(tiendaId) });
      setIsEditModalOpen(false);
      setSelectedItem(null);
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Error al actualizar página';
      message.error(detail);
    },
  });

  const handleView = (item, type) => {
    setSelectedItem(item);
    setItemType(type);
    setIsViewModalOpen(true);
  };

  const handleEdit = (item, type) => {
    setSelectedItem(item);
    setItemType(type);
    setIsEditModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedItem(null);
    setItemType(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
    setItemType(null);
  };

  const handleSaveConfiguracion = (values) => {
    Modal.confirm({
      title: '¿Estás seguro de aplicar estos cambios?',
      content: 'Los cambios en la configuración de la tienda se aplicarán inmediatamente.',
      okText: 'Aplicar Cambios',
      okType: 'primary',
      cancelText: 'Cancelar',
      onOk: () => updateConfiguracionMutation.mutate(values),
    });
  };

  const handleSavePagina = (values) => {
    Modal.confirm({
      title: '¿Estás seguro de aplicar estos cambios?',
      content: 'Los cambios en la página se aplicarán inmediatamente.',
      okText: 'Aplicar Cambios',
      okType: 'primary',
      cancelText: 'Cancelar',
      onOk: () => updatePaginaMutation.mutate({
        paginaId: selectedItem.id,
        payload: values
      }),
    });
  };

  // Combine data for the table
  const tableData = [];

  // Add configuración tienda as first row
  if (configuracionData) {
    tableData.push({
      id: 'configuracion',
      type: 'configuracion',
      name: 'Configuración de Tienda',
      description: `${configuracionData.razonSocial || 'Sin razón social'} - ${configuracionData.ruc || 'Sin RUC'}`,
      status: 'Activa',
      data: configuracionData,
    });
  }

  // Add páginas storefront
  paginasData.forEach(pagina => {
    tableData.push({
      id: `pagina-${pagina.id}`,
      type: 'pagina',
      name: pagina.titulo,
      description: `Slug: ${pagina.slug} - Orden: ${pagina.ordenMenu}`,
      status: pagina.activa ? 'Activa' : 'Inactiva',
      data: pagina,
    });
  });

  const isLoading = isLoadingConfiguracion || isLoadingPaginas;
  const isError = isErrorConfiguracion || isErrorPaginas;

  return (
    <>
      <ConfiguracionTableView
        data={tableData}
        loading={isLoading}
        isError={isError}
        onRetry={() => {
          refetchConfiguracion();
          refetchPaginas();
        }}
        onView={handleView}
        onEdit={handleEdit}
      />

      <ConfiguracionViewModal
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        item={selectedItem}
        itemType={itemType}
      />

      <ConfiguracionEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        item={selectedItem}
        itemType={itemType}
        onSave={itemType === 'configuracion' ? handleSaveConfiguracion : handleSavePagina}
        loading={updateConfiguracionMutation.isPending || updatePaginaMutation.isPending}
      />
    </>
  );
};

export default ConfiguracionTable;