// components/Payment/StripePaymentForm.jsx
import React, {useState} from 'react';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {FaCreditCard, FaLock, FaSpinner, FaCheckCircle, FaTimes} from 'react-icons/fa';
import {ENV} from '../../conf/env';
import {useAuthStore} from '../../store/auth.store';
import './StripePaymentForm.css';

const StripePaymentForm = ({order, onSuccess, onClose}) => {
    const stripe = useStripe();
    const elements = useElements();
    const {user} = useAuthStore();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setError('Payment system not initialized');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Crear el token de tarjeta
            const cardElement = elements.getElement(CardElement);

            const {error: stripeError, token} = await stripe.createToken(cardElement, {
                name: user?.name || user?.username,
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            // 2. Enviar al backend
            const formData = new FormData();
            formData.append('client_id', user.id.toString());
            formData.append('order_id', order.id.toString());
            formData.append('token', token.id);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(`${ENV.API_URL}/stripe/payment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData,
                signal: controller.signal
            }).catch(err => {
                if (err.name === 'AbortError') {
                    throw new Error('Request timeout - please try again');
                }
                throw err;
            });

            clearTimeout(timeoutId);

            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(responseData.detail || `Error ${response.status}`);
            }

            setSuccess(true);
            setTimeout(() => onSuccess?.(), 2000);

        } catch (err) {
            console.error('Payment error:', err);


            let errorMessage = err.message || 'Payment failed';

            // Limpiar mensajes técnicos si llegaran
            if (errorMessage.includes('Request req_')) {
                // Extraer solo la parte relevante después del código
                const match = errorMessage.match(/:(.+)/);
                errorMessage = match ? match[1].trim() : 'Card error';
            }

            // Quitar prefijos técnicos
            errorMessage = errorMessage.replace(/^Error:\s*/i, '');
            errorMessage = errorMessage.replace(/^Stripe error:\s*/i, '');

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#fff',
                '::placeholder': {
                    color: '#aab7c4',
                },
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            invalid: {
                color: '#ff6b6b',
                iconColor: '#ff6b6b',
            },
        },
        hidePostalCode: true,
    };

    return (
        <div className="stripe-payment-modal">
            <div className="stripe-payment-content">
                <div className="stripe-payment-header">
                    <h3>
                        <FaCreditCard/> Complete Payment
                    </h3>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes/>
                    </button>
                </div>

                {success ? (
                    <div className="payment-success">
                        <FaCheckCircle className="success-icon"/>
                        <h4>Payment Successful!</h4>
                        <p>Your order has been confirmed.</p>
                    </div>
                ) : (
                    <>
                        <div className="order-summary">
                            <h4>Order Summary</h4>
                            <div className="summary-item">
                                <span>Order #{order.id}</span>
                                <span className="order-type">{order.type}</span>
                            </div>
                            {order.size && order.size !== '-' && (
                                <div className="summary-item">
                                    <span>Size:</span>
                                    <span>{order.size}</span>
                                </div>
                            )}
                            {order.color && order.color !== '-' && (
                                <div className="summary-item">
                                    <span>Color:</span>
                                    <span>{order.color}</span>
                                </div>
                            )}
                            <div className="summary-item">
                                <span>Quantity:</span>
                                <span>{order.qantity || 1}</span>
                            </div>
                            <div className="summary-total">
                                <span>Total:</span>
                                <span className="total-amount">${(order.price || 0).toFixed(2)}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="payment-form">
                            <div className="form-group">
                                <label>Card Details</label>
                                <div className="card-element-container">
                                    <CardElement options={cardElementOptions}/>
                                </div>
                            </div>

                            {error && (
                                <div className="payment-error">
                                    <span>⚠️ {error}</span>
                                </div>
                            )}

                            <div className="payment-footer">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="pay-btn"
                                    disabled={!stripe || loading}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="spinner"/> Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaLock/> Pay ${(order.price || 0).toFixed(2)}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default StripePaymentForm;