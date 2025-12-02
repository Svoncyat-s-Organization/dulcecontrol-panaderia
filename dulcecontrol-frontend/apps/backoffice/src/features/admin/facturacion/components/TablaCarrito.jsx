import React from 'react';
import { Table, Button, InputNumber } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useFacturacionStore } from '../hooks/useFacturacionStore';

export const TablaCarrito = () => {
    const { carrito, actualizarCantidad, removerProducto } = useFacturacionStore();

    const columns = [
        {
            title: 'Producto',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Precio',
            dataIndex: 'precioUnitario',
            key: 'precioUnitario',
            render: (val) => `S/ ${val.toFixed(2)}`,
            width: 100,
        },
        {
            title: 'Cant.',
            dataIndex: 'cantidad',
            key: 'cantidad',
            width: 100,
            render: (val, record) => (
                <InputNumber
                    min={1}
                    value={val}
                    onChange={(newVal) => actualizarCantidad(record.id, newVal)}
                />
            )
        },
        {
            title: 'Subtotal',
            dataIndex: 'subtotal',
            key: 'subtotal',
            render: (val) => `S/ ${val.toFixed(2)}`,
            width: 100,
            align: 'right'
        },
        {
            title: '',
            key: 'action',
            width: 50,
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removerProducto(record.id)}
                />
            )
        }
    ];

    return (
        <Table
            dataSource={carrito}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ y: 400 }}
        />
    );
};
