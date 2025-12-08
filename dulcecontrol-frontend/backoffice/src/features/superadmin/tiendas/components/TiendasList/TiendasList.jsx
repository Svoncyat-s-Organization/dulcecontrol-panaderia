import React from 'react';
import { Table, Button, Space, Input, Popconfirm, Tag, Tooltip } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
    ShopOutlined,
    GlobalOutlined,
    TeamOutlined,
} from '@ant-design/icons';

const TiendasList = ({
    tiendas,
    loading,
    onEdit,
    onCreate,
    onDelete,
    onViewSedes,
    onViewDominios,
    onViewUsuarios,
    searchText,
    setSearchText,
}) => {
    const columns = [
        {
            title: 'Nombre Comercial',
            dataIndex: 'nombreComercial',
            key: 'nombreComercial',
            sorter: (a, b) => (a.nombreComercial || '').localeCompare(b.nombreComercial || ''),
        },
        {
            title: 'RUC/DNI',
            dataIndex: 'numeroDoc',
            key: 'numeroDoc',
        },
        {
            title: 'Contacto',
            dataIndex: 'correoContacto',
            key: 'correoContacto',
        },
        {
            title: 'Dominios',
            key: 'dominios',
            render: (_, record) => {
                if (record.dominiosLoading) {
                    return <Tag color="processing">Cargando…</Tag>;
                }

                const dominios = record.dominios ?? [];
                if (!dominios.length) {
                    return <Tag>Sin dominios</Tag>;
                }

                return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {dominios.map((dominio) => {
                            const color = dominio.tipo === 'ADMINISTRATIVO' ? 'purple' : 'geekblue';
                            return (
                                <Tag key={dominio.id || dominio.urlDominio} color={color}>
                                    {dominio.urlDominio}
                                </Tag>
                            );
                        })}
                    </div>
                );
            },
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (estado) => {
                let color = 'default';
                if (estado === 'ACTIVA') color = 'green';
                if (estado === 'SUSPENDIDA') color = 'orange';
                if (estado === 'CANCELADA') color = 'red';
                return <Tag color={color}>{estado}</Tag>;
            },
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Ver sedes">
                        <Button icon={<ShopOutlined />} onClick={() => onViewSedes(record.id)} />
                    </Tooltip>
                    <Tooltip title="Ver dominios">
                        <Button icon={<GlobalOutlined />} onClick={() => onViewDominios(record.id)} />
                    </Tooltip>
                    <Tooltip title="Gestionar usuarios">
                        <Button icon={<TeamOutlined />} onClick={() => onViewUsuarios(record.id)} />
                    </Tooltip>
                    <Tooltip title="Editar tienda">
                        <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="¿Estás seguro de eliminar esta tienda?"
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
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Input
                    placeholder="Buscar por nombre o documento"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                    Nueva Tienda
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={tiendas}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default TiendasList;
