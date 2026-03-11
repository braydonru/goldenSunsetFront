import React, {useRef, useState, useEffect} from 'react';
import {useDesignerStore} from "../Designs/designer.store";
import {ENV} from "../../conf/env";
import {useAuthStore} from "../../store/auth.store";

export default function MugCustomizer({
                                          onImageUpload,   // recibe File
                                          onReset,
                                          currentImage,    // string (objectUrl) que viene del padre
                                          id
                                      }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const quantity = useDesignerStore(state => state.quantity)
    const {setQuantity} = useDesignerStore()
    const [basePrice, setBasePrice] = useState(0);
    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(true);
    const [validationError, setValidationError] = useState("")
    const [showValidation, setShowValidation] = useState(false)
    const totalprice = useDesignerStore(state => state.totalprice)
    const {setTotalprice} = useDesignerStore()



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


    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setQuantity(Math.max(1, value));
    }

    // ================= OBTENER PRODUCTO =================
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setProductLoading(true);
                const response = await fetch(`${ENV.API_URL}/product/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error('Error fetching product');

                const data = await response.json();
                setProduct(data);
                setBasePrice(data.price || 0);

            } catch (error) {
                console.error('Error fetching product:', error);
                setValidationError('Could not load product details');
                setShowValidation(true);
            } finally {
                setProductLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);


    // ================= CALCULAR PRECIO TOTAL =================
    useEffect(() => {
        let price = basePrice;

        price *= quantity;

        setTotalprice(price || 0);
    }, [basePrice, quantity]);



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
            <h3 style={{textAlign: 'center'}}>🎨 Personalize mug</h3>

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
                <p>{currentImage ? 'Change image' : 'Upload image'}</p>
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
                    {currentImage ? 'Change' : 'Upload'}
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
            <div style={{marginBottom: 15}}>
                <label style={labelStyle}>Quantity</label>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    style={inputStyle}
                />
            </div>
            <div style={{
                marginBottom: 15,
                padding: "15px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #6a5acd 0%, #8a7ad9 100%)",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 4px 12px rgba(106, 90, 205, 0.3)"
            }}>
                <span style={{fontSize: 16, fontWeight: 500}}>Total Price:</span>
                <span style={{fontSize: 24, fontWeight: 700}}>${totalprice.toFixed(2)}</span>
            </div>
        </div>


    );
}

const inputStyle = {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ddd",
    fontSize: 14,
    marginTop: 4
}

const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase"
}