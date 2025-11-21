import { useMemo } from 'react';
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Select, Space, Switch, theme } from 'antd';

const tipoOptions = [
  { label: 'Producto terminado', value: 'PRODUCTO_TERMINADO' },
  { label: 'Insumo para venta', value: 'INSUMO_VENTA' },
  { label: 'Servicio', value: 'SERVICIO' },
];

const ProductoFormView = ({
  open,
  onClose,
  form,
  onSubmit,
  loading,
  isEditing,
  categorias = [],
  loadingCategorias = false,
}) => {
  const { token } = theme.useToken();
  const categoriaOptions = useMemo(
    () => categorias.map((categoria) => ({ label: categoria.nombre, value: categoria.id })),
    [categorias]
  );

  return (
    <Drawer
      title={`${isEditing ? 'Editar' : 'Nuevo'} producto`}
      open={open}
      onClose={onClose}
      width={520}
      destroyOnClose
      styles={{
        body: {
          paddingBottom: 24,
          background: token.colorBgContainer,
        },
        header: {
          borderBottom: `1px solid ${token.colorSplit}`,
        },
      }}
      footer={
        <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" loading={loading} onClick={() => form.submit()}>
            {isEditing ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        disabled={loading}
        requiredMark={false}
      >
        <Form.Item
          label="Nombre"
          name="nombre"
          rules={[{ required: true, message: 'Ingresa el nombre del producto' }]}
        >
          <Input placeholder="Ej. Torta tres leches" allowClear />
        </Form.Item>

        <Form.Item
          label="SKU"
          name="sku"
          rules={[{ required: true, message: 'Ingresa el SKU' }]}
        >
          <Input placeholder="Ej. DM-TORTA-001" allowClear />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tipo"
              name="tipo"
              rules={[{ required: true, message: 'Selecciona un tipo' }]}
            >
              <Select options={tipoOptions} placeholder="Selecciona" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Categoría" name="categoriaId">
              <Select
                placeholder="Selecciona una categoría"
                options={categoriaOptions}
                loading={loadingCategorias}
                allowClear
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Precio base"
          name="precioBase"
          rules={[{ required: true, message: 'Ingresa el precio base' }]}
        >
          <InputNumber
            addonBefore="S/."
            min={0}
            step={0.1}
            style={{ width: '100%' }}
            placeholder="0.00"
          />
        </Form.Item>

        <Form.Item label="URL Imagen principal" name="urlImagenPrincipal">
          <Input placeholder="https://" allowClear />
        </Form.Item>

        <Form.Item label="Descripción" name="descripcion">
          <Input.TextArea rows={4} placeholder="Descripción breve del producto" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Activo" name="activo" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Visible en POS"
              name="visibleEnPos"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Visible en Storefront"
              name="visibleEnStorefront"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Destacado Storefront"
              name="destacadoStorefront"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Personalizable"
          name="esPersonalizable"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ProductoFormView;
