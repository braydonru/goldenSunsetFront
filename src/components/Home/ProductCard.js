import React from 'react';
import { Link } from 'react-router-dom';
import { ENV } from '../../conf/env';
import './ProductCard.css'; // Crearemos este archivo

const ProductCard = ({product}) => {
    const { nombre, price, img_url, descripcion, enable } = product;

    // URL de placeholder por si la imagen falla
    const placeholderImage = '/img/placeholder.jpg'; // Ajusta la ruta según tu proyecto

    return (
        <div className="cat-item d-flex flex-column border mb-4 product-card">
            <p className="price-tag">{price}$</p>

            <div className="product-image-wrapper">
                <Link to={''} className="product-image-link">
                    <img
                        className="product-image"
                        src={`${ENV.API_URL}${img_url}`}
                        alt={nombre}
                        onError={(e) => {
                            e.target.src = placeholderImage;
                            e.target.onerror = null; // Evita loop infinito
                        }}
                        loading="lazy" // Carga perezosa para mejor rendimiento
                    />
                </Link>
                {!enable && (
                    <span className="product-badge">Agotado</span>
                )}
            </div>

            <div className="product-info">
                <h5 className="product-title">{nombre}</h5>
                <p className="product-description">{descripcion}</p>
            </div>
        </div>
    );
};

export default ProductCard;