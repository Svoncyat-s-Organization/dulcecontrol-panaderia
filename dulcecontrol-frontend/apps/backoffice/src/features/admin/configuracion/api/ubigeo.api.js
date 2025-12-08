import apiClient from '../../../../api/apiClient.js';

/**
 * Obtiene la lista de departamentos del Perú
 */
export const getDepartamentos = async () => {
  const { data } = await apiClient.get('/api/ubigeo/departamentos');
  return data;
};

/**
 * Obtiene las provincias de un departamento
 * @param {number} departamentoId - ID del departamento
 */
export const getProvinciasByDepartamento = async (departamentoId) => {
  const { data } = await apiClient.get(`/api/ubigeo/departamentos/${departamentoId}/provincias`);
  return data;
};

/**
 * Obtiene los distritos de una provincia
 * @param {number} provinciaId - ID de la provincia
 */
export const getDistritosByProvincia = async (provinciaId) => {
  const { data } = await apiClient.get(`/api/ubigeo/provincias/${provinciaId}/distritos`);
  return data;
};
