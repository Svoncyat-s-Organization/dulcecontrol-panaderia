import React, { useMemo } from 'react';
import { Button, Space, Table, Tag, Typography } from 'antd';
import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
import { ESTADO_TICKET_META, PRIORIDAD_TICKET_META } from '../../constants/index.js';
import { formatDateTime } from '../../utils/formatters.js';

const { Title, Text } = Typography;

const TicketList = ({
    tickets,
    loading,
    onSelect,
    selectedTicketId,
    onCreate,
    onRefresh,
}) => {
    const columns = useMemo(() => ([
        {
            key: 'asunto',
            dataIndex: 'asunto',
            title: 'Asunto',
            width: 260,
            ellipsis: true,
            render: (value, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{value}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Ticket #{record.id}
                    </Text>
                </Space>
            ),
        },
        {
            key: 'tiendaNombre',
            dataIndex: 'tiendaNombre',
            title: 'Tienda',
            width: 180,
            ellipsis: true,
            render: (value) => value || '—',
        },
        {
            key: 'estado',
            dataIndex: 'estado',
            title: 'Estado',
            width: 140,
            render: (value) => {
                const meta = ESTADO_TICKET_META[value];
                if (!meta) {
                    return value || '—';
                }
                return <Tag color={meta.color}>{meta.label}</Tag>;
            },
        },
        {
            key: 'prioridad',
            dataIndex: 'prioridad',
            title: 'Prioridad',
            width: 140,
            render: (value) => {
                const meta = PRIORIDAD_TICKET_META[value];
                if (!meta) {
                    return value || '—';
                }
                return <Tag color={meta.color}>{meta.label}</Tag>;
            },
        },
        {
            key: 'actualizadoEn',
            dataIndex: 'actualizadoEn',
            title: 'Última actualización',
            width: 180,
            render: (value) => formatDateTime(value),
        },
        {
            key: 'vencimientoSlaEn',
            dataIndex: 'vencimientoSlaEn',
            title: 'Vence SLA',
            width: 160,
            render: (value) => formatDateTime(value),
        },
        {
            key: 'actions-spacer',
            width: 1,
            render: () => null,
        },
    ]), []);

    return (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Tickets registrados</Title>
                    <Text type="secondary">Monitorea el estado y la prioridad de los tickets abiertos.</Text>
                </div>
                <Space>
                    <Button icon={<RedoOutlined />} onClick={onRefresh} disabled={loading}>Actualizar</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Nuevo ticket</Button>
                </Space>
            </div>

            <Table
                rowKey="id"
                loading={loading}
                dataSource={tickets}
                columns={columns}
                tableLayout="fixed"
                scroll={{ x: 960, y: 520 }}
                pagination={false}
                onRow={(record) => ({
                    onClick: () => onSelect?.(record.id),
                })}
                rowClassName={(record) => (record.id === selectedTicketId ? 'ant-table-row-selected' : '')}
                locale={{
                    emptyText: 'No se encontraron tickets con los filtros aplicados.',
                }}
            />
        </Space>
    );
};

export default TicketList;
