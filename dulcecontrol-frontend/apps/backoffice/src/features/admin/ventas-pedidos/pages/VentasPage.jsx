import { useLocation } from 'react-router-dom';
import CajaControl from '../components/CajaControl/index.jsx';
import PuntoDeVenta from '../components/PuntoDeVenta/index.jsx';
import PedidosTable from '../components/PedidosTable/index.jsx';
import HistorialVentas from '../components/HistorialVentas/index.jsx';

const VentasPage = () => {
    const location = useLocation();

    const getActiveKey = () => {
        const path = location.pathname;
        if (path.includes('pedidos')) return 'pedidos';
        if (path.includes('historial')) return 'historial';
        return 'pos';
    };

    const activeKey = getActiveKey();

    const renderContent = () => {
        switch (activeKey) {
            case 'pos':
                return (
                    <CajaControl>
                        <PuntoDeVenta />
                    </CajaControl>
                );
            case 'pedidos':
                return <PedidosTable />;
            case 'historial':
                return <HistorialVentas />;
            default:
                return null;
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {renderContent()}
        </div>
    );
};

export default VentasPage;
