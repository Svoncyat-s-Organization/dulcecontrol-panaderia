import { Row, Col } from 'antd';
import ProductGrid from './ProductGrid.jsx';
import Cart from './Cart.jsx';

const PosView = ({ onCheckout }) => {
    return (
        <div style={{ height: '100%', padding: '0 16px 16px 16px' }}>
            <Row gutter={16} style={{ height: '100%' }}>
                <Col span={16} style={{ height: '100%' }}>
                    <ProductGrid />
                </Col>
                <Col span={8} style={{ height: '100%' }}>
                    <Cart onCheckout={onCheckout} />
                </Col>
            </Row>
        </div>
    );
};

export default PosView;
