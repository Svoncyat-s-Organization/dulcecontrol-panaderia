import { useState } from 'react';
import { Modal, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getDatosEmpresa, updateDatosEmpresa } from '../../api/datos-empresa.api.js';
import { DATOS_EMPRESA_KEYS } from '../../constants/queryKeys.js';
import DatosEmpresaFormView from './DatosEmpresaFormView.jsx';

const DatosEmpresaForm = () => {
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      message.success('Datos de empresa actualizados correctamente');
      queryClient.invalidateQueries({ queryKey: DATOS_EMPRESA_KEYS.byTienda(tiendaId) });
      setIsSubmitting(false);
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Error al actualizar datos de empresa';
      message.error(detail);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (values) => {
    Modal.confirm({
      title: '¿Confirmar cambios en Datos de Empresa?',
      content: 'Los cambios afectarán a los futuros comprobantes de pago. Los históricos quedan intactos.',
      okText: 'Confirmar',
      okType: 'primary',
      cancelText: 'Cancelar',
      onOk: () => {
        setIsSubmitting(true);
        updateMutation.mutate(values);
      },
    });
  };

  return (
    <DatosEmpresaFormView
      datosEmpresa={datosEmpresa}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
};

export default DatosEmpresaForm;
