import {Typography} from 'antd';
import {useTokenGet} from '../hooks/useTokenGet.js';
import {useTokenRegister} from '../hooks/useTokenRegister.js';
import {TokenGetForm} from '../components/TokenGetForm.jsx';
import {TokenRegisterForm} from '../components/TokenRegisterForm.jsx';
import {SwaggerEndpointsCard} from '../components/SwaggerEndpointsCard.jsx';
import styles from './ObtenerTokenPage.module.css';

const {Title, Paragraph} = Typography;

const ObtenerTokenPage = () => {
    const {
        control: controlGet,
        generatedToken,
        isTokenVisible,
        isLoading: isLoadingGet,
        error: errorGet,
        onSubmit: onSubmitGet,
        handleClearForm: handleClearFormGet,
        toggleTokenVisibility,
        handleCopyToken,
    } = useTokenGet();

    const {
        control: controlRegister,
        isLoading: isLoadingRegister,
        error: errorRegister,
        isSuccess: isSuccessRegister,
        registeredCredentials,
        onSubmit: onSubmitRegister,
        handleClearForm: handleClearFormRegister,
        handleCloseSuccess,
    } = useTokenRegister();

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <Title level={1} className={styles.pageTitle}>
                    Generador de Tokens para la API de Dulce Control
                </Title>
                <Paragraph className={styles.pageDescription}>
                    Cree credenciales de usuario y genere tokens JWT para acceder a todos los
                    endpoints de nuestra API. Utilice el token generado en Swagger UI para
                    probar las peticiones de forma interactiva.
                </Paragraph>
            </div>
            <div className={styles.formsWrapper}>
                <TokenRegisterForm
                    control={controlRegister}
                    onSubmit={onSubmitRegister}
                    handleClearForm={handleClearFormRegister}
                    isLoading={isLoadingRegister}
                    error={errorRegister}
                    isSuccess={isSuccessRegister}
                    registeredCredentials={registeredCredentials}
                    handleCloseSuccess={handleCloseSuccess}
                />
                <TokenGetForm
                    control={controlGet}
                    onSubmit={onSubmitGet}
                    handleClearForm={handleClearFormGet}
                    isLoading={isLoadingGet}
                    generatedToken={generatedToken}
                    isTokenVisible={isTokenVisible}
                    toggleTokenVisibility={toggleTokenVisibility}
                    handleCopyToken={handleCopyToken}
                    error={errorGet}
                />
            </div>
            <div className={styles.pageHeader}>
                <SwaggerEndpointsCard />
            </div>
        </div>
    );
};

export default ObtenerTokenPage;