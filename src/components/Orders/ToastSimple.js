// components/ToastSimple.jsx
import React, { useEffect } from 'react';
import './Toast.css';

const SimpleToast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    // Asegurarnos de que message sea string
    const displayMessage = typeof message === 'string'
        ? message
        : JSON.stringify(message);

    return (
        <div className={`simple-toast ${type}`}>
            <span>{displayMessage}</span>
            <button onClick={onClose}>×</button>
        </div>
    );
};

export default SimpleToast;