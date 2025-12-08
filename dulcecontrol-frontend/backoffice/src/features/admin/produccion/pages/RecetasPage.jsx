import { useState } from 'react';
import { Typography, Button, Space } from 'antd';
import { IconPlus } from '@tabler/icons-react';
import RecetasTable from '../components/RecetasTable/index.jsx';
import RecetaForm from '../components/RecetaForm/index.jsx';

const { Title, Paragraph } = Typography;

const RecetasPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceta, setSelectedReceta] = useState(null);

  const handleOpenCreate = () => {
    setSelectedReceta(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (receta) => {
    setSelectedReceta(receta);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReceta(null);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Recetas</Title>
            <Paragraph type="secondary" style={{ margin: '8px 0 0 0' }}>
              Define los insumos y cantidades requeridas para elaborar cada producto
            </Paragraph>
          </div>
          <Button
            type="primary"
            icon={<IconPlus size={18} />}
            onClick={handleOpenCreate}
            size="large"
          >
            Nueva Receta
          </Button>
        </div>

        <RecetasTable onEdit={handleOpenEdit} />

        <RecetaForm
          open={modalOpen}
          onClose={handleCloseModal}
          receta={selectedReceta}
        />
      </Space>
    </div>
  );
};

export default RecetasPage;
