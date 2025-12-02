import { Modal, Descriptions, Tag, Typography, Divider } from 'antd';

const { Text, Title } = Typography;

const ConfiguracionViewModal = ({ open, onClose, item, itemType }) => {
  if (!item) return null;

  const renderConfiguracionContent = (configuracion) => (
    <div>
      <Title level={5} style={{ marginBottom: 16 }}>
        Información de la Tienda
      </Title>

      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="RUC">{configuracion.ruc || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Razón Social">{configuracion.razonSocial || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Dirección Fiscal">{configuracion.direccionFiscal || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Ubigeo Fiscal">{configuracion.ubigeoFiscal || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Usuario SUNAT SOL">{configuracion.usuarioSunatSol || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Certificado Digital URL">{configuracion.certificadoDigitalUrl || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Modo SUNAT">{configuracion.modoSunat || 'pruebas'}</Descriptions.Item>
        <Descriptions.Item label="Tasa IGV">{configuracion.tasaIgv ? `${configuracion.tasaIgv}%` : 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="API Key Yape">{configuracion.apiKeyYape || 'No configurado'}</Descriptions.Item>
        <Descriptions.Item label="API Key Plin">{configuracion.apiKeyPlin || 'No configurado'}</Descriptions.Item>
        <Descriptions.Item label="Merchant ID Niubiz">{configuracion.merchantIdNiubiz || 'No configurado'}</Descriptions.Item>
        <Descriptions.Item label="Banner Principal URL">{configuracion.bannerPrincipalUrl || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Mensaje de Bienvenida">{configuracion.mensajeBienvenida || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Horario de Atención">
          {configuracion.horarioAtencion ? (
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
              {typeof configuracion.horarioAtencion === 'string'
                ? configuracion.horarioAtencion
                : JSON.stringify(configuracion.horarioAtencion, null, 2)}
            </pre>
          ) : 'No especificado'}
        </Descriptions.Item>
        <Descriptions.Item label="Redes Sociales">
          {configuracion.redesSociales ? (
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
              {typeof configuracion.redesSociales === 'string'
                ? configuracion.redesSociales
                : JSON.stringify(configuracion.redesSociales, null, 2)}
            </pre>
          ) : 'No especificado'}
        </Descriptions.Item>
        <Descriptions.Item label="Políticas de Envío">{configuracion.politicasEnvio || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Políticas de Devolución">{configuracion.politicasDevolucion || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Email de Notificaciones">{configuracion.emailNotificaciones || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Token Bot Telegram">{configuracion.telegramBotToken ? 'Configurado' : 'No configurado'}</Descriptions.Item>
        <Descriptions.Item label="Chat ID Telegram">{configuracion.telegramChatId || 'No configurado'}</Descriptions.Item>
        <Descriptions.Item label="Última Actualización">
          {configuracion.actualizadoEn ? new Date(configuracion.actualizadoEn).toLocaleString('es-PE') : 'No disponible'}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  const renderPaginaContent = (pagina) => (
    <div>
      <Title level={5} style={{ marginBottom: 16 }}>
        Información de la Página
      </Title>

      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="ID">{pagina.id}</Descriptions.Item>
        <Descriptions.Item label="Slug">{pagina.slug}</Descriptions.Item>
        <Descriptions.Item label="Título">{pagina.titulo}</Descriptions.Item>
        <Descriptions.Item label="Contenido">
          <div dangerouslySetInnerHTML={{ __html: pagina.contenido || 'Sin contenido' }} />
        </Descriptions.Item>
        <Descriptions.Item label="Meta Descripción">{pagina.metaDescripcion || 'No especificado'}</Descriptions.Item>
        <Descriptions.Item label="Orden en Menú">{pagina.ordenMenu}</Descriptions.Item>
        <Descriptions.Item label="Visible en Menú">
          <Tag color={pagina.visibleEnMenu ? 'green' : 'red'}>
            {pagina.visibleEnMenu ? 'Sí' : 'No'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          <Tag color={pagina.activa ? 'green' : 'red'}>
            {pagina.activa ? 'Activa' : 'Inactiva'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de Creación">
          {pagina.creadoEn ? new Date(pagina.creadoEn).toLocaleString('es-PE') : 'No disponible'}
        </Descriptions.Item>
        <Descriptions.Item label="Última Actualización">
          {pagina.actualizadoEn ? new Date(pagina.actualizadoEn).toLocaleString('es-PE') : 'No disponible'}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  return (
    <Modal
      title={itemType === 'configuracion' ? 'Detalles de Configuración de Tienda' : 'Detalles de Página Storefront'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnHidden
    >
      {itemType === 'configuracion'
        ? renderConfiguracionContent(item)
        : renderPaginaContent(item)
      }
    </Modal>
  );
};

export default ConfiguracionViewModal;