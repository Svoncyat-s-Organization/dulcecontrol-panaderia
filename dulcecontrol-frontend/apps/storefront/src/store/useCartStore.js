import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      /**
       * Agrega un producto al carrito.
       * IMPORTANTE: Si el producto tiene personalización, cada item es ÚNICO (no se agrupa).
       * El cartId se genera como: productId + timestamp para productos personalizados.
       * 
       * @param {Object} product - Producto a agregar
       * @param {number} quantity - Cantidad
       * @param {Object|null} personalizacion - Objeto con { dedicatoria, saborMasa, saborRelleno, tematica, imagenReferencia }
       */
      addItem: (product, quantity = 1, personalizacion = null) => {
        const items = get().items;
        
        // Si tiene personalización, cada item es único (no agrupar)
        if (personalizacion) {
          const uniqueId = `${product.id}_${Date.now()}`;
          set({ 
            items: [...items, { 
              ...product, 
              quantity, 
              cartId: uniqueId,  // ID único para items personalizados
              personalizacion 
            }] 
          });
          return;
        }
        
        // Sin personalización: buscar por ID y agrupar cantidades
        const existingItem = items.find((item) => item.id === product.id && !item.personalizacion);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && !item.personalizacion
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity, cartId: product.id }] });
        }
      },

      /**
       * Remueve un item del carrito.
       * @param {string|number} cartId - ID único del item (puede ser productId o uniqueId para personalizados)
       */
      removeItem: (cartId) => {
        set({ items: get().items.filter((item) => item.cartId !== cartId) });
      },

      /**
       * Actualiza cantidad de un item.
       * @param {string|number} cartId - ID único del item
       * @param {number} quantity - Nueva cantidad
       */
      updateQuantity: (cartId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartId);
        } else {
          set({
            items: get().items.map((item) =>
              item.cartId === cartId ? { ...item, quantity } : item
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'dulcecontrol-cart', // unique name for localStorage
    }
  )
);

export default useCartStore;
