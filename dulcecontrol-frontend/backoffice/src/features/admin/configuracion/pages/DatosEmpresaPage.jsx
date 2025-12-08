import DatosEmpresaForm from '../components/DatosEmpresaForm/index.jsx';

const DatosEmpresaPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Datos de Empresa
        </h1>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Configure la información legal y fiscal de su empresa que aparecerá en los comprobantes de pago.
        </p>
      </div>
      
      <DatosEmpresaForm />
    </div>
  );
};

export default DatosEmpresaPage;
