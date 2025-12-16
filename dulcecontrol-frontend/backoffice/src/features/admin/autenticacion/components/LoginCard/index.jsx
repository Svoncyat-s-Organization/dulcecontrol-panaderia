import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { postAdminLogin } from '../../api/auth.api.js';
import { AUTH_MESSAGES } from '../../constants/messages.js';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import LoginCardView from './LoginCardView.jsx';
import { featureFlags } from '../../../../../config/featureFlags.js';
import { DEV_AUTH_TOKEN } from '../../../../../shared/constants/devAuth.js';

const LoginCard = ({ redirectPath }) => {
  const login = useTokenStore((state) => state.login);
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);
  const devLoginEnabled = featureFlags.devLoginEnabled;

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await postAdminLogin(payload);
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
        userId: data.userId || data.id,
        subscription: data.subscriptionStatus ?? null,
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

  const handleDevLogin = () => {
    if (!devLoginEnabled) {
      return;
    }

    setFormError(null);
    login({
      token: DEV_AUTH_TOKEN,
      userType: 'ADMIN',
      tiendaId: 1,
      expiresIn: null,
      userId: 0,
    });
    message.info(AUTH_MESSAGES.DEV_LOGIN);
    navigate(redirectPath, { replace: true });
  };

  return (
    <LoginCardView
      loading={mutation.isPending}
      onSubmit={mutation.mutate}
      errorMessage={formError}
      devLoginEnabled={devLoginEnabled}
      onDevLogin={handleDevLogin}
    />
  );
};

export default LoginCard;
