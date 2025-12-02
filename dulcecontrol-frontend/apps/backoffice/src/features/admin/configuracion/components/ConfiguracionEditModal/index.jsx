import { useEffect } from 'react';
import { Form, Modal, Input, InputNumber, Switch, Select, Button, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getConfiguracionTienda } from '../../api/configuracion.api.js';
import { getPaginaStorefront } from '../../api/paginas-storefront.api.js';
import { CONFIGURACION_KEYS, PAGINAS_STOREFRONT_KEYS } from '../../constants/queryKeys.js';
import { mapConfiguracionTiendaResponse, mapPaginaStorefrontResponse } from '../../utils/configuracionMappers.js';

const { TextArea } = Input;
const { Option } = Select;

const ConfiguracionEditModal = ({ open, onClose, item, itemType, onSave, loading }) => {
  const [form] = Form.useForm();

  // Load data if editing
  const { data: configuracionData } = useQuery({
    queryKey: CONFIGURACION_KEYS.tienda(item?.tiendaId),
    queryFn: () => getConfiguracionTienda(item?.tiendaId),
    enabled: open && itemType === 'configuracion' && Boolean(item?.tiendaId),
    select: mapConfiguracionTiendaResponse,
  });

  const { data: paginaData } = useQuery({
    queryKey: PAGINAS_STOREFRONT_KEYS.detail(item?.tiendaId, item?.id),
    queryFn: () => getPaginaStorefront(item?.tiendaId, item?.id),
    enabled: open && itemType === 'pagina' && Boolean(item?.tiendaId) && Boolean(item?.id),
    select: mapPaginaStorefrontResponse,
  });

  useEffect(() => {
    if (open && item) {
      if (itemType === 'configuracion' && configuracionData) {
        form.setFieldsValue({
          ruc: configuracionData.ruc,
          razonSocial: configuracionData.razonSocial,
          direccionFiscal: configuracionData.direccionFiscal,
          ubigeoFiscal: configuracionData.ubigeoFiscal,
          usuarioSunatSol: configuracionData.usuarioSunatSol,
          claveSunatSolEncriptada: configuracionData.claveSunatSolEncriptada,
          certificadoDigitalUrl: configuracionData.certificadoDigitalUrl,
          modoSunat: configuracionData.modoSunat,
          tasaIgv: configuracionData.tasaIgv,
          apiKeyYape: configuracionData.apiKeyYape,
          apiKeyPlin: configuracionData.apiKeyPlin,
          merchantIdNiubiz: configuracionData.merchantIdNiubiz,
          bannerPrincipalUrl: configuracionData.bannerPrincipalUrl,
          mensajeBienvenida: configuracionData.mensajeBienvenida,
          horarioAtencion: typeof configuracionData.horarioAtencion === 'string'
            ? configuracionData.horarioAtencion
            : JSON.stringify(configuracionData.horarioAtencion, null, 2),
          redesSociales: typeof configuracionData.redesSociales === 'string'
            ? configuracionData.redesSociales
            : JSON.stringify(configuracionData.redesSociales, null, 2),
          politicasEnvio: configuracionData.politicasEnvio,
          politicasDevolucion: configuracionData.politicasDevolucion,
          emailNotificaciones: configuracionData.emailNotificaciones,
          telegramBotToken: configuracionData.telegramBotToken,
          telegramChatId: configuracionData.telegramChatId,
        });
      } else if (itemType === 'pagina' && paginaData) {
        form.setFieldsValue({
          slug: paginaData.slug,
          titulo: paginaData.titulo,
          contenido: paginaData.contenido,
          metaDescripcion: paginaData.metaDescripcion,
          ordenMenu: paginaData.ordenMenu,
          visibleEnMenu: paginaData.visibleEnMenu,
          activa: paginaData.activa,
        });
      }
    } else {
      form.resetFields();
    }
  }, [open, item, itemType, configuracionData, paginaData, form]);

  const handleSubmit = (values) => {
    // Custom confirmation modal as requested
    Modal.confirm({
      title: '¿Estás seguro de aplicar estos cambios?',
      content: 'Los cambios se aplicarán inmediatamente.',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => onSave(values),
    });
  };

  const renderConfiguracionForm = () => (
    <div>
      <Form.Item
        name="ruc"
        label="RUC"
        rules={[{ required: true, message: 'El RUC es obligatorio' }]}
      >
        <Input placeholder="Ingrese el RUC" />
      </Form.Item>

      <Form.Item
        name="razonSocial"
        label="Razón Social"
        rules={[{ required: true, message: 'La razón social es obligatoria' }]}
      >
        <Input placeholder="Ingrese la razón social" />
      </Form.Item>

      <Form.Item
        name="direccionFiscal"
        label="Dirección Fiscal"
        rules={[{ required: true, message: 'La dirección fiscal es obligatoria' }]}
      >
        <TextArea placeholder="Ingrese la dirección fiscal" rows={2} />
      </Form.Item>

      <Form.Item
        name="ubigeoFiscal"
        label="Ubigeo Fiscal"
        rules={[{ required: true, message: 'El ubigeo fiscal es obligatorio' }]}
      >
        <Input placeholder="Ingrese el código de ubigeo" />
      </Form.Item>

      <Form.Item name="usuarioSunatSol" label="Usuario SUNAT SOL">
        <Input placeholder="Ingrese el usuario SUNAT SOL" />
      </Form.Item>

      <Form.Item name="claveSunatSolEncriptada" label="Clave SUNAT SOL">
        <Input.Password placeholder="Ingrese la clave SUNAT SOL" />
      </Form.Item>

      <Form.Item name="certificadoDigitalUrl" label="Certificado Digital URL">
        <Input placeholder="Ingrese la URL del certificado digital" />
      </Form.Item>

      <Form.Item name="modoSunat" label="Modo SUNAT">
        <Select placeholder="Seleccione el modo">
          <Option value="pruebas">Pruebas</Option>
          <Option value="produccion">Producción</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="tasaIgv"
        label="Tasa IGV (%)"
        rules={[{ required: true, message: 'La tasa IGV es obligatoria' }]}
      >
        <InputNumber
          min={0}
          max={100}
          step={0.01}
          placeholder="18.00"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item name="apiKeyYape" label="API Key Yape">
        <Input placeholder="Ingrese la API key de Yape" />
      </Form.Item>

      <Form.Item name="apiKeyPlin" label="API Key Plin">
        <Input placeholder="Ingrese la API key de Plin" />
      </Form.Item>

      <Form.Item name="merchantIdNiubiz" label="Merchant ID Niubiz">
        <Input placeholder="Ingrese el merchant ID de Niubiz" />
      </Form.Item>

      <Form.Item name="bannerPrincipalUrl" label="Banner Principal URL">
        <Input placeholder="Ingrese la URL del banner principal" />
      </Form.Item>

      <Form.Item name="mensajeBienvenida" label="Mensaje de Bienvenida">
        <TextArea placeholder="Ingrese el mensaje de bienvenida" rows={3} />
      </Form.Item>

      <Form.Item name="horarioAtencion" label="Horario de Atención (JSON)">
        <TextArea placeholder='{"lunes": "08:00-18:00", ...}' rows={4} />
      </Form.Item>

      <Form.Item name="redesSociales" label="Redes Sociales (JSON)">
        <TextArea placeholder='{"facebook": "url", "instagram": "url"}' rows={4} />
      </Form.Item>

      <Form.Item name="politicasEnvio" label="Políticas de Envío">
        <TextArea placeholder="Ingrese las políticas de envío" rows={3} />
      </Form.Item>

      <Form.Item name="politicasDevolucion" label="Políticas de Devolución">
        <TextArea placeholder="Ingrese las políticas de devolución" rows={3} />
      </Form.Item>

      <Form.Item name="emailNotificaciones" label="Email de Notificaciones">
        <Input placeholder="Ingrese el email de notificaciones" />
      </Form.Item>

      <Form.Item name="telegramBotToken" label="Token Bot Telegram">
        <Input placeholder="Ingrese el token del bot de Telegram" />
      </Form.Item>

      <Form.Item name="telegramChatId" label="Chat ID Telegram">
        <Input placeholder="Ingrese el chat ID de Telegram" />
      </Form.Item>
    </div>
  );

  const renderPaginaForm = () => (
    <div>
      <Form.Item
        name="slug"
        label="Slug"
        rules={[{ required: true, message: 'El slug es obligatorio' }]}
      >
        <Input placeholder="Ingrese el slug de la página" />
      </Form.Item>

      <Form.Item
        name="titulo"
        label="Título"
        rules={[{ required: true, message: 'El título es obligatorio' }]}
      >
        <Input placeholder="Ingrese el título de la página" />
      </Form.Item>

      <Form.Item
        name="contenido"
        label="Contenido"
        rules={[{ required: true, message: 'El contenido es obligatorio' }]}
      >
        <TextArea placeholder="Ingrese el contenido HTML de la página" rows={6} />
      </Form.Item>

      <Form.Item name="metaDescripcion" label="Meta Descripción">
        <TextArea placeholder="Ingrese la meta descripción" rows={2} />
      </Form.Item>

      <Form.Item
        name="ordenMenu"
        label="Orden en Menú"
        rules={[{ required: true, message: 'El orden en menú es obligatorio' }]}
      >
        <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="visibleEnMenu"
        label="Visible en Menú"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="activa"
        label="Activa"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </div>
  );

  return (
    <Modal
      title={itemType === 'configuracion' ? 'Editar Configuración de Tienda' : 'Editar Página Storefront'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {itemType === 'configuracion' ? renderConfiguracionForm() : renderPaginaForm()}

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Guardar Cambios
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConfiguracionEditModal;