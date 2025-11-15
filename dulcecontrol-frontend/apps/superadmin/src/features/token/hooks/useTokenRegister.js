import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';

const API_URL = 'http://localhost:2250';
const REGISTER_ENDPOINT = `${API_URL}/api/superadmin/seguridad/usuarios`;

/**
 * Función de API para registrar un usuario superadmin.
 * @param {object} formData - Datos del formulario
 * @returns {Promise<object>} La respuesta de la API
 */
const postRegisterUser = async (formData) => {
    const payload = {
        correo: formData.correo,
        contrasena: formData.contrasena,
        tipoDoc: formData.tipoDoc,
        numeroDoc: formData.numeroDoc,
        nombres: formData.nombres,
        telefono: formData.telefono || null,
    };

    const response = await axios.post(REGISTER_ENDPOINT, payload);
    return response.data;
};

export const useTokenRegister = () => {
    const [registeredCredentials, setRegisteredCredentials] = React.useState(null);

    const { control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            correo: '',
            contrasena: '',
            tipoDoc: 'DNI',
            numeroDoc: '',
            nombres: '',
            telefono: '',
        },
    });

    const mutation = useMutation({
        mutationFn: postRegisterUser,
        onSuccess: (data, variables) => {
            setRegisteredCredentials({
                correo: variables.correo,
                contrasena: variables.contrasena,
            });
            message.success('¡Usuario registrado exitosamente!');
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || error.message || 'Error al registrar usuario';
            message.error(errorMsg);
        },
    });

    const onSubmit = (formData) => {
        mutation.mutate(formData);
    };

    const handleClearForm = () => {
        reset();
        setRegisteredCredentials(null);
        message.info('Formulario limpiado');
    };

    const handleCloseSuccess = () => {
        setRegisteredCredentials(null);
        reset();
    };

    return {
        // Estado y datos
        isLoading: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        registeredCredentials,

        // Funciones y controladores
        control,
        onSubmit: handleSubmit(onSubmit),
        handleClearForm,
        handleCloseSuccess,
        watch,
    };
};