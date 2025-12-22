import React, { useState } from 'react';
import { Form, Input, Select, Switch, Button, Modal, Space, message, Alert } from 'antd';
import { IconSearch } from '@tabler/icons-react';

const { TextArea } = Input;
const { Option } = Select;

const ClienteFormView = ({ 
  open, 
  onClose, 
  form, 
  onSubmit, 
  loading, 
  isEditing, 
  isClienteGenerico, 
  onBuscarDocumento, 
  buscandoDocumento 
}) => {
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
      destroyOnClose
      maskClosable={false}
    >
      {isClienteGenerico && (
        <Alert
          message="Cliente Genérico del Sistema"
          description="Este cliente es generado automáticamente y no puede ser modificado. Se utiliza para ventas rápidas sin documento del cliente."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
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
            rules={[{ required: !isClienteGenerico, message: 'Selecciona el tipo de documento' }]}
          >
            <Select
              placeholder="Selecciona"
              onChange={(value) => {
                setTipoDocSeleccionado(value);
                // Limpiar número de documento al cambiar tipo
                form.setFieldsValue({ numeroDoc: '' });
              }}
              disabled={isClienteGenerico}
            >
              <Option value="DNI">DNI</Option>
              <Option value="RUC">RUC</Option>
            </Select>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.tipoDoc !== currentValues.tipoDoc}>
            {({ getFieldValue }) => {
              const tipoDoc = getFieldValue('tipoDoc');
              return (
                <Form.Item
                  label="Número de Documento"
                  name="numeroDoc"
                  rules={[
                    { required: !isClienteGenerico, message: 'Ingresa el número de documento' },
                    { pattern: /^[0-9]+$/, message: 'Solo números' },
                    ...(tipoDoc === 'DNI' ? [
                      { len: 8, message: 'El DNI debe tener exactamente 8 dígitos' }
                    ] : []),
                    ...(tipoDoc === 'RUC' ? [
                      { len: 11, message: 'El RUC debe tener exactamente 11 dígitos' }
                    ] : [])
                  ]}
                >
                  <Input 
                    placeholder={tipoDoc === 'DNI' ? '12345678' : tipoDoc === 'RUC' ? '20123456789' : 'Número de documento'}
                    maxLength={tipoDoc === 'DNI' ? 8 : tipoDoc === 'RUC' ? 11 : undefined}
                    disabled={isClienteGenerico}
                    suffix={
                      !isEditing && !isClienteGenerico && tipoDoc && (
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
              );
            }}
          </Form.Item>
        </div>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.tipoDoc !== currentValues.tipoDoc}>
          {({ getFieldValue }) => {
            const tipoDoc = getFieldValue('tipoDoc');
            return (
              <Form.Item
                label={tipoDoc === 'RUC' ? 'Razón Social' : 'Nombre Completo'}
                name="nombreDoc"
                rules={[
                  { required: !isClienteGenerico, message: `Ingresa ${tipoDoc === 'RUC' ? 'la razón social' : 'el nombre completo'}` },
                  { min: 3, message: 'Mínimo 3 caracteres' },
                  { max: 255, message: 'Máximo 255 caracteres' }
                ]}
              >
                <Input 
                  placeholder={tipoDoc === 'RUC' ? 'Razón social del cliente' : 'Nombre completo del cliente'} 
                  disabled={isClienteGenerico}
                />
              </Form.Item>
            );
          }}
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.esUsuarioVirtual !== currentValues.esUsuarioVirtual}>
            {({ getFieldValue }) => {
              const esVirtual = getFieldValue('esUsuarioVirtual');
              return (
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    ...(esVirtual ? [{ required: true, message: 'El email es obligatorio para usuarios virtuales' }] : []),
                    { type: 'email', message: 'Ingresa un email válido' },
                    { max: 255, message: 'Máximo 255 caracteres' }
                  ]}
                >
                  <Input 
                    placeholder="cliente@email.com"
                    type="email"
                    disabled={isClienteGenerico}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[
              { pattern: /^[0-9+\-\s()]+$/, message: 'Solo números y caracteres (+, -, espacio, paréntesis)' },
              { min: 7, message: 'Mínimo 7 caracteres' },
              { max: 50, message: 'Máximo 50 caracteres' }
            ]}
          >
            <Input 
              placeholder="+51 987 654 321"
              disabled={isClienteGenerico}
            />
          </Form.Item>
        </div>

        {/* Tipo de Cliente y Estado */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            label="Tipo de Cliente"
            name="esUsuarioVirtual"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Virtual"
              unCheckedChildren="Físico"
              disabled={isClienteGenerico}
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
              disabled={isClienteGenerico}
            />
          </Form.Item>
        </div>

        {/* Contraseña (solo para usuarios virtuales) */}
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.esUsuarioVirtual !== currentValues.esUsuarioVirtual}>
          {({ getFieldValue }) => {
            const esVirtual = getFieldValue('esUsuarioVirtual');
            return esVirtual ? (
              <Form.Item
                label="Contraseña"
                name="hashContrasena"
                rules={[
                  { required: true, message: 'La contraseña es requerida para usuarios virtuales' },
                  { min: 6, message: 'Mínimo 6 caracteres' },
                  { max: 100, message: 'Máximo 100 caracteres' }
                ]}
              >
                <Input.Password placeholder="Contraseña temporal" />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>

        {/* Notas */}
        <Form.Item
          label="Notas"
          name="notas"
        >
          <TextArea
            placeholder="Notas adicionales sobre el cliente"
            rows={3}
            maxLength={1000}
            showCount
            disabled={isClienteGenerico}
          />
        </Form.Item>

        {!isClienteGenerico && (
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
        )}

        {isClienteGenerico && (
          <Form.Item style={{ marginTop: 24, marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={handleCancel}>
              Cerrar
            </Button>
          </Form.Item>
        )}
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