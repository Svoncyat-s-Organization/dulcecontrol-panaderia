import React, { useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, message } from 'antd';
import { createUsuario, updateUsuario } from '../../../../../api/superadmin/usuarios';
import { getRolesByTiendaId } from '../../../../../api/superadmin/roles';
import { getSedesByTiendaId } from '../../../../../api/superadmin/sedes';
import { buildUsuarioCreatePayload, buildUsuarioUpdatePayload } from '../../utils/payloadBuilders';
import UsuarioForm from './UsuarioForm';

const UsuarioFormContainer = ({ visible, onCancel, initialValues, tiendaId }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { data: roles, isLoading: loadingRoles } = useQuery({
        queryKey: ['tiendaRoles', tiendaId],
        queryFn: () => getRolesByTiendaId(tiendaId),
        enabled: visible && !!tiendaId,
        onError: (error) => {
            console.error(error);
            const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
            message.error(backendMessage || 'No se pudo cargar la lista de roles disponibles. Inténtalo nuevamente.');
        },
    });

    const { data: sedes, isLoading: loadingSedes } = useQuery({
        queryKey: ['tiendaSedes', tiendaId],
        queryFn: () => getSedesByTiendaId(tiendaId),
        enabled: visible && !!tiendaId,
        onError: (error) => {
            console.error(error);
            const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
            message.error(backendMessage || 'No se pudo obtener la lista de sedes. Inténtalo nuevamente.');
        },
    });

    useEffect(() => {
        if (!visible) {
            return;
        }

        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                rolId: initialValues.rolId ?? initialValues.rol?.id ?? null,
                tipoDoc: initialValues.tipoDoc ?? initialValues.tipo_doc ?? 'DNI',
                numeroDoc: initialValues.numeroDoc ?? initialValues.numero_doc ?? '',
                telefono: initialValues.telefono ?? initialValues.telefono_contacto ?? '',
                activo: initialValues.activo ?? true,
                sedeIds: initialValues.sedeIds
                    ?? initialValues.sedesIds
                    ?? (initialValues.sedeId ? [initialValues.sedeId] : []),
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                tipoDoc: 'DNI',
                activo: true,
                sedeIds: [],
            });
        }
    }, [visible, initialValues, form]);

    const rolesOptions = useMemo(() => (
        (roles ?? []).map((rol) => ({
            value: rol.id,
            label: rol.nombre || rol.name,
        }))
    ), [roles]);

    const sedesOptions = useMemo(() => (
        (sedes ?? []).map((sede) => ({
            value: sede.id,
            label: sede.nombre,
        }))
    ), [sedes]);

    const mutation = useMutation({
        mutationFn: (payload) => (
            initialValues
                ? updateUsuario(tiendaId, initialValues.id, payload)
                : createUsuario(tiendaId, payload)
        ),
        onSuccess: () => {
            message.success(`Usuario ${initialValues ? 'actualizado' : 'creado'} correctamente`);
            queryClient.invalidateQueries({ queryKey: ['usuarios', tiendaId] });
            onCancel();
            form.resetFields();
        },
        onError: (error) => {
            console.error(error);
            const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
            message.error(backendMessage || 'No se pudo guardar el usuario. Revisa los datos e inténtalo nuevamente.');
        },
    });

    const handleSubmit = (values) => {
        const payload = initialValues
            ? buildUsuarioUpdatePayload(values)
            : buildUsuarioCreatePayload(values);
        mutation.mutate(payload);
    };

    return (
        <UsuarioForm
            visible={visible}
            onCancel={onCancel}
            onSubmit={handleSubmit}
            initialValues={initialValues}
            form={form}
            loading={mutation.isPending}
            roles={rolesOptions}
            loadingRoles={loadingRoles}
            sedes={sedesOptions}
            loadingSedes={loadingSedes}
        />
    );
};

export default UsuarioFormContainer;
