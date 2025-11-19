import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFoundPage = ({
  title = 'Página no encontrada',
  description = 'La ruta solicitada no existe o fue movida. Verifica la URL e intenta de nuevo.',
  homePath = '/',
  actionLabel = 'Volver al inicio',
}) => (
  <Result
    status="404"
    title={title}
    subTitle={description}
    extra={
      <Link to={homePath}>
        <Button type="primary">{actionLabel}</Button>
      </Link>
    }
  />
);

export default NotFoundPage;
