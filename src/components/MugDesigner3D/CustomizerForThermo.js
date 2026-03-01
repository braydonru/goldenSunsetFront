import React, { useRef, useState } from 'react';

export default function CustomizerForThermo({
                                          onImageUpload,   // recibe File
                                          onReset,
                                          currentImage,    // string (objectUrl) que viene del padre
                                      }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Solo imágenes');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Máximo 5MB');
            return;
        }

        const objectUrl = URL.createObjectURL(file);

        // 🔥 ahora mandamos ambos
        onImageUpload(objectUrl, file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div style={{
            background: '#fff',
            padding: 20,
            borderRadius: 12,
            boxShadow: '0 5px 20px rgba(0,0,0,.1)'
        }}>
            <h3 style={{ textAlign: 'center' }}>🎨 Personalize Thermo</h3>

            <div
                onClick={triggerFileInput}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
                style={{
                    border: '2px dashed #4CAF50',
                    borderRadius: 8,
                    padding: 20,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: isDragging ? '#e8f5e9' : '#f8f9fa',
                    marginBottom: 15
                }}
            >
                <p>{currentImage ? 'Cambiar imagen' : 'Subir imagen'}</p>
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {currentImage && (
                <div style={{ marginBottom: 15 }}>
                    <img
                        src={currentImage}
                        alt="preview"
                        style={{
                            width: '100%',
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 6,
                            border: '1px solid #4CAF50'
                        }}
                    />
                </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
                <button
                    onClick={triggerFileInput}
                    style={{
                        flex: 1,
                        padding: 10,
                        background: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6
                    }}
                >
                    {currentImage ? 'Cambiar' : 'Subir'}
                </button>

                {currentImage && (
                    <button
                        onClick={onReset}
                        style={{
                            flex: 1,
                            padding: 10,
                            background: '#f44336',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6
                        }}
                    >
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}
