import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin, Space, Select, Empty } from 'antd';
import { ArrowLeftOutlined, TeamOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getTiendaById, getTiendas } from '../../../../api/superadmin/tiendas';
import UsuariosListContainer from '../components/UsuariosList';
import UsuarioFormContainer from '../components/UsuarioForm';
import useEntityModal from '../hooks/useEntityModal';

const { Title, Paragraph, Text } = Typography;

const UsuariosPage = () => {
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
        if (!value) {
            return;
        }
        navigate(`/superadmin/tiendas/${value}/usuarios`);
    };

    if (!isDetailView) {
        return (
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                    <div>
                        <Title level={2} style={{ marginBottom: 4 }}>Usuarios de tiendas</Title>
                        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                            Selecciona una tienda para administrar sus titulares y personal con acceso al backoffice.
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
                                <TeamOutlined style={{ fontSize: 24, color: 'var(--ant-primary-color)' }} />
                                <div>
                                    <Text strong>Selecciona una tienda</Text>
                                    <Paragraph style={{ margin: 0 }} type="secondary">
                                        Gestiona los usuarios autorizados para ingresar al panel de administración.
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
                                allowClear
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
                    <Title level={2} style={{ marginBottom: 4 }}>Usuarios</Title>
                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                        Define roles, credenciales y estado de acceso de las personas vinculadas a la tienda.
                    </Paragraph>
                </div>
                <Space align="center">
                    <TeamOutlined style={{ fontSize: 24, color: 'var(--ant-primary-color)' }} />
                    <div>
                        <Text strong>{tienda?.nombreComercial || tienda?.nombreDoc || 'Tienda'}</Text>
                        <Paragraph style={{ margin: 0 }} type="secondary">
                            ID tienda #{tiendaId}
                        </Paragraph>
                    </div>
                </Space>
            </div>

            <Card>
                <UsuariosListContainer tiendaId={tiendaId} onCreate={openForCreate} onEdit={openForEdit} />
            </Card>

            <UsuarioFormContainer
                visible={isOpen}
                onCancel={close}
                initialValues={entity}
                tiendaId={tiendaId}
            />
        </Space>
    );
};

export default UsuariosPage;
