import React, { useState, useEffect } from 'react';
import { get_colors_by_variant } from '../../hooks/get_colors';
import { ENV } from '../../conf/env';
import './colorPicker.css';
import { useDesignerStore } from "./designer.store";

const ColorPicker = () => {
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const setColor = useDesignerStore(state => state.setColor);
    const selectedColor = useDesignerStore(state => state.selectedColor);
    const selectedVariant = useDesignerStore(state => state.selectedVariant);

    useEffect(() => {
        if (selectedVariant) {
            fetchColorsByVariant(selectedVariant.name);
        }
    }, [selectedVariant]);

    const fetchColorsByVariant = async (variantName) => {
        try {
            setLoading(true);
            const response = await get_colors_by_variant(variantName);
            setColors(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Error fetching colors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectColor = (color) => {
        setColor(color);
    };

    // Mostrar solo 4 colores inicialmente, o todos si expanded es true
    const displayedColors = expanded ? colors : colors.slice(0, 4);

    if (!selectedVariant) {
        return (
            <div className="color-selector-card">
                <div className="color-header">
                    <h5>Choose Color</h5>
                </div>
                <div className="color-body text-center py-4">
                    <p className="text-muted mb-0">Please select a variant first</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="color-selector-card">
                <div className="color-header">
                    <h5>Choose Color</h5>
                </div>
                <div className="color-body text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2 mb-0">Loading colors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="color-selector-card">
            <div className="color-header">
                <h5>Choose Color</h5>
                {selectedColor && (
                    <span className="selected-badge">
                        <i className="fa fa-check-circle"></i> Selected
                    </span>
                )}
            </div>

            <div className="color-body">
                {colors.length === 0 ? (
                    <div className="text-center py-4">
                        <i className="fa fa-paint-brush fa-3x text-muted mb-3"></i>
                        <p className="text-muted mb-0">No colors available for this variant</p>
                    </div>
                ) : (
                    <>
                        {/* Color seleccionado (si hay) */}
                        {selectedColor && (
                            <div className="selected-color-preview mb-3">
                                <strong>Selected:</strong>
                                <div className="d-flex align-items-center mt-2">
                                    <div className="selected-color-swatch"
                                         style={{
                                             backgroundColor: selectedColor.color_code,
                                             border: selectedColor.color_name === 'White' ? '2px solid #ddd' : 'none'
                                         }}>
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="mb-1">{selectedColor.color_name}</h6>
                                        <small className="text-muted">{selectedColor.color_code}</small>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grid de colores */}
                        <div className="colors-grid">
                            {displayedColors.map(color => {
                                const isSelected = selectedColor?.id === color.id;

                                return (
                                    <button
                                        key={color.id}
                                        className={`color-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleSelectColor(color)}
                                    >
                                        <div className="color-image-wrapper">
                                            <div
                                                className="color-swatch"
                                                style={{
                                                    backgroundColor: color.color_code,
                                                    border: color.color_name === 'White' ? '2px solid #ddd' : 'none'
                                                }}
                                            />
                                            {isSelected && (
                                                <div className="selected-overlay">
                                                    <i className="fa fa-check-circle"></i>
                                                </div>
                                            )}
                                        </div>
                                        <span className="color-name">{color.color_name}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Botón Ver más / Ver menos */}
                        {colors.length > 4 && (
                            <button
                                className="see-more-btn"
                                onClick={() => setExpanded(!expanded)}
                            >
                                {expanded ? (
                                    <>Show less <i className="fa fa-chevron-up ms-1"></i></>
                                ) : (
                                    <>Show {colors.length - 4} more colors <i className="fa fa-chevron-down ms-1"></i></>
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ColorPicker;