import React from 'react';
import { Button, Input, Select, Space } from 'antd';
import { ESTADO_TICKET_OPTIONS, PRIORIDAD_TICKET_OPTIONS } from '../../constants/index.js';

const TicketFilters = ({
    filters,
    searchTerm,
    onFilterChange,
    onSearchTermChange,
    onReset,
    tiendaOptions,
    tiendasLoading,
}) => {
    return (
        <Space wrap size={[16, 12]} align="end">
            <div>
                <span style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--ant-color-text-tertiary)' }}>
                    Tienda
                </span>
                <Select
                    style={{ minWidth: 200 }}
                    placeholder="Todas las tiendas"
                    value={filters.tiendaId}
                    options={tiendaOptions}
                    onChange={(value) => onFilterChange('tiendaId', value)}
                    allowClear
                    loading={tiendasLoading}
                />
            </div>

            <div>
                <span style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--ant-color-text-tertiary)' }}>
                    Estado
                </span>
                <Select
                    style={{ minWidth: 180 }}
                    placeholder="Todos los estados"
                    value={filters.estado}
                    options={ESTADO_TICKET_OPTIONS}
                    onChange={(value) => onFilterChange('estado', value)}
                    allowClear
                />
            </div>

            <div>
                <span style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--ant-color-text-tertiary)' }}>
                    Prioridad
                </span>
                <Select
                    style={{ minWidth: 180 }}
                    placeholder="Todas las prioridades"
                    value={filters.prioridad}
                    options={PRIORIDAD_TICKET_OPTIONS}
                    onChange={(value) => onFilterChange('prioridad', value)}
                    allowClear
                />
            </div>

            <div>
                <span style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--ant-color-text-tertiary)' }}>
                    Buscar por asunto
                </span>
                <Input.Search
                    placeholder="Ej. migración de datos"
                    allowClear
                    value={searchTerm}
                    onChange={(event) => onSearchTermChange(event.target.value)}
                    style={{ minWidth: 240 }}
                />
            </div>

            <Button onClick={onReset}>Limpiar filtros</Button>
        </Space>
    );
};

export default TicketFilters;
