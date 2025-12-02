import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, message } from 'antd';
import { createDominio, updateDominio } from '../../../../../api/superadmin/dominios';
import { buildDominioPayload } from '../../utils/payloadBuilders';
import DominioForm from './DominioForm';

const DominioFormContainer = ({ visible, onCancel, initialValues, tiendaId }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!visible) {
            return;
        }

        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
            form.setFieldsValue({
                tipo: 'TIENDA_VIRTUAL',
                colorPrimario: '#040316',
                colorSecundario: '#f5f5f5',
            });
        }
    }, [visible, initialValues, form]);

    const mutation = useMutation({
        mutationFn: (payload) =>
            initialValues
                ? updateDominio(tiendaId, initialValues.id, payload)
                : createDominio(tiendaId, payload),
        onSuccess: () => {
            message.success(`Dominio ${initialValues ? 'actualizado' : 'creado'} correctamente`);
            queryClient.invalidateQueries({ queryKey: ['dominios', tiendaId] });
            onCancel();
            form.resetFields();
        },
        onError: (error) => {
            console.error(error);
            message.error('No se pudo guardar el dominio. Revisa los datos e inténtalo nuevamente.');
        },
    });

    const handleSubmit = (values) => {
        const payload = buildDominioPayload(values);
        mutation.mutate(payload);
    };

    return (
        <DominioForm
            visible={visible}
            onCancel={onCancel}
            onSubmit={handleSubmit}
            initialValues={initialValues}
            form={form}
            loading={mutation.isPending}
        />
    );
};

export default DominioFormContainer;
