import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaUser, FaCamera, FaQuoteRight } from 'react-icons/fa';
import { ENV } from '../../conf/env';
import './ReviewsGallery.css';

const ReviewsGallery = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${ENV.API_URL}/reviews/get_all`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch reviews');

            const data = await response.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Could not load reviews');
        } finally {
            setLoading(false);
        }
    };

    // Función para renderizar estrellas
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="star-filled" />);
            } else if (i === fullStars + 1 && hasHalf) {
                stars.push(<FaStarHalfAlt key={i} className="star-half" />);
            } else {
                stars.push(<FaRegStar key={i} className="star-empty" />);
            }
        }
        return stars;
    };

    // Filtrar reviews por calificación
    const filteredReviews = filter === 'all'
        ? reviews
        : reviews.filter(r => r.calification === parseInt(filter));

    // Calcular estadísticas
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.calification, 0) / totalReviews).toFixed(1)
        : 0;
    const ratingCounts = [5, 4, 3, 2, 1].map(stars =>
        reviews.filter(r => r.calification === stars).length
    );

    if (loading) {
        return (
            <div className="reviews-gallery-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading reviews...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="reviews-gallery-container">
                <div className="error-message">
                    <p>😕 {error}</p>
                    <button onClick={fetchReviews} className="retry-btn">
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="reviews-gallery-container">
            {/* Header con estadísticas */}


            {/* Grid de reviews */}
            {filteredReviews.length === 0 ? (
                <div className="no-reviews">
                    <FaCamera className="no-reviews-icon" />
                    <p>No reviews match this filter</p>
                </div>
            ) : (
                <div className="reviews-grid">
                    {filteredReviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="user-info">
                                    <div className="user-avatar">
                                        <FaUser />
                                    </div>
                                    <div className="user-details">
                                        <h4 className="username">{review.username}</h4>
                                        <div className="stars">
                                            {renderStars(review.calification)}
                                        </div>
                                    </div>
                                </div>
                                <span className="review-date">
                                    {new Date().toLocaleDateString()} {/* Aquí iría la fecha real si la tuvieras */}
                                </span>
                            </div>

                            <div className="review-content">
                                <FaQuoteRight className="quote-icon" />
                                <p className="review-text">{review.comment}</p>
                            </div>

                            {review.product_img && (
                                <div
                                    className="review-image"
                                    onClick={() => setSelectedImage(review.product_img)}
                                >
                                    <img
                                        src={`${ENV.API_URL}${review.product_img}`}
                                        alt={`Review by ${review.username}`}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <div className="image-overlay">
                                        <FaCamera /> View
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal para imagen ampliada */}
            {selectedImage && (
                <div className="image-modal" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedImage(null)}>
                            ×
                        </button>
                        <img
                            src={`${ENV.API_URL}${selectedImage}`}
                            alt="Review full size"
                        />
                    </div>
                </div>
            )}
            <div className="gallery-header" style={{marginTop:'20px'}}>
                <h2 className="gallery-title">
                    Customer Reviews
                    <span className="review-count">{totalReviews} reviews</span>
                </h2>

                <div className="rating-summary">
                    <div className="average-rating">
                        <span className="big-rating">{averageRating}</span>
                        <div className="stars-large">
                            {renderStars(parseFloat(averageRating))}
                        </div>
                        <span className="out-of">out of 5</span>
                    </div>

                    <div className="rating-bars">
                        {[5, 4, 3, 2, 1].map((stars, index) => (
                            <div
                                key={stars}
                                className={`rating-bar-item ${filter === stars.toString() ? 'active' : ''}`}
                                onClick={() => setFilter(filter === stars.toString() ? 'all' : stars.toString())}
                            >
                                <span className="rating-label">{stars} stars</span>
                                <div className="bar-container">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${totalReviews > 0
                                                ? (ratingCounts[index] / totalReviews) * 100
                                                : 0}%`
                                        }}
                                    />
                                </div>
                                <span className="bar-count">{ratingCounts[index]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {filter !== 'all' && (
                    <button className="clear-filter" onClick={() => setFilter('all')}>
                        Clear filter ✕
                    </button>
                )}
            </div>
        </div>

    );
};

export default ReviewsGallery;