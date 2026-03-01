import { useState, useEffect } from 'react';
import { useDesignerStore } from "../Designs/designer.store";

export default function FontSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const setFont = useDesignerStore(s => s.setFont);
    const currentFont = useDesignerStore(s => s.font);

    // Lista de fuentes llamativas y creativas
    const fonts = [
        { name: 'Montserrat', value: "'Montserrat', sans-serif", googleName: 'Montserrat', category: 'Moderno', weight: '700' },
        { name: 'Poppins', value: "'Poppins', sans-serif", googleName: 'Poppins', category: 'Elegante', weight: '600' },
        { name: 'Roboto', value: "'Roboto', sans-serif", googleName: 'Roboto', category: 'Moderno', weight: '500' },
        { name: 'Open Sans', value: "'Open Sans', sans-serif", googleName: 'Open Sans', category: 'Legible', weight: '600' },
        { name: 'Lato', value: "'Lato', sans-serif", googleName: 'Lato', category: 'Elegante', weight: '700' },
        { name: 'Raleway', value: "'Raleway', sans-serif", googleName: 'Raleway', category: 'Sofisticado', weight: '600' },
        { name: 'Playfair Display', value: "'Playfair Display', serif", googleName: 'Playfair Display', category: 'Clásico', weight: '700' },
        { name: 'Oswald', value: "'Oswald', sans-serif", googleName: 'Oswald', category: 'Impactante', weight: '500' },
        { name: 'Merriweather', value: "'Merriweather', serif", googleName: 'Merriweather', category: 'Formal', weight: '700' },
        { name: 'Bebas Neue', value: "'Bebas Neue', sans-serif", googleName: 'Bebas Neue', category: 'Display', weight: '400' },
        { name: 'Anton', value: "'Anton', sans-serif", googleName: 'Anton', category: 'Impactante', weight: '400' },
        { name: 'Pacifico', value: "'Pacifico', cursive", googleName: 'Pacifico', category: 'Script', weight: '400' },
        { name: 'Dancing Script', value: "'Dancing Script', cursive", googleName: 'Dancing Script', category: 'Elegante', weight: '700' },
        { name: 'Lobster', value: "'Lobster', cursive", googleName: 'Lobster', category: 'Creativo', weight: '400' },
        { name: 'Bangers', value: "'Bangers', cursive", googleName: 'Bangers', category: 'Comic', weight: '400' },
        { name: 'Righteous', value: "'Righteous', cursive", googleName: 'Righteous', category: 'Retro', weight: '400' },
        { name: 'Luckiest Guy', value: "'Luckiest Guy', cursive", googleName: 'Luckiest Guy', category: 'Divertido', weight: '400' },
        { name: 'Chewy', value: "'Chewy', cursive", googleName: 'Chewy', category: 'Comic', weight: '400' },
        { name: 'Fredoka One', value: "'Fredoka One', cursive", googleName: 'Fredoka One', category: 'Redondeado', weight: '400' },
        { name: 'Permanent Marker', value: "'Permanent Marker', cursive", googleName: 'Permanent Marker', category: 'Manuscrito', weight: '400' },
        { name: 'Shadows Into Light', value: "'Shadows Into Light', cursive", googleName: 'Shadows Into Light', category: 'Script', weight: '400' },
        { name: 'Kaushan Script', value: "'Kaushan Script', cursive", googleName: 'Kaushan Script', category: 'Elegante', weight: '400' },
        { name: 'Satisfy', value: "'Satisfy', cursive", googleName: 'Satisfy', category: 'Manuscrito', weight: '400' },
        { name: 'Great Vibes', value: "'Great Vibes', cursive", googleName: 'Great Vibes', category: 'Formal', weight: '400' },
        { name: 'Sacramento', value: "'Sacramento', cursive", googleName: 'Sacramento', category: 'Delicado', weight: '400' },
        { name: 'Abril Fatface', value: "'Abril Fatface', serif", googleName: 'Abril Fatface', category: 'Elegante', weight: '400' },
        { name: 'Alfa Slab One', value: "'Alfa Slab One', serif", googleName: 'Alfa Slab One', category: 'Slab', weight: '400' },
        { name: 'Press Start 2P', value: "'Press Start 2P', cursive", googleName: 'Press Start 2P', category: 'Retro', weight: '400' },
        // Fuentes seguras como respaldo
        { name: 'Arial', value: 'Arial, sans-serif', googleName: null, category: 'Segura', weight: 'bold' },
        { name: 'Impact', value: 'Impact, sans-serif', googleName: null, category: 'Segura', weight: '400' },
        { name: 'Georgia', value: 'Georgia, serif', googleName: null, category: 'Segura', weight: 'bold' },
        { name: 'Courier New', value: 'Courier New, monospace', googleName: null, category: 'Segura', weight: 'bold' }
    ];

    // Función para precargar fuentes para el canvas
    const preloadFontsForCanvas = () => {
        if (typeof window === 'undefined') return;

        // Crear un div oculto para precargar todas las fuentes
        const preloadDiv = document.createElement('div');
        preloadDiv.style.position = 'absolute';
        preloadDiv.style.left = '-9999px';
        preloadDiv.style.top = '-9999px';
        preloadDiv.style.opacity = '0';
        preloadDiv.style.pointerEvents = 'none';

        fonts.forEach(font => {
            if (font.googleName) {
                const span = document.createElement('span');
                span.style.fontFamily = font.value;
                span.style.fontSize = '1px';
                span.textContent = '.';
                preloadDiv.appendChild(span);
            }
        });

        document.body.appendChild(preloadDiv);

        // Usar FontFace API para precargar
        const loadPromises = fonts
            .filter(font => font.googleName)
            .map(font => {
                const fontFace = new FontFace(
                    font.googleName,
                    `url(https://fonts.googleapis.com/css2?family=${font.googleName.replace(' ', '+')}:wght@${font.weight || '400'}&display=swap)`
                );

                return fontFace.load().catch(e => {
                    return null;
                });
            });

        Promise.all(loadPromises).then(() => {
            setFontsLoaded(true);


            // Eliminar el div después de cargar
            setTimeout(() => {
                if (document.body.contains(preloadDiv)) {
                    document.body.removeChild(preloadDiv);
                }
            }, 1000);
        });
    };

    // Agregar Google Fonts al documento
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Cargar Google Fonts
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Lato:wght@400;700&family=Raleway:wght@400;600;700&family=Playfair+Display:wght@400;700&family=Oswald:wght@400;500;700&family=Merriweather:wght@400;700&family=Bebas+Neue&family=Anton&family=Pacifico&family=Dancing+Script:wght@400;700&family=Lobster&family=Bangers&family=Righteous&family=Luckiest+Guy&family=Chewy&family=Fredoka+One&family=Permanent+Marker&family=Shadows+Into+Light&family=Kaushan+Script&family=Satisfy&family=Great+Vibes&family=Sacramento&family=Abril+Fatface&family=Alfa+Slab+One&family=Press+Start+2P&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Precargar fuentes para canvas
        preloadFontsForCanvas();

        // También cargar fuentes directamente usando FontFace API
        const fontFaces = [
            // Ejemplo de cómo cargar algunas fuentes críticas
            new FontFace('Poppins', 'url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2)'),
            new FontFace('Montserrat', 'url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2)'),
            new FontFace('Lobster', 'url(https://fonts.gstatic.com/s/lobster/v28/neILzCirqoswsqX9zoKmMw.woff2)'),
        ];

        fontFaces.forEach(fontFace => {
            fontFace.load().then(loadedFont => {
                document.fonts.add(loadedFont);
            }).catch();
        });

    }, []);

    const handleFontSelect = (fontValue, fontName) => {
        setFont(fontValue);
        setIsOpen(false);

        // Notificar al padre que la fuente cambió (si es necesario)
        if (typeof window !== 'undefined') {
            // Disparar evento personalizado para que DesignerCanvas lo escuche
            const event = new CustomEvent('fontChanged', {
                detail: {
                    font: fontValue,
                    fontName: fontName
                }
            });
            window.dispatchEvent(event);
        }
    };

    const getCurrentFontName = () => {
        const found = fonts.find(f => f.value === currentFont);
        return found ? found.name : 'Seleccionar fuente';
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Moderno': '#4f46e5',
            'Elegante': '#059669',
            'Legible': '#2563eb',
            'Sofisticado': '#7c3aed',
            'Clásico': '#dc2626',
            'Impactante': '#ea580c',
            'Formal': '#0891b2',
            'Display': '#be185d',
            'Script': '#9333ea',
            'Creativo': '#ec4899',
            'Comic': '#f59e0b',
            'Retro': '#d97706',
            'Divertido': '#65a30d',
            'Redondeado': '#0d9488',
            'Manuscrito': '#b45309',
            'Delicado': '#db2777',
            'Slab': '#c2410c',
            'Segura': '#6b7280'
        };
        return colors[category] || '#6b7280';
    };

    return (
        <div style={{ position: 'relative', width: '100%', marginTop:'10px' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#fff',
                    fontSize: '16px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    fontFamily: currentFont || "'Poppins', sans-serif",
                    fontWeight: 'bold'
                }}
                onMouseEnter={(e) => e.target.style.borderColor = '#4f46e5'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
                <span style={{
                    fontFamily: currentFont || "'Poppins', sans-serif",
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: '#1f2937'
                }}>
                    {getCurrentFontName()}
                </span>
                {!fontsLoaded && (
                    <span style={{
                        fontSize: '10px',
                        backgroundColor: '#fbbf24',
                        color: '#78350f',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        marginRight: '8px'
                    }}>
                        Cargando...
                    </span>
                )}
                <span style={{
                    fontSize: '20px',
                    color: '#4f46e5',
                    transition: 'transform 0.3s',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    marginTop: '8px',
                    zIndex: 1000,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        padding: '12px 16px',
                        backgroundColor: '#f8fafc',
                        borderBottom: '1px solid #e5e7eb',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1
                    }}>
                        <input
                            type="text"
                            placeholder="🔍 Buscar fuente..."
                            onChange={(e) => {
                                const search = e.target.value.toLowerCase();
                                const items = document.querySelectorAll('.font-item');
                                items.forEach(item => {
                                    const fontName = item.getAttribute('data-name').toLowerCase();
                                    item.style.display = fontName.includes(search) ? 'flex' : 'none';
                                });
                            }}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    {fonts.map((font, index) => (
                        <button
                            key={index}
                            data-name={font.name}
                            className="font-item"
                            onClick={() => handleFontSelect(font.value, font.name)}
                            style={{
                                padding: '12px 16px',
                                width: '100%',
                                textAlign: 'left',
                                border: 'none',
                                borderBottom: '1px solid #f3f4f6',
                                backgroundColor: currentFont === font.value ? '#eef2ff' : '#fff',
                                cursor: 'pointer',
                                fontFamily: font.value,
                                fontSize: '16px',
                                fontWeight: font.weight || 'bold',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (currentFont !== font.value) {
                                    e.target.style.backgroundColor = '#f8fafc';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentFont !== font.value) {
                                    e.target.style.backgroundColor = '#fff';
                                }
                            }}
                        >
                            <span style={{
                                fontFamily: font.value,
                                fontWeight: font.weight || 'bold',
                                fontSize: '18px',
                                color: currentFont === font.value ? '#4f46e5' : '#1f2937'
                            }}>
                                {font.name}
                            </span>
                            <span style={{
                                fontSize: '12px',
                                backgroundColor: getCategoryColor(font.category),
                                color: '#fff',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontWeight: '500'
                            }}>
                                {font.category}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}