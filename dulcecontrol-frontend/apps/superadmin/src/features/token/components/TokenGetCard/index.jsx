import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {message} from 'antd';
import {postLogin} from "../../api/token.api.js";
import {TokenGetForm} from "./TokenGetForm.jsx";

export const TokenGetCard = () => {
    const [tokenSuccessData, setTokenSuccessData] = useState(null);

    const loginMutation = useMutation({
        mutationFn: postLogin,
        onSuccess: (data) => {
            setTokenSuccessData({
                accessToken: data.accessToken,
                tokenType: data.tokenType,
                expiresIn: data.expiresIn
            });
            message.success('Credenciales validadas. Token generado.');
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || 'Error en al validar sus credenciales. Intente nuevamente.';
            message.error(errorMsg);
        }
    });

    const handleLogin = async (values) => {
        setTokenSuccessData(null);
        // Esperamos a que la mutación termine
        await loginMutation.mutateAsync(values);
    };

    const handleCloseSuccess = () => {
        setTokenSuccessData(null);
    }

    return (
        <TokenGetForm
            onSubmit={handleLogin}
            isLoading={loginMutation.isLoading}
            error={loginMutation.error}
            tokenSuccessData={tokenSuccessData}
            handleCloseSuccess={handleCloseSuccess}
        />
    );
}