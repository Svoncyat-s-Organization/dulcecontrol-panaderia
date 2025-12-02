import React, { useState } from 'react';
import { Modal, Table, InputNumber, Button, App } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recibirParcial } from '../../api/ordenes-compra.api';
import { formatCurrency } from '../../utils/formatters';
import { UNIDADES_MEDIDA } from '../../constants/enums';
import { ORDENES_COMPRA_KEYS } from '../../constants/queryKeys';

const RecepcionParcialModal = ({ open, onClose, orden, tiendaId, sedeId }) => {
  const [items, setItems] = useState({});
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const mutation = useMutation({
    mutationFn: (payload) => recibirParcial(tiendaId, payload),
    onSuccess: async () => {
      message.success('Recepción parcial registrada exitosamente');
      setItems({});
      onClose();
      // Invalidar y refetch después de cerrar modal
      await queryClient.invalidateQueries(ORDENES_COMPRA_KEYS.all(tiendaId, sedeId));
      await queryClient.refetchQueries(ORDENES_COMPRA_KEYS.all(tiendaId, sedeId));
      // Forzar re-render completo
      window.location.reload();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Error al registrar la recepción');
    },
  });

  const handleCantidadChange = (detalleId, cantidad) => {
    setItems(prev => ({
      ...prev,
      [detalleId]: cantidad || 0
    }));
  };

  const handleSubmit = () => {
    // Filtrar solo los items con cantidad mayor a 0
    const itemsToReceive = Object.entries(items)
      .filter(([, cantidad]) => cantidad > 0)
      .map(([detalleId, cantidad]) => ({
        detalleOrdenCompraId: parseInt(detalleId),
        cantidadRecibida: cantidad
      }));

    if (itemsToReceive.length === 0) {
      message.warning('Debe especificar al menos un insumo a recibir');
      return;
    }

    mutation.mutate({
      ordenCompraId: orden.id,
      items: itemsToReceive
    });
  };

  // Limpiar items cuando se cierra el modal
  const handleClose = () => {
    setItems({});
    onClose();
  };

  const columns = [
    {
      title: 'Insumo',
      dataIndex: 'nombreInsumo',
      key: 'nombreInsumo',
      width: 250,
    },
    {
      title: 'Solicitado',
      dataIndex: 'cantidadSolicitada',
      key: 'cantidadSolicitada',
      width: 100,
      render: (val) => val?.toFixed(2) || '0.00',
    },
    {
      title: 'Recibido',
      dataIndex: 'cantidadRecibida',
      key: 'cantidadRecibida',
      width: 100,
      render: (val) => val?.toFixed(2) || '0.00',
    },
    {
      title: 'Pendiente',
      key: 'pendiente',
      width: 100,
      render: (_, record) => {
        const pendiente = (record.cantidadSolicitada || 0) - (record.cantidadRecibida || 0);
        return pendiente.toFixed(2);
      },
    },
    {
      title: 'Unidad',
      dataIndex: 'unidadCompra',
      key: 'unidadCompra',
      width: 100,
      render: (val) => UNIDADES_MEDIDA[val] || val,
    },
    {
      title: 'A Recibir Ahora',
      key: 'recibir',
      width: 150,
      render: (_, record) => {
        const pendiente = (record.cantidadSolicitada || 0) - (record.cantidadRecibida || 0);
        return (
          <InputNumber
            min={0}
            max={pendiente}
            step={0.01}
            precision={2}
            style={{ width: '100%' }}
            value={items[record.id] || 0}
            onChange={(val) => handleCantidadChange(record.id, val)}
            placeholder="0.00"
          />
        );
      },
    },
  ];

  return (
    <Modal
      title={`Recepción Parcial - Orden #${orden?.id}`}
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      confirmLoading={mutation.isPending}
      width={1000}
      okText="Registrar Recepción"
      cancelText="Cancelar"
    >
      <div style={{ marginBottom: 16 }}>
        <p><strong>Proveedor:</strong> {orden?.nombreProveedor}</p>
        <p><strong>Sede Destino:</strong> {orden?.nombreSede}</p>
        <p><strong>Total:</strong> {formatCurrency(orden?.totalCompraCentimos)}</p>
      </div>

      <Table
        columns={columns}
        dataSource={orden?.detalles || []}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ y: 400 }}
      />

      <div style={{ marginTop: 16, color: '#666', fontSize: 12 }}>
        * Ingrese la cantidad recibida para cada insumo. Solo se actualizarán los items con cantidad mayor a 0.
      </div>
    </Modal>
  );
};

export default RecepcionParcialModal;
