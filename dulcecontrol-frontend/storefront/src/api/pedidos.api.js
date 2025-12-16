/**
 * API para gestión de pedidos personalizados en el storefront
 */

import { getTiendaIdentifier } from '../config/tenant.config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Crea un pedido personalizado para un cliente autenticado
 * 
 * @param {Object} pedidoData - Datos del pedido
 * @param {number} pedidoData.productoId - ID del producto base
 * @param {number} pedidoData.cantidad - Cantidad de unidades
 * @param {string} pedidoData.descripcionSolicitud - Descripción de la personalización
 * @param {string} [pedidoData.textoDedicatoria] - Texto de dedicatoria opcional
 * @param {string} [pedidoData.saborMasa] - Sabor de masa
 * @param {string} [pedidoData.saborRelleno] - Sabor de relleno
 * @param {string} [pedidoData.tematica] - Temática del diseño
 * @param {string} token - JWT token del cliente autenticado
 * @returns {Promise<Object>} Respuesta con el pedido creado
 */
export const createPedidoPersonalizado = async (pedidoData, token) => {
  const tiendaId = getTiendaIdentifier();
  const url = `${API_BASE_URL}/api/storefront/pedidos-personalizados`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      tiendaId,
      ...pedidoData,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear pedido personalizado');
  }

  return response.json();
};

/**
 * Obtiene los pedidos del cliente autenticado
 * 
 * @param {string} token - JWT token del cliente
 * @returns {Promise<Array>} Lista de pedidos del cliente
 */
export const getMisPedidos = async (token) => {
  const url = `${API_BASE_URL}/api/storefront/pedidos/me`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener pedidos');
  }

  return response.json();
};
