import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col, Button, InputNumber, Popconfirm, Card, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ESTADO_ORDEN_COMPRA_VALUES, METODO_PAGO, TIPO_COMPROBANTE, UNIDADES_MEDIDA } from '../../constants/enums.js';
import { formatCurrency } from '../../utils/formatters.js';

const { TextArea } = Input;

const OrdenCompraModalView = ({
  open,
  onClose,
  onSubmit,
  form,
  loading,
  isEditing,
  proveedores,
  insumos,
  sedes,
  detalles,
  setDetalles,
}) => {
  // Opciones de estado según si es nueva orden o edición
  const getEstadoOptions = () => {
    if (isEditing) {
      // Al editar, mostrar todos los estados
      return Object.entries(ESTADO_ORDEN_COMPRA_VALUES).map(([key, value]) => ({
        value: value,
        label: key.replace(/_/g, ' '),
      }));
    } else {
      // Al crear, solo permitir BORRADOR o ENVIADA
      return [
        { value: ESTADO_ORDEN_COMPRA_VALUES.BORRADOR, label: 'BORRADOR' },
        { value: ESTADO_ORDEN_COMPRA_VALUES.ENVIADA, label: 'ENVIADA' },
      ];
    }
  };

  const estadoOptions = getEstadoOptions();

  const metodoPagoOptions = Object.entries(METODO_PAGO).map(([key, label]) => ({
    value: key,
    label: label,
  }));

  const tipoComprobanteOptions = Object.entries(TIPO_COMPROBANTE).map(([key, label]) => ({
    value: key,
    label: label,
  }));

  const proveedoresOptions = proveedores.map((p) => ({
    value: p.id,
    label: p.nombreComercial,
  }));

  const sedesOptions = sedes.map((s) => ({
    value: s.id,
    label: s.nombre || `Sede ${s.codigoInterno}`,
  }));

  const insumosOptions = insumos.map((i) => ({
    value: i.id,
    label: `${i.nombre} (${i.codigoInterno || 'N/D'})`,
  }));

  const unidadesOptions = Object.entries(UNIDADES_MEDIDA).map(([key, label]) => ({
    value: key,
    label: label,
  }));

  // Contador para forzar re-render
  const [updateKey, setUpdateKey] = useState(0);
  const forceUpdate = () => setUpdateKey(prev => prev + 1);

  const agregarInsumo = () => {
    const nuevoItem = {
      key: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      insumoId: null,
      cantidadSolicitada: 1,
      unidadCompra: 'kg',
      costoUnitarioPactado: 0,
      totalLinea: 0,
    };
    setDetalles([...detalles, nuevoItem]);
  };

  const eliminarInsumo = (keyToRemove) => {
    setDetalles(detalles.filter(item => item.key !== keyToRemove));
  };

  const actualizarInsumo = (keyToUpdate, campo, valor) => {
    const updated = detalles.map(item => {
      // Si no es el item a actualizar, solo copiarlo
      if (item.key !== keyToUpdate) {
        return item;
      }
      
      // Item a actualizar
      const itemActualizado = { ...item, [campo]: valor };
      
      // Si cambió el insumo, actualizar la unidad
      if (campo === 'insumoId' && valor) {
        const insumo = insumos.find(i => i.id === valor);
        if (insumo) {
          itemActualizado.unidadCompra = insumo.unidadCompraHabitual;
        }
      }
      
      // Recalcular total con Number para asegurar conversión correcta
      const cantidad = Number(itemActualizado.cantidadSolicitada) || 0;
      const precio = Number(itemActualizado.costoUnitarioPactado) || 0;
      itemActualizado.totalLinea = cantidad * precio;
      
      console.log(`Actualizando ${campo}:`, { cantidad, precio, total: itemActualizado.totalLinea });
      
      return itemActualizado;
    });
    
    setDetalles(updated);
    forceUpdate(); // Forzar re-render
  };

  // Calcular el total directamente, sin useMemo, para que siempre use los valores más recientes
  const calcularTotalActual = () => {
    const total = detalles.reduce((suma, item) => {
      // Recalcular el total de cada línea en tiempo real
      const cantidad = parseFloat(item.cantidadSolicitada) || 0;
      const precio = parseFloat(item.costoUnitarioPactado) || 0;
      const lineTotal = cantidad * precio;
      return suma + lineTotal;
    }, 0);
    return total;
  };

  return (
    <Modal
      title={isEditing ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
      open={open}
      onCancel={onClose}
      onOk={onSubmit}
      confirmLoading={loading}
      width={1000}
      okText={isEditing ? 'Actualizar' : 'Crear'}
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Información General</div>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="proveedorId"
              label="Proveedor"
              rules={[{ required: true, message: 'El proveedor es requerido' }]}
            >
              <Select
                placeholder="Selecciona proveedor"
                options={proveedoresOptions}
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sedeDestinoId"
              label="Sede Destino"
              rules={[{ required: true, message: 'La sede destino es requerida' }]}
            >
              <Select
                placeholder="Selecciona sede"
                options={sedesOptions}
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Campo oculto para fecha de emisión (se establece automáticamente) */}
        <Form.Item name="fechaEmision" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fechaRecepcionEsperada"
              label="Fecha Recepción Esperada"
              getValueProps={(value) => ({
                value: value ? dayjs(value) : null,
              })}
              normalize={(value) => (value ? value.format('YYYY-MM-DD') : null)}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="estado"
              label="Estado"
              rules={[{ required: true, message: 'El estado es requerido' }]}
            >
              <Select options={estadoOptions} />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 16, marginBottom: 16 }}>
          Pago y Comprobante
        </div>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="metodoPago" label="Método de Pago">
              <Select placeholder="Selecciona método" options={metodoPagoOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="referenciaPago" label="Referencia de Pago">
              <Input placeholder="Ej: TRANS-20241028-001" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="tipoComprobanteProveedor" label="Tipo Comprobante">
              <Select placeholder="Selecciona tipo" options={tipoComprobanteOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="serieComprobanteProveedor" label="Serie Comprobante">
              <Input placeholder="Ej: F001" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="numeroComprobanteProveedor" label="Número Comprobante">
              <Input placeholder="Ej: 00012345" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="observaciones" label="Observaciones">
          <TextArea rows={2} placeholder="Notas adicionales sobre la orden" />
        </Form.Item>

        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 16 }}>
          Detalles de la Orden
        </div>
        
        <Button type="dashed" icon={<PlusOutlined />} onClick={agregarInsumo} block style={{ marginBottom: 16 }}>
          Agregar Insumo
        </Button>

        {detalles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
            No hay insumos agregados
          </div>
        ) : (
          <Space vertical style={{ width: '100%' }} size="middle" key={`space-${updateKey}`}>
            {detalles.map((item, idx) => (
              <Card key={`${item.key}-${updateKey}`} size="small">
                <div style={{ marginBottom: 12, fontWeight: 500 }}>Insumo #{idx + 1}</div>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div>
                      <div style={{ marginBottom: 4 }}>Insumo</div>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Seleccionar"
                        value={item.insumoId}
                        onChange={val => actualizarInsumo(item.key, 'insumoId', val)}
                        options={insumosOptions}
                        showSearch
                        filterOption={(input, option) => 
                          option.label.toLowerCase().includes(input.toLowerCase())
                        }
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <div style={{ marginBottom: 4 }}>Cantidad</div>
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0.01}
                        step={0.1}
                        precision={2}
                        value={item.cantidadSolicitada}
                        onChange={val => actualizarInsumo(item.key, 'cantidadSolicitada', val)}
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <div style={{ marginBottom: 4 }}>Unidad</div>
                      <Select
                        style={{ width: '100%' }}
                        value={item.unidadCompra}
                        onChange={val => actualizarInsumo(item.key, 'unidadCompra', val)}
                        options={unidadesOptions}
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <div style={{ marginBottom: 4 }}>Costo (S/)</div>
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={0.01}
                        precision={2}
                        placeholder="0.00"
                        value={item.costoUnitarioPactado}
                        onChange={val => actualizarInsumo(item.key, 'costoUnitarioPactado', val)}
                      />
                    </div>
                  </Col>
                  <Col span={20}>
                    <div>
                      <div style={{ marginBottom: 4 }}>Total</div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>
                        {(() => {
                          const cant = Number(item.cantidadSolicitada) || 0;
                          const costo = Number(item.costoUnitarioPactado) || 0;
                          const total = cant * costo;
                          return formatCurrency(Math.round(total * 100));
                        })()}
                      </div>
                    </div>
                  </Col>
                  <Col span={4} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <Popconfirm
                      title="¿Eliminar?"
                      onConfirm={() => eliminarInsumo(item.key)}
                      okText="Sí"
                      cancelText="No"
                    >
                      <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Col>
                </Row>
              </Card>
            ))}
            
            <Card style={{ backgroundColor: '#f5f5f5' }}>
              <Row>
                <Col span={12}>
                  <div style={{ fontSize: 14, color: '#666' }}>
                    {detalles.length} insumo{detalles.length !== 1 ? 's' : ''}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 18, fontWeight: 600, textAlign: 'right' }}>
                    Total: {(() => {
                      const total = detalles.reduce((suma, item) => {
                        const cantidad = Number(item.cantidadSolicitada) || 0;
                        const precio = Number(item.costoUnitarioPactado) || 0;
                        const lineTotal = cantidad * precio;
                        console.log(`Item: cant=${cantidad}, precio=${precio}, lineTotal=${lineTotal}`);
                        return suma + lineTotal;
                      }, 0);
                      console.log(`Total final a mostrar: ${total}`);
                      return formatCurrency(Math.round(total * 100));
                    })()}
                  </div>
                </Col>
              </Row>
            </Card>
          </Space>
        )}
      </Form>
    </Modal>
  );
};

export default OrdenCompraModalView;
