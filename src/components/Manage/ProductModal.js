// ProductModal.jsx
import React, { useState, useEffect } from 'react';
import './ProductModal.css';
import { get_categories_all } from '../../hooks/get_category';

const ProductModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        price: '',
        category: '',
        img_url: null
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    // Cargar categorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await get_categories_all();
                const cats = Array.isArray(response) ? response : response?.data || [];
                setCategories(cats);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const validate = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'Product name is required';
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'Description is required';
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be a positive number';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.img_url) {
            newErrors.img_url = 'Product image is required';
        }

        return newErrors;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, img_url: file });

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        // Crear FormData para enviar archivo
        const submitData = new FormData();
        submitData.append('nombre', formData.nombre);
        submitData.append('descripcion', formData.descripcion);
        submitData.append('price', formData.price);
        submitData.append('category', formData.category);
        submitData.append('img_url', formData.img_url);

        await onSubmit(submitData);
        setLoading(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content product-modal">
                <div className="modal-header">
                    <h3>Create New Product</h3>
                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombre">
                                Product Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                value={formData.nombre}
                                onChange={(e) => {
                                    setFormData({...formData, nombre: e.target.value});
                                    setErrors({...errors, nombre: null});
                                }}
                                className={errors.nombre ? 'error' : ''}
                                disabled={loading}
                            />
                            {errors.nombre && (
                                <span className="error-message">{errors.nombre}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">
                                Price <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => {
                                    setFormData({...formData, price: e.target.value});
                                    setErrors({...errors, price: null});
                                }}
                                className={errors.price ? 'error' : ''}
                                disabled={loading}
                            />
                            {errors.price && (
                                <span className="error-message">{errors.price}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">
                            Description <span className="required">*</span>
                        </label>
                        <textarea
                            id="descripcion"
                            rows="4"
                            value={formData.descripcion}
                            onChange={(e) => {
                                setFormData({...formData, descripcion: e.target.value});
                                setErrors({...errors, descripcion: null});
                            }}
                            className={errors.descripcion ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.descripcion && (
                            <span className="error-message">{errors.descripcion}</span>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">
                                Category <span className="required">*</span>
                            </label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={(e) => {
                                    setFormData({...formData, category: e.target.value});
                                    setErrors({...errors, category: null});
                                }}
                                className={errors.category ? 'error' : ''}
                                disabled={loading}
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <span className="error-message">{errors.category}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="img_url">
                                Product Image <span className="required">*</span>
                            </label>
                            <input
                                type="file"
                                id="img_url"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={errors.img_url ? 'error' : ''}
                                disabled={loading}
                            />
                            {errors.img_url && (
                                <span className="error-message">{errors.img_url}</span>
                            )}
                        </div>
                    </div>

                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;