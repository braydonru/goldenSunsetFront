import React, { useState, useEffect } from 'react';
import { FaTimes, FaShoppingCart, FaPalette, FaRuler } from 'react-icons/fa';
import { ENV } from '../../conf/env';
import { useAuthStore } from '../../store/auth.store';
import { get_colors_all } from '../../hooks/get_colors';
import './CustomOrderModal.css';

const CustomOrderModal = ({ design, onClose }) => {
    const { user } = useAuthStore();
    const [formData, setFormData] = useState({
        size: '',
        color: '',
        specifications: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [imageLoading, setImageLoading] = useState(false);
    const [colors, setColors] = useState([]);
    const [loadingColors, setLoadingColors] = useState(true);

    const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL','3XL', '4XL', '5XL'];

    // Cargar colores desde el backend
    useEffect(() => {
        const fetchColors = async () => {
            try {
                setLoadingColors(true);
                const colorsData = await get_colors_all();
                // Filtrar solo colores habilitados
                const enabledColors = Array.isArray(colorsData)
                    ? colorsData.filter(c => c.enable !== false)
                    : [];
                setColors(enabledColors);
                console.log('🎨 Colores cargados:', enabledColors);
            } catch (error) {
                console.error('Error loading colors:', error);
            } finally {
                setLoadingColors(false);
            }
        };

        fetchColors();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formData.size) newErrors.size = 'Please select a size';
        if (!formData.color) newErrors.color = 'Please select a color';
        if (!user) newErrors.auth = 'You must be logged in';
        return newErrors;
    };

    const fetchImageAsFile = async () => {
        try {
            setImageLoading(true);

            // Construir URL correctamente
            const imageUrl = design.img?.startsWith('http')
                ? design.img
                : `${ENV.API_URL}${design.img.startsWith('/') ? '' : '/'}${design.img}`;

            console.log('📸 Fetching image from:', imageUrl);

            const response = await fetch(imageUrl, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();

            const extension = design.img?.split('.').pop() || 'png';
            const filename = `design_${design.id}_${Date.now()}.${extension}`;

            const file = new File([blob], filename, {
                type: blob.type || `image/${extension}`
            });

            console.log('✅ Image fetched successfully:', file.name, file.size, 'bytes');
            return file;

        } catch (error) {
            console.error('❌ Error fetching image:', error);
            return null;
        } finally {
            setImageLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setErrors({ auth: 'Please login to create an order' });
            return;
        }

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const imageFile = await fetchImageAsFile();

            if (!imageFile) {
                throw new Error('Could not load design image');
            }

            const formDataToSend = new FormData();

            // Datos básicos
            formDataToSend.append('user', user.id.toString());
            formDataToSend.append('size', formData.size);
            formDataToSend.append('color', formData.color);
            formDataToSend.append('type', 'Pullover');
            formDataToSend.append('font', 'Arial');
            formDataToSend.append('variation', design.category || '');

            // Combinar especificaciones
            const fullSpecification = [
                `Design: ${design.name}`,
                formData.specifications && `Specs: ${formData.specifications}`
            ].filter(Boolean).join(' | ');

            formDataToSend.append('specification', fullSpecification);

            // Agregar la imagen del diseño
            formDataToSend.append('client_img', imageFile);

            console.log('📤 Enviando orden con color:', formData.color);

            const response = await fetch(`${ENV.API_URL}/order/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();

            alert(`✅ Order created successfully! Order ID: ${result.order_id}`);
            onClose();

        } catch (error) {
            console.error('Error creating order:', error);
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="custom-order-modal-overlay" onClick={onClose}>
            <div className="custom-order-modal-content" onClick={e => e.stopPropagation()}>
                <div className="custom-order-modal-header">
                    <h3>
                        <FaShoppingCart /> Create Order
                    </h3>
                    <button className="custom-order-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="custom-order-design-preview">
                    <img
                        src={design.img?.startsWith('http') ? design.img : `${ENV.API_URL}${design.img.startsWith('/') ? '' : '/'}${design.img}`}
                        alt={design.name}
                        className="custom-order-design-image"
                        onError={(e) => {
                            e.target.src = '/img/placeholder.jpg';
                        }}
                    />
                    <div className="custom-order-design-info">
                        <h4>{design.name}</h4>
                        <span className="custom-order-design-category">
                            {design.category}
                        </span>
                    </div>
                </div>

                {errors.auth && (
                    <div className="custom-order-error">
                        {errors.auth}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="custom-order-form">
                    <div className="custom-order-form-row">
                        <div className="custom-order-form-group">
                            <label>
                                <FaRuler /> Size <span className="required">*</span>
                            </label>
                            <select
                                value={formData.size}
                                onChange={(e) => {
                                    setFormData({...formData, size: e.target.value});
                                    setErrors({...errors, size: null});
                                }}
                                className={errors.size ? 'error' : ''}
                                disabled={loading || imageLoading || loadingColors}
                            >
                                <option value="">Select a size</option>
                                {sizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            {errors.size && <span className="error-message">{errors.size}</span>}
                        </div>

                        <div className="custom-order-form-group">
                            <label>
                                <FaPalette /> Color <span className="required">*</span>
                            </label>
                            <select
                                value={formData.color}
                                onChange={(e) => {
                                    setFormData({...formData, color: e.target.value});
                                    setErrors({...errors, color: null});
                                }}
                                className={errors.color ? 'error' : ''}
                                disabled={loading || imageLoading || loadingColors}
                            >
                                <option value="">Select a color</option>
                                {loadingColors ? (
                                    <option disabled>Loading colors...</option>
                                ) : (
                                    colors.map(color => (
                                        <option key={color.id} value={color.color_name}>
                                            {color.color_name}
                                        </option>
                                    ))
                                )}
                            </select>
                            {errors.color && <span className="error-message">{errors.color}</span>}
                            {!loadingColors && colors.length === 0 && (
                                <small className="helper-text">No colors available</small>
                            )}
                        </div>
                    </div>

                    <div className="custom-order-form-group">
                        <label>Specifications</label>
                        <textarea
                            rows="3"
                            placeholder="e.g., Front print, long sleeves, etc."
                            value={formData.specifications}
                            onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                            disabled={loading || imageLoading}
                        />
                    </div>



                    {imageLoading && (
                        <div className="custom-order-loading">
                            Loading design image...
                        </div>
                    )}

                    {loadingColors && (
                        <div className="custom-order-loading">
                            Loading available colors...
                        </div>
                    )}

                    {errors.submit && (
                        <div className="custom-order-error">
                            {errors.submit}
                        </div>
                    )}

                    <div className="custom-order-form-actions">
                        <button type="button" className="custom-order-cancel-btn" onClick={onClose} disabled={loading || imageLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="custom-order-submit-btn" disabled={loading || imageLoading || loadingColors}>
                            {loading ? 'Creating...' : imageLoading ? 'Loading image...' : loadingColors ? 'Loading colors...' : 'Create Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomOrderModal;