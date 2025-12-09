import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Switch, message, Card, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, CodeOutlined } from '@ant-design/icons';
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
  const [tipoContenido, setTipoContenido] = useState('JSON');

  // Query para listar páginas
  const { data: allPaginas = [], isLoading } = useQuery({
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
      setTipoContenido('JSON');
    } else {
      form.resetFields();
      form.setFieldsValue({ tipoContenido: 'JSON' });
      setTipoContenido('JSON');
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
      title: 'Tipo',
      dataIndex: 'tipoContenido',
      key: 'tipoContenido',
      width: 80,
      align: 'center',
      render: (tipo) => (
        <Tag color={tipo === 'HTML' ? 'blue' : 'purple'}>
          {tipo || 'HTML'}
        </Tag>
      ),
    },
    {
      title: 'Contenido',
      dataIndex: 'contenido',
      key: 'contenido',
      ellipsis: true,
      render: (text) => text?.substring(0, 100) + (text?.length > 100 ? '...' : ''),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleOpenModal(record)}
          size="small"
        >
          Editar
        </Button>
      ),
    },
  ];

  return (
    <Card
      title={<span><CodeOutlined /> Secciones JSON del Storefront</span>}
    >
      <div style={{ marginBottom: 16, padding: '12px', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px' }}>
        <p style={{ margin: 0, color: '#0c4a6e', fontSize: '14px' }}>
          <strong>📝 Secciones Dinámicas:</strong>
          <br />
          • <strong>home-seccion-destacados</strong> → Título de productos destacados en HomePage
          <br />
          • <strong>home-seccion-personalizada</strong> → Sección de tortas personalizadas en HomePage
          <br />
          • <strong>home-seccion-about</strong> → Historia y valores en AboutPage
          <br />
          • <strong>home-seccion-contact</strong> → Dirección, teléfono y email en ContactPage
        </p>
      </div>
      
      <Table
        columns={columns}
        dataSource={allPaginas}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        scroll={{ x: 1100 }}
      />

      <Modal
        title={editingPagina ? `Editar: ${editingPagina.titulo}` : 'Nueva Sección'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={900}
        okText="Guardar Cambios"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              label="Título"
              name="titulo"
              rules={[{ required: true, message: 'El título es obligatorio' }]}
              tooltip="El título que se muestra en el panel de administración"
            >
              <Input placeholder="Ej: Los Favoritos del Barrio" />
            </Form.Item>

            <Form.Item
              label="Slug (URL)"
              name="slug"
              rules={[
                { required: true, message: 'El slug es obligatorio' },
                { pattern: /^[a-z0-9-]+$/, message: 'Solo minúsculas, números y guiones' }
              ]}
              tooltip="Identificador único para acceder a esta sección. Ej: home-seccion-destacados"
            >
              <Input placeholder="home-seccion-ejemplo" />
            </Form.Item>
          </div>

          <Form.Item
            label="Contenido JSON"
            name="contenido"
            rules={[
              { required: true, message: 'El contenido es obligatorio' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch (e) {
                    return Promise.reject(new Error('El contenido debe ser un JSON válido'));
                  }
                }
              }
            ]}
            tooltip='Objeto JSON con la estructura de datos. Valida sintaxis antes de guardar.'
          >
            <TextArea 
              rows={18} 
              placeholder='{\n  "subtitulo": "Texto descriptivo",\n  "descripcion": "Contenido principal",\n  "valores": ["Item 1", "Item 2", "Item 3"],\n  "imagen": "https://ejemplo.com/imagen.jpg"\n}'
              style={{ 
                fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace', 
                fontSize: '13px',
                lineHeight: '1.6'
              }}
            />
          </Form.Item>

          <Form.Item 
            label="Meta Descripción (SEO)" 
            name="metaDescripcion"
            tooltip="Descripción para motores de búsqueda (opcional)"
          >
            <TextArea 
              rows={2} 
              placeholder="Breve descripción de esta sección para SEO" 
              maxLength={160}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PaginasStorefrontTable;
