import { useEffect, useState } from 'react';
import { Form, message, Modal } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ClienteFormView from './ClienteFormView.jsx';
import { createCliente, updateCliente, getCliente } from '../../api/clientes.api.js';
import { consultarDni, consultarRuc } from '../../api/decolecta.api.js';
// import { getDireccionesCliente } from '../../api/direcciones-cliente.api.js';
import { CLIENTE_KEYS } from '../../constants/queryKeys.js';
import { mapClienteResponse, mapDireccionesClienteResponse } from '../../utils/clienteMappers.js';

const ClienteForm = ({ open, onClose, tiendaId, cliente }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEditing = Boolean(cliente?.id);
  const [buscandoDocumento, setBuscandoDocumento] = useState(false);

  // Detectar si es cliente genérico
  const isClienteGenerico = isEditing && 
    (cliente?.numeroDoc === '00000000' || cliente?.nombreDoc === 'CLIENTE GENÉRICO');

  // Cargar datos del cliente si estamos editando
  const { data: clienteData } = useQuery({
    queryKey: CLIENTE_KEYS.detail(tiendaId, cliente?.id),
    queryFn: () => getCliente(tiendaId, cliente?.id),
    enabled: open && isEditing && Boolean(tiendaId) && Boolean(cliente?.id),
    select: mapClienteResponse,
  });

  // Direcciones removidas del formulario
  // const { data: direccionesData = [] } = useQuery({
  //   queryKey: DIRECCION_CLIENTE_KEYS.lists(tiendaId, cliente?.id),
  //   queryFn: () => getDireccionesCliente(tiendaId, cliente?.id),
  //   enabled: open && isEditing && Boolean(tiendaId) && Boolean(cliente?.id),
  //   select: mapDireccionesClienteResponse,
  // });
  const direccionesData = [];

  useEffect(() => {
    if (open) {
      if (isEditing && clienteData) {
        // Valores iniciales para edición
        form.setFieldsValue({
          tipoDoc: clienteData.tipoDoc,
          numeroDoc: clienteData.numeroDoc,
          nombreDoc: clienteData.nombreDoc,
          email: clienteData.email,
          telefono: clienteData.telefono,
          esUsuarioVirtual: clienteData.esUsuarioVirtual,
          hashContrasena: clienteData.hashContrasena,
          notas: clienteData.notas,
          activo: clienteData.activo,
        });
      } else {
        // Valores iniciales para creación
        form.setFieldsValue({
          tipoDoc: 'DNI',
          esUsuarioVirtual: false,
          activo: true,
        });
      }
    } else {
      form.resetFields();
    }
  }, [open, isEditing, clienteData, form]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!tiendaId) {
        throw new Error('No hay tienda activa para gestionar clientes');
      }

      // Construir payload del cliente
      const clientePayload = {
        tipoDocumento: values.tipoDoc,
        numeroDoc: values.numeroDoc,
        nombreDoc: values.nombreDoc,
        email: values.email,
        telefono: values.telefono,
        esUsuarioVirtual: values.esUsuarioVirtual,
        hashContrasena: values.hashContrasena,
        notas: values.notas,
        activo: values.activo,
      };

      if (isEditing) {
        return updateCliente(tiendaId, cliente.id, clientePayload);
      }
      return createCliente(tiendaId, clientePayload);
    },
    onSuccess: (response) => {
      message.success(`Cliente ${isEditing ? 'actualizado' : 'creado'} correctamente`);
      queryClient.invalidateQueries({ queryKey: CLIENTE_KEYS.lists(tiendaId) });
      onClose();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Ocurrió un error';
      message.error(detail);
    },
  });

  const handleSubmit = (values) => {
    // Prevenir edición de cliente genérico
    if (isClienteGenerico) {
      message.error('El cliente genérico no puede ser modificado');
      return;
    }
    mutation.mutate(values);
  };

  const handleBuscarDocumento = async (tipoDoc, numeroDoc) => {
    setBuscandoDocumento(true);
    try {
      if (tipoDoc === 'DNI') {
        const response = await consultarDni(numeroDoc);
        // Autocompletar con datos de RENIEC
        form.setFieldsValue({
          nombreDoc: response.full_name || `${response.first_name} ${response.first_last_name} ${response.second_last_name}`.trim(),
        });
        message.success('Datos encontrados en RENIEC');
      } else if (tipoDoc === 'RUC') {
        const response = await consultarRuc(numeroDoc);
        // Autocompletar con datos de SUNAT
        form.setFieldsValue({
          nombreDoc: response.razon_social || response.razonSocial,
        });
        message.success('Datos encontrados en SUNAT');
      }
    } catch (error) {
      const detail = error?.response?.data?.message ?? error?.message ?? 'No se pudo consultar el documento';
      message.error(detail);
    } finally {
      setBuscandoDocumento(false);
    }
  };

  return (
    <ClienteFormView
      open={open}
      onClose={onClose}
      form={form}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      isEditing={isEditing}
      isClienteGenerico={isClienteGenerico}
      onBuscarDocumento={handleBuscarDocumento}
      buscandoDocumento={buscandoDocumento}
    />
  );
};

export default ClienteForm;
