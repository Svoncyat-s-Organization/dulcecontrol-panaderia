import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { getProductos } from '../../catalogo/api/productos.api';

const { Option } = Select;

export const BuscadorProducto = ({ tiendaId, onSelect }) => {
    const [data, setData] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [value, setValue] = useState(null);

    const fetchProductos = async (search) => {
        if (!search) return;
        setFetching(true);
        try {
            // Asumiendo que el API de productos soporta ?nombre=...
            const productos = await getProductos(tiendaId, { nombre: search });
            setData(productos);
        } catch (error) {
            console.error('Error buscando productos:', error);
        } finally {
            setFetching(false);
        }
    };

    // Debounce simple
    let timeout;
    const handleSearch = (val) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            fetchProductos(val);
        }, 500);
    };

    const handleChange = (val, option) => {
        setValue(null); // Limpiar input después de seleccionar
        onSelect(option.item); // Pasar el objeto producto completo
    };

    return (
        <Select
            showSearch
            value={value}
            placeholder="Buscar producto por nombre o código..."
            style={{ width: '100%' }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            size="large"
        >
            {data.map((d) => (
                <Option key={d.id} value={d.id} item={d}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{d.nombre}</span>
                        <span style={{ fontWeight: 'bold' }}>S/ {d.precio?.toFixed(2)}</span>
                    </div>
                </Option>
            ))}
        </Select>
    );
};
