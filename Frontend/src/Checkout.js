import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useLocation, Navigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51RiLXjQHfiVvd5iEfMdrpyyweNOw5x4u7kW7HsSABL5kS0D3zKg8BzXoKWUKiGDhkES7uKX8YTakOc7092nJrA8k0022r01YZS");

export const CheckoutForm = () => {
  const location = useLocation();
  const priceId = new URLSearchParams(location.search).get("priceId");

  const fetchClientSecret = useCallback(() => {
    return fetch("https://daytonleader.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, [priceId]);

  const options = { fetchClientSecret };

  return (
    <div className="p-3">
      <EmbeddedCheckoutProvider clasName="flex-grow-1" stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');

    fetch(`https://daytonleader.onrender.com/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') return <Navigate to="/checkout" />;
  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.
          If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
};
