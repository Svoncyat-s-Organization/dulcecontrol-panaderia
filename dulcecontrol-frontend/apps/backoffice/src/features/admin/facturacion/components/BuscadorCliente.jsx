import React, { useState } from 'react';
import { Select, Spin } from 'antd';
import { facturacionApi } from '../api/facturacion.api';

const { Option } = Select;

export const BuscadorCliente = ({ tiendaId, onSelect, value }) => {
    const [data, setData] = useState([]);
    const [fetching, setFetching] = useState(false);

    const fetchClientes = async (search) => {
        if (!search) return;
        setFetching(true);
        try {
            const clientes = await facturacionApi.buscarClientes(tiendaId, search);
            setData(clientes);
        } catch (error) {
            console.error('Error buscando clientes:', error);
        } finally {
            setFetching(false);
        }
    };

    let timeout;
    const handleSearch = (val) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            fetchClientes(val);
        }, 500);
    };

    const handleChange = (val, option) => {
        onSelect(option.item);
    };

    return (
        <Select
            showSearch
            value={value ? value.id : undefined}
            placeholder="Buscar cliente (RUC/DNI/Nombre)..."
            style={{ width: '100%' }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            allowClear
        >
            {data.map((d) => (
                <Option key={d.id} value={d.id} item={d}>
                    {d.nombre || d.razonSocial} ({d.numeroDocumento})
                </Option>
            ))}
        </Select>
    );
};
