import React, { useEffect, useState } from 'react';
import ProductCard from "./ProductCard";
import { get_products_all } from "../../hooks/get_products";
import ProductResolver from "./ProductResolver";
import './ProductRow.css';

const ProductRow = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await get_products_all();
                // Si quieres solo productos habilitados, descomenta la siguiente línea
                // const data = response.filter(i => i.enable === true);
                setProducts(Array.isArray(response) ? response : response?.data || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="product-row-container">
                <h1 className="category-title">All Products</h1>
                <div className="products-grid">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="product-skeleton">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-text"></div>
                            <div className="skeleton-text"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="product-row-container">
                <h1 className="category-title">All Products</h1>
                <div className="no-products-message">
                    <p>No products available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="product-row-container">
            <h1 className="category-title">All Products</h1>
            <div className="products-grid">
                {products.map((product) => (
                    <div className="product-grid-item" key={product.id}>
                        <ProductResolver product={product}>
                            <ProductCard product={product} />
                        </ProductResolver>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductRow;