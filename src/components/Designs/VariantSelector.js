import React, { useState, useEffect } from 'react';
import { get_variants_by_category } from '../../hooks/get_variants';
import { ENV } from '../../conf/env';
import './VariantSelector.css';
import { useDesignerStore } from "./designer.store";

const VariantSelector = ({ category }) => {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    // 👇 CORRECCIÓN: Así se obtiene la función del store
    const setVariant = useDesignerStore(state => state.setSelectedVariant);
    const selectedVariant = useDesignerStore(state => state.selectedVariant);

    useEffect(() => {
        if (category) {
            fetchVariantsByCategory(category);
        }
    }, [category]);

    const fetchVariantsByCategory = async (category) => {
        try {
            setLoading(true);
            const response = await get_variants_by_category(category);
            setVariants(Array.isArray(response) ? response : []);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const handleSelectVariant = (variant) => {
        // 👇 Guardar en el store
        setVariant(variant);
    };

    // Mostrar solo 4 variantes inicialmente, o todas si expanded es true
    const displayedVariants = expanded ? variants : variants.slice(0, 4);

    if (!category) {
        return (
            <div className="variant-selector-card">
                <div className="variant-header">
                    <h5>Select Variant</h5>
                </div>
                <div className="variant-body text-center py-4">
                    <p className="text-muted mb-0">Please select a category first</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="variant-selector-card">
                <div className="variant-header">
                    <h5>Select Variant</h5>
                </div>
                <div className="variant-body text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2 mb-0">Loading variants...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="variant-selector-card">
            <div className="variant-header">
                <h5>Select Variant</h5>
                {selectedVariant && (
                    <span className="selected-badge">
                        <i className="fa fa-check-circle"></i> Selected
                    </span>
                )}
            </div>

            <div className="variant-body">
                {variants.length === 0 ? (
                    <div className="text-center py-4">
                        <i className="fa fa-box-open fa-3x text-muted mb-3"></i>
                        <p className="text-muted mb-0">No variants available for this category</p>
                    </div>
                ) : (
                    <>
                        {/* Variante seleccionada (si hay) */}
                        {selectedVariant && (
                            <div className="selected-variant-preview mb-3">
                                <strong>Selected:</strong>
                                <div className="d-flex align-items-center mt-2">
                                    <img
                                        src={`${ENV.API_URL}/${selectedVariant.image_url}`}
                                        alt={selectedVariant.name}
                                        className="selected-variant-image"
                                        onError={(e) => {
                                            e.target.src = '/img/placeholder.jpg';
                                        }}
                                    />
                                    <div className="ms-3">
                                        <h6 className="mb-1">{selectedVariant.name}</h6>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grid de variantes */}
                        <div className="variants-grid">
                            {displayedVariants.map(variant => (
                                <button
                                    key={variant.id}
                                    className={`variant-item ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectVariant(variant)}
                                >
                                    <div className="variant-image-wrapper">
                                        <img
                                            src={`${ENV.API_URL}/${variant.image_url}`}
                                            alt={variant.name}
                                            className="variant-image"
                                            onError={(e) => {
                                                e.target.src = '/img/placeholder.jpg';
                                            }}
                                        />
                                        {selectedVariant?.id === variant.id && (
                                            <div className="selected-overlay">
                                                <i className="fa fa-check-circle"></i>
                                            </div>
                                        )}
                                    </div>
                                    <span className="variant-name">{variant.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Botón Ver más / Ver menos */}
                        {variants.length > 4 && (
                            <button
                                className="see-more-btn"
                                onClick={() => setExpanded(!expanded)}
                            >
                                {expanded ? (
                                    <>Show less <i className="fa fa-chevron-up ms-1"></i></>
                                ) : (
                                    <>Show {variants.length - 4} more variants <i className="fa fa-chevron-down ms-1"></i></>
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default VariantSelector;