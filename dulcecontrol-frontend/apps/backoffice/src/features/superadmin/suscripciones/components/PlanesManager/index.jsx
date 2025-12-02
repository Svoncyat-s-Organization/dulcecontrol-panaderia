import { useState } from 'react';
import { message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PlanesManagerView from './PlanesManagerView.jsx';
import { getPlanes, createPlan, updatePlan } from '../../api/suscripciones.api.js';
import { PENToCentimos } from '../../utils/currencyFormatter.js';

const PLANES_QUERY_KEY = ['superadmin', 'planes'];

const PlanesManager = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [form, setForm] = useState(null);

    // Fetch planes
    const { data: planes = [], isLoading, isError, refetch } = useQuery({
        queryKey: PLANES_QUERY_KEY,
        queryFn: getPlanes,
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: createPlan,
        onSuccess: () => {
            message.success('Plan creado exitosamente');
            queryClient.invalidateQueries({ queryKey: PLANES_QUERY_KEY });
            handleCloseModal();
        },
        onError: (error) => {
            const detail = error?.response?.data?.message ?? 'Error al crear plan';
            message.error(detail);
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updatePlan(id, payload),
        onSuccess: () => {
            message.success('Plan actualizado exitosamente');
            queryClient.invalidateQueries({ queryKey: PLANES_QUERY_KEY });
            handleCloseModal();
        },
        onError: (error) => {
            const detail = error?.response?.data?.message ?? 'Error al actualizar plan';
            message.error(detail);
        },
    });

    const handleCreate = () => {
        setSelectedPlan(null);
        setIsModalOpen(true);
    };

    const handleEdit = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
        form?.resetFields();
    };

    const handleSave = async (values) => {
        try {
            const limitesEntries = Array.isArray(values.limitesEntries) ? values.limitesEntries : [];
            const limitesPayload = limitesEntries.reduce((acc, entry) => {
                const clave = entry?.clave?.trim();
                const hasValue = entry?.valor !== undefined && entry?.valor !== null && `${entry?.valor}`.trim() !== '';
                if (!clave || !hasValue) {
                    return acc;
                }

                const numericValue = Number(entry.valor);
                acc[clave] = Number.isFinite(numericValue) && `${entry.valor}`.trim() !== '' ? numericValue : entry.valor;
                return acc;
            }, {});

            if (Object.keys(limitesPayload).length === 0) {
                message.error('Agrega al menos un límite válido');
                return;
            }

            const payload = {
                codigo: values.codigo,
                nombre: values.nombre,
                descripcion: values.descripcion || '',
                precioMensualCentimos: PENToCentimos(values.precioMensualSoles),
                precioAnualCentimos: PENToCentimos(values.precioAnualSoles),
                moneda: 'PEN',
                limites: limitesPayload,
                activo: values.activo ?? true,
            };

            if (selectedPlan) {
                updateMutation.mutate({ id: selectedPlan.id, payload });
            } else {
                createMutation.mutate(payload);
            }
        } catch (error) {
            message.error('Error al procesar el formulario');
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <PlanesManagerView
            planes={planes}
            loading={isLoading}
            isError={isError}
            onRetry={refetch}
            onCreate={handleCreate}
            onEdit={handleEdit}
            isModalOpen={isModalOpen}
            onCloseModal={handleCloseModal}
            onSave={handleSave}
            selectedPlan={selectedPlan}
            isSaving={isSaving}
            setForm={setForm}
        />
    );
};

export default PlanesManager;
