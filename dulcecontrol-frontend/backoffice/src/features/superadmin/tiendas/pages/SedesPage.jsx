import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin, Space, Select, Empty } from 'antd';
import { ArrowLeftOutlined, ShopOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getTiendaById, getTiendas } from '../../../../api/superadmin/tiendas';
import SedesListContainer from '../components/SedesList';
import SedeFormContainer from '../components/SedeForm';
import useEntityModal from '../hooks/useEntityModal';

const { Title, Paragraph, Text } = Typography;

const SedesPage = () => {
    const { tiendaId } = useParams();
    const navigate = useNavigate();
    const { isOpen, entity, openForCreate, openForEdit, close } = useEntityModal();
    const isDetailView = Boolean(tiendaId);

    const { data: tienda, isLoading: loadingTienda } = useQuery({
        queryKey: ['tienda', tiendaId],
        queryFn: () => getTiendaById(tiendaId),
        enabled: !!tiendaId,
    });

    const { data: tiendas, isLoading: loadingTiendas } = useQuery({
        queryKey: ['tiendas'],
        queryFn: getTiendas,
        enabled: !tiendaId,
    });

    const tiendaOptions = useMemo(() => (
        (tiendas ?? []).map((item) => ({
            value: item.id,
            label: item.nombreComercial || item.nombreDoc,
        }))
    ), [tiendas]);

    const handleSelectTienda = (value) => {
        navigate(`/superadmin/tiendas/${value}/sedes`);
    };

    if (!isDetailView) {
        return (
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                    <div>
                        <Title level={2} style={{ marginBottom: 4 }}>Sedes</Title>
                        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                            Elige una tienda para revisar y administrar sus sedes activas.
                        </Paragraph>
                    </div>
                    <Button type="link" onClick={() => navigate('/superadmin/tiendas/directorio')} style={{ padding: 0 }}>
                        Ir al directorio de tiendas
                    </Button>
                </div>

                <Card>
                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Space size={12} align="center">
                                <ShopOutlined style={{ fontSize: 24, color: 'var(--ant-primary-color)' }} />
                                <div>
                                    <Text strong>Selecciona una tienda</Text>
                                    <Paragraph style={{ margin: 0 }} type="secondary">
                                        Para crear o editar sedes primero elige un cliente corporativo.
                                    </Paragraph>
                                </div>
                            </Space>
                            <Select
                                placeholder="Busca una tienda"
                                showSearch
                                optionFilterProp="label"
                                options={tiendaOptions}
                                loading={loadingTiendas}
                                onChange={handleSelectTienda}
                                style={{ minWidth: 240 }}
                            />
                        </div>

                        {(!tiendaOptions || tiendaOptions.length === 0) && !loadingTiendas && (
                            <Empty description="Aún no hay tiendas registradas" />
                        )}
                    </Space>
                </Card>
            </Space>
        );
    }

    if (loadingTienda) {
        return <Spin size="large" style={{ display: 'block', margin: '64px auto' }} />;
    }

    return (
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/superadmin/tiendas/directorio')}
                type="link"
                style={{ padding: 0, width: 'fit-content' }}
            >
                Volver a tiendas
            </Button>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                <div>
                    <Title level={2} style={{ marginBottom: 4 }}>Sedes</Title>
                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                        Administra las ubicaciones físicas de la tienda y define cuál es la sede principal.
                    </Paragraph>
                </div>
                <Space align="center">
                    <ShopOutlined style={{ fontSize: 24, color: 'var(--ant-primary-color)' }} />
                    <div>
                        <Text strong>{tienda?.nombreComercial}</Text>
                        <Paragraph style={{ margin: 0 }} type="secondary">
                            ID tienda #{tiendaId}
                        </Paragraph>
                    </div>
                </Space>
            </div>

            <Card>
                <SedesListContainer tiendaId={tiendaId} onCreate={openForCreate} onEdit={openForEdit} />
            </Card>

            <SedeFormContainer visible={isOpen} onCancel={close} initialValues={entity} tiendaId={tiendaId} />
        </Space>
    );
};

export default SedesPage;
