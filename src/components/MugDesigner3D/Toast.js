import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bg = type === 'success' ? '#2ecc71' : '#e74c3c';

    return (
        <div style={{
            position: 'fixed',
            top: 20,
            right: 20,
            background: bg,
            color: '#fff',
            padding: '14px 22px',
            borderRadius: 10,
            boxShadow: '0 10px 25px rgba(0,0,0,.2)',
            fontWeight: '600',
            zIndex: 9999,
            animation: 'slideIn .3s ease'
        }}>
            {message}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(120%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
