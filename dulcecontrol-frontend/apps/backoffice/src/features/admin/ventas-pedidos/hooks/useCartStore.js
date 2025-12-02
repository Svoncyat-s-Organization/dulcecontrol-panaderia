import { create } from 'zustand';

export const POS_MODES = {
    VENTA: 'venta',
    PEDIDO: 'pedido',
};

const createCartItemId = (prefix) => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${prefix || 'item'}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useCartStore = create((set, get) => ({
    items: [],
    cliente: null,
    posMode: POS_MODES.VENTA,

    setCliente: (cliente) => set({ cliente }),

    setPosMode: (mode) => {
        if (!mode || !Object.values(POS_MODES).includes(mode)) {
            return;
        }
        set({ posMode: mode });
    },

    addItem: (product) => {
        const newItem = {
            ...product,
            cartItemId: createCartItemId(product.id),
            quantity: 1,
            customNotes: '',
        };
        set({ items: [...get().items, newItem] });
    },

    removeItem: (cartItemId) => {
        set({
            items: get().items.filter((item) => item.cartItemId !== cartItemId),
        });
    },

    updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(cartItemId);
            return;
        }
        set({
            items: get().items.map((item) =>
                item.cartItemId === cartItemId ? { ...item, quantity } : item
            ),
        });
    },

    updateItemNotes: (cartItemId, notes = '') => {
        set({
            items: get().items.map((item) =>
                item.cartItemId === cartItemId ? { ...item, customNotes: notes } : item
            ),
        });
    },

    clearCart: () => set({ items: [], cliente: null }),

    getTotal: () => {
        return get().items.reduce(
            (total, item) => total + (item.precioBaseCentimos / 100) * item.quantity,
            0
        );
    },

    getItemsCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
    }
}));
