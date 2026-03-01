import React, { useState, useEffect } from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import SimpleToast from '../Orders/ToastSimple';
import ProductModal from './ProductModal';
import { get_products_all, deleteProduct, activateProduct, createProduct } from "../../hooks/get_products";
import './tablestyle.css';

const ListProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await get_products_all();
            setProducts(Array.isArray(response) ? response : response?.data || []);
            setLoading(false);
        } catch (err) {
            setToast({ message: 'Error loading products', type: 'error' });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDeactivate = async (product) => {
        setUpdatingId(product.id);

        try {
            const result = await deleteProduct(product.id);

            if (result?.success) {
                setProducts(products.map(p =>
                    p.id === product.id ? { ...p, enable: false } : p
                ));
                setToast({
                    message: 'Product deactivated successfully',
                    type: 'success'
                });
            } else {
                setToast({ message: result?.error || 'Deactivation failed', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error deactivating product', type: 'error' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleActivate = async (product) => {
        setUpdatingId(product.id);

        try {
            const result = await activateProduct(product.id);

            if (result?.success) {
                setProducts(products.map(p =>
                    p.id === product.id ? { ...p, enable: true } : p
                ));
                setToast({
                    message: 'Product activated successfully',
                    type: 'success'
                });
            } else {
                setToast({ message: result?.error || 'Activation failed', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error activating product', type: 'error' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCreateProduct = async (formData) => {
        try {
            const result = await createProduct(formData);

            if (result?.success) {
                await fetchProducts(); // Recargar productos
                setToast({
                    message: 'Product created successfully',
                    type: 'success'
                });
                setShowModal(false);
            } else {
                setToast({
                    message: result?.error || 'Creation failed',
                    type: 'error'
                });
            }
        } catch (err) {
            setToast({ message: 'Error creating product', type: 'error' });
        }
    };

    if (loading) {
        return (
            <>
                <TopBar/><Navbar/>
                <div className="product-table-container text-center">Loading...</div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <TopBar/><Navbar/>
            <div className="product-table-container">
                <div className="table-header">
                    <h2 className="table-title">Product List</h2>
                    <button
                        className="create-btn"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="fa fa-plus"></i>
                        Create Product
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="text-center">
                        <p>No products available</p>
                        <button
                            className="create-btn-empty"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="fa fa-plus"></i>
                            Create your first product
                        </button>
                    </div>
                ) : (
                    <table className="product-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.nombre}</td>
                                <td>${product.price}</td>
                                <td>
                                        <span className={`status-badge ${product.enable ? 'active' : 'inactive'}`}>
                                            {product.enable ? 'Active' : 'Inactive'}
                                        </span>
                                </td>
                                <td>
                                    {product.enable ? (
                                        <button
                                            className="deactivate-btn"
                                            onClick={() => handleDeactivate(product)}
                                            disabled={updatingId === product.id}
                                        >
                                            {updatingId === product.id ? '...' : 'Deactivate'}
                                        </button>
                                    ) : (
                                        <button
                                            className="activate-btn"
                                            onClick={() => handleActivate(product)}
                                            disabled={updatingId === product.id}
                                        >
                                            {updatingId === product.id ? '...' : 'Activate'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Footer/>

            {/* Modal para crear producto */}
            {showModal && (
                <ProductModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateProduct}
                />
            )}

            {/* Toast notifications */}
            {toast && (
                <SimpleToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default ListProducts;