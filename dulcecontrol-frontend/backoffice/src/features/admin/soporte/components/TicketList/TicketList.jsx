import React, { useMemo } from 'react';
import { Button, Input, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { ESTADO_TICKET_META, PRIORIDAD_TICKET_META } from '../../../../superadmin/soporte/constants/index.js';
import { formatDateTime } from '../../../../superadmin/soporte/utils/formatters.js';

const { Title, Text } = Typography;

const TicketList = ({
  tickets,
  loading,
  onSelect,
  selectedTicketId,
  onCreate,
  onRefresh,
  searchTerm,
  onSearchTermChange,
}) => {
  const columns = useMemo(() => ([
    {
      key: 'asunto',
      dataIndex: 'asunto',
      title: 'Asunto',
      ellipsis: true,
      render: (value, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{value}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Ticket #{record.id}</Text>
        </Space>
      ),
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
      title: 'Actualizado',
      width: 180,
      render: (value) => formatDateTime(value),
    },
  ]), []);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Mis tickets</Title>
          <Text type="secondary">Consulta el estado de las solicitudes enviadas al equipo de DulceControl.</Text>
        </div>
        <Space>
          <Button icon={<RedoOutlined />} onClick={onRefresh} disabled={loading}>Actualizar</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Nuevo ticket</Button>
        </Space>
      </div>

      <Input
        placeholder="Buscar por asunto o ID"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(event) => onSearchTermChange?.(event.target.value)}
        allowClear
      />

      <Table
        rowKey="id"
        loading={loading}
        dataSource={tickets}
        columns={columns}
        pagination={false}
        scroll={{ y: 480 }}
        onRow={(record) => ({
          onClick: () => onSelect?.(record.id),
        })}
        rowClassName={(record) => (record.id === selectedTicketId ? 'ant-table-row-selected' : '')}
        locale={{ emptyText: 'Aún no registras tickets.' }}
      />
    </Space>
  );
};

export default TicketList;
