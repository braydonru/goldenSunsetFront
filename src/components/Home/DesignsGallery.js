import React, { useState, useEffect } from 'react';
import { ENV } from '../../conf/env';
import { FaSearch, FaTimes, FaShoppingCart, FaPlus } from 'react-icons/fa';
import './DesignsGallery.css';
import CustomOrderModal from './CustomOrderModal'; // Crearemos este componente

const DesignsGallery = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('sublimation');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [designForOrder, setDesignForOrder] = useState(null);
    const [categories] = useState([
        { id: 'sublimation', name: 'Sublimation', icon: '🌊', color: '#4facfe' },
        { id: 'embroidery', name: 'Embroidery', icon: '🧵', color: '#f093fb' },
        { id: 'dtf', name: 'DTF', icon: '🖨️', color: '#43e97b' }
    ]);

    useEffect(() => {
        fetchDesigns();
    }, []);

    const fetchDesigns = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${ENV.API_URL}/design/get_enable_design`);
            if (!response.ok) throw new Error('Error al cargar diseños');
            const data = await response.json();
            setDesigns(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar diseños por categoría seleccionada y búsqueda
    const filteredDesigns = designs.filter(design => {
        const matchesCategory = design.category?.toLowerCase() === selectedCategory;
        const matchesSearch = design.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && (searchTerm === '' || matchesSearch);
    });

    const getCategoryInfo = (categoryId) => {
        return categories.find(c => c.id === categoryId) || categories[0];
    };

    const handleOrderClick = (design, e) => {
        e.stopPropagation(); // Evitar que se abra el modal de vista previa
        setDesignForOrder(design);
        setShowOrderModal(true);
    };

    if (loading) {
        return (
            <div className="designs-gallery-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading designs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="designs-gallery-container">
            {/* Header con título y búsqueda */}
            <div className="gallery-header">
                <h1 className="gallery-title">🎨 Design Gallery</h1>

            </div>

            {/* Categorías - 3 partes principales */}
            <div className="categories-nav">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                        style={{ '--category-color': category.color }}
                    >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                        <span className="category-count">
                            {designs.filter(d => d.category?.toLowerCase() === category.id).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Contenido de la categoría seleccionada */}
            <div className="category-content">
                <div className="category-header">
                    <h2 className="category-title">
                        {getCategoryInfo(selectedCategory).icon} {getCategoryInfo(selectedCategory).name}
                    </h2>
                    <span className="designs-count">{filteredDesigns.length} designs</span>
                </div>


                {filteredDesigns.length === 0 ? (
                    <div className="no-designs">
                        <p>There are no designs available in this category.</p>
                        {searchTerm && (
                            <button className="clear-filter" onClick={() => setSearchTerm('')}>
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="designs-grid">
                        {filteredDesigns.map(design => (
                            <div
                                key={design.id}
                                className="design-card"
                            >
                                <div className="design-image-wrapper">
                                    {design.img ? (
                                        <img
                                            src={`${ENV.API_URL}/${design.img}`}
                                            alt={design.name}
                                            className="design-image"
                                            onError={(e) => {
                                                e.target.src = '/img/placeholder.jpg';
                                            }}
                                        />
                                    ) : (
                                        <div className="design-placeholder">
                                            <span>🖼️</span>
                                        </div>
                                    )}
                                    <div className="design-overlay">
                                        <button
                                            className="view-design-btn"
                                            onClick={() => setSelectedDesign(design)}
                                        >
                                            Preview
                                        </button>
                                        <button
                                            className="order-design-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDesignForOrder(design);
                                                setShowOrderModal(true);
                                            }}
                                        >
                                            <FaShoppingCart /> Order
                                        </button>
                                    </div>
                                </div>
                                <div className="design-info">
                                    <h3 className="design-name">{design.name}</h3>
                                    <span className="design-category-tag">
                                        {getCategoryInfo(design.category?.toLowerCase())?.icon} {design.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal para ver diseño completo */}
            {selectedDesign && (
                <div className="design-modal" onClick={() => setSelectedDesign(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedDesign(null)}>
                            ×
                        </button>
                        {selectedDesign.img ? (
                            <img
                                src={`${ENV.API_URL}/${selectedDesign.img}`}
                                alt={selectedDesign.name}
                                className="modal-image"
                            />
                        ) : (
                            <div className="modal-placeholder">
                                <span>🖼️</span>
                                <p>Imagen no disponible</p>
                            </div>
                        )}
                        <div className="modal-info">
                            <h2>{selectedDesign.name}</h2>
                            <p className="modal-category">
                                {getCategoryInfo(selectedDesign.category?.toLowerCase())?.icon} {selectedDesign.category}
                            </p>
                            <button
                                className="modal-order-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDesign(null);
                                    handleOrderClick(selectedDesign, e);
                                }}
                            >
                                <FaShoppingCart /> Encargar este diseño
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para crear encargo */}
            {showOrderModal && designForOrder && (
                <CustomOrderModal
                    design={designForOrder}
                    onClose={() => {
                        setShowOrderModal(false);
                        setDesignForOrder(null);
                    }}
                />
            )}
        </div>
    );
};

export default DesignsGallery;