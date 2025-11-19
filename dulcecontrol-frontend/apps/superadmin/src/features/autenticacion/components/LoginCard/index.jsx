import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { postSuperadminLogin } from '../../api/auth.api.js';
import { AUTH_MESSAGES } from '../../constants/messages.js';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import LoginCardView from './LoginCardView.jsx';

const LoginCard = ({ redirectPath }) => {
    const login = useTokenStore((state) => state.login);
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);

    const mutation = useMutation({
        mutationFn: async (payload) => {
            const response = await postSuperadminLogin(payload);
            if (!response?.token) {
                const fallbackMessage = response?.message ?? AUTH_MESSAGES.ERROR;
                throw new Error(fallbackMessage);
            }
            return response;
        },
        onSuccess: (data) => {
            setFormError(null);
            login({
                token: data.token,
                userType: data.userType,
                tiendaId: data.tiendaId,
                expiresIn: data.expiresIn,
            });
            message.success(AUTH_MESSAGES.SUCCESS);
            navigate(redirectPath, { replace: true });
        },
        onError: (error) => {
            const detail =
                error?.response?.data?.message ?? error?.message ?? AUTH_MESSAGES.ERROR;
            setFormError(detail);
            message.error(detail);
        },
    });

    return (
        <LoginCardView
            loading={mutation.isPending}
            onSubmit={mutation.mutate}
            errorMessage={formError}
        />
    );
};

export default LoginCard;
