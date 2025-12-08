import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ActividadTimelineView from './ActividadTimelineView.jsx';
import {
  getActividadesPorSuperadmin,
  getActividadesSuperadmin,
  getSuperadminUsuarios,
} from '../../api/seguridad.api.js';
import { SUPERADMIN_SEGURIDAD_KEYS } from '../../constants/queryKeys.js';

const DEFAULT_LIMIT = 50;

const ActividadTimeline = () => {
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const usuariosQuery = useQuery({
    queryKey: SUPERADMIN_SEGURIDAD_KEYS.usuarios(),
    queryFn: () => getSuperadminUsuarios(),
    staleTime: 5 * 60 * 1000,
  });

  const actividadesQuery = useQuery({
    queryKey: selectedUsuarioId
      ? SUPERADMIN_SEGURIDAD_KEYS.actividadesPorUsuario(selectedUsuarioId, limit)
      : SUPERADMIN_SEGURIDAD_KEYS.actividades(limit),
    queryFn: () =>
      selectedUsuarioId
        ? getActividadesPorSuperadmin(selectedUsuarioId, { limit })
        : getActividadesSuperadmin({ limit }),
    keepPreviousData: true,
  });

  const usuarios = useMemo(() => usuariosQuery.data ?? [], [usuariosQuery.data]);
  const actividades = useMemo(() => actividadesQuery.data ?? [], [actividadesQuery.data]);

  const handleSelectUsuario = (value) => {
    setSelectedUsuarioId(value ?? null);
  };

  const handleChangeLimit = (value) => {
    setLimit(value);
  };

  return (
    <ActividadTimelineView
      actividades={actividades}
      usuarios={usuarios}
      selectedUsuarioId={selectedUsuarioId}
      onSelectUsuario={handleSelectUsuario}
      limit={limit}
      onChangeLimit={handleChangeLimit}
      loading={actividadesQuery.isLoading || actividadesQuery.isFetching}
      isError={actividadesQuery.isError}
      onRetry={actividadesQuery.refetch}
    />
  );
};

export default ActividadTimeline;
