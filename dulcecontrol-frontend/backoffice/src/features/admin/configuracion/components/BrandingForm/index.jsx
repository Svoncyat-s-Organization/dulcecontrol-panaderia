import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, ColorPicker, Card, Button, Space, Row, Col, message, Spin } from 'antd';
import { SaveOutlined, BgColorsOutlined } from '@ant-design/icons';
import { getBranding, updateBranding } from '../../api/branding.api';
import { BRANDING_KEYS } from '../../constants/queryKeys';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';

/**
 * Componente para gestionar el branding de la tienda (logo, favicon, colores)
 * Pestaña 1: Apariencia
 */
const BrandingForm = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const tiendaId = useTokenStore((state) => state.tiendaId);

  // Query para obtener branding actual
  const { data: branding, isLoading } = useQuery({
    queryKey: BRANDING_KEYS.byTienda(tiendaId),
    queryFn: () => getBranding(tiendaId),
    enabled: !!tiendaId,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation para actualizar branding
  const updateMutation = useMutation({
    mutationFn: (values) => updateBranding(tiendaId, values),
    onSuccess: () => {
      message.success('Apariencia actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: BRANDING_KEYS.byTienda(tiendaId) });
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al actualizar la apariencia');
    },
  });

  // Cargar datos iniciales en el formulario
  React.useEffect(() => {
    if (branding) {
      form.setFieldsValue({
        urlLogo: branding.urlLogo,
        urlFavicon: branding.urlFavicon,
        colorPrimario: branding.colorPrimario,
        colorSecundario: branding.colorSecundario,
      });
    }
  }, [branding, form]);

  const onFinish = (values) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card title={<span><BgColorsOutlined /> Apariencia de la Tienda Virtual</span>} bordered={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="URL del Logo (Navbar)"
              name="urlLogo"
              rules={[
                { required: true, message: 'La URL del logo es obligatoria' },
                { type: 'url', message: 'Debe ser una URL válida' },
              ]}
              tooltip="Este logo aparecerá en la barra de navegación del storefront"
            >
              <Input placeholder="https://cdn.mitienda.com/logo.png" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="URL del Favicon (Pestaña del navegador)"
              name="urlFavicon"
              rules={[{ type: 'url', message: 'Debe ser una URL válida' }]}
              tooltip="Icono pequeño que aparece en la pestaña del navegador"
            >
              <Input placeholder="https://cdn.mitienda.com/favicon.ico" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Color Primario"
              name="colorPrimario"
              rules={[
                { required: true, message: 'El color primario es obligatorio' },
                { pattern: /^#[0-9A-Fa-f]{6}$/, message: 'Debe ser un color hexadecimal válido (ej: #FF5733)' },
              ]}
              tooltip="Color principal usado en botones, encabezados, etc."
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  placeholder="#FF5733"
                  maxLength={7}
                  prefix={<ColorPicker
                    value={form.getFieldValue('colorPrimario')}
                    onChange={(color) => form.setFieldsValue({ colorPrimario: color.toHexString() })}
                    showText
                  />}
                />
                <div
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: form.getFieldValue('colorPrimario') || '#000000',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9',
                  }}
                />
              </Space>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Color Secundario"
              name="colorSecundario"
              rules={[
                { required: true, message: 'El color secundario es obligatorio' },
                { pattern: /^#[0-9A-Fa-f]{6}$/, message: 'Debe ser un color hexadecimal válido (ej: #FFFFFF)' },
              ]}
              tooltip="Color secundario usado en acentos, fondos, etc."
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  placeholder="#FFFFFF"
                  maxLength={7}
                  prefix={<ColorPicker
                    value={form.getFieldValue('colorSecundario')}
                    onChange={(color) => form.setFieldsValue({ colorSecundario: color.toHexString() })}
                    showText
                  />}
                />
                <div
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: form.getFieldValue('colorSecundario') || '#ffffff',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9',
                  }}
                />
              </Space>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={updateMutation.isPending}
            size="large"
          >
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BrandingForm;
