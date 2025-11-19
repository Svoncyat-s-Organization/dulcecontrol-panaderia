import { Card, Button, Typography } from 'antd';
import { IconApi, IconExternalLink } from '@tabler/icons-react';
import styles from './SwaggerEndpointsCard.module.css';
import { getApiUrl, ENDPOINTS } from '../../../../config/api.config.js';

const { Title, Paragraph } = Typography;

/**
 * Componente para mostrar el enlace a la documentación Swagger UI.
 */
export const SwaggerEndpointsCard = () => {
    const swaggerUrl = `${getApiUrl()}${ENDPOINTS.SWAGGER_UI}`;

    const handleOpenSwagger = () => {
        window.open(swaggerUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={styles.wrapper}>
            <Card className={styles.card} variant="borderless">
                <div className={styles.header}>
                    <IconApi size={24} className={styles.headerIcon} />
                    <Title level={3} className={styles.title}>
                        Documentación API
                    </Title>


                </div>
                <div className={styles.content}>
                    <Paragraph className={styles.description}>
                        Explore y pruebe todos los endpoints de la API de Dulce Control
                        utilizando la interfaz interactiva Swagger UI.
                    </Paragraph>

                    <Button
                        type="primary"
                        size="large"
                        icon={<IconExternalLink size={18} />}
                        onClick={handleOpenSwagger}
                        className={styles.swaggerButton}
                        block
                    >
                        Abrir Swagger UI
                    </Button>

                    <div className={styles.infoBox}>
                        Copie el token generado y úselo en Swagger
                        haciendo clic en el botón <strong>Authorize 🔓</strong>
                    </div>
                </div>
            </Card>
        </div>
    );
};
