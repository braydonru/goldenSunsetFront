import React, {useState, useEffect} from 'react';
import {
    FaShoppingCart, FaTimes, FaBox, FaCalendarAlt, FaDollarSign,
    FaSpinner, FaUser, FaSignOutAlt, FaTrash, FaCreditCard, FaExclamationTriangle, FaTruck
} from 'react-icons/fa';
import {ENV} from '../../conf/env';
import {useAuthStore} from '../../store/auth.store';
import {Link, useNavigate} from 'react-router-dom';
import StripePaymentForm from "../Stripe/StripePaymentForm";
import ShippingForm from "../Shippo/ShippingForm";
import './TopBar.css';

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

    // Estados para pagos
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Estados para envío
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [selectedShipping, setSelectedShipping] = useState(null);

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

    // Manejar pago con envío
    const handlePayOrder = (order) => {
        setSelectedOrder(order);
        setShowShippingModal(true);
    };

    // Cuando se selecciona el envío
    const handleShippingSelected = (shippingData) => {
        setSelectedShipping(shippingData);
        setShowShippingModal(false);

        const orderWithShipping = {
            ...selectedOrder,
            price: selectedOrder.price + shippingData.amount,
            shipping: shippingData
        };

        setSelectedOrder(orderWithShipping);
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

    const getProductType = (order) => {
        if (order.variation && order.variation !== '-') {
            return order.variation;
        }
        if (order.type && order.type !== '-') {
            return order.type;
        }
        return 'Custom Product';
    };

    const getStatusColor = () => '#ff9800';
    const getStatusText = () => 'Pending Payment';

    // Cerrar menús cuando se hace clic fuera
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

                                {/* Carrito */}
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

            {/* MODAL DE ENVÍO */}
            {showShippingModal && selectedOrder && (
                <ShippingForm
                    order={selectedOrder}
                    onShippingSelected={handleShippingSelected}
                    onClose={() => {
                        setShowShippingModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}

            {/* Diálogo de confirmación */}
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

            {/* MODAL DE PAGO */}
            {showPaymentModal && selectedOrder && (
                <StripePaymentForm
                    order={selectedOrder}
                    shipping={selectedShipping}
                    onSuccess={async () => {
                        try {
                            // 1. Crear la etiqueta de envío en Shippo
                            if (selectedShipping && selectedShipping.rate_id) {
                                const labelResponse = await fetch(`${ENV.API_URL}/shipping/label`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                    },
                                    body: JSON.stringify({
                                        rate_id: selectedShipping.rate_id,
                                        order_id: selectedOrder.id
                                    })
                                });

                                if (!labelResponse.ok) {
                                    const errorData = await labelResponse.json();
                                    console.error('Error creating shipping label:', errorData);
                                    setSuccessMessage('Payment completed, but shipping label creation failed. Please contact support.');
                                    setShowSuccess(true);
                                    setTimeout(() => setShowSuccess(false), 5000);
                                } else {
                                    const labelData = await labelResponse.json();
                                    console.log('✅ Shipping label created:', labelData);
                                    setSuccessMessage('Payment completed successfully! Shipping label generated.');
                                    setShowSuccess(true);
                                    setTimeout(() => setShowSuccess(false), 5000);
                                }
                            } else {
                                // Sin envío, solo mostrar éxito de pago
                                setSuccessMessage('Payment completed successfully!');
                                setShowSuccess(true);
                                setTimeout(() => setShowSuccess(false), 3000);
                            }

                            // 2. Recargar órdenes para que el carrito se actualice (orden pagada desaparece)
                            await fetchUserOrders();
                        } catch (error) {
                            console.error('Error during post-payment process:', error);
                            setSuccessMessage('Payment succeeded but there was an issue finalizing your order. Please contact support.');
                            setShowSuccess(true);
                            setTimeout(() => setShowSuccess(false), 5000);
                        } finally {
                            setShowPaymentModal(false);
                            setSelectedOrder(null);
                            setSelectedShipping(null);
                        }
                    }}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedOrder(null);
                        setSelectedShipping(null);
                    }}
                />
            )}
        </>
    );
};

export default TopBar;