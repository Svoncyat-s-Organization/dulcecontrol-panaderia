import { useEffect } from 'react';
import { Form, message, Modal } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ClienteFormView from './ClienteFormView.jsx';
import { createCliente, updateCliente, getCliente } from '../../api/clientes.api.js';
import { getDireccionesCliente } from '../../api/direcciones-cliente.api.js';
import { CLIENTE_KEYS, DIRECCION_CLIENTE_KEYS } from '../../constants/queryKeys.js';
import { mapClienteResponse, mapDireccionesClienteResponse } from '../../utils/clienteMappers.js';

const ClienteForm = ({ open, onClose, tiendaId, cliente }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEditing = Boolean(cliente?.id);

  // Cargar datos del cliente si estamos editando
  const { data: clienteData } = useQuery({
    queryKey: CLIENTE_KEYS.detail(tiendaId, cliente?.id),
    queryFn: () => getCliente(tiendaId, cliente?.id),
    enabled: open && isEditing && Boolean(tiendaId) && Boolean(cliente?.id),
    select: mapClienteResponse,
  });

  // Cargar direcciones del cliente si estamos editando
  const { data: direccionesData = [] } = useQuery({
    queryKey: DIRECCION_CLIENTE_KEYS.lists(tiendaId, cliente?.id),
    queryFn: () => getDireccionesCliente(tiendaId, cliente?.id),
    enabled: open && isEditing && Boolean(tiendaId) && Boolean(cliente?.id),
    select: mapDireccionesClienteResponse,
  });

  useEffect(() => {
    if (open) {
      if (isEditing && clienteData) {
        // Valores iniciales para edición - cargar primera dirección si existe
        const primeraDireccion = direccionesData.length > 0 ? direccionesData[0] : null;
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
          // Cargar primera dirección para edición
          direccionEtiqueta: primeraDireccion?.etiqueta || '',
          direccionCompleta: primeraDireccion?.direccionCompleta || '',
          direccionReferencia: primeraDireccion?.referencia || '',
          direccionDistritoId: primeraDireccion?.distritoId || '',
          direccionCodigoPostal: primeraDireccion?.codigoPostal || '',
          direccionEsFiscal: primeraDireccion?.esFiscal || false,
          direccionEsEntrega: primeraDireccion?.esEntrega || false,
        });
      } else {
        // Valores iniciales para creación
        form.setFieldsValue({
          tipoDoc: 'DNI',
          esUsuarioVirtual: false,
          activo: true,
          // Campos de dirección vacíos para creación
          direccionEtiqueta: '',
          direccionCompleta: '',
          direccionReferencia: '',
          direccionDistritoId: '',
          direccionCodigoPostal: '',
          direccionEsFiscal: false,
          direccionEsEntrega: false,
        });
      }
    } else {
      form.resetFields();
    }
  }, [open, isEditing, clienteData, direccionesData, form]);

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
        // Dirección del cliente
        direccionEtiqueta: values.direccionEtiqueta,
        direccionCompleta: values.direccionCompleta,
        direccionReferencia: values.direccionReferencia,
        direccionDistritoId: values.direccionDistritoId,
        direccionCodigoPostal: values.direccionCodigoPostal,
        direccionEsFiscal: values.direccionEsFiscal,
        direccionEsEntrega: values.direccionEsEntrega,
      };

      if (isEditing) {
        return updateCliente(tiendaId, cliente.id, clientePayload);
      }
      return createCliente(tiendaId, clientePayload);
    },
    onSuccess: (response) => {
      message.success(`Cliente ${isEditing ? 'actualizado' : 'creado'} correctamente`);
      queryClient.invalidateQueries({ queryKey: CLIENTE_KEYS.lists(tiendaId) });
      // Invalidar direcciones del cliente (tanto para edición como creación)
      const clienteId = isEditing ? cliente?.id : response?.id;
      if (clienteId) {
        queryClient.invalidateQueries({ queryKey: DIRECCION_CLIENTE_KEYS.lists(tiendaId, clienteId) });
      }
      onClose();
    },
    onError: (error) => {
      const detail = error?.response?.data?.message ?? error?.message ?? 'Ocurrió un error';
      message.error(detail);
    },
  });

  const handleSubmit = (values) => {
    Modal.confirm({
      title: `¿Estás seguro de ${isEditing ? 'actualizar' : 'crear'} este cliente?`,
      content: `Se ${isEditing ? 'actualizarán' : 'crearán'} los datos del cliente "${values.nombreDoc}".`,
      okText: isEditing ? 'Actualizar' : 'Crear',
      cancelText: 'Cancelar',
      onOk: () => mutation.mutate(values),
    });
  };

  return (
    <ClienteFormView
      open={open}
      onClose={onClose}
      form={form}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      isEditing={isEditing}
    />
  );
};

export default ClienteForm;