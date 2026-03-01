// ColorModal.jsx
import React, {useEffect, useState} from 'react';
import './colorModal.css';
import {get_variants_all} from "../../hooks/get_variants";

const ColorModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        color_name: '',
        color_code: '#000000',
        variant: '',
        front_image: null,
        back_image: null
    });
    const [variant, setVariant] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [previews, setPreviews] = useState({
        front: null,
        back: null
    });

    useEffect(() => {
        const fetchVariant = async () => {
            try {
                const response = await get_variants_all();
                const variants = Array.isArray(response) ? response : response?.data || [];
                setVariant(variants);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };
        fetchVariant();
    }, []);


    const validate = () => {
        const newErrors = {};

        if (!formData.color_name.trim()) {
            newErrors.color_name = 'Color name is required';
        }

        if (!formData.front_image) {
            newErrors.front_image = 'Front image is required';
        }

        if (!formData.back_image) {
            newErrors.back_image = 'Back image is required';
        }

        return newErrors;
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            // Validar que sea imagen
            if (!file.type.startsWith('image/')) {
                setErrors({...errors, [type]: 'File must be an image'});
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors({...errors, [type]: 'Image must be less than 5MB'});
                return;
            }

            setFormData({...formData, [type]: file});

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews({...previews, [type]: reader.result});
            };
            reader.readAsDataURL(file);

            // Limpiar error
            setErrors({...errors, [type]: null});
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

            // Crear objeto para enviar al backend (solo datos del color)
            const colorData = {
                color_name: formData.color_name,
                color_code: formData.color_code,
                variant: formData.variant,
                front_image: formData.front_image,
                back_image: formData.back_image
            };
            await onSubmit(colorData);

        } catch (error) {
            console.error('Error saving images:', error);
            alert('Error saving images');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content color-modal">
                <div className="modal-header">
                    <h3>Create New Color</h3>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="color_name">
                            Color Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="color_name"
                            value={formData.color_name}
                            onChange={(e) => {
                                setFormData({...formData, color_name: e.target.value});
                                setErrors({...errors, color_name: null});
                            }}
                            placeholder="e.g., White"
                            className={errors.color_name ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.color_name && (
                            <span className="error-message">{errors.color_name}</span>
                        )}
                        <small className="helper-text">
                            This name will be used for image files: {formData.color_name.toLowerCase().replace(/\s+/g, '_')}_front.png
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="color_code">Color Code</label>
                        <div className="color-input-group">
                            <input
                                type="color"
                                id="color_code"
                                value={formData.color_code}
                                onChange={(e) => setFormData({...formData, color_code: e.target.value})}
                                disabled={loading}
                            />
                            <input
                                type="text"
                                value={formData.color_code}
                                onChange={(e) => setFormData({...formData, color_code: e.target.value})}
                                placeholder="#000000"
                                pattern="^#[0-9A-Fa-f]{6}$"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <select
                            id="variant"
                            value={formData.variant}
                            onChange={(e) => {
                                setFormData({...formData, variant: e.target.value});
                                setErrors({...errors, variant: null});
                            }}
                            className={errors.variant ? 'error' : ''}
                            disabled={loading}
                        >
                            <option value="">Select a variant</option>
                            {variant.map(varian => (
                                <option key={varian.name} value={varian.name}>
                                    {varian.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="front_image">
                                Front Image <span className="required">*</span>
                            </label>
                            <input
                                type="file"
                                id="front_image"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'front_image')}
                                className={errors.front_image ? 'error' : ''}
                                disabled={loading}
                            />
                            {errors.front_image && (
                                <span className="error-message">{errors.front_image}</span>
                            )}
                            {previews.front && (
                                <div className="image-preview">
                                    <img src={previews.front} alt="Front preview" />
                                    <span className="preview-label">Front</span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="back_image">
                                Back Image <span className="required">*</span>
                            </label>
                            <input
                                type="file"
                                id="back_image"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'back_image')}
                                className={errors.back_image ? 'error' : ''}
                                disabled={loading}
                            />
                            {errors.back_image && (
                                <span className="error-message">{errors.back_image}</span>
                            )}
                            {previews.back && (
                                <div className="image-preview">
                                    <img src={previews.back} alt="Back preview" />
                                    <span className="preview-label">Back</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="color-preview-modal">
                        <div
                            className="preview-swatch"
                            style={{ backgroundColor: formData.color_code }}
                        />
                        <div className="preview-info">
                            <span>Color: {formData.color_name || 'Color name'}</span>
                            {formData.front_image && (
                                <span className="file-info">
                                    Front: {formData.front_image.name}
                                </span>
                            )}
                            {formData.back_image && (
                                <span className="file-info">
                                    Back: {formData.back_image.name}
                                </span>
                            )}
                        </div>
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
                            {loading ? 'Creating...' : 'Create Color'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ColorModal;