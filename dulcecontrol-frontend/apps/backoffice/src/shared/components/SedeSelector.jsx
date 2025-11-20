import { useEffect, useMemo } from 'react';
import { Button, Empty, Select, Spin, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getSedesAsignadas } from '../../features/admin/configuracion/api/sedes.api.js';
import { useTokenStore } from '../store/tokenStore.js';
import { useSedeStore } from '../store/sedeStore.js';

const selectStyle = {
  minWidth: 240,
  borderRadius: 12,
};

const SedeSelector = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const selectedSedeId = useSedeStore((state) => state.selectedSedeId);
  const selectedSedeNombre = useSedeStore((state) => state.selectedSedeNombre);
  const selectionTiendaId = useSedeStore((state) => state.selectedTiendaId);
  const setSelectedSede = useSedeStore((state) => state.setSelectedSede);
  const clearSelection = useSedeStore((state) => state.clearSelection);

  const {
    data: sedes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'configuracion', 'sedes', tiendaId],
    queryFn: () => getSedesAsignadas(tiendaId),
    enabled: Boolean(tiendaId),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!tiendaId) {
      clearSelection();
      return;
    }
    if (selectionTiendaId && selectionTiendaId !== tiendaId) {
      clearSelection();
    }
  }, [tiendaId, selectionTiendaId, clearSelection]);

  useEffect(() => {
    if (!tiendaId) {
      if (selectedSedeId) {
        clearSelection();
      }
      return;
    }
    if (!sedes.length) {
      if (!isLoading && selectedSedeId) {
        clearSelection();
      }
      return;
    }

    const current = sedes.find((sede) => sede.id === selectedSedeId);
    if (current) {
      if (current.nombre !== selectedSedeNombre) {
        setSelectedSede({ sedeId: current.id, sedeNombre: current.nombre, tiendaId });
      }
      return;
    }

    const preferred = sedes.find((sede) => sede.esPrincipal) ?? sedes[0];
    if (preferred) {
      setSelectedSede({ sedeId: preferred.id, sedeNombre: preferred.nombre, tiendaId });
    }
  }, [clearSelection, isLoading, sedes, selectedSedeId, selectedSedeNombre, setSelectedSede, tiendaId]);

  const options = useMemo(
    () =>
      sedes.map((sede) => ({
        label: sede.nombre,
        value: sede.id,
        sede,
      })),
    [sedes]
  );

  const handleChange = (nextSedeId) => {
    const nextSede = sedes.find((sede) => sede.id === nextSedeId);
    if (!nextSede) {
      clearSelection();
      return;
    }
    setSelectedSede({ sedeId: nextSede.id, sedeNombre: nextSede.nombre, tiendaId });
  };

  const notFoundContent = isLoading ? (
    <div style={{ padding: '8px', textAlign: 'center' }}>
      <Spin size="small" />
    </div>
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={tiendaId ? 'Sin sedes asignadas' : 'Selecciona una tienda'}
    />
  );

  const showDisabledState = !tiendaId || !sedes.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Select
        value={selectedSedeId ?? undefined}
        onChange={handleChange}
        options={options}
        placeholder={tiendaId ? 'Selecciona una sede' : 'Selecciona una tienda'}
        style={selectStyle}
        popupMatchSelectWidth={false}
        variant="filled"
        loading={isLoading}
        disabled={showDisabledState}
        notFoundContent={notFoundContent}
        status={isError ? 'error' : undefined}
        optionRender={(option) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{option.data.label}</span>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {option.data.sede?.direccion ?? 'Sin dirección configurada'}
            </Typography.Text>
          </div>
        )}
      />
      {isError && (
        <Typography.Text type="danger" style={{ fontSize: 12 }}>
          Error al cargar sedes.{' '}
          <Button type="link" size="small" onClick={() => refetch()} style={{ padding: 0 }}>
            Reintentar
          </Button>
        </Typography.Text>
      )}
    </div>
  );
};

export default SedeSelector;
