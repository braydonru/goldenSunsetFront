import React, { useState, useEffect } from 'react';
import './OrderVisualizer.css';
import { ENV } from "../../conf/env";
import { productRenderers } from "../Orders/ProductRenderers";

// Simple Image Renderer (solo como fallback)
const ImageRenderer = ({ imageUrl, owner, onLoad, alt = "Design" }) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setHasError(false);
        setIsLoading(true);
    }, [imageUrl]);

    const handleImageLoad = () => {
        setIsLoading(false);
        if (onLoad) onLoad();
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
        if (onLoad) onLoad();
    };

    if (!imageUrl) {
        return (
            <div className="image-error">
                <i className="fa fa-exclamation-circle"></i>
                <p>No image URL provided</p>
            </div>
        );
    }

    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${ENV.API_URL}${imageUrl}`;

    return (
        <div className="image-renderer">
            {isLoading && (
                <div className="image-loading-overlay">
                    <i className="fa fa-spinner fa-spin"></i>
                </div>
            )}

            {hasError ? (
                <div className="image-error">
                    <i className="fa fa-exclamation-circle"></i>
                    <p>Failed to load image</p>
                    <small>URL: {imageUrl}</small>
                </div>
            ) : (
                <img
                    src={fullUrl}
                    alt={`${alt} for ${owner}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        display: isLoading ? 'none' : 'block'
                    }}
                />
            )}
        </div>
    );
};

