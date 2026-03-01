import { useEffect, useState } from 'react';
import { useDesignerStore } from './designer.store';
import { ENV } from '../../conf/env';
import { get_colors_by_variant } from '../../hooks/get_colors';
import './colorPicker.css';

const isDark = (hex) => {
    if (!hex || typeof hex !== 'string') return false;
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 140;
};

export default function ColorPicker({ onChange }) {
    const { setColor, selectedColor: storeColor, selectedVariant } = useDesignerStore();
    const [selected, setSelected] = useState('#000000');
    const [expanded, setExpanded] = useState(false);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageErrors, setImageErrors] = useState({});

    // Función para obtener la URL completa de la imagen
    const getFullImageUrl = (path) => {
        if (!path) return '/img/placeholder.jpg';
        // Si ya es una URL completa, devolverla
        if (path.startsWith('http')) return path;
        // Asegurarse de que no haya doble slash
        const baseUrl = ENV.API_URL.replace(/\/+$/, '');
        const cleanPath = path.replace(/^\/+/, '');
        return `${baseUrl}/${cleanPath}`;
    };

    // Cargar colores según la variante seleccionada
    useEffect(() => {
        const fetchColors = async () => {
            if (!selectedVariant) {
                setColors([]);
                return;
            }
            try {
                setLoading(true);
                // Usar el nombre de la variante para filtrar
                const response = await get_colors_by_variant(selectedVariant.name);
                console.log('Colors for variant:', response);

                // Formatear colores de la API
                const formattedColors = (response || []).map(color => ({
                    id: color.id,
                    name: color.color_name,
                    value: color.color_code,
                    frontImage: color.front_image_path,
                    backImage: color.back_image_path
                }));

                setColors(formattedColors);




                if (formattedColors.length > 0 && !storeColor) {
                    handleColorSelect(formattedColors[0]);
                }
            } catch (error) {
                console.error('Error fetching colors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchColors();
    }, [selectedVariant]);


    // Inicializar selected desde store
    useEffect(() => {
        if (storeColor && typeof storeColor === 'string') {
            setSelected(storeColor);
        }
    }, [storeColor]);

    const handleColorSelect = (color) => {
        let colorValue = color.value || '#000000';

        setSelected(colorValue);
        localStorage.setItem('color', colorValue);

        // Actualizar store con el objeto color completo para tener acceso a las imágenes
        setColor(color);

        if (onChange) {
            onChange(color);
        }
    };


    const handleImageError = (colorId) => {
        setImageErrors(prev => ({ ...prev, [colorId]: true }));
    };

    const displayedColors = expanded ? colors : colors.slice(0, 12);

    // Mensaje si no hay variante seleccionada
    if (!selectedVariant) {
        return (
            <div className="color-picker">
                <h5 className="font-weight-semi-bold mb-4">Choose Color</h5>
                <div className="text-center p-4 bg-light rounded">
                    <p className="text-muted mb-0">
                        Please select a variant first
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="color-picker">
                <h5 className="font-weight-semi-bold mb-4">Choose Color</h5>
                <div className="loading-spinner">
                    <i className="fa fa-spinner fa-spin"></i> Loading colors...
                </div>
            </div>
        );
    }

    if (colors.length === 0) {
        return (
            <div className="color-picker">
                <h5 className="font-weight-semi-bold mb-4">Choose Color</h5>
                <div className="text-center p-4 bg-light rounded">
                    <i className="fa fa-paint-brush fa-2x text-muted mb-3"></i>
                    <p className="text-muted mb-0">
                        No colors available for this variant
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="color-picker">
            <h5 className="font-weight-semi-bold mb-4">
                Choose Color - {selectedVariant.name}
            </h5>

            <div className="selected">
                Selected Color:
                <strong>
                    {colors.find(c => c.value === selected)?.name || 'Unknown'}
                </strong>
                <span
                    className="preview"
                    style={{ backgroundColor: selected }}
                />
            </div>

            {/* Previsualización de imágenes si hay color seleccionado */}
            {storeColor && storeColor.frontImage && (
                <div className="color-previews mb-3">
                    <div className="preview-images">
                        <div className="preview-item">
                            <img
                                src={getFullImageUrl(storeColor.frontImage)}
                                alt="Front"
                                className="preview-image"
                                onError={(e) => {
                                    e.target.src = '/img/placeholder.jpg';
                                }}
                            />
                            <span>Front</span>
                        </div>
                        {storeColor.backImage && (
                            <div className="preview-item">
                                <img
                                    src={getFullImageUrl(storeColor.backImage)}
                                    alt="Back"
                                    className="preview-image"
                                    onError={(e) => {
                                        e.target.src = '/img/placeholder.jpg';
                                    }}
                                />
                                <span>Back</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="grid">
                {displayedColors.map((color, index) => {
                    const isSelected = selected === color.value;

                    return (
                        <button
                            key={color.id || `color-${index}`}
                            title={color.name}
                            className={`color ${isSelected ? 'active' : ''}`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => handleColorSelect(color)}
                        >
                            {isSelected && (
                                <span
                                    className="check"
                                    style={{ color: isDark(color.value) ? '#fff' : '#000' }}
                                >
                                    ✓
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {colors.length > 12 && (
                <button className="more" onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'See less' : `See ${colors.length - 12} more`}
                </button>
            )}
        </div>
    );
}