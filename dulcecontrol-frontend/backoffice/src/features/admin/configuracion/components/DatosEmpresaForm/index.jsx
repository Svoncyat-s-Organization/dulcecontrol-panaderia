import { useState } from 'react';
import { App } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getDatosEmpresa, updateDatosEmpresa } from '../../api/datos-empresa.api.js';
import { DATOS_EMPRESA_KEYS } from '../../constants/queryKeys.js';
import DatosEmpresaFormView from './DatosEmpresaFormView.jsx';

const DatosEmpresaForm = () => {
  const { notification } = App.useApp();
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(null);

  // Fetch datos empresa
  const {
    data: datosEmpresa,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: DATOS_EMPRESA_KEYS.byTienda(tiendaId),
    queryFn: () => getDatosEmpresa(tiendaId),
    enabled: Boolean(tiendaId),
  });

  // Mutation para actualizar
  const updateMutation = useMutation({
    mutationFn: (payload) => updateDatosEmpresa(tiendaId, payload),
    onSuccess: () => {
      setSaveFeedback({
        type: 'success',
        message: 'Cambios guardados',
        description: 'Los datos de empresa se actualizaron correctamente.',
      });
      notification.success({
        message: 'Cambios guardados',
        description: 'Los datos de empresa se actualizaron correctamente',
        placement: 'topRight',
        duration: 3,
      });
      queryClient.invalidateQueries({ queryKey: DATOS_EMPRESA_KEYS.byTienda(tiendaId) });
      setIsSubmitting(false);
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Error al actualizar datos de empresa';
      setSaveFeedback({
        type: 'error',
        message: 'Error al guardar',
        description: detail,
      });
      notification.error({
        message: 'Error al guardar',
        description: detail,
        placement: 'topRight',
        duration: 3,
      });
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    setSaveFeedback(null);
    updateMutation.mutate(values);
  };

  const handleDirty = () => {
    if (saveFeedback) setSaveFeedback(null);
  };

  return (
    <DatosEmpresaFormView
      datosEmpresa={datosEmpresa}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      saveFeedback={saveFeedback}
      onDirty={handleDirty}
    />
  );
};

export default DatosEmpresaForm;
