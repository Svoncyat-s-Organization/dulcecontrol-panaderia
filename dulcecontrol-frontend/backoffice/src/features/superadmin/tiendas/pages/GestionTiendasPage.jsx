import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Space, Tabs, Select, Empty, Spin } from 'antd';
import { ShopOutlined, GlobalOutlined, TeamOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getTiendas, getTiendaById } from '../../../../api/superadmin/tiendas';
import TiendasListContainer from '../components/TiendasList';
import TiendaFormContainer from '../components/TiendaForm';
import SedesListContainer from '../components/SedesList';
import SedeFormContainer from '../components/SedeForm';
import DominiosListContainer from '../components/DominiosList';
import DominioFormContainer from '../components/DominioForm';
import UsuariosListContainer from '../components/UsuariosList';
import UsuarioFormContainer from '../components/UsuarioForm';
import useEntityModal from '../hooks/useEntityModal';

const { Title, Paragraph, Text } = Typography;

const GestionTiendasPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'tiendas';
    const tiendaIdParam = searchParams.get('tiendaId');
    
    const [selectedTiendaId, setSelectedTiendaId] = useState(tiendaIdParam || null);
    
    const tiendaModal = useEntityModal();
    const sedeModal = useEntityModal();
    const dominioModal = useEntityModal();
    const usuarioModal = useEntityModal();

    const { data: tiendas, isLoading: loadingTiendas } = useQuery({
        queryKey: ['tiendas'],
        queryFn: getTiendas,
    });

    const { data: tiendaSeleccionada, isLoading: loadingTienda } = useQuery({
        queryKey: ['tienda', selectedTiendaId],
        queryFn: () => getTiendaById(selectedTiendaId),
        enabled: !!selectedTiendaId && activeTab !== 'tiendas',
    });

    const tiendaOptions = useMemo(() => (
        (tiendas ?? []).map((item) => ({
            value: item.id,
            label: item.nombreComercial || item.nombreDoc,
        }))
    ), [tiendas]);

    const handleTabChange = (key) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', key);
        if (key === 'tiendas') {
            params.delete('tiendaId');
            setSelectedTiendaId(null);
        }
        setSearchParams(params);
    };

    const handleTiendaSelect = (tiendaId) => {
        setSelectedTiendaId(tiendaId);
        const params = new URLSearchParams(searchParams);
        if (tiendaId) {
            params.set('tiendaId', tiendaId);
        } else {
            params.delete('tiendaId');
        }
        setSearchParams(params);
    };

    const handleViewSedes = (tiendaId) => {
        setSelectedTiendaId(tiendaId);
        const params = new URLSearchParams();
        params.set('tab', 'sedes');
        params.set('tiendaId', tiendaId);
        setSearchParams(params);
    };

    const handleViewDominios = (tiendaId) => {
        setSelectedTiendaId(tiendaId);
        const params = new URLSearchParams();
        params.set('tab', 'dominios');
        params.set('tiendaId', tiendaId);
        setSearchParams(params);
    };

    const handleViewUsuarios = (tiendaId) => {
        setSelectedTiendaId(tiendaId);
        const params = new URLSearchParams();
        params.set('tab', 'usuarios');
        params.set('tiendaId', tiendaId);
        setSearchParams(params);
    };

    const renderTiendaSelector = () => (
        <Card size="small" style={{ marginBottom: 16 }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text strong>Tienda seleccionada:</Text>
                <Select
                    placeholder="Selecciona una tienda"
                    showSearch
                    optionFilterProp="label"
                    options={tiendaOptions}
                    loading={loadingTiendas}
                    onChange={handleTiendaSelect}
                    value={selectedTiendaId}
                    style={{ minWidth: 300 }}
                    allowClear
                />
            </Space>
        </Card>
    );

    const renderContent = () => {
        if (activeTab === 'tiendas') {
            return (
                <Card>
                    <TiendasListContainer
                        onCreate={tiendaModal.openForCreate}
                        onEdit={tiendaModal.openForEdit}
                        onViewSedes={handleViewSedes}
                        onViewDominios={handleViewDominios}
                        onViewUsuarios={handleViewUsuarios}
                    />
                </Card>
            );
        }

        if (!selectedTiendaId) {
            return (
                <>
                    {renderTiendaSelector()}
                    <Card>
                        <Empty description="Selecciona una tienda para continuar" />
                    </Card>
                </>
            );
        }

        if (loadingTienda) {
            return (
                <>
                    {renderTiendaSelector()}
                    <Card>
                        <Spin size="large" style={{ display: 'block', margin: '64px auto' }} />
                    </Card>
                </>
            );
        }

        return (
            <>
                {renderTiendaSelector()}
                <Card
                    title={
                        <Space>
                            <Text strong>{tiendaSeleccionada?.nombreComercial || 'Tienda'}</Text>
                            <Text type="secondary">#{selectedTiendaId}</Text>
                        </Space>
                    }
                >
                    {activeTab === 'sedes' && (
                        <SedesListContainer
                            tiendaId={selectedTiendaId}
                            onCreate={sedeModal.openForCreate}
                            onEdit={sedeModal.openForEdit}
                        />
                    )}
                    {activeTab === 'dominios' && (
                        <DominiosListContainer
                            tiendaId={selectedTiendaId}
                            onCreate={dominioModal.openForCreate}
                            onEdit={dominioModal.openForEdit}
                        />
                    )}
                    {activeTab === 'usuarios' && (
                        <UsuariosListContainer
                            tiendaId={selectedTiendaId}
                            onCreate={usuarioModal.openForCreate}
                            onEdit={usuarioModal.openForEdit}
                        />
                    )}
                </Card>
            </>
        );
    };

    const tabs = [
        {
            key: 'tiendas',
            label: (
                <Space>
                    <AppstoreOutlined />
                    Directorio
                </Space>
            ),
        },
        {
            key: 'sedes',
            label: (
                <Space>
                    <ShopOutlined />
                    Sedes
                </Space>
            ),
        },
        {
            key: 'dominios',
            label: (
                <Space>
                    <GlobalOutlined />
                    Dominios
                </Space>
            ),
        },
        {
            key: 'usuarios',
            label: (
                <Space>
                    <TeamOutlined />
                    Usuarios
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <div>
                <Title level={2} style={{ marginBottom: 8 }}>Gestión de Tiendas</Title>
                <Paragraph type="secondary" style={{ margin: 0 }}>
                    Administra tiendas, sedes, dominios y usuarios desde un solo lugar.
                </Paragraph>
            </div>

            <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabs} />

            {renderContent()}

            <TiendaFormContainer visible={tiendaModal.isOpen} onCancel={tiendaModal.close} initialValues={tiendaModal.entity} />
            <SedeFormContainer visible={sedeModal.isOpen} onCancel={sedeModal.close} initialValues={sedeModal.entity} tiendaId={selectedTiendaId} />
            <DominioFormContainer visible={dominioModal.isOpen} onCancel={dominioModal.close} initialValues={dominioModal.entity} tiendaId={selectedTiendaId} />
            <UsuarioFormContainer visible={usuarioModal.isOpen} onCancel={usuarioModal.close} initialValues={usuarioModal.entity} tiendaId={selectedTiendaId} />
        </Space>
    );
};

export default GestionTiendasPage;
