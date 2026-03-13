import React, {useState, useEffect} from 'react';
import {
    FaShoppingCart, FaTimes, FaBox, FaCalendarAlt, FaDollarSign,
    FaSpinner, FaUser, FaSignOutAlt, FaTrash, FaCreditCard, FaExclamationTriangle
} from 'react-icons/fa';
import {ENV} from '../../conf/env';
import {useAuthStore} from '../../store/auth.store';
import {Link, useNavigate} from 'react-router-dom';
import StripePaymentForm from "../Stripe/StripePaymentForm";

const TopBar = () => {

    const {user, clearAuth} = useAuthStore();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [showCartModal, setShowCartModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deletingOrderId, setDeletingOrderId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);


    // Estados para el mensaje de confirmación
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    // Función para obtener las órdenes del usuario
    const fetchUserOrders = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${ENV.API_URL}/order/order_by_user/${user.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error fetching orders');
            }

            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
            setCartCount(Array.isArray(data) ? data.length : 0);

        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Could not load your orders');
        } finally {
            setLoading(false);
        }
    };

    // Función para abrir el modal del carrito y cargar órdenes
    const handleOpenCart = () => {
        setShowCartModal(true);
        if (user) {
            fetchUserOrders();
        }
    };

    // Función para mostrar el diálogo de confirmación
    const confirmDeleteOrder = (orderId) => {
        setOrderToDelete(orderId);
        setShowConfirmDialog(true);
    };

    // Función para eliminar una orden (después de confirmación)
    const handleDeleteOrder = async () => {
        if (!orderToDelete) return;

        setDeletingOrderId(orderToDelete);
        setShowConfirmDialog(false);

        try {
            const response = await fetch(`${ENV.API_URL}/order/delete/${orderToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error deleting order');
            }

            // Actualizar la lista local
            const updatedOrders = orders.filter(order => order.id !== orderToDelete);
            setOrders(updatedOrders);
            setCartCount(updatedOrders.length);

            // Mostrar mensaje de éxito
            setSuccessMessage('Item removed from cart');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

        } catch (error) {
            console.error('Error deleting order:', error);
            setError('Could not delete item');
        } finally {
            setDeletingOrderId(null);
            setOrderToDelete(null);
        }
    };

    // Cancelar eliminación
    const cancelDelete = () => {
        setShowConfirmDialog(false);
        setOrderToDelete(null);
    };

    // Función para pagar una orden
    const handlePayOrder = (order) => {
        setSelectedOrder(order);
        setShowPaymentModal(true);
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        clearAuth();
        setShowUserMenu(false);
        setShowCartModal(false);
        navigate('/');
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Obtener tipo de producto amigable
    const getProductType = (order) => {
        if (order.variation && order.variation !== '-') {
            return order.variation;
        }
        if (order.type && order.type !== '-') {
            return order.type;
        }
        return 'Custom Product';
    };

    // Obtener color del estado (state = false significa pendiente de pago)
    const getStatusColor = () => '#ff9800';
    const getStatusText = () => 'Pending Payment';

    // Cerrar menús cuando se hace clic fuera (solo para el menú de usuario)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.user-menu-container')) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className="top-bar">
                <div className="container-fluid">
                    <div className="row align-items-center py-3 px-xl-5">
                        <div className="col-lg-4 d-none d-lg-block">
                            <h1 className="brand-title">
                                Golden Sunset Made by Josh
                            </h1>
                        </div>
                        <div className="col-lg-8 col-12">
                            <div className="header-actions">
                                {/* Información del usuario con menú desplegable */}
                                {user && (
                                    <div className="user-menu-container">
                                        <button
                                            className="user-menu-button"
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                        >
                                            <FaUser className="user-icon"/>
                                            <span className="user-name">{user.name || user.username}</span>
                                        </button>

                                        {/* Menú desplegable del usuario */}
                                        {showUserMenu && (
                                            <div className="user-dropdown">
                                                <div className="user-dropdown-menu">
                                                    <button className="dropdown-item logout" onClick={handleLogout}>
                                                        <FaSignOutAlt/> Logout
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Carrito - SOLO visible para usuarios autenticados */}
                                {user && (
                                    <div className="cart-container">
                                        <button
                                            className="cart-button"
                                            onClick={handleOpenCart}
                                        >
                                            <FaShoppingCart className="cart-icon"/>
                                            <span className="cart-count">{cartCount}</span>
                                            <span className="cart-text">Cart</span>
                                        </button>
                                    </div>
                                )}

                                {!user && (
                                    <div className="auth-buttons">
                                        <Link to="/login" className="auth-btn login-btn">Login</Link>
                                        <Link to="/register" className="auth-btn register-btn">Register</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DEL CARRITO */}
            {showCartModal && (
                <div className="cart-modal-overlay" onClick={() => setShowCartModal(false)}>
                    <div className="cart-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="cart-modal-header">
                            <h3>Your Cart ({cartCount})</h3>
                            <button
                                className="cart-modal-close"
                                onClick={() => setShowCartModal(false)}
                            >
                                <FaTimes/>
                            </button>
                        </div>

                        {/* Mensaje de éxito */}
                        {showSuccess && (
                            <div className="cart-modal-success">
                                {successMessage}
                            </div>
                        )}

                        <div className="cart-modal-body">
                            {loading ? (
                                <div className="cart-modal-loading">
                                    <FaSpinner className="spinner-icon"/>
                                    <p>Loading your cart...</p>
                                </div>
                            ) : error ? (
                                <div className="cart-modal-error">
                                    <p>{error}</p>
                                    <button onClick={fetchUserOrders} className="retry-btn">
                                        Try Again
                                    </button>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="cart-modal-empty">
                                    <FaBox className="empty-icon"/>
                                    <p>Your cart is empty</p>
                                    <p className="empty-sub">Start shopping to add items!</p>
                                    <button
                                        className="continue-shopping-btn"
                                        onClick={() => setShowCartModal(false)}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="cart-modal-items">
                                    {orders.map(order => (
                                        <div key={order.id} className="cart-modal-item">
                                            <div className="cart-item-header">
                                                <span className="cart-item-status" style={{
                                                    backgroundColor: getStatusColor(),
                                                    color: 'white'
                                                }}>
                                                    {getStatusText()}
                                                </span>
                                                <span className="cart-item-price">
                                                    ${order.price || '0.00'}
                                                </span>
                                            </div>

                                            <div className="cart-item-body">
                                                <div className="cart-item-product">
                                                    <FaBox className="item-icon"/>
                                                    <span>{order.type}</span>
                                                </div>

                                                <div className="cart-item-details">
                                                    <div className="cart-item-detail">
                                                        <FaCalendarAlt className="detail-icon"/>
                                                        <span>{formatDate(order.date)}</span>
                                                    </div>
                                                    {order.size && order.size !== '-' && (
                                                        <div className="cart-item-detail">
                                                            <span className="item-badge">Size: {order.size}</span>
                                                        </div>
                                                    )}
                                                    {order.color && order.color !== '-' && (
                                                        <div className="cart-item-detail">
                                                            <span className="item-badge">Color: {order.color}</span>
                                                        </div>
                                                    )}
                                                    <div className="cart-item-detail">
                                                        <span className="item-badge">Qty: {order.qantity || 1}</span>
                                                    </div>
                                                </div>

                                                {order.specification && order.specification !== '-' && (
                                                    <div className="cart-item-specs">
                                                        <small>{order.specification}</small>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="cart-item-footer">
                                                <button
                                                    className="cart-item-pay"
                                                    onClick={() => {
                                                        setShowCartModal(false);
                                                        handlePayOrder(order);
                                                    }}
                                                    disabled={deletingOrderId === order.id}
                                                >
                                                    <FaCreditCard/> Pay
                                                </button>
                                                <button
                                                    className="cart-item-delete"
                                                    onClick={() => confirmDeleteOrder(order.id)}
                                                    disabled={deletingOrderId === order.id}
                                                >
                                                    {deletingOrderId === order.id ? (
                                                        <FaSpinner className="spinner-icon-small"/>
                                                    ) : (
                                                        <>
                                                            <FaTrash/> Remove
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Diálogo de confirmación personalizado */}
            {showConfirmDialog && (
                <div className="confirm-dialog-overlay">
                    <div className="confirm-dialog">
                        <div className="confirm-dialog-icon">
                            <FaExclamationTriangle/>
                        </div>
                        <h3>Remove Item</h3>
                        <p>Are you sure you want to remove this item from your cart?</p>
                        <div className="confirm-dialog-actions">
                            <button className="confirm-cancel-btn" onClick={cancelDelete}>
                                Cancel
                            </button>
                            <button className="confirm-delete-btn" onClick={handleDeleteOrder}>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPaymentModal && selectedOrder && (
                <StripePaymentForm
                    order={selectedOrder}
                    onSuccess={() => {
                        setShowPaymentModal(false);
                        setSelectedOrder(null);
                        fetchUserOrders(); // Recargar órdenes
                        setSuccessMessage('Payment completed successfully!');
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 3000);
                    }}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}

            {/* Estilos CSS adicionales */}
            <style>{`
                /* Estilos existentes se mantienen igual */
                ${'' /* Aquí van todos los estilos que ya tenías */}
                .order-price {
                    font-weight: 600;
                    color: #CD7F32;
                    font-size: 14px;
                }

                .order-item-footer {
                    display: flex;
                    gap: 8px;
                    margin-top: 10px;
                }

                .pay-order-btn, .delete-order-btn {
                    flex: 1;
                    padding: 8px 12px;
                    border: none;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    transition: all 0.3s ease;
                }

                .pay-order-btn {
                    background: linear-gradient(135deg, #4caf50, #45a049);
                    color: white;
                }

                .pay-order-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                }

                .delete-order-btn {
                    background: rgba(255, 107, 107, 0.1);
                    border: 1px solid #ff6b6b;
                    color: #ff6b6b;
                }

                .delete-order-btn:hover:not(:disabled) {
                    background: #ff6b6b;
                    color: white;
                    transform: translateY(-2px);
                }

                .pay-order-btn:disabled, .delete-order-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .spinner-icon-small {
                    animation: spin 1s linear infinite;
                }

                .success-message {
                    background: linear-gradient(135deg, #4caf50, #45a049);
                    color: white;
                    padding: 10px 15px;
                    margin: 10px;
                    border-radius: 8px;
                    font-size: 13px;
                    text-align: center;
                    animation: slideDown 0.3s ease;
                }

                /* Diálogo de confirmación */
                .confirm-dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.2s ease;
                }

                .confirm-dialog {
                    background: linear-gradient(135deg, #1a1f2e, #0f1422);
                    border-radius: 16px;
                    padding: 25px;
                    width: 90%;
                    max-width: 350px;
                    text-align: center;
                    border: 1px solid rgba(205, 127, 50, 0.3);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                    animation: scaleIn 0.2s ease;
                }

                .confirm-dialog-icon {
                    font-size: 48px;
                    color: #ff6b6b;
                    margin-bottom: 15px;
                }

                .confirm-dialog h3 {
                    color: #fff;
                    margin: 0 0 10px 0;
                    font-size: 18px;
                }

                .confirm-dialog p {
                    color: #aaa;
                    margin: 0 0 20px 0;
                    font-size: 14px;
                }

                .confirm-dialog-actions {
                    display: flex;
                    gap: 10px;
                }

                .confirm-cancel-btn, .confirm-delete-btn {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .confirm-cancel-btn {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .confirm-cancel-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .confirm-delete-btn {
                    background: linear-gradient(135deg, #ff6b6b, #ff4757);
                    color: white;
                }

                .confirm-delete-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 480px) {
                    .order-item-footer {
                        flex-direction: column;
                    }
                    
                    .confirm-dialog {
                        width: 85%;
                        padding: 20px;
                    }
                    
                }
                .top-bar {
                    background: linear-gradient(135deg, #0a0f1e 0%, #1a1f2e 100%);
                    border-bottom: 1px solid rgba(205, 127, 50, 0.2);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }

                .brand-title {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #CD7F32, #DAA520);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    display: inline-block;
                    letter-spacing: 1px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    animation: goldPulse 3s infinite;
                }

                @keyframes goldPulse {
                    0%, 100% {
                        opacity: 1;
                        text-shadow: 0 2px 4px rgba(205, 127, 50, 0.3);
                    }
                    50% {
                        opacity: 0.95;
                        text-shadow: 0 2px 8px rgba(218, 165, 32, 0.6);
                    }
                }

                .header-actions {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 20px;
                }

                /* Menú de usuario */
                .user-menu-container {
                    position: relative;
                }

                .user-menu-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 15px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(205, 127, 50, 0.2);
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .user-menu-button:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: #CD7F32;
                }

                .user-icon {
                    color: #CD7F32;
                    font-size: 14px;
                }

                .user-name {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 500;
                }

                /* Dropdown de usuario */
                .user-dropdown {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: 0;
                    width: 280px;
                    background: linear-gradient(135deg, #1a1f2e, #0f1422);
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(205, 127, 50, 0.2);
                    overflow: hidden;
                    z-index: 1001;
                    animation: slideDown 0.3s ease;
                }

                .user-dropdown-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 15px;
                    background: rgba(205, 127, 50, 0.1);
                    border-bottom: 1px solid rgba(205, 127, 50, 0.2);
                }

                .dropdown-user-icon {
                    font-size: 24px;
                    color: #CD7F32;
                }

                .dropdown-user-info {
                    flex: 1;
                }

                .dropdown-user-info strong {
                    display: block;
                    color: #fff;
                    font-size: 14px;
                    margin-bottom: 2px;
                }

                .dropdown-user-info small {
                    color: #aaa;
                    font-size: 11px;
                }

                .user-dropdown-menu {
                    padding: 8px;
                }

                .dropdown-item {
                    width: 100%;
                    padding: 10px 15px;
                    background: none;
                    border: none;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 14px;
                    text-align: left;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.2s;
                }

                .dropdown-item:hover {
                    background: rgba(205, 127, 50, 0.1);
                    color: #CD7F32;
                }

                .dropdown-item.logout:hover {
                    background: rgba(255, 107, 107, 0.1);
                    color: #ff6b6b;
                }

                .dropdown-divider {
                    height: 1px;
                    background: rgba(205, 127, 50, 0.2);
                    margin: 8px 0;
                }

                /* Botones de autenticación */
                .auth-buttons {
                    display: flex;
                    gap: 10px;
                }

                .auth-btn {
                    padding: 8px 20px;
                    border-radius: 30px;
                    font-size: 14px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .login-btn {
                    background: transparent;
                    border: 1px solid #CD7F32;
                    color: #CD7F32;
                }

                .login-btn:hover {
                    background: #CD7F32;
                    color: #0a0f1e;
                    transform: translateY(-2px);
                }

                .register-btn {
                    background: linear-gradient(135deg, #CD7F32, #DAA520);
                    border: 1px solid #CD7F32;
                    color: #0a0f1e;
                }

                .register-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(205, 127, 50, 0.3);
                }

                .cart-container {
                    display: flex;
                    justify-content: flex-end;
                    position: relative;
                }

                .cart-button {
                    background: linear-gradient(135deg, #2a2f3e, #1a1f2e);
                    border: 1px solid #CD7F32;
                    border-radius: 40px;
                    padding: 12px 30px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .cart-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(205, 127, 50, 0.3);
                    border-color: #DAA520;
                }

                .cart-icon {
                    color: #CD7F32;
                    font-size: 20px;
                }

                .cart-count {
                    background: linear-gradient(135deg, #CD7F32, #DAA520);
                    color: #0a0f1e;
                    font-weight: bold;
                    font-size: 14px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }

                .cart-text {
                    color: #fff;
                    font-weight: 600;
                    font-size: 16px;
                }

                .orders-panel {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: 0;
                    width: 420px;
                    background: linear-gradient(135deg, #1a1f2e, #0f1422);
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(205, 127, 50, 0.2);
                    overflow: hidden;
                    z-index: 1000;
                    animation: slideDown 0.3s ease;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .orders-header {
                    background: linear-gradient(135deg, #2a2f3e, #1a1f2e);
                    padding: 15px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(205, 127, 50, 0.2);
                }

                .orders-header h3 {
                    margin: 0;
                    color: #CD7F32;
                    font-size: 18px;
                    font-weight: 600;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 18px;
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #CD7F32;
                }

                .orders-list {
                    max-height: 450px;
                    overflow-y: auto;
                    padding: 10px;
                }

                .orders-list::-webkit-scrollbar {
                    width: 6px;
                }

                .orders-list::-webkit-scrollbar-track {
                    background: #1a1f2e;
                }

                .orders-list::-webkit-scrollbar-thumb {
                    background: #CD7F32;
                    border-radius: 3px;
                }

                .order-item {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(205, 127, 50, 0.1);
                    border-radius: 12px;
                    padding: 15px;
                    margin-bottom: 10px;
                    transition: all 0.3s;
                }

                .order-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(205, 127, 50, 0.3);
                    transform: translateX(5px);
                }

                .order-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .order-id {
                    font-weight: 600;
                    color: #CD7F32;
                    font-size: 14px;
                }

                .order-status {
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .order-item-body {
                    margin-bottom: 10px;
                }

                .order-product {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #fff;
                    font-size: 14px;
                    margin-bottom: 8px;
                }

                .order-icon {
                    color: #CD7F32;
                    font-size: 14px;
                }

                .order-details {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    color: #aaa;
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .order-detail {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .detail-icon {
                    color: #CD7F32;
                    font-size: 11px;
                }

                .order-badge {
                    background: rgba(205, 127, 50, 0.1);
                    padding: 2px 8px;
                    border-radius: 12px;
                    color: #CD7F32;
                    font-size: 11px;
                }

                .order-items {
                    background: rgba(205, 127, 50, 0.1);
                    padding: 2px 8px;
                    border-radius: 12px;
                    color: #CD7F32;
                }

                .order-specs {
                    margin-top: 5px;
                    padding: 5px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 6px;
                    color: #aaa;
                    font-size: 11px;
                    font-style: italic;
                }

                .no-orders {
                    text-align: center;
                    padding: 40px 20px;
                    color: #666;
                }

                .no-orders-icon {
                    font-size: 40px;
                    color: #333;
                    margin-bottom: 10px;
                }

                .no-orders-sub {
                    font-size: 12px;
                    color: #888;
                    margin-top: 5px;
                }

                .no-orders p {
                    margin: 0;
                    font-size: 14px;
                }

                .loading-orders {
                    text-align: center;
                    padding: 40px 20px;
                    color: #CD7F32;
                }

                .spinner-icon {
                    font-size: 30px;
                    margin-bottom: 10px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .error-orders {
                    text-align: center;
                    padding: 30px 20px;
                    color: #ff6b6b;
                }

                .retry-btn {
                    margin-top: 10px;
                    padding: 8px 20px;
                    background: #CD7F32;
                    border: none;
                    color: white;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s;
                }

                .retry-btn:hover {
                    background: #DAA520;
                    transform: translateY(-2px);
                }

                .orders-footer {
                    padding: 15px 20px;
                    border-top: 1px solid rgba(205, 127, 50, 0.2);
                    text-align: center;
                }

                .checkout-btn {
                    background: linear-gradient(135deg, #CD7F32, #DAA520);
                    border: none;
                    color: #0a0f1e;
                    padding: 12px 25px;
                    border-radius: 25px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s;
                    width: 100%;
                }

                .checkout-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(205, 127, 50, 0.3);
                }

                @media (max-width: 768px) {
                    .brand-title {
                        font-size: 20px;
                        text-align: center;
                        margin-bottom: 10px;
                    }

                    .header-actions {
                        flex-direction: column;
                        gap: 10px;
                    }

                    .cart-container {
                        justify-content: center;
                    }

                    .orders-panel {
                        width: 350px;
                        right: 50%;
                        transform: translateX(50%);
                    }

                    .cart-button {
                        padding: 8px 20px;
                    }

                    .cart-text {
                        display: none;
                    }

                    .auth-buttons {
                        width: 100%;
                        justify-content: center;
                    }

                    .user-dropdown {
                        width: 250px;
                    }
                }

                @media (max-width: 480px) {
                    .orders-panel {
                        width: 300px;
                    }

                    .order-details {
                        flex-direction: column;
                        gap: 5px;
                    }

                    .user-dropdown {
                        width: 220px;
                    }

                    .order-item-footer {
                        flex-direction: column;
                    }}
                /* NUEVOS ESTILOS PARA EL MODAL DEL CARRITO */
                .cart-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }

                .cart-modal-content {
                    background: linear-gradient(135deg, #1a1f2e, #0f1422);
                    border-radius: 20px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow: hidden;
                    border: 1px solid rgba(205, 127, 50, 0.3);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                    animation: slideUp 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }

                .cart-modal-header {
                    background: linear-gradient(135deg, #2a2f3e, #1a1f2e);
                    padding: 20px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(205, 127, 50, 0.2);
                }

                .cart-modal-header h3 {
                    margin: 0;
                    color: #CD7F32;
                    font-size: 20px;
                    font-weight: 600;
                }

                .cart-modal-close {
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 20px;
                    cursor: pointer;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }

                .cart-modal-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #CD7F32;
                }

                .cart-modal-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }

                .cart-modal-body::-webkit-scrollbar {
                    width: 6px;
                }

                .cart-modal-body::-webkit-scrollbar-track {
                    background: #1a1f2e;
                }

                .cart-modal-body::-webkit-scrollbar-thumb {
                    background: #CD7F32;
                    border-radius: 3px;
                }

                .cart-modal-success {
                    background: linear-gradient(135deg, #4caf50, #45a049);
                    color: white;
                    padding: 10px 15px;
                    margin: 0 20px 15px 20px;
                    border-radius: 8px;
                    font-size: 13px;
                    text-align: center;
                    animation: slideDown 0.3s ease;
                }

                .cart-modal-loading {
                    text-align: center;
                    padding: 40px 20px;
                    color: #CD7F32;
                }

                .cart-modal-error {
                    text-align: center;
                    padding: 30px 20px;
                    color: #ff6b6b;
                }

                .cart-modal-empty {
                    text-align: center;
                    padding: 40px 20px;
                    color: #666;
                }

                .empty-icon {
                    font-size: 60px;
                    color: #333;
                    margin-bottom: 15px;
                }

                .empty-sub {
                    font-size: 12px;
                    color: #888;
                    margin-top: 5px;
                    margin-bottom: 20px;
                }

                .continue-shopping-btn {
                    background: linear-gradient(135deg, #CD7F32, #DAA520);
                    border: none;
                    color: #0a0f1e;
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .continue-shopping-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(205, 127, 50, 0.3);
                }

                .cart-modal-items {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .cart-modal-item {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(205, 127, 50, 0.1);
                    border-radius: 12px;
                    padding: 15px;
                    transition: all 0.3s;
                }

                .cart-modal-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(205, 127, 50, 0.3);
                }

                .cart-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .cart-item-status {
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .cart-item-price {
                    font-weight: 600;
                    color: #CD7F32;
                    font-size: 14px;
                }

                .cart-item-body {
                    margin-bottom: 10px;
                }

                .cart-item-product {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #fff;
                    font-size: 14px;
                    margin-bottom: 8px;
                }

                .item-icon {
                    color: #CD7F32;
                    font-size: 14px;
                }

                .cart-item-details {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    color: #aaa;
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .cart-item-detail {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .item-badge {
                    background: rgba(205, 127, 50, 0.1);
                    padding: 2px 8px;
                    border-radius: 12px;
                    color: #CD7F32;
                    font-size: 11px;
                }

                .cart-item-specs {
                    margin-top: 5px;
                    padding: 5px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 6px;
                    color: #aaa;
                    font-size: 11px;
                    font-style: italic;
                }

                .cart-item-footer {
                    display: flex;
                    gap: 8px;
                    margin-top: 10px;
                }

                .cart-item-pay, .cart-item-delete {
                    flex: 1;
                    padding: 8px 12px;
                    border: none;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    transition: all 0.3s ease;
                }

                .cart-item-pay {
                    background: linear-gradient(135deg, #4caf50, #45a049);
                    color: white;
                }

                .cart-item-pay:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                }

                .cart-item-delete {
                    background: rgba(255, 107, 107, 0.1);
                    border: 1px solid #ff6b6b;
                    color: #ff6b6b;
                }

                .cart-item-delete:hover:not(:disabled) {
                    background: #ff6b6b;
                    color: white;
                    transform: translateY(-2px);
                }

                .cart-item-pay:disabled, .cart-item-delete:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                @media (max-width: 480px) {
                    .cart-modal-content {
                        width: 95%;
                        max-height: 90vh;
                    }

                    .cart-item-footer {
                        flex-direction: column;
                    }

                    .cart-item-details {
                        flex-direction: column;
                        gap: 5px;
                    }
                }
            `}</style>
        </>
    );
};

export default TopBar;