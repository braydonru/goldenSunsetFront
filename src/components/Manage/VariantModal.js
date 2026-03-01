// VariantModal.jsx
import React, { useState, useEffect } from 'react';
import './VariantModal.css';
import { get_categories_all } from '../../hooks/get_category';
import { ENV } from '../../conf/env';

const VariantModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        image_url: null
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    // Cargar categorías para el selector
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await get_categories_all();
                const cats = Array.isArray(response) ? response : response?.data || [];
                setCategories(cats.filter(cat => cat.enable)); // Solo categorías activas
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Variant name is required';
        }

        if (!formData.category_id) {
            newErrors.category_id = 'Please select a category';
        }

        if (!formData.image_url) {
            newErrors.image_url = 'Variant image is required';
        }

        return newErrors;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                setErrors({...errors, image_url: 'File must be an image'});
                return;
            }

            // Validar tamaño (máximo 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setErrors({...errors, image_url: 'Image must be less than 2MB'});
                return;
            }

            setFormData({...formData, image_url: file});

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            setErrors({...errors, image_url: null});
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

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('category_id', formData.category_id);
            submitData.append('image_url', formData.image_url);

            await onSubmit(submitData);

        } catch (error) {
            console.error('Error creating variant:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content variant-modal">
                <div className="modal-header">
                    <h3>Create New Variant</h3>
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
                    <div className="form-group">
                        <label htmlFor="name">
                            Variant Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({...formData, name: e.target.value});
                                setErrors({...errors, name: null});
                            }}
                            placeholder="e.g., Manga Larga, Taza Grande, etc."
                            className={errors.name ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.name && (
                            <span className="error-message">{errors.name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="category_id">
                            Category <span className="required">*</span>
                        </label>
                        <select
                            id="category_id"
                            value={formData.category_id}
                            onChange={(e) => {
                                setFormData({...formData, category_id: e.target.value});
                                setErrors({...errors, category_id: null});
                            }}
                            className={errors.category_id ? 'error' : ''}
                            disabled={loading}
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <span className="error-message">{errors.category_id}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="image_url">
                            Variant Image <span className="required">*</span>
                        </label>
                        <input
                            type="file"
                            id="image_url"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={errors.image_url ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.image_url && (
                            <span className="error-message">{errors.image_url}</span>
                        )}
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                                <span className="preview-label">Preview</span>
                            </div>
                        )}
                    </div>

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
                            {loading ? 'Creating...' : 'Create Variant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VariantModal;