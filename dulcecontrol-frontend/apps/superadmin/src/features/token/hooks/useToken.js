import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';

const API_URL = 'http://localhost:2250';
const LOGIN_ENDPOINT = `${API_URL}/api/v1/auth/login`;


/**
 * Función de API aislada.
 * Llama al endpoint de login.
 * @param {object} formData - Datos del formulario ({ correo, contrasena })
 * @returns {Promise<object>} La respuesta de la API (LoginResponse.java)
 */
const postLogin = async (formData) => {
    const payload = {
        correo: formData.correo,
        contrasena: formData.contrasena,
    };

    const response = await axios.post(LOGIN_ENDPOINT, payload);
    return response.data; // Retorna el LoginResponse
};

export const useToken = () => {
    const [generatedToken, setGeneratedToken] = useState(null);
    const [isTokenVisible, setIsTokenVisible] = useState(false);

    const { control, handleSubmit, setValue, reset } = useForm({
        defaultValues: {
            correo: '',
            contrasena: '',
        },
    });

    const mutation = useMutation({
        mutationFn: postLogin,
        onMutate: () => {
            setGeneratedToken(null);
            setIsTokenVisible(false);
        },
        onSuccess: (data) => {
            const token = data?.accessToken;
            if (token) {
                setGeneratedToken(token);
                message.success('¡Token generado con éxito!');
            } else {
                message.error('Respuesta exitosa, pero no se encontró un accessToken.');
            }
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || error.message || 'Error desconocido';
            message.error(errorMsg);
        },
    });

    const onSubmit = (formData) => {
        mutation.mutate(formData);
    };

    const fillForm = (user) => {
        setValue('correo', user.email);
        setValue('contrasena', user.pass);
        message.info(`Credenciales de ${user.name} cargadas.`);
    };

    const handleClearForm = () => {
        reset();
        setGeneratedToken(null);
        setIsTokenVisible(false);
        message.info('Formulario limpiado');
    };

    const toggleTokenVisibility = () => {
        setIsTokenVisible(!isTokenVisible);
    };

    const handleCopyToken = () => {
        if (generatedToken) {
            navigator.clipboard.writeText(generatedToken);
            message.success('Token copiado al portapapeles');
        }
    };

    return {
        // Estado y datos
        generatedToken,
        isTokenVisible,
        isLoading: mutation.isPending,
        error: mutation.error,

        // Funciones y controladores
        control,
        onSubmit: handleSubmit(onSubmit),
        fillForm,
        handleClearForm,
        toggleTokenVisibility,
        handleCopyToken,
    };
};