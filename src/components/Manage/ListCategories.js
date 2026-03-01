// ListCategories.jsx
import React, { useState, useEffect } from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import SimpleToast from '../Orders/ToastSimple';
import CategoryModal from './CategoryModal';
import { get_categories_all, enableCategory, disableCategory, createCategory } from "../../hooks/get_category";
import './categorystyle.css';

const ListCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await get_categories_all();
            setCategories(Array.isArray(response) ? response : response?.data || []);
            setLoading(false);
        } catch (err) {
            setToast({ message: 'Error loading categories', type: 'error' });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDisable = async (category) => {
        setUpdatingId(category.id);

        try {
            const result = await disableCategory(category.id);

            if (result?.success) {
                setCategories(categories.map(c =>
                    c.id === category.id ? { ...c, enable: false } : c
                ));
                setToast({
                    message: 'Category deactivated successfully',
                    type: 'success'
                });
            } else {
                setToast({ message: result?.error || 'Deactivation failed', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error deactivating category', type: 'error' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleEnable = async (category) => {
        setUpdatingId(category.id);

        try {
            const result = await enableCategory(category.id);

            if (result?.success) {
                setCategories(categories.map(c =>
                    c.id === category.id ? { ...c, enable: true } : c
                ));
                setToast({
                    message: 'Category activated successfully',
                    type: 'success'
                });
            } else {
                setToast({ message: result?.error || 'Activation failed', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error activating category', type: 'error' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCreateCategory = async (formData) => {
        try {
            const result = await createCategory(formData);

            if (result?.success) {
                await fetchCategories(); // Recargar categorías
                setToast({
                    message: 'Category created successfully',
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
            setToast({ message: 'Error creating category', type: 'error' });
        }
    };

    if (loading) {
        return (
            <>
                <TopBar/><Navbar/>
                <div className="category-table-container text-center">Loading categories...</div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <TopBar/><Navbar/>
            <div className="category-table-container">
                <div className="table-header">
                    <h2 className="table-title">Categories</h2>
                    <button
                        className="create-btn"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="fa fa-plus"></i>
                        Create Category
                    </button>
                </div>

                {categories.length === 0 ? (
                    <div className="text-center">
                        <p>No categories available</p>
                        <button
                            className="create-btn-empty"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="fa fa-plus"></i>
                            Create your first category
                        </button>
                    </div>
                ) : (
                    <table className="category-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                        <span className={`status-badge ${category.enable ? 'active' : 'inactive'}`}>
                                            {category.enable ? 'Active' : 'Inactive'}
                                        </span>
                                </td>
                                <td>
                                    {category.enable ? (
                                        <button
                                            className="deactivate-btn"
                                            onClick={() => handleDisable(category)}
                                            disabled={updatingId === category.id}
                                        >
                                            {updatingId === category.id ? '...' : 'Deactivate'}
                                        </button>
                                    ) : (
                                        <button
                                            className="activate-btn"
                                            onClick={() => handleEnable(category)}
                                            disabled={updatingId === category.id}
                                        >
                                            {updatingId === category.id ? '...' : 'Activate'}
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

            {/* Modal para crear categoría */}
            {showModal && (
                <CategoryModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateCategory}
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

export default ListCategories;