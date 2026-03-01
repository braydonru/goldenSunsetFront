import React, { useState } from 'react';
import { FaStar, FaRegStar, FaCamera, FaCheckCircle } from 'react-icons/fa';
import { ENV } from '../../conf/env';
import { useAuthStore } from '../../store/auth.store'; // Ajusta la ruta según tu proyecto
import './Reviews.css';

const Reviews = () => {
    const { user } = useAuthStore(); // Obtener usuario logueado
    const [formData, setFormData] = useState({
        comment: '',
        calification: 0,
        product_img: null
    });
    const [hoverRating, setHoverRating] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const handleRatingClick = (rating) => {
        setFormData({...formData, calification: rating});
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                setErrors({...errors, image: 'Invalid file type'});
                return;
            }
            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors({...errors, image: 'Max size 5MB'});
                return;
            }

            setFormData({...formData, product_img: file});

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setErrors({...errors, image: null});
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.comment.trim()) newErrors.comment = 'Review is required';
        if (formData.calification === 0) newErrors.calification = 'Rating is required';
        if (!user) newErrors.auth = 'You must be logged in';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar usuario logueado
        if (!user) {
            setErrors({...errors, auth: 'Please login to leave a review'});
            return;
        }

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('username', user.username || user.name || 'Anonymous');
            submitData.append('comment', formData.comment);
            submitData.append('calification', formData.calification);

            // Solo agregar imagen si se seleccionó una
            if (formData.product_img) {
                submitData.append('product_img', formData.product_img);
            }

            console.log('Enviando review:', {
                username: user.username || user.name,
                comment: formData.comment,
                calification: formData.calification,
                hasImage: !!formData.product_img
            });

            const response = await fetch(`${ENV.API_URL}/reviews/create_review`, {
                method: 'POST',
                headers: {
                    // Si necesitas autenticación
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: submitData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || 'Failed to submit review');
            }

            const result = await response.json();
            console.log('Review created:', result);

            // Éxito
            setSuccess(true);
            setFormData({ comment: '', calification: 0, product_img: null });
            setImagePreview(null);

            // Ocultar mensaje de éxito después de 3 segundos
            setTimeout(() => setSuccess(false), 3000);

        } catch (error) {
            console.error('Error submitting review:', error);
            setErrors({...errors, submit: error.message});
        } finally {
            setLoading(false);
        }
    };

    // Si no hay usuario logueado, mostrar mensaje
    if (!user) {
        return (
            <div className="reviews-footer">
                <h5 className="footer-title">⭐ Review</h5>
                <div className="login-message">
                    <p>Please log in to leave a review</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reviews-footer">
            <h5 className="footer-title">
                ⭐ Review as <span className="username">{user.username || user.name}</span>
            </h5>

            {success && (
                <div className="success-toast">
                    <FaCheckCircle /> Review submitted! Thanks 🌟
                </div>
            )}

            {errors.auth && (
                <div className="error-toast">{errors.auth}</div>
            )}

            <form onSubmit={handleSubmit} className="footer-form">
                {/* Rating compacto */}
                <div className="rating-row">
                    <div className="stars-compact">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="star-btn-small"
                                onClick={() => handleRatingClick(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                disabled={loading}
                            >
                                {star <= (hoverRating || formData.calification) ? (
                                    <FaStar className="star-small filled" />
                                ) : (
                                    <FaRegStar className="star-small" />
                                )}
                            </button>
                        ))}
                    </div>
                    {errors.calification && (
                        <span className="error-badge" title={errors.calification}>*</span>
                    )}
                </div>

                {/* Comentario e imagen en línea */}
                <div className="comment-row">
                    <input
                        type="text"
                        className={`comment-input ${errors.comment ? 'error' : ''}`}
                        placeholder="Write your review..."
                        value={formData.comment}
                        onChange={(e) => {
                            setFormData({...formData, comment: e.target.value});
                            setErrors({...errors, comment: null});
                        }}
                        disabled={loading}
                        maxLength="500"
                    />

                    <div className="image-upload-compact">
                        <input
                            type="file"
                            id="footer-img"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={loading}
                            hidden
                        />
                        <label
                            htmlFor="footer-img"
                            className={`upload-btn ${formData.product_img ? 'has-image' : ''}`}
                            title="Upload product photo"
                        >
                            <FaCamera />
                        </label>
                        {imagePreview && (
                            <div className="preview-thumb">
                                <img src={imagePreview} alt="Preview" />
                                <button
                                    type="button"
                                    className="remove-thumb"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setFormData({...formData, product_img: null});
                                    }}
                                    disabled={loading}
                                    title="Remove image"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mensajes de error */}
                {errors.comment && (
                    <div className="field-error">{errors.comment}</div>
                )}
                {errors.image && (
                    <div className="field-error">{errors.image}</div>
                )}

                {/* Botón de envío */}
                <button
                    type="submit"
                    className="submit-compact"
                    disabled={loading}
                >
                    {loading ? '...' : 'Send Review'}
                </button>
            </form>

            {errors.submit && (
                <div className="footer-error">{errors.submit}</div>
            )}
        </div>
    );
};

export default Reviews;