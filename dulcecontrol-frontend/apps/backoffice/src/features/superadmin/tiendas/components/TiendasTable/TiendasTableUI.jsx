import {Table, Button, Space, Tag, Popconfirm} from 'antd';

const TiendasTableUI = ({ isLoading, data, onEdit, onDelete }) => {

    const columns = [
        {
            title: 'Nombre Comercial',
            dataIndex: 'nombreComercial',
            key: 'nombreComercial',
        },
        {
            title: 'Documento',
            dataIndex: 'numeroDoc',
            key: 'numeroDoc'
        },
        {
            title: 'Contacto',
            key: 'correoContacto',
            render: (text, record) => (
                <Space direction="vertical">
                    <div>{record.correoContacto}</div>
                    <div>{record.telefonoContacto}</div>
                </Space>
            ),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (estado) => {
                let color = estado === 'EN_PRUEBA' ? 'geekblue' : 'green';
                return <Tag color={color}>{estado}</Tag>;
            }
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => onEdit(record.id)}>Editar</Button>
                    <Popconfirm
                        title="¿Estás seguro de que deseas eliminar esta tienda?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button type="primary" danger>Eliminar</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={isLoading}
            rowKey="id"
        />
    );
};

export default TiendasTableUI;