// CategoryModal.jsx
import React, { useState } from 'react';
import './CategoryModal.css';

const CategoryModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Category name must be at least 2 characters';
        } else if (formData.name.length > 50) {
            newErrors.name = 'Category name must be less than 50 characters';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        // Crear FormData para enviar
        const submitData = new FormData();
        submitData.append('name', formData.name);

        await onSubmit(submitData);
        setLoading(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content category-modal">
                <div className="modal-header">
                    <h3>Create New Category</h3>
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
                            Category Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({...formData, name: e.target.value});
                                setErrors({...errors, name: null});
                            }}
                            placeholder="e.g., Electronics, Clothing, Books"
                            className={errors.name ? 'error' : ''}
                            disabled={loading}
                            autoFocus
                        />
                        {errors.name && (
                            <span className="error-message">{errors.name}</span>
                        )}
                        <small className="helper-text">
                            {formData.name.length}/50 characters
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
                            {loading ? 'Creating...' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;