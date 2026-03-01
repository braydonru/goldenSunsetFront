import React, { useState, useEffect } from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import SimpleToast from '../Orders/ToastSimple'; // Verifica esta ruta
import { get_colors_all, enableColor, disableColor, createColor } from "../../hooks/get_colors";
import ColorModal from './ColorModal'; // Asegúrate que este archivo existe
import './colorstyle.css';

const ListColors = () => {
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const response = await get_colors_all();
                const colorsData = Array.isArray(response) ? response : response?.data || [];
                setColors(colorsData);
                setLoading(false);
            } catch (err) {
                setToast({ message: 'Error loading colors', type: 'error' });
                setLoading(false);
            }
        };
        fetchColors();
    }, []);

    const handleDisable = async (color) => {
        setUpdatingId(color.id);

        try {
            const result = await disableColor(color.id);

            if (result?.success) {
                setColors(colors.map(c =>
                    c.id === color.id ? { ...c, enable: false } : c
                ));
                setToast({
                    message: 'Color deactivated successfully',
                    type: 'success'
                });
            } else {
                setToast({ message: result?.error || 'Deactivation failed', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error deactivating color', type: 'error' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleEnable = async (color) => {
        setUpdatingId(color.id);

        try {
            const result = await enableColor(color.id);

            if (result?.success) {
                setColors(colors.map(c =>
                    c.id === color.id ? { ...c, enable: true } : c
                ));
                setToast({
                    message: 'Color activated successfully',
                    type: 'success'
                });
            } else {
                setToast({ message: result?.error || 'Activation failed', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error activating color', type: 'error' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCreateColor = async (colorData) => {
        try {
            const result = await createColor(colorData);

            console.log('Create result:', result); // Para debug

            if (result?.success) {
                // Recargar la lista de colores
                const updatedColors = await get_colors_all();
                setColors(Array.isArray(updatedColors) ? updatedColors : updatedColors?.data || []);

                // Asegurarnos de que message sea un string
                setToast({
                    message: 'Color created successfully', // String directo, no un objeto
                    type: 'success'
                });
                setShowModal(false);
            } else {
                // Asegurarnos de que error sea un string
                const errorMsg = typeof result?.error === 'string'
                    ? result.error
                    : 'Creation failed';

                setToast({
                    message: errorMsg,
                    type: 'error'
                });
            }
        } catch (err) {
            console.error('Error creating color:', err);
            setToast({
                message: 'Error creating color',
                type: 'error'
            });
        }
    };

    if (loading) {
        return (
            <>
                <TopBar/><Navbar/>
                <div className="color-table-container">
                    <div className="loading-spinner">
                        <i className="fa fa-spinner fa-spin"></i>
                        Loading colors...
                    </div>
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <TopBar/><Navbar/>
            <div className="color-table-container">
                <div className="table-header">
                    <h2 className="table-title">Colors</h2>
                    <button
                        className="create-btn"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="fa fa-plus"></i>
                        Create Color
                    </button>
                </div>

                {colors.length === 0 ? (
                    <div className="text-center">
                        <p>No colors available</p>
                        <button
                            className="create-btn-empty"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="fa fa-plus"></i>
                            Create your first color
                        </button>
                    </div>
                ) : (
                    <table className="color-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Color</th>
                            <th>Name</th>
                            <th>Variant</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {colors.map(color => (
                            <tr key={color.id}>
                                <td>{color.id}</td>
                                <td>
                                    <div className="color-preview">
                                        <div
                                            className="color-swatch"
                                            style={{
                                                backgroundColor: color.color_code,
                                                border: color.color_name === 'White' ? '2px solid #ddd' : 'none'
                                            }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <span className="color-name">{color.color_name}</span>
                                </td>
                                <td>
                                    <span className="color-code">{color.variant}</span>
                                </td>
                                <td>
                                        <span className={`status-badge ${color.enable ? 'active' : 'inactive'}`}>
                                            {color.enable ? 'Active' : 'Inactive'}
                                        </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {color.enable ? (
                                            <button
                                                className="deactivate-btn"
                                                onClick={() => handleDisable(color)}
                                                disabled={updatingId === color.id}
                                            >
                                                {updatingId === color.id ? '...' : 'Deactivate'}
                                            </button>
                                        ) : (
                                            <button
                                                className="activate-btn"
                                                onClick={() => handleEnable(color)}
                                                disabled={updatingId === color.id}
                                            >
                                                {updatingId === color.id ? '...' : 'Activate'}
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

            {/* Modal para crear color */}
            {showModal && (
                <ColorModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateColor}
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

export default ListColors;