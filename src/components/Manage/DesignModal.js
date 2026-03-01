import React, { useState } from 'react';
import './DesignModal.css';

const DesignModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'sublimation',
        img: null
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    const categories = [
        { id: 'sublimation', name: 'Sublimation', icon: '🌊' },
        { id: 'embroidery', name: 'Embroidery', icon: '🧵' },
        { id: 'dtf', name: 'DTF', icon: '🖨️' }
    ];

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Design name is required';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        return newErrors;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                setErrors({...errors, image: 'File must be an image'});
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors({...errors, image: 'Image must be less than 5MB'});
                return;
            }

            setFormData({...formData, img: file});

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            setErrors({...errors, image: null});
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
            submitData.append('category', formData.category);
            if (formData.img) {
                submitData.append('img', formData.img);
            }

            await onSubmit(submitData);

        } catch (error) {
            console.error('Error creating design:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content design-modal">
                <div className="modal-header">
                    <h3>Create New Design</h3>
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
                            Design Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({...formData, name: e.target.value});
                                setErrors({...errors, name: null});
                            }}
                            placeholder="e.g., Floral Pattern, Geometric Design"
                            className={errors.name ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.name && (
                            <span className="error-message">{errors.name}</span>
                        )}
                    </div>

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
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <span className="error-message">{errors.category}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="img">
                            Design Image
                        </label>
                        <input
                            type="file"
                            id="img"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={errors.image ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.image && (
                            <span className="error-message">{errors.image}</span>
                        )}
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                                <span className="preview-label">Preview</span>
                            </div>
                        )}
                        <small className="helper-text">
                            Max size: 5MB. Leave empty if no image.
                        </small>
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
                            {loading ? 'Creating...' : 'Create Design'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DesignModal;