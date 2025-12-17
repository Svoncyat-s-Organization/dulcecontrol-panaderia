import { Modal, Form, Select, InputNumber, Input, Alert } from 'antd';
import { IconAlertCircle } from '@tabler/icons-react';
import { UNIDADES_MEDIDA_OPTIONS } from '../../constants/recetasConstants.js';

const { TextArea } = Input;

const RecetaFormView = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEditing,
  saving,
  productos,
  insumos,
  loadingProductos,
  loadingInsumos,
}) => {
  const [form] = Form.useForm();
  
  // Detectar si es agregar insumo (tiene productoId pero no id)
  const isAddingInsumo = initialValues && initialValues.productoId && !initialValues.id;

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((info) => {
        console.log('Validación fallida:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // Inicializar valores cuando se abre el modal
  const handleAfterOpenChange = (visible) => {
    if (visible) {
      if (isEditing && initialValues) {
        form.setFieldsValue({
          productoId: initialValues.productoId,
          insumoId: initialValues.insumoId,
          cantidadRequerida: initialValues.cantidadRequerida,
          unidadMedida: initialValues.unidadMedida,
          notasPreparacion: initialValues.notasPreparacion,
        });
      } else if (isAddingInsumo) {
        // Preseleccionar producto al agregar insumo
        form.setFieldsValue({
          productoId: initialValues.productoId,
        });
      } else {
        form.resetFields();
      }
    }
  };

  // Auto-cargar unidad de medida del insumo seleccionado
  const handleInsumoChange = (insumoId) => {
    const insumo = insumos.find(i => i.id === insumoId);
    if (insumo && insumo.unidadBase) {
      // El backend ahora devuelve unidades en minúsculas, usarlas directamente
      form.setFieldValue('unidadMedida', insumo.unidadBase);
    }
  };

  // Filtrar producto actual para evitar que aparezca en insumos (opcional)
  const productoSeleccionadoId = Form.useWatch('productoId', form);
  const insumosFiltrados = insumos; // Productos e insumos son catálogos diferentes

  // Determinar texto del botón
  const getOkText = () => {
    if (isEditing) return 'Actualizar';
    if (isAddingInsumo) return 'Agregar Insumo';
    return 'Crear Receta';
  };

  return (
    <Modal
      title={isEditing ? 'Editar Receta' : isAddingInsumo ? 'Agregar Insumo a Receta' : 'Nueva Receta'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={saving}
      width={600}
      okText={getOkText()}
      cancelText="Cancelar"
      afterOpenChange={handleAfterOpenChange}
    >
      <Alert
        message="Define los insumos y cantidades requeridas para elaborar cada producto"
        type="info"
        icon={<IconAlertCircle size={16} />}
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{
          cantidadRequerida: 1,
          unidadMedida: 'unidad',
        }}
      >
        <Form.Item
          name="productoId"
          label="Producto"
          rules={[{ required: true, message: 'Selecciona el producto' }]}
        >
          <Select
            placeholder="Selecciona el producto a elaborar"
            showSearch
            loading={loadingProductos}
            disabled={isEditing || isAddingInsumo}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={productos.map((p) => ({
              value: p.id,
              label: `${p.nombre} (${p.sku})`,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="insumoId"
          label="Insumo"
          rules={[{ required: true, message: 'Selecciona el insumo' }]}
        >
          <Select
            placeholder="Selecciona el insumo requerido"
            showSearch
            loading={loadingInsumos}
            disabled={isEditing}
            onChange={handleInsumoChange}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={insumosFiltrados.map((i) => ({
              value: i.id,
              label: `${i.nombre} (${i.codigoInterno || 'Sin código'})`,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="cantidadRequerida"
          label="Cantidad Requerida"
          rules={[
            { required: true, message: 'Ingresa la cantidad' },
            { type: 'number', min: 0.0001, message: 'La cantidad debe ser mayor a 0' },
          ]}
        >
          <InputNumber
            placeholder="Ej: 0.5"
            style={{ width: '100%' }}
            min={0.0001}
            precision={4}
            step={0.1}
          />
        </Form.Item>

        <Form.Item
          name="unidadMedida"
          label="Unidad de Medida"
          rules={[{ required: true, message: 'Selecciona la unidad' }]}
        >
          <Select
            placeholder="Selecciona la unidad"
            options={UNIDADES_MEDIDA_OPTIONS}
          />
        </Form.Item>

        <Form.Item
          name="notasPreparacion"
          label="Notas de Preparación"
          rules={[{ max: 2000, message: 'Máximo 2000 caracteres' }]}
        >
          <TextArea
            placeholder="Instrucciones adicionales para la preparación (opcional)"
            rows={4}
            maxLength={2000}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RecetaFormView;