const OrderVisualizer = ({ orden, onClose }) => {
    const {
        id,
        owner,
        type,
        size,
        color,
        specification,
        font,
        date,
        imageUrl,
        previewImageUrl,
        client_img,
        client_img_back,
        preview_img,
        preview_img_back,
        variation,
        qantity,
        price
    } = orden || {};

    const [frontImageLoaded, setFrontImageLoaded] = useState(false);
    const [backImageLoaded, setBackImageLoaded] = useState(false);
    const [activeView, setActiveView] = useState('front');

    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && onClose) onClose();
        };
        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Determinar qué vistas están disponibles
    const frontImageUrl = preview_img || client_img || previewImageUrl || imageUrl;
    const hasFrontDesign = !!frontImageUrl;

    const backImageUrl = preview_img_back || client_img_back;
    const hasBackDesign = !!backImageUrl;

    const hasBothDesigns = hasFrontDesign && hasBackDesign;

    useEffect(() => {
        if (hasBothDesigns) {
            setActiveView('front');
        } else if (hasFrontDesign) {
            setActiveView('front');
        } else if (hasBackDesign) {
            setActiveView('back');
        }
    }, [hasFrontDesign, hasBackDesign, hasBothDesigns]);

    // Función para obtener el renderer adecuado según el tipo de producto
    const getProductRenderer = () => {
        // Mapeo de tipos de producto a los keys en productRenderers
        const typeMap = {
            'Taza': 'Cup',
            'Mug': 'Cup',
            'Cup': 'Cup',
            'Termo': 'Thermo',
            'Thermo': 'Thermo',
            'T-Shirt': 'T-Shirt',
            'Camiseta': 'T-Shirt',
            'Pullover': 'Pullover' // Pullover se maneja aparte
        };

        const rendererKey = typeMap[type] || type;
        return productRenderers[rendererKey];
    };

    const buildImageUrl = (relativeUrl) => {
        if (!relativeUrl) return null;
        return relativeUrl.startsWith('http') ? relativeUrl : `${ENV.API_URL}${relativeUrl}`;
    };

    const handleDownload = async (side = 'all') => {
        try {
            const imagesToDownload = [];

            if (side === 'all' || side === 'front') {
                const frontUrl = buildImageUrl(client_img || preview_img || imageUrl);
                if (frontUrl) {
                    imagesToDownload.push({
                        url: frontUrl,
                        name: `order-${id}-${side === 'all' ? 'front' : ''}.png`
                    });
                }
            }

            if (side === 'all' || side === 'back') {
                const backUrl = buildImageUrl(client_img_back || preview_img_back);
                if (backUrl) {
                    imagesToDownload.push({
                        url: backUrl,
                        name: `order-${id}-${side === 'all' ? 'back' : ''}.png`
                    });
                }
            }

            if (imagesToDownload.length === 0) {
                alert('No images available for download');
                return;
            }

            for (const image of imagesToDownload) {
                try {
                    const response = await fetch(image.url);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement('a');
                    link.href = url;
                    link.download = image.name;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    await new Promise(resolve => setTimeout(resolve, 100));
                    window.URL.revokeObjectURL(url);
                } catch (error) {
                    alert(`Error downloading ${image.name}: ${error.message}`);
                }
            }

            if (imagesToDownload.length === 1) {
                alert('Image downloaded successfully');
            } else {
                alert(`${imagesToDownload.length} images downloaded successfully`);
            }
        } catch (err) {
            alert('Error downloading images');
        }
    };

    const handleDownloadAll = () => {
        if (hasBothDesigns) {
            if (window.confirm('Do you want to download both front and back images?')) {
                handleDownload('all');
            }
        } else if (hasFrontDesign) {
            handleDownload('front');
        } else if (hasBackDesign) {
            handleDownload('back');
        }
    };

    if (!orden) return null;

    // Obtener el renderer específico para este producto
    const Renderer = getProductRenderer();
    const isPullover = type === 'Pullover';
    const is3DProduct = type === 'Cup' || type === 'Thermo' || type === 'Taza' || type === 'Termo' || type === 'Mug';


    return (
        <div className="orden-visualizador-overlay">
            <div className="orden-visualizador-container">
                <button className="close-btn" onClick={onClose}>
                    <i className="fa fa-times"></i>
                </button>

                <div className="orden-visualizador-content">
                    {/* PANEL DETALLES */}
                    <div className="detalles-panel">
                        <div className="detalles-header">
                            <h3>Order Details</h3>
                            <span className="orden-id">ID: #{id}</span>
                        </div>

                        <div className="detalles-content">
                            <div className="detalle-item">
                                <span>Owner:</span> {owner}
                            </div>
                            <div className="detalle-item">
                                <span>Type:</span> {type}
                                {is3DProduct && <span className="badge-3d"> 3D</span>}
                            </div>
                            <div className="detalle-item">
                                <span>Size:</span> {size}
                            </div>
                            <div className="detalle-item">
                                <span>Color:</span> {color}
                            </div>
                            <div className="detalle-item">
                                <span>Date:</span> {new Date(date).toLocaleDateString()}
                            </div>
                            <div className="detalle-item">
                                <span>Font:</span> {font}
                            </div>
                            <div className="detalle-item">
                                <span>Specification:</span> {specification}
                            </div>
                            <div className="detalle-item">
                                <span>Variation:</span> {variation}
                            </div>
                            <div className="detalle-item">
                                <span>Quantity:</span> {qantity}
                            </div>
                            <div className="detalle-item">
                                <span>Price:</span> {price}
                            </div>

                            {/* Indicador de diseños disponibles */}
                            <div className="designs-summary">
                                <h4>Designs Available:</h4>
                                <div className="designs-list">
                                    <div className={`design-item ${hasFrontDesign ? 'available' : 'unavailable'}`}>
                                        <i className={`fa fa-${hasFrontDesign ? 'check-circle' : 'times-circle'}`}></i>
                                        <span>Front Design</span>
                                        {hasFrontDesign && (
                                            <span className="design-type">
                                                {client_img ? 'Original Image' : 'Preview'}
                                            </span>
                                        )}
                                    </div>
                                    <div className={`design-item ${hasBackDesign ? 'available' : 'unavailable'}`}>
                                        <i className={`fa fa-${hasBackDesign ? 'check-circle' : 'times-circle'}`}></i>
                                        <span>Back Design</span>
                                        {hasBackDesign && (
                                            <span className="design-type">
                                                {client_img_back ? 'Original Image' : 'Preview'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="acciones-panel">
                                {/* Botones de descarga */}
                                <div className="download-buttons">
                                    {isPullover && hasBothDesigns ? (
                                        <>
                                            <button
                                                className="btn-descargar btn-descargar-all"
                                                onClick={handleDownloadAll}
                                            >
                                                <i className="fa fa-download"></i>
                                                Download Both Images
                                            </button>
                                            <div className="download-options">
                                                <button
                                                    className="btn-descargar-option"
                                                    onClick={() => handleDownload('front')}
                                                    disabled={!hasFrontDesign}
                                                >
                                                    <i className="fa fa-tshirt"></i> Front Only
                                                </button>
                                                <button
                                                    className="btn-descargar-option"
                                                    onClick={() => handleDownload('back')}
                                                    disabled={!hasBackDesign}
                                                >
                                                    <i className="fa fa-tshirt fa-flip-horizontal"></i> Back Only
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <button
                                            className="btn-descargar"
                                            onClick={handleDownloadAll}
                                            disabled={!hasFrontDesign && !hasBackDesign}
                                        >
                                            <i className="fa fa-download"></i>
                                            {hasBothDesigns ? 'Download Both Images' :
                                                hasFrontDesign ? 'Download Front Image' :
                                                    hasBackDesign ? 'Download Back Image' :
                                                        'No Images Available'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PANEL VISOR */}
                    <div className="imagen-panel">
                        <div className="imagen-header">
                            <h3>
                                {isPullover && hasBothDesigns
                                    ? `Product Preview - ${activeView === 'front' ? 'Front' : 'Back'}`
                                    : is3DProduct ? '3D Product Preview' : 'Product Preview'}
                            </h3>
                        </div>

                        <div className="imagen-container">
                            {/* Para Pullovers (usan ImageRenderer con front/back) */}
                            {isPullover && (
                                <>
                                    {activeView === 'front' && hasFrontDesign && (
                                        <div className="design-view front-view">
                                            <ImageRenderer
                                                imageUrl={frontImageUrl}
                                                owner={owner}
                                                onLoad={() => setFrontImageLoaded(true)}
                                                alt="Front Design"
                                            />
                                            <div className="view-label">
                                                <i className="fa fa-tshirt"></i> Front Design
                                            </div>
                                        </div>
                                    )}

                                    {activeView === 'back' && hasBackDesign && (
                                        <div className="design-view back-view">
                                            <ImageRenderer
                                                imageUrl={backImageUrl}
                                                owner={owner}
                                                onLoad={() => setBackImageLoaded(true)}
                                                alt="Back Design"
                                            />
                                            <div className="view-label">
                                                <i className="fa fa-tshirt fa-flip-horizontal"></i> Back Design
                                            </div>
                                        </div>
                                    )}

                                    {((activeView === 'front' && !hasFrontDesign) ||
                                        (activeView === 'back' && !hasBackDesign)) && (
                                        <div className="no-design-message">
                                            <i className="fa fa-exclamation-triangle"></i>
                                            <h3>No {activeView} design available</h3>
                                            <p>This order only has {hasFrontDesign ? 'front' : hasBackDesign ? 'back' : 'no'} design</p>
                                            {hasFrontDesign && activeView === 'back' && (
                                                <button
                                                    className="btn-switch-view"
                                                    onClick={() => setActiveView('front')}
                                                >
                                                    Switch to Front View
                                                </button>
                                            )}
                                            {hasBackDesign && activeView === 'front' && (
                                                <button
                                                    className="btn-switch-view"
                                                    onClick={() => setActiveView('back')}
                                                >
                                                    Switch to Back View
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Para productos 3D (usan MugViewer o MugViewerForThermo) */}
                            {!isPullover && Renderer && hasFrontDesign && (
                                <Renderer
                                    imageUrl={frontImageUrl}  // 👈 Pasar la URL sin construir, que el renderer la construya
                                    owner={owner}
                                    onLoad={() => setFrontImageLoaded(true)}
                                />
                            )}

                            {/* Fallback para productos sin renderer específico */}
                            {!isPullover && !Renderer && hasFrontDesign && (
                                <ImageRenderer
                                    imageUrl={frontImageUrl}
                                    owner={owner}
                                    onLoad={() => setFrontImageLoaded(true)}
                                    alt="Product Design"
                                />
                            )}

                            {/* Mensaje si no hay diseño disponible */}
                            {!hasFrontDesign && !hasBackDesign && (
                                <div className="no-design-message">
                                    <i className="fa fa-exclamation-triangle"></i>
                                    <h3>No design available</h3>
                                    <p>This order has no design images</p>
                                </div>
                            )}
                        </div>

                        {/* Navegación entre vistas para pullovers con ambos diseños */}
                        {isPullover && hasBothDesigns && (
                            <div className="view-navigation">
                                <button
                                    className="nav-btn prev-btn"
                                    onClick={() => setActiveView('front')}
                                    disabled={activeView === 'front'}
                                >
                                    <i className="fa fa-chevron-left"></i> Front
                                </button>

                                <div className="view-indicator">
                                    <span className={`indicator-dot ${activeView === 'front' ? 'active' : ''}`}></span>
                                    <span className={`indicator-dot ${activeView === 'back' ? 'active' : ''}`}></span>
                                </div>

                                <button
                                    className="nav-btn next-btn"
                                    onClick={() => setActiveView('back')}
                                    disabled={activeView === 'back'}
                                >
                                    Back <i className="fa fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderVisualizer;