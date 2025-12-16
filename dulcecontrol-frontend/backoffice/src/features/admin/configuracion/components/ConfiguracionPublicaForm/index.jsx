import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Card, Button, Row, Col, message, Spin } from 'antd';
import { SaveOutlined, GlobalOutlined } from '@ant-design/icons';
import { getConfiguracionPublica, updateConfiguracionPublica } from '../../api/configuracion-publica.api';
import { CONFIGURACION_PUBLICA_KEYS } from '../../constants/queryKeys';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';

const { TextArea } = Input;

/**
 * Componente para gestionar la configuración pública de la tienda
 * Pestaña 3: Configuración Pública (banner, mensaje, horarios, redes, políticas)
 */
const ConfiguracionPublicaForm = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const tiendaId = useTokenStore((state) => state.tiendaId);

  // Query para obtener configuración actual
  const { data: config, isLoading } = useQuery({
    queryKey: CONFIGURACION_PUBLICA_KEYS.byTienda(tiendaId),
    queryFn: () => getConfiguracionPublica(tiendaId),
    enabled: !!tiendaId,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation para actualizar
  const updateMutation = useMutation({
    mutationFn: (values) => updateConfiguracionPublica(tiendaId, values),
    onSuccess: () => {
      message.success('Configuración pública actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: CONFIGURACION_PUBLICA_KEYS.byTienda(tiendaId) });
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al actualizar la configuración');
    },
  });

  // Cargar datos iniciales
  React.useEffect(() => {
    if (config) {
      form.setFieldsValue({
        sloganParte1: config.sloganParte1,
        sloganParte2: config.sloganParte2,
        bannerPrincipalUrl: config.bannerPrincipalUrl,
        mensajeBienvenida: config.mensajeBienvenida,
        horarioAtencion: config.horarioAtencion,
        redesSociales: config.redesSociales,
      });
    }
  }, [config, form]);

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
    <Card title={<span><GlobalOutlined /> Configuración Pública del Storefront</span>} bordered={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Slogan - Parte 1 (Estilo Normal)"
              name="sloganParte1"
              rules={[
                { max: 50, message: 'Máximo 50 caracteres' },
              ]}
              tooltip="Primera parte del slogan que aparece con estilo normal (ej: 'Dulces')"
            >
              <Input 
                placeholder="Ej: Dulces" 
                maxLength={50}
                showCount
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Slogan - Parte 2 (Estilo Itálica/Color)"
              name="sloganParte2"
              rules={[
                { max: 50, message: 'Máximo 50 caracteres' },
              ]}
              tooltip="Segunda parte del slogan que aparece con estilo itálica y color primario (ej: 'Momentos')"
            >
              <Input 
                placeholder="Ej: Momentos" 
                maxLength={50}
                showCount
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="URL del Banner Principal"
              name="bannerPrincipalUrl"
              rules={[{ type: 'url', message: 'Debe ser una URL válida' }]}
              tooltip="Imagen del banner principal en la página de inicio"
            >
              <Input placeholder="https://cdn.mitienda.com/banners/principal.jpg" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Mensaje de Bienvenida"
              name="mensajeBienvenida"
              rules={[{ max: 500, message: 'Máximo 500 caracteres' }]}
              tooltip="Mensaje que aparece en la sección hero del storefront"
            >
              <TextArea rows={3} placeholder="¡Bienvenidos! La mejor repostería artesanal de Lima..." />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Horario de Atención (JSON)"
              name="horarioAtencion"
              tooltip='{"lunes": {"abierto": true, "horario": "09:00-18:00"}}'
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    try {
                      JSON.parse(value);
                      return Promise.resolve();
                    } catch {
                      return Promise.reject(new Error('JSON inválido'));
                    }
                  },
                },
              ]}
            >
              <TextArea
                rows={6}
                placeholder='{"lunes": {"abierto": true, "horario": "09:00-18:00"}}'
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Redes Sociales (JSON)"
              name="redesSociales"
              tooltip='{"facebook": "url", "instagram": "url"}'
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    try {
                      JSON.parse(value);
                      return Promise.resolve();
                    } catch {
                      return Promise.reject(new Error('JSON inválido'));
                    }
                  },
                },
              ]}
            >
              <TextArea
                rows={6}
                placeholder='{"facebook": "https://facebook.com/...", "instagram": "https://instagram.com/..."}}'
              />
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

export default ConfiguracionPublicaForm;
