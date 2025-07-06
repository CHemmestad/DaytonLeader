import React from 'react';
import './Subscribe.css';

const Subscribe = () => {
  const handleSubscribe = async (priceId) => {
    const response = await fetch('http://localhost:8081/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    const { url } = await response.json();
    window.location.href = url; // Redirects to Stripe Checkout
  };

  return (
    <div className="subscribe-container">
      <h2>Choose a Subscription Plan</h2>
      <div className="plans">
        <div className="plan-card">
          <h3>Newspaper Only</h3>
          <p>$100/year</p>
          <button className="btn" onClick={() => handleSubscribe('price_1XXX_Newspaper')}>Subscribe</button>
        </div>
        <div className="plan-card">
          <h3>Online Only</h3>
          <p>$50/year</p>
          <button className="btn" onClick={() => handleSubscribe('price_1XXX_Online')}>Subscribe</button>
        </div>
        <div className="plan-card">
          <h3>Bundle</h3>
          <p>$75/year</p>
          <button className="btn" onClick={() => handleSubscribe('price_1XXX_Bundle')}>Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
