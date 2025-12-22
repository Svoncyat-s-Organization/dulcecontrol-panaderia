import React, { useState } from 'react';
import { Form, Input, Select, Switch, Button, Modal, Space, Typography, message } from 'antd';
import { IconX, IconSearch } from '@tabler/icons-react';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const ClienteFormView = ({ open, onClose, form, onSubmit, loading, isEditing, onBuscarDocumento, buscandoDocumento }) => {
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitValues, setSubmitValues] = useState(null);
  const [tipoDocSeleccionado, setTipoDocSeleccionado] = useState(null);

  // Initialize tipoDocSeleccionado when form opens for editing
  React.useEffect(() => {
    if (open && isEditing) {
      const tipoDocValue = form.getFieldValue('tipoDoc');
      setTipoDocSeleccionado(tipoDocValue);
    } else if (open && !isEditing) {
      setTipoDocSeleccionado(null);
    }
  }, [open, isEditing, form]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    setTipoDocSeleccionado(null);
    onClose();
  };

  const handleSubmitClick = async () => {
    try {
      const values = await form.validateFields();
      setSubmitValues(values);
      setShowSubmitConfirm(true);
    } catch (error) {
      // Validation failed, errors are shown automatically
    }
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirm(false);
    if (submitValues) {
      onSubmit(submitValues);
    }
    setSubmitValues(null);
  };

  const handleCancelSubmit = () => {
    setShowSubmitConfirm(false);
    setSubmitValues(null);
  };

  const handleBuscarDocumento = async () => {
    const tipoDoc = form.getFieldValue('tipoDoc');
    const numeroDoc = form.getFieldValue('numeroDoc');

    if (!tipoDoc) {
      message.warning('Selecciona el tipo de documento primero');
      return;
    }

    if (!numeroDoc) {
      message.warning('Ingresa el número de documento');
      return;
    }

    if (tipoDoc === 'DNI' && !/^\d{8}$/.test(numeroDoc)) {
      message.warning('El DNI debe tener exactamente 8 dígitos');
      return;
    }

    if (tipoDoc === 'RUC' && !/^\d{11}$/.test(numeroDoc)) {
      message.warning('El RUC debe tener exactamente 11 dígitos');
      return;
    }

    onBuscarDocumento(tipoDoc, numeroDoc);
  };

  return (
    <Modal
      title={isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Tipo de Documento"
            name="tipoDoc"
            rules={[{ required: true, message: 'Selecciona el tipo de documento' }]}
          >
            <Select
              placeholder="Selecciona"
              onChange={(value) => setTipoDocSeleccionado(value)}
            >
              <Option value="DNI">DNI</Option>
              <Option value="RUC">RUC</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Número de Documento"
            name="numeroDoc"
            rules={[
              { required: true, message: 'Ingresa el número de documento' },
              { pattern: /^[0-9]+$/, message: 'Solo números' }
            ]}
          >
            <Input 
              placeholder="Número de documento"
              suffix={
                !isEditing && (
                  <Button
                    type="text"
                    size="small"
                    icon={<IconSearch size={16} />}
                    loading={buscandoDocumento}
                    onClick={handleBuscarDocumento}
                    title="Buscar en RENIEC/SUNAT"
                  />
                )
              }
            />
          </Form.Item>
        </div>

        <Form.Item
          label={tipoDocSeleccionado === 'RUC' ? 'Razón Social' : 'Nombre Completo'}
          name="nombreDoc"
          rules={[{ required: true, message: `Ingresa ${tipoDocSeleccionado === 'RUC' ? 'la razón social' : 'el nombre completo'}` }]}
        >
          <Input placeholder={tipoDocSeleccionado === 'RUC' ? 'Razón social del cliente' : 'Nombre completo del cliente'} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: 'email', message: 'Ingresa un email válido' }
            ]}
          >
            <Input placeholder="cliente@email.com" />
          </Form.Item>

          <Form.Item
            label="Teléfono"
            name="telefono"
          >
            <Input placeholder="Número de teléfono" />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Tipo de Cliente"
            name="esUsuarioVirtual"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Virtual"
              unCheckedChildren="Físico"
            />
          </Form.Item>

          <Form.Item
            label="Estado"
            name="activo"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
            />
          </Form.Item>
        </div>

        {form.getFieldValue('esUsuarioVirtual') && (
          <Form.Item
            label="Contraseña"
            name="hashContrasena"
            rules={[{ required: true, message: 'La contraseña es requerida para usuarios virtuales' }]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
        )}

        <Form.Item
          label="Notas"
          name="notas"
        >
          <TextArea
            placeholder="Notas adicionales sobre el cliente"
            rows={3}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 24, marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="primary" onClick={handleSubmitClick} loading={loading}>
              {isEditing ? 'Actualizar' : 'Crear'} Cliente
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Modal de confirmación para submit */}
      <Modal
        title={`¿Estás seguro de ${isEditing ? 'actualizar' : 'crear'} este cliente?`}
        open={showSubmitConfirm}
        onCancel={handleCancelSubmit}
        footer={[
          <Button key="cancel" onClick={handleCancelSubmit}>
            No
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmSubmit}>
            Sí
          </Button>,
        ]}
      >
        <p>Se {isEditing ? 'actualizarán' : 'crearán'} los datos del cliente "{submitValues?.nombreDoc}".</p>
      </Modal>
    </Modal>
  );
};

export default ClienteFormView;