import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, message } from 'antd';
import { createSede, updateSede } from '../../../../../api/superadmin/sedes';
import { buildSedePayload } from '../../utils/payloadBuilders';
import SedeForm from './SedeForm';

const SedeFormContainer = ({ visible, onCancel, initialValues, tiendaId }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!visible) {
            return;
        }

        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                esPrincipal: Boolean(initialValues.esPrincipal),
                activo: initialValues.activo ?? true,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ esPrincipal: false });
        }
    }, [visible, initialValues, form]);

    const mutation = useMutation({
        mutationFn: (payload) =>
            initialValues
                ? updateSede(tiendaId, initialValues.id, payload)
                : createSede(tiendaId, payload),
        onSuccess: () => {
            message.success(`Sede ${initialValues ? 'actualizada' : 'creada'} correctamente`);
            queryClient.invalidateQueries({ queryKey: ['sedes', tiendaId] });
            onCancel();
            form.resetFields();
        },
        onError: (error) => {
            console.error(error);
            message.error('No se pudo guardar la sede. Intenta nuevamente.');
        },
    });

    const handleSubmit = (values) => {
        const payload = buildSedePayload(values, { includeActivo: Boolean(initialValues) });
        mutation.mutate(payload);
    };

    return (
        <SedeForm
            visible={visible}
            onCancel={onCancel}
            onSubmit={handleSubmit}
            initialValues={initialValues}
            form={form}
            loading={mutation.isPending}
        />
    );
};

export default SedeFormContainer;
