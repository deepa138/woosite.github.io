import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './Products';
import SingleProduct from './SingleProduct';
import Category from './Category';
import Categorylist from './categorylist';
import Cart from './Cart';
import Checkout from './Checkout';
import Header from './Header';

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (productId, amount) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + amount;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  return (
    <Router>
      <Header cartItems={cartItems} handleRemoveItem={handleRemoveItem} handleQuantityChange={handleQuantityChange} />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/category/:categorySlug" element={<Category />} />
        <Route path="/categorylist" element={<Categorylist />} />
        {/* Make sure to pass cartItems to Cart component */}
        <Route path="/cart" element={<Cart cartItems={cartItems} />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
};

export default App;
