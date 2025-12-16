import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Card, Button, Space, Row, Col, message, Spin, ColorPicker } from 'antd';
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
  
  // Estados locales para los colores (para preview en tiempo real)
  const [colorPrimario, setColorPrimario] = useState('#96CBB3');
  const [colorSecundario, setColorSecundario] = useState('#F6D3D8');

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
      message.success('✅ Apariencia actualizada correctamente. Los cambios se verán en el storefront.');
      queryClient.invalidateQueries({ queryKey: BRANDING_KEYS.byTienda(tiendaId) });
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al actualizar la apariencia');
    },
  });

  // Cargar datos iniciales en el formulario
  React.useEffect(() => {
    if (branding) {
      const primaryColor = branding.colorPrimario || '#96CBB3';
      const secondaryColor = branding.colorSecundario || '#F6D3D8';
      
      setColorPrimario(primaryColor);
      setColorSecundario(secondaryColor);
      
      form.setFieldsValue({
        urlLogo: branding.urlLogo,
        urlFavicon: branding.urlFavicon,
        colorPrimario: primaryColor,
        colorSecundario: secondaryColor,
      });
    }
  }, [branding, form]);

  const onFinish = (values) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Cargando configuración..." />
      </div>
    );
  }

  return (
    <Card 
      title={<span><BgColorsOutlined /> Apariencia de la Tienda Virtual</span>} 
      bordered={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={24}>
          {/* Sección de Logos */}
          <Col span={24}>
            <div style={{ 
              marginBottom: '24px', 
              padding: '16px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '8px' 
            }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                Logotipos
              </h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="URL del Logo (Navbar)"
                    name="urlLogo"
                    rules={[
                      { required: true, message: 'La URL del logo es obligatoria' },
                      { type: 'url', message: 'Debe ser una URL válida' },
                    ]}
                    tooltip="Este logo aparecerá en la barra de navegación del storefront. Recomendado: 200x80px"
                  >
                    <Input placeholder="https://i.postimg.cc/ejemplo/logo.png" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="URL del Favicon"
                    name="urlFavicon"
                    rules={[{ type: 'url', message: 'Debe ser una URL válida' }]}
                    tooltip="Icono pequeño que aparece en la pestaña del navegador. Recomendado: 32x32px"
                  >
                    <Input placeholder="https://i.postimg.cc/ejemplo/favicon.png" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Sección de Colores */}
          <Col span={24}>
            <div style={{ 
              marginBottom: '24px', 
              padding: '16px', 
              backgroundColor: '#f0f7ff', 
              borderRadius: '8px',
              border: '1px solid #d6e4ff'
            }}>
              <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 600 }}>
                Colores de Marca
              </h3>
              <p style={{ marginBottom: '16px', color: '#666', fontSize: '13px' }}>
                Estos colores se aplicarán automáticamente en todo el storefront (botones, enlaces, fondos, etc.)
              </p>
              
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Color Primario"
                    name="colorPrimario"
                    rules={[
                      { required: true, message: 'El color primario es obligatorio' },
                      { pattern: /^#[0-9A-Fa-f]{6}$/i, message: 'Formato: #RRGGBB' },
                    ]}
                    tooltip="Usado en botones principales, enlaces, iconos hover"
                    extra={
                      <div style={{ marginTop: '8px' }}>
                        <small style={{ color: '#666' }}>
                          Ejemplos: #8B4513 (chocolate), #FF69B4 (rosa), #6F4E37 (café)
                        </small>
                      </div>
                    }
                  >
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                      <ColorPicker
                        value={colorPrimario}
                        onChange={(color) => {
                          const hex = color.toHexString().toUpperCase();
                          setColorPrimario(hex);
                          form.setFieldsValue({ colorPrimario: hex });
                        }}
                        showText
                        size="large"
                        style={{ width: '100%' }}
                      />
                      <Input
                        value={colorPrimario}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          setColorPrimario(value);
                          form.setFieldsValue({ colorPrimario: value });
                        }}
                        placeholder="#96CBB3"
                        maxLength={7}
                        style={{ fontFamily: 'monospace' }}
                      />
                      {/* Preview del color */}
                      <div
                        style={{
                          width: '100%',
                          height: '60px',
                          backgroundColor: colorPrimario,
                          borderRadius: '8px',
                          border: '2px solid #d9d9d9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isColorDark(colorPrimario) ? '#ffffff' : '#000000',
                          fontWeight: 600,
                          fontSize: '14px',
                        }}
                      >
                        Color Primario
                      </div>
                    </Space>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Color Secundario"
                    name="colorSecundario"
                    rules={[
                      { required: true, message: 'El color secundario es obligatorio' },
                      { pattern: /^#[0-9A-Fa-f]{6}$/i, message: 'Formato: #RRGGBB' },
                    ]}
                    tooltip="Usado en botones secundarios, fondos de secciones, acentos"
                    extra={
                      <div style={{ marginTop: '8px' }}>
                        <small style={{ color: '#666' }}>
                          Ejemplos: #FFE4B5 (crema), #FFF0F5 (rosa claro), #F5DEB3 (beige)
                        </small>
                      </div>
                    }
                  >
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                      <ColorPicker
                        value={colorSecundario}
                        onChange={(color) => {
                          const hex = color.toHexString().toUpperCase();
                          setColorSecundario(hex);
                          form.setFieldsValue({ colorSecundario: hex });
                        }}
                        showText
                        size="large"
                        style={{ width: '100%' }}
                      />
                      <Input
                        value={colorSecundario}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          setColorSecundario(value);
                          form.setFieldsValue({ colorSecundario: value });
                        }}
                        placeholder="#F6D3D8"
                        maxLength={7}
                        style={{ fontFamily: 'monospace' }}
                      />
                      {/* Preview del color */}
                      <div
                        style={{
                          width: '100%',
                          height: '60px',
                          backgroundColor: colorSecundario,
                          borderRadius: '8px',
                          border: '2px solid #d9d9d9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isColorDark(colorSecundario) ? '#ffffff' : '#000000',
                          fontWeight: 600,
                          fontSize: '14px',
                        }}
                      >
                        Color Secundario
                      </div>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: '24px' }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={updateMutation.isPending}
              size="large"
            >
              Guardar Cambios
            </Button>
            <Button
              type="default"
              onClick={() => {
                form.resetFields();
                if (branding) {
                  setColorPrimario(branding.colorPrimario || '#96CBB3');
                  setColorSecundario(branding.colorSecundario || '#F6D3D8');
                }
              }}
              size="large"
            >
              Restablecer
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

// Función auxiliar para determinar si un color es oscuro
const isColorDark = (hexColor) => {
  if (!hexColor || !hexColor.match(/^#[0-9A-Fa-f]{6}$/)) return false;
  
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Fórmula de luminosidad
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
};

export default BrandingForm;
