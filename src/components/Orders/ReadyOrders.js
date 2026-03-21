// components/Orders/ReadyOrders.jsx
import React, {useState, useEffect} from 'react';
import {FaBox, FaCalendarAlt, FaDollarSign, FaTruck, FaTag, FaSpinner, FaExternalLinkAlt} from 'react-icons/fa';
import {ENV} from '../../conf/env';
import {useAuthStore} from '../../store/auth.store';
import './ReadyOrders.css';

const ReadyOrders = () => {
    const {user} = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${ENV.API_URL}/order/order_ready/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError('Could not load your orders');
        } finally {
            setLoading(false);
        }
    };

    const getCarrierTrackingUrl = (carrier, trackingNumber) => {
        if (!trackingNumber) return null;
        const carrierMap = {
            'usps': `https://tools.usps.com/go/TrackConfirmAction.action?tLabels=${trackingNumber}`,
            'fedex': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
            'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
            'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
        };
        const key = carrier?.toLowerCase() || '';
        return carrierMap[key] || `https://www.google.com/search?q=${carrier}+tracking+${trackingNumber}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="ready-orders-container">
                <div className="loading-spinner">
                    <FaSpinner className="spinner-icon"/>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ready-orders-container">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={fetchOrders} className="retry-btn">Try Again</button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="ready-orders-container">
                <div className="empty-orders">
                    <FaBox className="empty-icon"/>
                    <p>You have no completed orders yet.</p>
                    <p className="empty-sub">Start shopping to see your orders here!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ready-orders-container">
            <h2 className="ready-orders-title">My Orders</h2>
            <div className="orders-grid">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-card-header">
                            <span className="order-id">Order #{order.id}</span>
                            <span className="order-date">
                                <FaCalendarAlt/> {formatDate(order.date)}
                            </span>
                        </div>
                        <div className="order-card-body">
                            <div className="order-product">
                                <FaTag className="product-icon"/>
                                <span className="product-name">{order.type || 'Custom Product'}</span>
                            </div>
                            <div className="order-details">
                                {order.size && order.size !== '-' && (
                                    <div className="detail-item">Size: {order.size}</div>
                                )}
                                {order.color && order.color !== '-' && (
                                    <div className="detail-item">Color: {order.color}</div>
                                )}
                                <div className="detail-item">Qty: {order.qantity || 1}</div>
                                {order.specification && order.specification !== '-' && (
                                    <div className="detail-item-specs">{order.specification}</div>
                                )}
                            </div>
                            <div className="order-price">
                                <FaDollarSign/> {order.price ? order.price.toFixed(2) : '0.00'}
                            </div>
                        </div>
                        <div className="order-card-footer">
                            {order.tracking_number ? (
                                <div className="shipping-info">
                                    <FaTruck className="shipping-icon"/>
                                    <div className="shipping-details">
                                        <p>
                                            <strong>{order.shipping_carrier || 'Carrier'}</strong> – {order.shipping_method || 'Standard'}
                                        </p>
                                        <p>
                                            Tracking number:&nbsp;
                                            <a
                                                href={getCarrierTrackingUrl(order.shipping_carrier, order.tracking_number)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="tracking-link"
                                            >
                                                {order.tracking_number} <FaExternalLinkAlt/>
                                            </a>
                                        </p>
                                        <p>Shipping cost:
                                            ${order.shipping_cost ? order.shipping_cost.toFixed(2) : '0.00'}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-shipping">
                                    <FaTruck/> No shipping required (digital product or pending)
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReadyOrders;