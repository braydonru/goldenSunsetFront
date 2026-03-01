// ListDesigns.jsx
import React, { useState, useEffect } from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import SimpleToast from '../Orders/ToastSimple';
import DesignModal from './DesignModal';
import { get_designs_all, enableDesign, disableDesign, createDesign } from "../../hooks/get_designs";
import { ENV } from '../../conf/env';
import './designstyle.css';

const ListDesigns = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchDesigns = async () => {
        try {
            const response = await get_designs_all();
            setDesigns(Array.isArray(response) ? response : response?.data || []);
            setLoading(false);
        } catch (err) {
            setToast({ message: 'Error loading designs', type: 'error' });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    const handleDisable = async (design) => {
        setUpdatingId(design.id);

        try {
            const result = await disableDesign(design.id);

            if (result?.success) {
                setDesigns(designs.map(d =>
                    d.id === design.id ? { ...d, enable: false } : d
                ));
                setToast({
                    message: 'Design deactivated successfully',
                    type: 'success'
                });
            } else {
                setToast({ message: result?.error || 'Deactivation failed', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error deactivating design', type: 'error' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleEnable = async (design) => {
        setUpdatingId(design.id);

        try {
            const result = await enableDesign(design.id);

            if (result?.success) {
                setDesigns(designs.map(d =>
                    d.id === design.id ? { ...d, enable: true } : d
                ));
                setToast({
                    message: 'Design activated successfully',
                    type: 'success'
                });
            } else {
                setToast({ message: result?.error || 'Activation failed', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error activating design', type: 'error' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCreateDesign = async (formData) => {
        try {
            const result = await createDesign(formData);

            if (result?.success) {
                await fetchDesigns();
                setToast({
                    message: 'Design created successfully',
                    type: 'success'
                });
                setShowModal(false);
            } else {
                const errorMsg = typeof result?.error === 'string'
                    ? result.error
                    : 'Creation failed';

                setToast({
                    message: errorMsg,
                    type: 'error'
                });
            }
        } catch (err) {
            setToast({ message: 'Error creating design', type: 'error' });
        }
    };

    // Función para obtener la clase de categoría
    const getCategoryClass = (category) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('sublimacion')) return 'sublimacion';
        if (cat.includes('bordado')) return 'bordado';
        if (cat.includes('dtf')) return 'dtf';
        return '';
    };

    // Función para obtener la URL de la imagen
    const getImageUrl = (imgPath) => {
        if (!imgPath) return null;
        return `${ENV.API_URL}/${imgPath}`;
    };

    if (loading) {
        return (
            <>
                <TopBar/><Navbar/>
                <div className="design-table-container">
                    <div className="loading-spinner">
                        <i className="fa fa-spinner fa-spin"></i>
                        Loading designs...
                    </div>
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <TopBar/><Navbar/>
            <div className="design-table-container">
                <div className="table-header">
                    <h2 className="table-title">Designs</h2>
                    <button
                        className="create-btn"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="fa fa-plus"></i>
                        Create Design
                    </button>
                </div>

                {designs.length === 0 ? (
                    <div className="text-center">
                        <p>No designs available</p>
                        <button
                            className="create-btn-empty"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="fa fa-plus"></i>
                            Create your first design
                        </button>
                    </div>
                ) : (
                    <table className="design-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Design Name</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {designs.map(design => (
                            <tr key={design.id}>
                                <td>{design.id}</td>
                                <td>
                                    {design.img ? (
                                        <div className="design-thumbnail">
                                            <img
                                                src={getImageUrl(design.img)}
                                                alt={design.name}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentNode.innerHTML = '<div class="design-thumbnail-placeholder">🖼️</div>';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="design-thumbnail-placeholder">
                                            🖼️
                                        </div>
                                    )}
                                </td>
                                <td>{design.name}</td>
                                <td>
                                        <span className={`category-badge ${getCategoryClass(design.category)}`}>
                                            {design.category}
                                        </span>
                                </td>
                                <td>
                                        <span className={`status-badge ${design.enable ? 'active' : 'inactive'}`}>
                                            {design.enable ? 'Active' : 'Inactive'}
                                        </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {design.enable ? (
                                            <button
                                                className="deactivate-btn"
                                                onClick={() => handleDisable(design)}
                                                disabled={updatingId === design.id}
                                            >
                                                {updatingId === design.id ? '...' : 'Deactivate'}
                                            </button>
                                        ) : (
                                            <button
                                                className="activate-btn"
                                                onClick={() => handleEnable(design)}
                                                disabled={updatingId === design.id}
                                            >
                                                {updatingId === design.id ? '...' : 'Activate'}
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

            {/* Modal para crear diseño */}
            {showModal && (
                <DesignModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateDesign}
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

export default ListDesigns;