import React from 'react';
import { Card, Typography, Space } from 'antd';
import TiendasListContainer from '../components/TiendasList';
import TiendaFormContainer from '../components/TiendaForm';
import useEntityModal from '../hooks/useEntityModal';

const { Title, Paragraph } = Typography;

const TiendasPage = () => {
    const { isOpen, entity, openForCreate, openForEdit, close } = useEntityModal();

    return (
        <Space orientation="vertical" size={24} style={{ width: '100%' }}>
            <div>
                <Title level={2} style={{ marginBottom: 8 }}>Gestión de tiendas</Title>
                <Paragraph type="secondary" style={{ margin: 0 }}>
                    Administra la información corporativa, credenciales y dominios de cada negocio registrado en la plataforma.
                </Paragraph>
            </div>

            <Card>
                <TiendasListContainer onCreate={openForCreate} onEdit={openForEdit} />
            </Card>

            <TiendaFormContainer visible={isOpen} onCancel={close} initialValues={entity} />
        </Space>
    );
};

export default TiendasPage;
