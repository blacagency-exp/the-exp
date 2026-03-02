import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string | number;
    name: string;
    price: string;
    size: string;
    color: string;
    quantity: number;
    image?: string;
}

interface Product {
    id: string | number;
    name: string;
    price: string;
    image?: string;
}

interface ShopContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string | number, size: string, color: string) => void;
    updateQuantity: (productId: string | number, size: string, color: string, quantity: number) => void;
    clearCart: () => void;
    recentlyViewed: Product[];
    addToRecentlyViewed: (product: Product) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('shop_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
        const saved = localStorage.getItem('recently_viewed');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('shop_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('recently_viewed', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    const addToCart = React.useCallback((item: CartItem) => {
        setCart(prev => {
            const existingItemIndex = prev.findIndex(i => i.id === item.id && i.size === item.size && i.color === item.color);
            if (existingItemIndex > -1) {
                const newCart = [...prev];
                newCart[existingItemIndex].quantity += item.quantity;
                return newCart;
            }
            return [...prev, item];
        });
    }, []);

    const removeFromCart = React.useCallback((productId: string | number, size: string, color: string) => {
        setCart(prev => prev.filter(item => !(item.id === productId && item.size === size && item.color === color)));
    }, []);

    const updateQuantity = React.useCallback((productId: string | number, size: string, color: string, quantity: number) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item =>
            (item.id === productId && item.size === size && item.color === color) ? { ...item, quantity } : item
        ));
    }, []);

    const clearCart = React.useCallback(() => {
        setCart([]);
    }, []);

    const addToRecentlyViewed = React.useCallback((product: Product) => {
        setRecentlyViewed(prev => {
            // Remove if exists to move to top
            const filtered = prev.filter(p => p.id !== product.id);
            const updated = [product, ...filtered].slice(0, 10); // Keep last 10
            return updated;
        });
    }, []);

    return (
        <ShopContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            recentlyViewed,
            addToRecentlyViewed
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};
