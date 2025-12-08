import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Switch, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import {
  getPaginasStorefront,
  createPaginaStorefront,
  updatePaginaStorefront,
  deletePaginaStorefront,
} from '../../api/paginas-storefront.api';
import { PAGINAS_STOREFRONT_KEYS } from '../../constants/queryKeys';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';

const { TextArea } = Input;

const PaginasStorefrontTable = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const tiendaId = useTokenStore((state) => state.tiendaId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPagina, setEditingPagina] = useState(null);

  // Query para listar páginas
  const { data: paginas = [], isLoading } = useQuery({
    queryKey: PAGINAS_STOREFRONT_KEYS.lists(tiendaId),
    queryFn: () => getPaginasStorefront(tiendaId),
    enabled: !!tiendaId,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation para crear
  const createMutation = useMutation({
    mutationFn: (values) => createPaginaStorefront(tiendaId, values),
    onSuccess: () => {
      message.success('Página creada correctamente');
      queryClient.invalidateQueries({ queryKey: PAGINAS_STOREFRONT_KEYS.lists(tiendaId) });
      handleCloseModal();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al crear la página');
    },
  });

  // Mutation para actualizar
  const updateMutation = useMutation({
    mutationFn: ({ paginaId, values }) => updatePaginaStorefront(tiendaId, paginaId, values),
    onSuccess: () => {
      message.success('Página actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: PAGINAS_STOREFRONT_KEYS.lists(tiendaId) });
      handleCloseModal();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al actualizar la página');
    },
  });

  // Mutation para eliminar
  const deleteMutation = useMutation({
    mutationFn: (paginaId) => deletePaginaStorefront(tiendaId, paginaId),
    onSuccess: () => {
      message.success('Página eliminada correctamente');
      queryClient.invalidateQueries({ queryKey: PAGINAS_STOREFRONT_KEYS.lists(tiendaId) });
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al eliminar la página');
    },
  });

  const handleOpenModal = (pagina = null) => {
    setEditingPagina(pagina);
    if (pagina) {
      form.setFieldsValue(pagina);
    } else {
      form.resetFields();
      form.setFieldsValue({ ordenMenu: 0, visibleEnMenu: true, activa: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPagina(null);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (editingPagina) {
      updateMutation.mutate({ paginaId: editingPagina.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDelete = (paginaId, titulo) => {
    Modal.confirm({
      title: '¿Eliminar página?',
      content: `¿Estás seguro de que deseas eliminar la página "${titulo}"?`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => deleteMutation.mutate(paginaId),
    });
  };

  const columns = [
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
      width: 200,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 150,
      render: (slug) => <code>/{slug}</code>,
    },
    {
      title: 'Contenido',
      dataIndex: 'contenido',
      key: 'contenido',
      ellipsis: true,
      render: (text) => text?.substring(0, 100) + (text?.length > 100 ? '...' : ''),
    },
    {
      title: 'Orden',
      dataIndex: 'ordenMenu',
      key: 'ordenMenu',
      width: 80,
      align: 'center',
    },
    {
      title: 'Visible',
      dataIndex: 'visibleEnMenu',
      key: 'visibleEnMenu',
      width: 80,
      align: 'center',
      render: (visible) => (visible ? '✓' : '✗'),
    },
    {
      title: 'Activa',
      dataIndex: 'activa',
      key: 'activa',
      width: 80,
      align: 'center',
      render: (activa) => (activa ? '✓' : '✗'),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
            size="small"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.titulo)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<span><FileTextOutlined /> Páginas del Storefront (CMS)</span>}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Nueva Página
        </Button>
      }
      bordered={false}
    >
      <Table
        columns={columns}
        dataSource={paginas}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingPagina ? 'Editar Página' : 'Nueva Página'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={800}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Título"
            name="titulo"
            rules={[{ required: true, message: 'El título es obligatorio' }]}
          >
            <Input placeholder="Ej: Quiénes Somos" />
          </Form.Item>

          <Form.Item
            label="Slug (URL)"
            name="slug"
            rules={[
              { required: true, message: 'El slug es obligatorio' },
              { pattern: /^[a-z0-9-]+$/, message: 'Solo minúsculas, números y guiones' },
            ]}
            tooltip="URL amigable sin espacios ni mayúsculas (ej: sobre-nosotros)"
          >
            <Input placeholder="sobre-nosotros" />
          </Form.Item>

          <Form.Item
            label="Contenido"
            name="contenido"
            rules={[{ required: true, message: 'El contenido es obligatorio' }]}
          >
            <TextArea rows={8} placeholder="Escribe el contenido de la página..." />
          </Form.Item>

          <Form.Item label="Meta Descripción (SEO)" name="metaDescripcion">
            <TextArea rows={2} placeholder="Breve descripción para motores de búsqueda" maxLength={160} />
          </Form.Item>

          <Space size="large">
            <Form.Item label="Orden en Menú" name="ordenMenu" style={{ marginBottom: 0 }}>
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item label="Visible en Menú" name="visibleEnMenu" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch />
            </Form.Item>

            <Form.Item label="Activa" name="activa" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </Card>
  );
};

export default PaginasStorefrontTable;
