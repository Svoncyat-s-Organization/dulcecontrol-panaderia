import React, { useState } from 'react';
import { Card, Col, Row, Space, Typography } from 'antd';
import TicketFiltersContainer from '../components/TicketFilters/index.jsx';
import TicketListContainer from '../components/TicketList/index.jsx';
import TicketDetailContainer from '../components/TicketDetail/index.jsx';
import TicketFormContainer from '../components/TicketForm/index.jsx';
import useTicketFilters from '../hooks/useTicketFilters.js';

const { Title, Paragraph } = Typography;

const SoporteTicketsPage = () => {
    const { filters, searchTerm, setSearchTerm, updateFilter, resetFilters } = useTicketFilters();
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleOpenCreate = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreate = () => {
        setIsCreateModalOpen(false);
    };

    return (
        <Space orientation="vertical" size={24} style={{ width: '100%' }}>
            <div>
                <Title level={2} style={{ marginBottom: 8 }}>Centro de soporte</Title>
                <Paragraph type="secondary" style={{ margin: 0 }}>
                    Supervisa los tickets creados por las tiendas y coordina con el equipo de soporte técnico.
                </Paragraph>
            </div>

            <Card>
                <TicketFiltersContainer
                    filters={filters}
                    searchTerm={searchTerm}
                    onFilterChange={updateFilter}
                    onSearchTermChange={setSearchTerm}
                    onReset={resetFilters}
                />
            </Card>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={10} xl={9}>
                    <Card style={{ height: '100%' }}>
                        <TicketListContainer
                            filters={filters}
                            searchTerm={searchTerm}
                            selectedTicketId={selectedTicketId}
                            onSelect={setSelectedTicketId}
                            onCreate={handleOpenCreate}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={14} xl={15}>
                    <TicketDetailContainer ticketId={selectedTicketId} />
                </Col>
            </Row>

            <TicketFormContainer
                open={isCreateModalOpen}
                onCancel={handleCloseCreate}
                onCreated={(ticket) => {
                    setSelectedTicketId(ticket?.id ?? null);
                    setIsCreateModalOpen(false);
                }}
            />
        </Space>
    );
};

export default SoporteTicketsPage;
