import { Form, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PagoModalView from './PagoModalView';
import { registrarPago } from '../../api/pagos.api.js';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';

const PagoModal = ({ open, onClose, ordenCompra }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const tiendaId = useTokenStore((state) => state.tiendaId);

  const mutation = useMutation({
    mutationFn: (pagoData) => registrarPago(tiendaId, pagoData),
    onSuccess: async (data) => {
      console.log('✅ Pago registrado:', data);
      message.success('Pago registrado exitosamente');
      
      // Invalidar todas las queries de órdenes y pagos
      console.log('🔄 Actualizando datos...');
      await queryClient.invalidateQueries({ 
        queryKey: ['compras-ordenes'],
        exact: false
      });
      await queryClient.invalidateQueries({ 
        queryKey: ['historial-pagos'],
        exact: false
      });
      await queryClient.refetchQueries({ 
        queryKey: ['compras-ordenes'],
        exact: false,
        type: 'active'
      });
      
      console.log('✅ Datos actualizados');
      form.resetFields();
      onClose();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al registrar el pago');
    },
  });

  // Función para convertir archivo a base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Convertir imagen a base64
      let urlFotoComprobante = null;
      if (values.urlFotoComprobante && Array.isArray(values.urlFotoComprobante) && values.urlFotoComprobante.length > 0) {
        const file = values.urlFotoComprobante[0];
        if (file.originFileObj) {
          // Convertir a base64
          urlFotoComprobante = await getBase64(file.originFileObj);
        }
      }

      const pagoData = {
        ordenCompraId: ordenCompra.id,
        fechaPago: values.fechaPago,
        montoPagadoCentimos: Math.round(values.montoPagadoCentimos * 100), // Convertir a centimos
        urlFotoComprobante: urlFotoComprobante,
        observaciones: values.observaciones,
      };

      mutation.mutate(pagoData);
    } catch (error) {
      console.error('Error de validación:', error);
      message.error('Error al procesar los datos');
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <PagoModalView
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      form={form}
      loading={mutation.isPending}
      ordenCompra={ordenCompra}
    />
  );
};

export default PagoModal;
