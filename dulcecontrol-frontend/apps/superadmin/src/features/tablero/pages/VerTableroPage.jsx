import { Typography } from 'antd';
import styles from './VerTableroPage.module.css';

const { Title } = Typography;

const VerTableroPage = () => {
    return (
        <Title level={1} className={styles?.pageTitle ?? ''}>
            Tablero
        </Title>
    );
};

export default VerTableroPage;