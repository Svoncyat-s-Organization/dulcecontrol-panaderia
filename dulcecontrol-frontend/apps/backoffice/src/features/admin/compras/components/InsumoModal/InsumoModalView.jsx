import { Modal, Form, Input, InputNumber, Select, Switch, Row, Col } from 'antd';
import { UNIDADES_MEDIDA } from '../../constants/enums.js';

const InsumoModalView = ({ open, onClose, onSubmit, form, loading, isEditing }) => {
  const unidadesOptions = Object.entries(UNIDADES_MEDIDA).map(([key, label]) => ({
    value: key,
    label: label,
  }));

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
              rules={[{ required: true, message: 'El factor de conversión es requerido' }]}
              tooltip="Cuántas unidades base equivalen a 1 unidad de compra"
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
