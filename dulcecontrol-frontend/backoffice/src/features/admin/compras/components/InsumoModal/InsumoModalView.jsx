import { useMemo } from 'react';
import { Alert, Col, Form, Input, InputNumber, Modal, Row, Select, Switch, Typography } from 'antd';
import { UNIDADES_MEDIDA } from '../../constants/enums.js';

const { Text } = Typography;

const InsumoModalView = ({ open, onClose, onSubmit, form, loading, isEditing }) => {
  const unidadesOptions = Object.entries(UNIDADES_MEDIDA).map(([key, label]) => ({
    value: key,
    label: label,
  }));

  const unidadBase = Form.useWatch('unidadBase', form);
  const unidadCompraHabitual = Form.useWatch('unidadCompraHabitual', form);
  const factorConversionRaw = Form.useWatch('factorConversion', form);

  const factorConversion = useMemo(() => {
    const n = Number(factorConversionRaw);
    return Number.isFinite(n) ? n : null;
  }, [factorConversionRaw]);

  const conversionText = useMemo(() => {
    if (!unidadBase || !unidadCompraHabitual || !factorConversion || factorConversion <= 0) {
      return null;
    }
    return `1 ${unidadCompraHabitual} = ${factorConversion} ${unidadBase}`;
  }, [unidadBase, unidadCompraHabitual, factorConversion]);

  const shouldSuggestFactorOne = Boolean(unidadBase && unidadCompraHabitual && unidadBase === unidadCompraHabitual);

  return (
    <Modal
      title={isEditing ? 'Editar Insumo' : 'Nuevo Insumo'}
      open={open}
      onCancel={onClose}
      onOk={onSubmit}
      confirmLoading={loading}
      width={700}
      okText={isEditing ? 'Actualizar' : 'Crear'}
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="Unidades y conversión"
          description={(
            <div>
              <div>
                El <Text strong>factor de conversión</Text> indica cuántas <Text strong>unidades base</Text> equivalen a 1
                <Text strong> unidad de compra</Text>.
              </div>
              <div style={{ marginTop: 4 }}>
                Ejemplo: si compras en <Text strong>SACO</Text> de 50 <Text strong>KG</Text>, entonces factor = 50.
              </div>
              {conversionText && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Vista previa: </Text>
                  <Text strong>{conversionText}</Text>
                </div>
              )}
            </div>
          )}
        />

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="nombre"
              label="Nombre del Insumo"
              rules={[{ required: true, message: 'El nombre es requerido' }]}
            >
              <Input placeholder="Ej: Harina panadera" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="codigoInterno" label="Código Interno">
              <Input placeholder="Ej: INS-001" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="unidadBase"
              label="Unidad Base"
              rules={[{ required: true, message: 'La unidad base es requerida' }]}
            >
              <Select
                placeholder="Selecciona unidad base"
                options={unidadesOptions}
                showSearch
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="unidadCompraHabitual"
              label="Unidad de Compra Habitual"
              rules={[{ required: true, message: 'La unidad de compra es requerida' }]}
            >
              <Select
                placeholder="Selecciona unidad de compra"
                options={unidadesOptions}
                showSearch
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="factorConversion"
              label="Factor de Conversión"
              rules={[
                { required: true, message: 'El factor de conversión es requerido' },
                { type: 'number', min: 0.0001, message: 'Debe ser mayor a 0' },
              ]}
              tooltip="Cuántas unidades base equivalen a 1 unidad de compra"
              extra={
                conversionText ? (
                  <Text type="secondary">{conversionText}</Text>
                ) : shouldSuggestFactorOne ? (
                  <Text type="secondary">Si ambas unidades son iguales, usa factor 1.</Text>
                ) : (
                  <Text type="secondary">Completa unidades para ver la equivalencia.</Text>
                )
              }
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0.0001}
                step={0.1}
                precision={4}
                placeholder="Ej: 1 si son iguales, 50 si un saco = 50 kg"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="stockMinimoGlobal"
              label="Stock Mínimo Global"
              rules={[{ required: true, message: 'El stock mínimo es requerido' }]}
              extra={unidadBase ? `Se interpreta en ${unidadBase}.` : 'Se interpreta en unidad base.'}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={1}
                precision={2}
                placeholder="Cantidad mínima de alerta"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="activo" label="Estado" valuePropName="checked">
          <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InsumoModalView;
