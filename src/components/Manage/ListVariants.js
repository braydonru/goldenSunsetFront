// ListVariants.jsx
import React, { useState, useEffect } from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import SimpleToast from '../Orders/ToastSimple';
import VariantModal from './VariantModal';
import { get_variants_all, enableVariant, disableVariant, createVariant } from "../../hooks/get_variants";
import { get_categories_all } from "../../hooks/get_category";
import { ENV } from '../../conf/env';
import './variantstyle.css';

const ListVariants = () => {
    const [variants, setVariants] = useState([]);
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchVariants = async () => {
        try {
            const response = await get_variants_all();
            setVariants(Array.isArray(response) ? response : response?.data || []);

            // Cargar categorías para mostrar nombres
            const catsResponse = await get_categories_all();
            const catsArray = Array.isArray(catsResponse) ? catsResponse : catsResponse?.data || [];
            const catsMap = {};
            catsArray.forEach(cat => {
                catsMap[cat.id] = cat.name;
            });
            setCategories(catsMap);

            setLoading(false);
        } catch (err) {
            setToast({ message: 'Error loading variants', type: 'error' });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVariants();
    }, []);

    const handleDisable = async (variant) => {
        setUpdatingId(variant.id);

        try {
            const result = await disableVariant(variant.id);

            if (result?.success) {
                setVariants(variants.map(v =>
                    v.id === variant.id ? { ...v, enable: false } : v
                ));
                setToast({
                    message: 'Variant deactivated successfully',
                    type: 'success'
                });
            } else {
                setToast({ message: result?.error || 'Deactivation failed', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error deactivating variant', type: 'error' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleEnable = async (variant) => {
        setUpdatingId(variant.id);

        try {
            const result = await enableVariant(variant.id);

            if (result?.success) {
                setVariants(variants.map(v =>
                    v.id === variant.id ? { ...v, enable: true } : v
                ));
                setToast({
                    message: 'Variant activated successfully',
                    type: 'success'
                });
            } else {
                setToast({ message: result?.error || 'Activation failed', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error activating variant', type: 'error' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCreateVariant = async (formData) => {
        try {
            const result = await createVariant(formData);

            if (result?.success) {
                await fetchVariants(); // Recargar variantes
                setToast({
                    message: 'Variant created successfully',
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
            setToast({ message: 'Error creating variant', type: 'error' });
        }
    };

    if (loading) {
        return (
            <>
                <TopBar/><Navbar/>
                <div className="variant-table-container">
                    <div className="loading-spinner">
                        <i className="fa fa-spinner fa-spin"></i>
                        Loading variants...
                    </div>
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <TopBar/><Navbar/>
            <div className="variant-table-container">
                <div className="table-header">
                    <h2 className="table-title">Product Variants</h2>
                    <button
                        className="create-btn"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="fa fa-plus"></i>
                        Create Variant
                    </button>
                </div>

                {variants.length === 0 ? (
                    <div className="text-center">
                        <p>No variants available</p>
                        <button
                            className="create-btn-empty"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="fa fa-plus"></i>
                            Create your first variant
                        </button>
                    </div>
                ) : (
                    <table className="variant-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Variant Name</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {variants.map(variant => (
                            <tr key={variant.id}>
                                <td>{variant.id}</td>
                                <td>

                                    <img
                                        src={`${ENV.API_URL}/${variant.image_url}`}
                                        alt={variant.name}
                                        className="variant-image"
                                        onError={(e) => {
                                            e.target.src = '/img/placeholder.jpg';
                                        }}
                                    />
                                </td>
                                <td>{variant.name}</td>
                                <td>
                                        <span className="category-badge">
                                            {categories[variant.category_id] || 'Unknown'}
                                        </span>
                                </td>
                                <td>
                                        <span className={`status-badge ${variant.enable ? 'active' : 'inactive'}`}>
                                            {variant.enable ? 'Active' : 'Inactive'}
                                        </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {variant.enable ? (
                                            <button
                                                className="deactivate-btn"
                                                onClick={() => handleDisable(variant)}
                                                disabled={updatingId === variant.id}
                                            >
                                                {updatingId === variant.id ? '...' : 'Deactivate'}
                                            </button>
                                        ) : (
                                            <button
                                                className="activate-btn"
                                                onClick={() => handleEnable(variant)}
                                                disabled={updatingId === variant.id}
                                            >
                                                {updatingId === variant.id ? '...' : 'Activate'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Footer/>

            {/* Modal para crear variante */}
            {showModal && (
                <VariantModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateVariant}
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

export default ListVariants;