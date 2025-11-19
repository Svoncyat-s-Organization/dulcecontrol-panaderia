import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTiendas, deleteTienda } from '../../api/tiendas.api.js';
import TiendasTableUI from './TiendasTableUI.jsx';
import { Spin, message } from 'antd';

export const TiendasTablaContainer = () => {
    const {
        data: tiendas,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['tiendas'],
        queryFn: getTiendas,
    });

    const queryClient = useQueryClient();

    const {
        mutate: eliminarTienda,
        isLoading: isDeleting,
    } = useMutation({
        mutationFn: deleteTienda,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiendas'] });
            message.success('Tienda eliminada correctamente');
        },
        onError: (error) => {
            message.error('Error al eliminar la tienda:', error.message);
        },
    })

    if (isError) {
        return <span>Error al cargar las tiendas: {error.message}</span>;
    }

    return (
        <Spin spinning={isLoading || isDeleting}>
            <TiendasTableUI
                data={tiendas || []}
                isLoading={isLoading || isDeleting}
                onEdit={(id) => {
                    // Lógica para editar la tienda
                    console.log('Editar tienda con ID:', id);
                }}
                onDelete={(id) => {
                    eliminarTienda(id);
                }}
            />
        </Spin>
    );
}
