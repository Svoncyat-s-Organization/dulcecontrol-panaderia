import {Typography} from 'antd';
import { TokenGetCard } from '../components/TokenGetCard';
import { TokenRegisterCard } from '../components/TokenRegisterCard';
import {SwaggerEndpointsCard} from '../components/SwaggerEnpointsCard/SwaggerEndpointsCard.jsx';
import styles from './ObtenerTokenPage.module.css';

const {Title, Paragraph} = Typography;

const ObtenerTokenPage = () => {
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
                <TokenRegisterCard />
                <TokenGetCard />
            </div>
            <div className={styles.pageHeader}>
                <SwaggerEndpointsCard />
            </div>
        </div>
    );
};

export default ObtenerTokenPage;