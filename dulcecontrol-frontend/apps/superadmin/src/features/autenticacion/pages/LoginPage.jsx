import { useLocation } from 'react-router-dom';
import { AuthLayout, LoginCard } from '../components/index.js';

const LoginPage = () => {
    const location = useLocation();
    const redirectPath = location.state?.from?.pathname || '/';

    return (
        <AuthLayout>
            <LoginCard redirectPath={redirectPath} />
        </AuthLayout>
    );
};

export default LoginPage;
