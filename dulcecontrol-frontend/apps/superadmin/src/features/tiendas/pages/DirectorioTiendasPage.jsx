import { Typography } from 'antd';
import * as Tiendas from '../components/TiendasTable';

const DirectorioTiendasPage = () => {
    const { Title } = Typography;

    return (
        <>
            <Title level={1}>Directorio de Tiendas</Title>
            <Tiendas.TiendasTablaContainer />
        </>
    );

}

export default DirectorioTiendasPage;