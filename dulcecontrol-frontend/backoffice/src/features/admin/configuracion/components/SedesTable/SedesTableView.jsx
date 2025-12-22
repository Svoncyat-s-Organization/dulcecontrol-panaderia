import React, { useEffect } from 'react';
import { Table, Button, Space, Tag, Card, Modal, Form, Input, Switch, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import UbigeoSelector from '../UbigeoSelector';

/**
 * View: Presentación pura de la tabla de sedes
 */
export default function SedesTableView({
  sedes,
  isLoading,
  isModalVisible,
  editingSede,
  isSaving,
  onOpenModal,
  onCloseModal,
  onSubmit,
  onDesactivar,
  onDelete,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalVisible) {
      if (editingSede) {
        form.setFieldsValue(editingSede);
      } else {
        form.resetFields();
      }
    }
  }, [isModalVisible, editingSede, form]);

  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigoInterno',
      key: 'codigoInterno',
      width: 120,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (text, record) => (
        <Space>
          {text}
          {record.esPrincipal && (
            <Tooltip title="Sede Principal">
              <CrownOutlined style={{ color: '#faad14' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      key: 'direccion',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <span><EnvironmentOutlined /> {text}</span>
          <small style={{ color: '#8c8c8c' }}>
            {record.distritoNombre}, {record.provinciaNombre}, {record.departamentoNombre}
          </small>
        </Space>
      ),
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
      width: 130,
      render: (text) => text && <span><PhoneOutlined /> {text}</span>,
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      width: 100,
      align: 'center',
      render: (activo) => (
        <Tag color={activo ? 'success' : 'default'}>
          {activo ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onOpenModal(record)}
            />
          </Tooltip>
          {record.activo && !record.esPrincipal && (
            <Tooltip title="Desactivar">
              <Button
                type="text"
                danger
                icon={<StopOutlined />}
                onClick={() => onDesactivar(record)}
              />
            </Tooltip>
          )}
          {!record.esPrincipal && (
            <Tooltip title="Eliminar">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <>
      <Card
        title="Gestión de Sedes"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => onOpenModal()}
          >
            Nueva Sede
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={sedes}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} sedes`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingSede ? 'Editar Sede' : 'Nueva Sede'}
        open={isModalVisible}
        onCancel={onCloseModal}
        onOk={() => form.submit()}
        confirmLoading={isSaving}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            esPrincipal: false,
            activo: true,
          }}
        >
          <Form.Item
            label="Código Interno"
            name="codigoInterno"
            rules={[
              { required: true, message: 'El código interno es obligatorio' },
              { pattern: /^[A-Z0-9-]+$/, message: 'Solo letras mayúsculas, números y guiones' },
              { max: 50, message: 'Máximo 50 caracteres' },
            ]}
          >
            <Input placeholder="Ej: DM-001" />
          </Form.Item>

          <Form.Item
            label="Nombre de la Sede"
            name="nombre"
            rules={[
              { required: true, message: 'El nombre es obligatorio' },
              { max: 100, message: 'Máximo 100 caracteres' },
            ]}
          >
            <Input placeholder="Ej: Sede Principal - Miraflores" />
          </Form.Item>

          <Form.Item
            label="Dirección"
            name="direccion"
            rules={[{ required: true, message: 'La dirección es obligatoria' }]}
          >
            <Input.TextArea rows={2} placeholder="Av. Larco 1234, Miraflores" />
          </Form.Item>

          <Form.Item
            label="Ubicación (Ubigeo)"
            name="distritoId"
            rules={[{ required: true, message: 'Seleccione la ubicación' }]}
          >
            <UbigeoSelector />
          </Form.Item>

          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[
              { pattern: /^[0-9+\-\s()]*$/, message: 'Solo números, +, -, espacios y paréntesis' },
              { max: 50, message: 'Máximo 50 caracteres' },
            ]}
          >
            <Input placeholder="987654321" />
          </Form.Item>

          <Space size="large">
            <Form.Item
              label="Sede Principal"
              name="esPrincipal"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            {editingSede && (
              <Form.Item
                label="Activo"
                name="activo"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            )}
          </Space>
        </Form>
      </Modal>
    </>
  );
}
