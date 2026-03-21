// components/Shipping/ShippingForm.jsx
import React, {useState} from 'react';
import {FaTruck, FaBox, FaSpinner, FaCheckCircle, FaExclamationTriangle} from 'react-icons/fa';
import {ENV} from '../../conf/env';
import './ShippingForm.css';

// Dimensiones de paquete estándar (puedes modificar según el producto)
const DEFAULT_PARCEL = {
    length: 10,
    width: 8,
    height: 2,
    weight: 1,
    distance_unit: 'in',
    mass_unit: 'lb'
};

const ShippingForm = ({order, onShippingSelected, onClose}) => {
    const [address, setAddress] = useState({
        name: '',
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [rates, setRates] = useState([]);
    const [selectedRate, setSelectedRate] = useState(null);
    const [step, setStep] = useState('address'); // address, rates, confirmation

    // Estados para mensajes
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const handleAddressChange = (e) => {
        setAddress({...address, [e.target.name]: e.target.value});
        if (error) setError('');
    };

    const validateAddress = () => {
        if (!address.name.trim()) return 'Name is required';
        if (!address.street1.trim()) return 'Street address is required';
        if (!address.city.trim()) return 'City is required';
        if (!address.state.trim()) return 'State is required';
        if (!address.zip.trim()) return 'ZIP code is required';
        if (!address.email.trim()) return 'Email is required';
        if (!address.email.includes('@')) return 'Invalid email format';
        return null;
    };

    const calculateRates = async (e) => {
        e.preventDefault();

        const addressError = validateAddress();
        if (addressError) {
            setError(addressError);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${ENV.API_URL}/shipping/rates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    to_address: address,
                    parcel: DEFAULT_PARCEL
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error calculating rates');
            }

            const data = await response.json();

            if (data.rates.length === 0) {
                setError('No shipping options available for this address');
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 3000);
            } else {
                setRates(data.rates);
                setStep('rates');
                setSuccess('Shipping rates calculated successfully!');
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 2000);
            }
        } catch (error) {
            console.error(error);
            setError(error.message || 'Error calculating rates');
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    const selectRate = (rate) => {
        setSelectedRate(rate);
        setStep('confirmation');
    };

    const confirmShipping = () => {
        onShippingSelected({
            ...selectedRate,
            address: address
        });
    };

    return (
        <div className="shipping-modal-overlay" onClick={onClose}>
            <div className="shipping-modal-content" onClick={e => e.stopPropagation()}>
                <div className="shipping-modal-header">
                    <h3><FaTruck/> Shipping Options</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {/* Mensajes elegantes */}
                {showMessage && error && (
                    <div className="shipping-message error">
                        <FaExclamationTriangle className="message-icon"/>
                        <span>{error}</span>
                    </div>
                )}

                {showMessage && success && !error && (
                    <div className="shipping-message success">
                        <FaCheckCircle className="message-icon"/>
                        <span>{success}</span>
                    </div>
                )}

                <div className="shipping-modal-body">
                    {step === 'address' && (
                        <>
                            <h4>Delivery Address</h4>
                            <form onSubmit={calculateRates}>
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={address.name}
                                        onChange={handleAddressChange}
                                        placeholder="John Doe"
                                        required
                                        className={error && !address.name ? 'error' : ''}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Street Address *</label>
                                    <input
                                        type="text"
                                        name="street1"
                                        value={address.street1}
                                        onChange={handleAddressChange}
                                        placeholder="123 Main St"
                                        required
                                        className={error && !address.street1 ? 'error' : ''}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Apt/Suite (optional)</label>
                                    <input
                                        type="text"
                                        name="street2"
                                        value={address.street2}
                                        onChange={handleAddressChange}
                                        placeholder="Apt 4B"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={address.city}
                                            onChange={handleAddressChange}
                                            placeholder="Miami"
                                            required
                                            className={error && !address.city ? 'error' : ''}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={address.state}
                                            onChange={handleAddressChange}
                                            placeholder="FL"
                                            required
                                            className={error && !address.state ? 'error' : ''}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>ZIP *</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            value={address.zip}
                                            onChange={handleAddressChange}
                                            placeholder="33101"
                                            required
                                            className={error && !address.zip ? 'error' : ''}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={address.email}
                                        onChange={handleAddressChange}
                                        placeholder="john@example.com"
                                        required
                                        className={error && (!address.email || !address.email.includes('@')) ? 'error' : ''}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone (optional)</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={address.phone}
                                        onChange={handleAddressChange}
                                        placeholder="305-555-0123"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="continue-btn"
                                    disabled={loading}
                                >
                                    {loading ? <FaSpinner className="spinner"/> : 'Calculate Shipping'}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 'rates' && (
                        <>
                            <h4>Select Shipping Method</h4>
                            <div className="rates-list">
                                {rates.map((rate, index) => (
                                    <div
                                        key={index}
                                        className={`rate-item ${selectedRate === rate ? 'selected' : ''}`}
                                        onClick={() => selectRate(rate)}
                                    >
                                        <div className="rate-provider">
                                            <strong>{rate.provider}</strong>
                                            <span className="rate-service">{rate.service}</span>
                                        </div>
                                        <div className="rate-details">
                                            <span className="rate-price">${rate.amount.toFixed(2)}</span>
                                            {rate.days && <span className="rate-days">{rate.days} days</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="action-buttons">
                                <button className="back-btn" onClick={() => setStep('address')}>
                                    Back
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'confirmation' && selectedRate && (
                        <>
                            <h4>Confirm Shipping</h4>
                            <div className="confirmation-details">
                                <p>
                                    <strong>Address:</strong> {address.street1}, {address.city}, {address.state} {address.zip}
                                </p>
                                <p><strong>Method:</strong> {selectedRate.provider} - {selectedRate.service}</p>
                                <p><strong>Cost:</strong> ${selectedRate.amount.toFixed(2)}</p>
                                <p><strong>Estimated
                                    Delivery:</strong> {selectedRate.days ? `${selectedRate.days} business days` : 'Varies'}
                                </p>
                            </div>
                            <div className="action-buttons">
                                <button className="back-btn" onClick={() => setStep('rates')}>
                                    Back
                                </button>
                                <button className="confirm-btn" onClick={confirmShipping}>
                                    Confirm & Continue to Payment
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShippingForm;