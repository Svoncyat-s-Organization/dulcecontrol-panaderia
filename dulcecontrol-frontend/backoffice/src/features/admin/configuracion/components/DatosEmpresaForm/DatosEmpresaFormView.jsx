import { Alert, Button, Card, Col, Divider, Form, Input, message, Modal, Row, Select, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
const { TextArea } = Input;

const DatosEmpresaFormView = ({ datosEmpresa, isLoading, isError, error, isSubmitting, onSubmit }) => {
  const [form] = Form.useForm();

  // Cuando los datos cargan, setear valores iniciales (evita setState en render)
  useEffect(() => {
    if (!datosEmpresa) return;
    if (form.isFieldsTouched(true)) return;

    const tasaIgvRaw = datosEmpresa.tasaIgv ?? 18.0;
    const tasaIgvNum = Number(tasaIgvRaw);

    form.setFieldsValue({
      numeroDoc: datosEmpresa.numeroDoc,
      nombreDoc: datosEmpresa.nombreDoc,
      nombreComercial: datosEmpresa.nombreComercial,
      correoContacto: datosEmpresa.correoContacto,
      telefonoContacto: datosEmpresa.telefonoContacto,
      direccionFiscal: datosEmpresa.direccionFiscal,
      ubigeoFiscal: datosEmpresa.ubigeoFiscal,
    });
  }, [datosEmpresa, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      Modal.confirm({
        title: '¿Estas seguro de aplicar estos cambios?',
        content: 'Los cambios afectarán a los futuros comprobantes de pago. Los históricos quedan intactos.',
        okText: 'Sí',
        cancelText: 'No',
        onOk: () => {
          onSubmit(values);
        },
      });
    }).catch(() => {});
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Cargando datos de empresa..." />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error al cargar datos"
        description={error?.message || 'No se pudieron cargar los datos de la empresa'}
        type="error"
        showIcon
      />
    );
  }

  return (
    <Form form={form} layout="vertical">
      {/* SECCIÓN 1: IDENTIDAD LEGAL */}
      <Card title="📋 Identidad Legal" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="RUC"
              name="numeroDoc"
              tooltip="El RUC de la empresa (11 dígitos numéricos)"
            >
              <Input placeholder="20123456789" maxLength={11} />
            </Form.Item>
          </Col>

          <Col xs={24} md={16}>
            <Form.Item
              label="Razón Social"
              name="nombreDoc"
              rules={[{ required: true, message: 'La razón social es obligatoria' }]}
              tooltip="Nombre legal de la empresa ante la SUNAT"
            >
              <Input placeholder="Ej: Inversiones Dulce Manjar S.A.C." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nombre Comercial"
              name="nombreComercial"
              rules={[{ required: true, message: 'El nombre comercial es obligatorio' }]}
              tooltip="Nombre público de la empresa"
            >
              <Input placeholder="Ej: Pastelería Dulce Manjar" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Correo de Contacto"
              name="correoContacto"
              rules={[
                { required: true, message: 'El correo es obligatorio' },
                { type: 'email', message: 'Ingrese un correo válido' },
              ]}
            >
              <Input placeholder="contacto@empresa.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Teléfono de Contacto" name="telefonoContacto">
              <Input placeholder="+51 999 999 999" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* SECCIÓN 2: DATOS FISCALES */}
      <Card title="🏢 Datos Fiscales" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item
              label="Dirección Fiscal"
              name="direccionFiscal"
              rules={[{ required: true, message: 'La dirección fiscal es obligatoria' }]}
              tooltip="Dirección legal registrada en la SUNAT"
            >
              <TextArea rows={2} placeholder="Av. Principal 123, Distrito, Provincia" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="Ubigeo Fiscal"
              name="ubigeoFiscal"
              rules={[
                { required: true, message: 'El ubigeo es obligatorio' },
                { pattern: /^\d{6}$/, message: 'El ubigeo debe tener 6 dígitos' },
              ]}
              tooltip="Código de 6 dígitos del distrito fiscal (ej: 150101 para Lima - Lima - Lima)"
            >
              <Input placeholder="150101" maxLength={6} />
            </Form.Item>
          </Col>
        </Row>
      </Card>



      <Divider />

      {/* BOTÓN SUBMIT */}
      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={isSubmitting} block>
          Guardar Cambios
        </Button>
      </Form.Item>

      {datosEmpresa?.actualizadoEn && (
        <div style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '8px' }}>
          Última actualización: {new Date(datosEmpresa.actualizadoEn).toLocaleString('es-PE')}
        </div>
      )}
    </Form>
  );
};

export default DatosEmpresaFormView;
