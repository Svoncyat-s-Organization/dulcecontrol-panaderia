import { Card, Button, Typography, InputNumber, Empty, Input, Radio } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import { POS_MODES, useCartStore } from '../../hooks/useCartStore.js';

const { Title, Text } = Typography;

const Cart = ({ onCheckout }) => {
    const {
        items,
        removeItem,
        updateQuantity,
        updateItemNotes,
        getTotal,
        clearCart,
        posMode,
        setPosMode,
    } = useCartStore();
    const total = getTotal();
    const isPedido = posMode === POS_MODES.PEDIDO;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
            <div style={{ background: '#e6f4ff', borderRadius: 12, padding: 12 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Tipo de operación</Text>
                <Radio.Group
                    buttonStyle="solid"
                    value={posMode}
                    onChange={(e) => setPosMode(e.target.value)}
                    style={{ display: 'flex' }}
                >
                    <Radio.Button value={POS_MODES.VENTA} style={{ flex: 1, textAlign: 'center' }}>
                        Venta inmediata
                    </Radio.Button>
                    <Radio.Button value={POS_MODES.PEDIDO} style={{ flex: 1, textAlign: 'center' }}>
                        Pedido personalizado
                    </Radio.Button>
                </Radio.Group>
            </div>
            <Card
                title={<><ShoppingCartOutlined /> Carrito de Compras</>}
                extra={items.length > 0 && <Button type="link" danger onClick={clearCart}>Vaciar</Button>}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 } }}
            >
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                {items.length === 0 ? (
                    <Empty description="Carrito vacío" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {items.map((item) => (
                            <div
                                key={item.cartItemId}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: 12,
                                    border: '1px solid #f0f0f0',
                                    borderRadius: 8,
                                    background: '#fff',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Text strong style={{ flex: 1 }}>{item.nombre}</Text>
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeItem(item.cartItemId)}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                    <InputNumber
                                        min={1}
                                        value={item.quantity}
                                        onChange={(val) => updateQuantity(item.cartItemId, val)}
                                        size="small"
                                        style={{ width: 60 }}
                                    />
                                    <Text type="secondary">x S/ {(item.precioBaseCentimos / 100).toFixed(2)}</Text>
                                    <Text strong style={{ marginLeft: 'auto' }}>
                                        S/ {((item.precioBaseCentimos * item.quantity) / 100).toFixed(2)}
                                    </Text>
                                </div>
                                {isPedido && (
                                    <div style={{ marginTop: 12 }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>Notas para este producto</Text>
                                        <Input.TextArea
                                            value={item.customNotes || ''}
                                            onChange={(e) => updateItemNotes(item.cartItemId, e.target.value)}
                                            autoSize={{ minRows: 2, maxRows: 4 }}
                                            placeholder="Ej: sin azúcar, agregar dedicatoria..."
                                            maxLength={200}
                                            showCount
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ padding: 16, background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Title level={4} style={{ margin: 0 }}>Total</Title>
                    <Title level={3} style={{ margin: 0, color: '#52c41a' }}>S/ {total.toFixed(2)}</Title>
                </div>
                <Button
                    type="primary"
                    block
                    size="large"
                    icon={<DollarOutlined />}
                    onClick={onCheckout}
                    disabled={items.length === 0}
                >
                    Cobrar
                </Button>
            </div>
            </Card>
        </div>
    );
};

export default Cart;
