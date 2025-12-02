import React from 'react';
import { Table, Button, Space, Popconfirm, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const DominiosList = ({ dominios, loading, onEdit, onCreate, onDelete }) => {
    const columns = [
        {
            title: 'URL Dominio',
            dataIndex: 'urlDominio',
            key: 'urlDominio',
            render: (text) => (
                text
                    ? <a href={`https://${text}`} target="_blank" rel="noopener noreferrer">{text}</a>
                    : '-'
            )
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
            render: (tipo) => {
                let color = 'blue';
                if (tipo === 'ADMINISTRATIVO') color = 'purple';
                return <Tag color={color}>{tipo}</Tag>;
            }
        },
        {
            title: 'Colores',
            key: 'colores',
            render: (_, record) => (
                <Space>
                    <div style={{ width: 20, height: 20, backgroundColor: record.colorPrimario, border: '1px solid #ccc' }} title="Primario"></div>
                    <div style={{ width: 20, height: 20, backgroundColor: record.colorSecundario, border: '1px solid #ccc' }} title="Secundario"></div>
                </Space>
            )
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Editar dominio">
                        <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="¿Estás seguro de eliminar este dominio?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                    Nuevo Dominio
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={dominios}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default DominiosList;
