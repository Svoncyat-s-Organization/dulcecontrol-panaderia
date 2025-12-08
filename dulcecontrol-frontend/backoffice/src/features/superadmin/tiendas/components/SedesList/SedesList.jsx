import React from 'react';
import { Table, Button, Space, Popconfirm, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const SedesList = ({ sedes, loading, onEdit, onCreate, onDelete }) => {
    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Código Interno',
            dataIndex: 'codigoInterno',
            key: 'codigoInterno',
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            key: 'direccion',
        },
        {
            title: 'Principal',
            dataIndex: 'esPrincipal',
            key: 'esPrincipal',
            render: (esPrincipal) => (esPrincipal ? <Tag color="blue">Principal</Tag> : <Tag>Sucursal</Tag>),
        },
        {
            title: 'Estado',
            dataIndex: 'activo',
            key: 'activo',
            render: (activo) => (
                activo ? <Tag color="green">Activa</Tag> : <Tag color="red">Inactiva</Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Editar sede">
                        <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="¿Estás seguro de eliminar esta sede?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                    Nueva Sede
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={sedes}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default SedesList;
