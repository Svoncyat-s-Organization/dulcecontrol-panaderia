import React from 'react';
import { Card, Row, Col, Typography, Button, Divider } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useFacturacionStore } from '../hooks/useFacturacionStore';

const { Title, Text } = Typography;

export const ResumenVenta = () => {
    const { totales, procesarVenta, loading } = useFacturacionStore();

    return (
        <Card title="Resumen de Venta" className="resumen-venta">
            <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Gravada:</Text>
                <Text>S/ {totales.gravada.toFixed(2)}</Text>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>IGV (18%):</Text>
                <Text>S/ {totales.igv.toFixed(2)}</Text>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Exonerada:</Text>
                <Text>S/ {totales.exonerada.toFixed(2)}</Text>
            </Row>

            <Divider style={{ margin: '12px 0' }} />

            <Row justify="space-between" align="middle">
                <Title level={4} style={{ margin: 0 }}>TOTAL:</Title>
                <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                    S/ {totales.total.toFixed(2)}
                </Title>
            </Row>

            <Button
                type="primary"
                size="large"
                block
                icon={<ShoppingCartOutlined />}
                style={{ marginTop: 24, height: 50, fontSize: 18 }}
                onClick={procesarVenta}
                loading={loading}
            >
                COBRAR
            </Button>
        </Card>
    );
};
