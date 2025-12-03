import React from 'react';
import { Table, Button, Space, Input, Tag, Popconfirm, Tooltip } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    MailOutlined,
    IdcardOutlined,
} from '@ant-design/icons';

const dateFormatter = new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
});

const UsuariosList = ({
    usuarios,
    loading,
    onCreate,
    onEdit,
    onDelete,
    searchText,
    setSearchText,
    isDeleting,
}) => {
    const columns = [
        {
            title: 'Nombres',
            dataIndex: 'nombres',
            key: 'nombres',
            render: (value, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{value}</div>
                    <div style={{ fontSize: 12, color: 'var(--ant-color-text-tertiary)' }}>{record.rolNombre || 'Sin rol'}</div>
                </div>
            ),
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            key: 'correo',
            render: (correo) => (
                <Space size={6}>
                    <MailOutlined style={{ color: 'var(--ant-color-text-tertiary)' }} />
                    <span>{correo || '-'}</span>
                </Space>
            ),
        },
        {
            title: 'Documento',
            key: 'documento',
            render: (_, record) => (
                <Space size={6}>
                    <IdcardOutlined style={{ color: 'var(--ant-color-text-tertiary)' }} />
                    <span>{[record.tipoDoc, record.numeroDoc].filter(Boolean).join(' ') || '-'}</span>
                </Space>
            ),
        },
        {
            title: 'Estado',
            dataIndex: 'activo',
            key: 'activo',
            render: (activo) => (
                activo ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>
            ),
        },
        {
            title: 'Creado',
            dataIndex: 'creadoEn',
            key: 'creadoEn',
            render: (creadoEn) => {
                if (!creadoEn) {
                    return '-';
                }
                const parsedDate = new Date(creadoEn);
                if (Number.isNaN(parsedDate.getTime())) {
                    return '-';
                }
                return dateFormatter.format(parsedDate);
            },
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Editar usuario">
                        <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="¿Eliminar usuario?"
                        description="Esta acción revocará el acceso del usuario."
                        okText="Sí"
                        cancelText="No"
                        onConfirm={() => onDelete(record.id)}
                    >
                        <Tooltip title="Eliminar usuario">
                            <Button type="text" danger icon={<DeleteOutlined />} loading={isDeleting} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
                <Input
                    placeholder="Buscar por nombre, correo o documento"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    allowClear
                    style={{ maxWidth: 360 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                    Nuevo usuario
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={usuarios}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default UsuariosList;
