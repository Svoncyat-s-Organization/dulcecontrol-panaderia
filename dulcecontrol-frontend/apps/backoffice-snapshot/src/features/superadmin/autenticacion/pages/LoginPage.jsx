import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthLayout, LoginCard } from '../components/index.js';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';

const LoginPage = ({ defaultRedirect = '/superadmin' }) => {
    const location = useLocation();
    const redirectPath = location.state?.from?.pathname || defaultRedirect;
    const setPanelRoleHint = useTokenStore((state) => state.setPanelRoleHint);

    useEffect(() => {
        setPanelRoleHint('SUPERADMIN');
        return () => setPanelRoleHint(null);
    }, [setPanelRoleHint]);

    return (
        <AuthLayout>
            <LoginCard redirectPath={redirectPath} />
        </AuthLayout>
    );
};

export default LoginPage;
