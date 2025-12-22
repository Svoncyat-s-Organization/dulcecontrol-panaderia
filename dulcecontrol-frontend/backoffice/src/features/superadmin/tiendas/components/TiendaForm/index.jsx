import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message, Form } from 'antd';
import { createTienda, updateTienda } from '../../../../../api/superadmin/tiendas';
import { buildTiendaCreatePayload, buildTiendaUpdatePayload } from '../../utils/payloadBuilders';
import TiendaForm from './TiendaForm';

const TiendaFormContainer = ({ visible, onCancel, initialValues }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!visible) {
            return;
        }

        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                estado: initialValues.estado ?? 'EN_PRUEBA',
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                estado: 'EN_PRUEBA',
            });
        }
    }, [visible, initialValues, form]);

    const mutation = useMutation({
        mutationFn: (payload) =>
            initialValues ? updateTienda(initialValues.id, payload) : createTienda(payload),
        onSuccess: () => {
            message.success(`Tienda ${initialValues ? 'actualizada' : 'creada'} correctamente`);
            queryClient.invalidateQueries({ queryKey: ['tiendas'] });
            onCancel();
            form.resetFields();
        },
        onError: (error) => {
            console.error(error);
            const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
            message.error(backendMessage || 'No se pudo guardar la tienda. Revisa la información e inténtalo nuevamente.');
        },
    });

    const handleSubmit = (values) => {
        const payload = initialValues
            ? buildTiendaUpdatePayload(values, initialValues)
            : buildTiendaCreatePayload(values);
        mutation.mutate(payload);
    };

    return (
        <TiendaForm
            visible={visible}
            onCancel={onCancel}
            onSubmit={handleSubmit}
            initialValues={initialValues}
            form={form}
            loading={mutation.isPending}
        />
    );
};

export default TiendaFormContainer;
