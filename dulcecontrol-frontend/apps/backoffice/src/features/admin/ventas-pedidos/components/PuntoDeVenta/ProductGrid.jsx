import { useState } from 'react';
import { Card, Input, Button, Typography, Spin, Empty } from 'antd';
import { SearchOutlined, PlusOutlined, ShopOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { getCategorias } from '../../../catalogo/api/categorias.api.js';
import { getProductos } from '../../../catalogo/api/productos.api.js';
import { useCartStore } from '../../hooks/useCartStore.js';
import { Tabs } from 'antd';

const { Text } = Typography;

const ProductGrid = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const tiendaId = useTokenStore((state) => state.tiendaId);
    const addItem = useCartStore((state) => state.addItem);

    // Fetch Categorias
    // Fetch Categorias
    const { data: categorias = [] } = useQuery({
        queryKey: ['categorias', 'pos', tiendaId],
        queryFn: () => getCategorias(tiendaId),
        enabled: !!tiendaId,
        select: (response) => {
            // Handle potential response wrapping
            const data = Array.isArray(response) ? response : (response?.data || response?.content || []);
            // Filter active categories
            return Array.isArray(data) ? data.filter(c => c.activa) : [];
        }
    });

    // Fetch Productos
    const { data: productos = [], isLoading } = useQuery({
        queryKey: ['productos', 'pos', tiendaId],
        queryFn: () => getProductos(tiendaId, { visibleEnPos: true }),
        enabled: !!tiendaId,
        select: (data) => data.filter(p => p.visibleEnPos && p.activo)
    });

    const filteredProducts = productos.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || p.categoriaId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categoryItems = [
        { key: 'ALL', label: 'Todos' },
        ...categorias.map(c => ({ key: c.id, label: c.nombre }))
    ];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
                placeholder="Buscar producto por nombre o SKU..."
                prefix={<SearchOutlined />}
                size="large"
                onChange={e => setSearchText(e.target.value)}
            />

            <Tabs
                activeKey={selectedCategory}
                onChange={setSelectedCategory}
                items={categoryItems}
                type="card"
                tabBarStyle={{ marginBottom: 16 }}
            />

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
                ) : filteredProducts.length === 0 ? (
                    <Empty description="No se encontraron productos" />
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: 16,
                        }}
                    >
                        {filteredProducts.map((item) => (
                            <Card
                                key={item.id}
                                hoverable
                                cover={
                                    <div style={{ height: 140, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
                                        {item.urlImagenPrincipal ? (
                                            <img alt={item.nombre} src={item.urlImagenPrincipal} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <ShopOutlined style={{ fontSize: 40, color: '#ccc' }} />
                                        )}
                                    </div>
                                }
                                actions={[
                                    <Button key="add" type="primary" block icon={<PlusOutlined />} onClick={() => addItem(item)}>
                                        Agregar
                                    </Button>
                                ]}
                                styles={{ body: { padding: 12 } }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <div style={{ whiteSpace: 'normal', lineHeight: '1.2em', height: '2.4em', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.nombre}>
                                        {item.nombre}
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 12, fontWeight: 'normal' }}>
                                        Cód: {item.sku}
                                    </Text>
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <Text strong style={{ color: '#1890ff', fontSize: 18 }}>
                                        S/ {(item.precioBaseCentimos / 100).toFixed(2)}
                                    </Text>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



export default ProductGrid;
