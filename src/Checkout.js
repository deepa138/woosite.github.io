import React, { useState, useEffect } from 'react';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails({ ...billingDetails, [name]: value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (agreed) {
      // Handle order placement logic here
      console.log('Order placed:', {
        billingDetails,
        paymentMethod,
        cartItems,
      });
    } else {
      alert('Please agree to the terms and conditions.');
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Billing details</h2>
          <div className="grid grid-cols-1 gap-4">
            <input type="text" name="firstName" placeholder="First name" value={billingDetails.firstName} onChange={handleInputChange} required className="border p-2 rounded" />
            <input type="text" name="lastName" placeholder="Last name" value={billingDetails.lastName} onChange={handleInputChange} required className="border p-2 rounded" />
            <input type="text" name="companyName" placeholder="Company name (optional)" value={billingDetails.companyName} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="text" name="country" placeholder="Country" value={billingDetails.country} onChange={handleInputChange} required className="border p-2 rounded" />
            <input type="text" name="address" placeholder="Street address" value={billingDetails.address} onChange={handleInputChange} required className="border p-2 rounded" />
            <input type="text" name="city" placeholder="Town / City" value={billingDetails.city} onChange={handleInputChange} required className="border p-2 rounded" />
            <input type="text" name="state" placeholder="State" value={billingDetails.state} onChange={handleInputChange} required className="border p-2 rounded" />
            <input type="text" name="zip" placeholder="ZIP Code" value={billingDetails.zip} onChange={handleInputChange} required className="border p-2 rounded" />
            <input type="tel" name="phone" placeholder="Phone" value={billingDetails.phone} onChange={handleInputChange} required className="border p-2 rounded" />
            <input type="email" name="email" placeholder="Email address" value={billingDetails.email} onChange={handleInputChange} required className="border p-2 rounded" />
            <textarea name="notes" placeholder="Order notes (optional)" value={billingDetails.notes} onChange={handleInputChange} className="border p-2 rounded"></textarea>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Your order</h2>
          <div className="border p-4 rounded mb-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>€{item.price} x {item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between mt-4 border-t pt-2">
              <span>Subtotal</span>
              <span>€{getTotal()}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Shipping</span>
              <span>Flat rate: €20.00</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Total</span>
              <span>€{(parseFloat(getTotal()) + 20).toFixed(2)}</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Payment method</h2>
          <div className="border p-4 rounded">
            <div className="mb-2">
              <input type="radio" name="paymentMethod" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" />
              <label>Direct bank transfer</label>
            </div>
            <div className="mb-2">
              <input type="radio" name="paymentMethod" value="check_payments" checked={paymentMethod === 'check_payments'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" />
              <label>Check payments</label>
            </div>
            <div className="mb-2">
              <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" />
              <label>Cash on delivery</label>
            </div>
          </div>
          <div className="mt-4">
            <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="mr-2" />
            <label>I have read and agree to the website terms and conditions *</label>
          </div>
          <button type="submit" disabled={!agreed} className={`bg-black text-white py-2 px-4 rounded mt-4 ${!agreed ? 'opacity-50 cursor-not-allowed' : ''}`}>
  {agreed ? 'Place order' : 'Agree to terms to place order'}
</button>

        </div>
      </form>
    </div>
  );
};

export default Checkout;
