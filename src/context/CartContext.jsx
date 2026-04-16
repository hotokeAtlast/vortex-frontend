import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('vortex_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // NEW: State for our Toast
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('vortex_cart', JSON.stringify(cart));
  }, [cart]);

  // NEW: Helper function to trigger the toast
  const triggerToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000); // Fades away after 3 seconds
  };

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    
    // NEW: Fire the toast!
    triggerToast(`Added ${product.name} to your cart`);
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) => 
      prevCart.map((item) => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    // Make sure toastMessage is exported here!
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, toastMessage }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);