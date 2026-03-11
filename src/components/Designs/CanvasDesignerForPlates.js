import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useAuthStore } from '../../store/auth.store'
import { ENV } from "../../conf/env";
import { useDesignerStore } from "./designer.store";
import ViewerForPlates from '../MugDesigner3D/ViewerForPlates';
import {useParams} from "react-router-dom";

// Mapeo de tamaños a dimensiones de canvas
const SIZE_TO_CANVAS = {
    '8" x 10"': { width: 400, height: 500 },
    '11" x 14"': { width: 440, height: 560 },
    '6" x 8"': { width: 360, height: 480 },
    '4" x 6"': { width: 320, height: 480 },
    'default': { width: 400, height: 500 }
};

const CAR_PLATE_DIMENSIONS = { width: 500, height: 300 };

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = ENV.API_URL.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');
    return `${baseUrl}/${cleanPath}`;
};

export default function DesignerCanvas() {
    const {id} = useParams();
    const resetDesignerState = useDesignerStore(s => s.resetDesignerState);

    useEffect(() => {
        // Resetear el estado al montar el componente
        resetDesignerState();
    }, [resetDesignerState]);

    const { user, access_token } = useAuthStore()
    const canvasRef = useRef(null)
    const viewerRef = useRef(null)

    // Store
    const specification = useDesignerStore(s => s.specification)
    const size = useDesignerStore(s => s.size)
    const selectedVariant = useDesignerStore(state => state.selectedVariant);

    // Estados
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 400, height: 500 })
    const [imageLoadError, setImageLoadError] = useState(null)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [uploadedImage, setUploadedImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    // Estados para mensajes
    const [errorMessage, setErrorMessage] = useState("")
    const [showError, setShowError] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)

    // Refs
    const baseImageRef = useRef(null)
    const uploadedImageRef = useRef(null)
    const lastMousePosRef = useRef({ x: 0, y: 0 })
    const imageStateRef = useRef({
        x: 200,
        y: 250,
        scale: 0.5,
        rotation: 0
    })

    const [currentQuantity, setCurrentQuantity] = useState(1)
    const [productLoading, setProductLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [basePrice, setBasePrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [validationError, setValidationError] = useState("")
    const [showValidation, setShowValidation] = useState(false)

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

        price *= currentQuantity;

        setTotalPrice(price);
    }, [basePrice, currentQuantity]);


    // Detectar Car Plate
    const isCarPlate = useCallback(() => {
        if (!selectedVariant) return false
        const name = selectedVariant.name?.toLowerCase() || ''
        return name.includes('car plate') || name.includes('carplate') || name === 'car'
    }, [selectedVariant])

    // Actualizar dimensiones según tipo
    useEffect(() => {
        if (isCarPlate()) {
            setCanvasDimensions(CAR_PLATE_DIMENSIONS)
        } else if (size && SIZE_TO_CANVAS[size]) {
            setCanvasDimensions(SIZE_TO_CANVAS[size])
        } else {
            setCanvasDimensions(SIZE_TO_CANVAS.default)
        }
    }, [size, isCarPlate])

    // Dibujar canvas 2D
    const drawCanvas = useCallback(() => {
        if (isCarPlate() || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Dibujar imagen base
        if (baseImageRef.current) {
            ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
        } else {
            ctx.fillStyle = '#f0f0f0'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        // Dibujar imagen subida
        if (uploadedImageRef.current) {
            const s = imageStateRef.current
            ctx.save()
            ctx.translate(s.x, s.y)
            ctx.rotate(s.rotation)
            ctx.scale(s.scale, s.scale)
            ctx.drawImage(
                uploadedImageRef.current,
                -uploadedImageRef.current.width / 2,
                -uploadedImageRef.current.height / 2
            )
            ctx.restore()
        }
    }, [isCarPlate])

    // Cargar imagen base (solo placas normales)
    useEffect(() => {
        if (isCarPlate() || !selectedVariant) {
            setImageLoaded(false)
            return
        }

        const imageUrl = getImageUrl(selectedVariant.image_url)
        if (!imageUrl) {
            setImageLoadError("No image URL")
            return
        }

        console.log("🖼️ Cargando imagen para placa normal:", imageUrl)

        const img = new Image()
        img.crossOrigin = "anonymous"

        img.onload = () => {
            console.log("✅ Imagen cargada exitosamente")
            baseImageRef.current = img
            setImageLoadError(null)
            setImageLoaded(true)

            // Centrar la imagen subida si existe
            if (!uploadedImageRef.current) {
                drawCanvas()
            } else {
                drawCanvas()
            }
        }

        img.onerror = (err) => {
            setImageLoaded(false)
        }

        img.src = `${imageUrl}?t=${Date.now()}` // Anti-caché

        // Cleanup
        return () => {
            img.src = ''
        }
    }, [selectedVariant, isCarPlate, drawCanvas])

    // Mostrar mensaje de error
    const showErrorMessage = (message) => {
        setErrorMessage(message)
        setShowError(true)
        setTimeout(() => {
            setShowError(false)
            setErrorMessage("")
        }, 3000)
    }

    // Mostrar mensaje de éxito
    const showSuccessMessage = (message) => {
        setSuccessMessage(message)
        setShowSuccess(true)
        setTimeout(() => {
            setShowSuccess(false)
            setSuccessMessage("")
        }, 3000)
    }

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setCurrentQuantity(Math.max(1, value));
    }


    // Manejar upload de imagen
    const handleImageUpload = useCallback((e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            showErrorMessage('Please upload only image files')
            return
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showErrorMessage('Image is too large. Maximum 5MB.')
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            const img = new Image()
            img.onload = () => {
                uploadedImageRef.current = img
                setUploadedImage(file)

                if (!isCarPlate() && canvasRef.current) {
                    const canvas = canvasRef.current

                    // Calcular escala para que la imagen no sea demasiado grande
                    const maxWidth = canvas.width * 0.6
                    const maxHeight = canvas.height * 0.6

                    const scale = Math.min(
                        maxWidth / img.width,
                        maxHeight / img.height,
                        0.8
                    )

                    imageStateRef.current = {
                        ...imageStateRef.current,
                        x: canvas.width / 2,
                        y: canvas.height / 2,
                        scale: scale
                    }
                    drawCanvas()
                } else {
                    setImageLoaded(true)
                }
            }
            img.src = reader.result
        }
        reader.readAsDataURL(file)
    }, [isCarPlate, drawCanvas])

    // Eventos de mouse
    const handleMouseDown = useCallback((e) => {
        if (isCarPlate() || !uploadedImageRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        const canvas = canvasRef.current
        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width)
        const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height)

        lastMousePosRef.current = { x: mouseX, y: mouseY }
        setIsDragging(true)
    }, [isCarPlate])

    const handleMouseMove = useCallback((e) => {
        if (isCarPlate() || !isDragging || !uploadedImageRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        const canvas = canvasRef.current
        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width)
        const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height)

        const deltaX = mouseX - lastMousePosRef.current.x
        const deltaY = mouseY - lastMousePosRef.current.y

        imageStateRef.current.x += deltaX
        imageStateRef.current.y += deltaY

        // Limitar dentro del canvas
        const img = uploadedImageRef.current
        const halfWidth = (img.width * imageStateRef.current.scale) / 2
        const halfHeight = (img.height * imageStateRef.current.scale) / 2

        imageStateRef.current.x = Math.max(halfWidth, Math.min(imageStateRef.current.x, canvas.width - halfWidth))
        imageStateRef.current.y = Math.max(halfHeight, Math.min(imageStateRef.current.y, canvas.height - halfHeight))

        lastMousePosRef.current = { x: mouseX, y: mouseY }
        drawCanvas()
    }, [isCarPlate, isDragging, drawCanvas])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    // Manejar rueda del mouse para zoom
    const handleWheel = useCallback((e) => {
        if (isCarPlate() || !uploadedImageRef.current) return

        e.preventDefault()

        const delta = e.deltaY > 0 ? -0.1 : 0.1
        const newScale = Math.max(0.2, Math.min(imageStateRef.current.scale + delta, 2))

        imageStateRef.current.scale = newScale
        drawCanvas()
    }, [isCarPlate, drawCanvas])

    // Limpiar diseño
    const clearDesign = useCallback(() => {
        uploadedImageRef.current = null
        setUploadedImage(null)
        setIsDragging(false)

        if (!isCarPlate() && canvasRef.current) {
            const canvas = canvasRef.current
            imageStateRef.current = {
                ...imageStateRef.current,
                x: canvas.width / 2,
                y: canvas.height / 2,
                scale: 0.5,
                rotation: 0
            }
            drawCanvas()
        }
    }, [isCarPlate, drawCanvas])

    // Generar preview
    const generatePreview = useCallback(async () => {
        if (isCarPlate()) {
            if (viewerRef.current?.getCanvas) {
                const canvas = viewerRef.current.getCanvas()
                return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.95))
            }
            return null
        } else {
            const canvas = canvasRef.current
            if (!canvas) return null
            return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.95))
        }
    }, [isCarPlate])

    // Crear orden
    const createOrder = async () => {
        if (!uploadedImageRef.current) {
            showErrorMessage('Please upload an image first')
            return
        }

        setIsLoading(true)

        try {
            const previewBlob = await generatePreview()
            if (!previewBlob) throw new Error('Error generating preview')

            const formData = new FormData()

            if (user?.id) formData.append('user', user.id.toString())
            formData.append('type', 'Plate')
            formData.append('color', '-')
            formData.append('font', '-')
            formData.append('size', size || '')
            formData.append('qantity', currentQuantity)
            formData.append('price', totalPrice)
            formData.append('variation', selectedVariant?.name || '')
            if (specification) formData.append('specification', specification)
            if (uploadedImage) formData.append('client_img', uploadedImage, `design_${Date.now()}.png`)
            formData.append('preview_img', previewBlob, `preview_${Date.now()}.png`)

            const headers = {}
            if (access_token) headers['Authorization'] = `Bearer ${access_token}`

            const response = await fetch(`${ENV.API_URL}/order/create`, {
                method: 'POST',
                headers,
                body: formData
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Error ${response.status}: ${errorText}`)
            }

            showSuccessMessage('✅ Order created successfully')
            clearDesign()

        } catch (error) {
            console.error('❌ Error:', error)
            showErrorMessage(`❌ Error: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '20px'
        }}>
            <h3 style={{ textAlign: 'center', color: '#333' }}>
                Design your {isCarPlate() ? 'Car Plate' : 'Custom Plate'}
                {selectedVariant && (
                    <span style={{
                        color: isCarPlate() ? '#ff6b6b' : '#6a5acd',
                        display: 'block',
                        fontSize: '0.9em',
                        fontWeight: 'normal'
                    }}>
                        {selectedVariant.name}
                    </span>
                )}
            </h3>

            {/* Mensaje de éxito */}
            {showSuccess && (
                <div style={{
                    marginBottom: 15,
                    padding: "12px 16px",
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                    animation: "slideIn 0.3s ease"
                }}>
                    <span style={{ fontSize: 20 }}>✅</span>
                    <span style={{ flex: 1 }}>{successMessage}</span>
                    <button
                        onClick={() => {
                            setShowSuccess(false)
                            setSuccessMessage("")
                        }}
                        style={{
                            background: "rgba(255,255,255,0.2)",
                            border: "none",
                            color: "white",
                            fontSize: 16,
                            cursor: "pointer",
                            padding: "0 5px",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Mensaje de error */}
            {showError && (
                <div style={{
                    marginBottom: 15,
                    padding: "12px 16px",
                    borderRadius: 8,
                    background: "rgba(255, 107, 107, 0.2)",
                    border: "1px solid #ff6b6b",
                    color: "#ff6b6b",
                    fontSize: 14,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    animation: "slideIn 0.3s ease"
                }}>
                    <span style={{ fontSize: 20 }}>⚠️</span>
                    <span style={{ flex: 1 }}>{errorMessage}</span>
                    <button
                        onClick={() => {
                            setShowError(false)
                            setErrorMessage("")
                        }}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#ff6b6b",
                            fontSize: 18,
                            cursor: "pointer",
                            padding: "0 5px"
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            {imageLoadError && (
                <div style={{
                    background: '#fff3cd',
                    color: '#856404',
                    padding: '10px',
                    borderRadius: '5px'
                }}>
                    ⚠️ {imageLoadError}
                </div>
            )}

            {!imageLoaded && !isCarPlate() && selectedVariant && (
                <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                }}>
                    Loading plate image...
                </div>
            )}

            {/* Área de diseño */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: isCarPlate() ? '400px' : '200px',
                background: isCarPlate() ? '#1a1a1a' : 'transparent',
                borderRadius: '16px',
                overflow: 'hidden'
            }}>
                {isCarPlate() ? (
                    <div style={{
                        width: '100%',
                        height: '300px',
                        maxWidth: '10000px', // Ancho máximo
                        margin: '0 auto'
                    }}>
                        <ViewerForPlates
                            ref={viewerRef}
                            textureUrl={uploadedImage ? URL.createObjectURL(uploadedImage) : null}
                            showInstructions={true}
                            cameraPosition={[0, 0.8, 5]}
                            cameraFov={45}
                        />
                    </div>
                ) : (
                    <canvas
                        ref={canvasRef}
                        width={canvasDimensions.width}
                        height={canvasDimensions.height}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                        style={{
                            border: '2px solid #ddd',
                            cursor: uploadedImageRef.current ? (isDragging ? 'grabbing' : 'grab') : 'default',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    />
                )}
            </div>

            {/* Controles */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <label style={{
                    ...btnStyle,
                    flex: 1,
                    background: uploadedImageRef.current ? '#6c757d' : '#007bff',
                    cursor: uploadedImageRef.current ? 'not-allowed' : 'pointer'
                }}>
                    📤 {uploadedImage ? 'Replace image' : 'Upload image'}
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                        disabled={isLoading}
                    />
                </label>

                {uploadedImage && (
                    <button
                        style={{ ...btnStyle, flex: 0.5, background: '#dc3545' }}
                        onClick={clearDesign}
                        disabled={isLoading}
                    >
                        ✕ Clear
                    </button>
                )}
            </div>

            {/* Mostrar precio */}
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
                <span style={{fontSize: 24, fontWeight: 700}}>${totalPrice.toFixed(2)}</span>
            </div>

            <div style={{marginBottom: 15}}>
                <label style={labelStyle}>Quantity</label>
                <input
                    type="number"
                    min="1"
                    value={currentQuantity}
                    onChange={handleQuantityChange}
                    style={inputStyle}
                />
            </div>

            <button
                onClick={createOrder}
                style={{
                    ...btnStyle,
                    background: isLoading ? '#6c757d' : (!uploadedImageRef.current ? '#ffc107' : '#28a745'),
                    fontSize: '18px',
                    padding: '16px',
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading || !uploadedImageRef.current ? 'not-allowed' : 'pointer'
                }}
                disabled={isLoading || !uploadedImageRef.current}
            >
                {isLoading ? '⏳ Creating order...' :
                    !uploadedImageRef.current ? '➕ Upload image first' :
                        '✅ Create Order'}
            </button>

            {/* Estilos para animación */}
            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

const btnStyle = {
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    transition: 'all 0.3s',
    display: 'block',
    width: '100%'
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