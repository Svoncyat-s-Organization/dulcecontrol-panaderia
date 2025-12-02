import { Tabs } from 'antd';
import CajasCatalog from '../components/Cajas/CajasCatalog.jsx';
import GestionCajasTable from '../components/Cajas/GestionCajasTable.jsx';

const CajasPage = () => {
    const tabItems = [
        {
            key: 'catalogo',
            label: 'Cajas',
            children: <CajasCatalog />,
        },
        {
            key: 'gestion',
            label: 'Gestión de cajas',
            children: <GestionCajasTable />,
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Tabs
                defaultActiveKey="catalogo"
                items={tabItems}
                type="card"
                tabBarStyle={{ marginBottom: 16 }}
            />
        </div>
    );
};

export default CajasPage;
