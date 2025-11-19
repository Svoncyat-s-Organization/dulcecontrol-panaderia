import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {message} from 'antd';
import {postRegister} from "../../api/token.api.js";
import {TokenRegisterForm} from "./TokenRegisterForm.jsx";

export const TokenRegisterCard = () => {
    const [registeredCredentials, setRegisteredCredentials] = useState(null);

    const registerMutation = useMutation({
        mutationFn: postRegister,
        onSuccess: (data, variables) => {
            // Guardamos las credenciales registradas para mostrarlas en la UI
            setRegisteredCredentials({
                correo: variables.correo,
                contrasena: variables.contrasena
            });
            message.success('Registro exitoso. Token generado.');
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || 'Error en el registro. Intente nuevamente.';
            message.error(errorMsg);
        }
    });

    const handleRegister = async (values) => {
        setRegisteredCredentials(null);
        // Esperamos a que la mutación termine
        await registerMutation.mutateAsync(values);
    };

    const handleCloseSuccess = () => {
        setRegisteredCredentials(null);
    }

    return (
        <TokenRegisterForm
            onSubmit={handleRegister}
            isLoading={registerMutation.isLoading}
            error={registerMutation.error}
            registeredCredentials={registeredCredentials}
            handleCloseSuccess={handleCloseSuccess}
        />
    );
}