import {useEffect, useRef, useState, useCallback} from "react"
import {useDesignerStore} from "../Designs/designer.store"
import {useAuthStore} from "../../store/auth.store"
import {ENV} from "../../conf/env"
import {useParams} from "react-router-dom";

export default function DesignerCanvasForCaps() {
    const resetDesignerState = useDesignerStore(s => s.resetDesignerState);

    const isFirstRender = useRef(true);

    if (isFirstRender.current) {
        resetDesignerState();
        isFirstRender.current = false;
    }

    const {user} = useAuthStore()
    const {id} = useParams();
    const size = useDesignerStore(s => s.size)
    const font = useDesignerStore(s => s.font)
    const selectedColor = useDesignerStore(s => s.selectedColor)
    const setSelectedColor = useDesignerStore(s => s.setSelectedColor)
    const specification = useDesignerStore(s => s.specification)
    const selectedVariant = useDesignerStore(state => state.selectedVariant);

    const canvasRef = useRef(null)
    const capImgRef = useRef(null)
    const [currentQuantity, setCurrentQuantity] = useState(1)
    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(true);
    const [basePrice, setBasePrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [currentText, setCurrentText] = useState("")
    const [textSize, setTextSize] = useState(28)
    const [textColor, setTextColor] = useState("#ffffff")
    const [isLoading, setIsLoading] = useState(false)
    const [validationError, setValidationError] = useState("")
    const [showValidation, setShowValidation] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)
    const [colors, setColors] = useState([])

    // Estados para arrastrar texto
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({x: 0, y: 0})
    const [selectedElement, setSelectedElement] = useState(null) // 'text' o 'image'

    // Estados para control de imagen
    const [imageScale, setImageScale] = useState(0.5)
    const [imageRotation, setImageRotation] = useState(0)

    const capState = useRef(createEmptyState())


    function createEmptyState() {
        return {
            image: null,
            clientFile: null,
            imgState: {x: 200, y: 180, scale: 0.5, rotation: 0},
            text: "",
            textState: {
                x: 200,
                y: 180,
                size: 28,
                rotation: 0,
                color: "#ffffff",
                font: font || "Arial"
            }
        }
    }

    console.log(selectedVariant)
    const getCurrentState = () => capState.current

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


    // Cargar colores disponibles y seleccionar el primero por defecto
    useEffect(() => {
        const fetchColors = async () => {
            try {
                const response = await fetch(`${ENV.API_URL}/colors/enable`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const data = await response.json()

                const colorsArray = Array.isArray(data) ? data : data?.data || []
                setColors(colorsArray)

                // Si hay colores y no hay uno seleccionado, seleccionar el primero
                if (colorsArray.length > 0 && !selectedColor) {
                    setSelectedColor(colorsArray[0])
                }
            } catch (error) {
                console.error("Error fetching colors:", error)
            }
        }

        fetchColors()
    }, [setSelectedColor, selectedColor])

    // Actualizar font cuando cambie en el store
    useEffect(() => {
        const state = getCurrentState()
        if (state.textState) {
            state.textState.font = font || "Arial"
            drawCanvas()
        }
    }, [font])

    // Verificar si el usuario ha personalizado la gorra
    const isCustomized = () => {
        return capState.current.image !== null || capState.current.text !== "";
    }

    /* ================= IMAGE URL ================= */

    const getCapImageUrl = (color) => {
        if (!color) return null
        return color.front_image_path
            ? `${ENV.API_URL}${color.front_image_path}`
            : null
    }

    /* ================= LOAD IMAGE ================= */

    const loadCapImage = useCallback(() => {

        if (!selectedColor) return

        const url = getCapImageUrl(selectedColor)
        if (!url) return

        const img = new Image()
        img.crossOrigin = "anonymous"

        img.onload = () => {
            capImgRef.current = img
            drawCanvas()
        }

        img.onerror = () => {
            console.error("Error loading image:", url)
        }

        img.src = url

    }, [selectedColor])

    useEffect(() => {
        capImgRef.current = null
        loadCapImage()
    }, [loadCapImage])

    /* ================= DRAW ================= */

    const drawCanvas = useCallback(() => {

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (capImgRef.current) {
            ctx.drawImage(capImgRef.current, 0, 0, canvas.width, canvas.height)
        }

        // design zone (área frontal de la gorra)
        ctx.strokeStyle = "rgba(255,255,255,0.6)"
        ctx.setLineDash([6, 6])
        ctx.strokeRect(120, 140, 160, 160)
        ctx.setLineDash([])

        const state = getCurrentState()

        if (state.image) {
            const s = state.imgState
            ctx.save()
            ctx.translate(s.x, s.y)
            ctx.rotate(s.rotation)
            ctx.scale(s.scale, s.scale)
            ctx.drawImage(
                state.image,
                -state.image.width / 2,
                -state.image.height / 2
            )
            ctx.restore()
        }

        if (state.text) {
            const t = state.textState
            ctx.save()
            ctx.translate(t.x, t.y)
            ctx.rotate(t.rotation)
            ctx.fillStyle = t.color
            ctx.font = `${t.size}px ${t.font}`
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(state.text, 0, 0)

            // Dibujar un borde alrededor del texto seleccionado
            if (selectedElement === 'text' && state.text) {
                const metrics = ctx.measureText(state.text)
                const textWidth = metrics.width
                const textHeight = t.size

                ctx.strokeStyle = "#00c9ff"
                ctx.lineWidth = 2
                ctx.setLineDash([5, 5])
                ctx.strokeRect(
                    -textWidth / 2 - 5,
                    -textHeight / 2 - 5,
                    textWidth + 10,
                    textHeight + 10
                )
                ctx.setLineDash([])
            }

            // Dibujar un borde alrededor de la imagen seleccionada
            if (selectedElement === 'image' && state.image) {
                const img = state.imgState
                const imgWidth = state.image.width * img.scale
                const imgHeight = state.image.height * img.scale

                ctx.strokeStyle = "#00c9ff"
                ctx.lineWidth = 2
                ctx.setLineDash([5, 5])
                ctx.strokeRect(
                    img.x - imgWidth / 2 - 5,
                    img.y - imgHeight / 2 - 5,
                    imgWidth + 10,
                    imgHeight + 10
                )
                ctx.setLineDash([])
            }

            ctx.restore()
        }

    }, [selectedElement])

    useEffect(() => {
        drawCanvas()
    }, [drawCanvas, font, textSize, textColor, selectedElement, imageScale, imageRotation])

    /* ================= DRAG AND DROP ================= */

    const handleMouseDown = (e) => {
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const mouseX = (e.clientX - rect.left) * scaleX
        const mouseY = (e.clientY - rect.top) * scaleY

        const state = getCurrentState()

        // Verificar si hizo clic en el texto
        if (state.text) {
            const t = state.textState
            const ctx = canvas.getContext("2d")
            ctx.font = `${t.size}px ${t.font}`
            const metrics = ctx.measureText(state.text)
            const textWidth = metrics.width
            const textHeight = t.size

            // Calcular los límites del texto
            const left = t.x - textWidth / 2
            const right = t.x + textWidth / 2
            const top = t.y - textHeight / 2
            const bottom = t.y + textHeight / 2

            // Verificar si el clic está dentro del texto
            if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
                setIsDragging(true)
                setSelectedElement('text')
                setDragOffset({
                    x: mouseX - t.x,
                    y: mouseY - t.y
                })
                drawCanvas()
                return
            }
        }

        // Verificar si hizo clic en la imagen
        if (state.image) {
            const img = state.imgState
            // Área aproximada de la imagen
            const imgWidth = state.image.width * img.scale
            const imgHeight = state.image.height * img.scale

            const left = img.x - imgWidth / 2
            const right = img.x + imgWidth / 2
            const top = img.y - imgHeight / 2
            const bottom = img.y + imgHeight / 2

            if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
                setIsDragging(true)
                setSelectedElement('image')
                setDragOffset({
                    x: mouseX - img.x,
                    y: mouseY - img.y
                })
                drawCanvas()
                return
            }
        }

        // Si no hizo clic en ningún elemento
        setSelectedElement(null)
        drawCanvas()
    }

    const handleMouseMove = (e) => {
        if (!isDragging || !selectedElement) return

        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const mouseX = (e.clientX - rect.left) * scaleX
        const mouseY = (e.clientY - rect.top) * scaleY

        const state = getCurrentState()

        if (selectedElement === 'text' && state.text) {
            // Mover texto
            state.textState.x = mouseX - dragOffset.x
            state.textState.y = mouseY - dragOffset.y
        } else if (selectedElement === 'image' && state.image) {
            // Mover imagen
            state.imgState.x = mouseX - dragOffset.x
            state.imgState.y = mouseY - dragOffset.y
        }

        drawCanvas()
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    /* ================= UPLOAD ================= */

    const handleImageUpload = (e) => {

        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()

        reader.onload = () => {
            const img = new Image()
            img.onload = () => {
                const state = getCurrentState()
                state.image = img
                state.clientFile = file
                const newScale = Math.min(150 / img.width, 150 / img.height, 1)
                state.imgState.scale = newScale
                setImageScale(newScale)
                drawCanvas()
                // Ocultar validación cuando el usuario personaliza
                setShowValidation(false)
                setValidationError("")
                // Seleccionar la imagen automáticamente
                setSelectedElement('image')
            }
            img.src = reader.result
        }

        reader.readAsDataURL(file)
    }

    /* ================= IMAGE CONTROLS ================= */

    const handleImageScaleChange = (e) => {
        const value = parseFloat(e.target.value)
        setImageScale(value)

        const state = getCurrentState()
        if (state.image) {
            state.imgState.scale = value
            drawCanvas()
        }
    }

    const handleImageRotationChange = (e) => {
        const value = parseInt(e.target.value)
        setImageRotation(value)

        const state = getCurrentState()
        if (state.image) {
            state.imgState.rotation = (value * Math.PI) / 180 // Convertir a radianes
            drawCanvas()
        }
    }

    /* ================= TEXT CONTROLS ================= */

    const handleTextChange = (e) => {
        const value = e.target.value
        setCurrentText(value)

        const state = getCurrentState()
        state.text = value
        drawCanvas()

        if (value) {
            setShowValidation(false)
            setValidationError("")
            // Seleccionar el texto automáticamente
            setSelectedElement('text')
        }
    }

    const handleTextSizeChange = (e) => {
        const value = parseInt(e.target.value)
        setTextSize(value)

        const state = getCurrentState()
        state.textState.size = value
        drawCanvas()
    }

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setCurrentQuantity(Math.max(1, value));
    }

    const handleTextColorChange = (e) => {
        const value = e.target.value
        setTextColor(value)

        const state = getCurrentState()
        state.textState.color = value
        drawCanvas()
    }

    /* ================= PREVIEW GENERATION ================= */

    const generatePreviewImage = async () => {
        const canvas = canvasRef.current
        if (!canvas) return null

        // Crear un nuevo canvas para el preview
        const previewCanvas = document.createElement('canvas')
        previewCanvas.width = canvas.width
        previewCanvas.height = canvas.height

        const previewCtx = previewCanvas.getContext('2d')

        // Dibujar el contenido actual del canvas
        previewCtx.drawImage(canvas, 0, 0)

        // Convertir a blob
        return new Promise((resolve) => {
            previewCanvas.toBlob((blob) => {
                if (blob) {
                    // Crear un File a partir del blob
                    const file = new File([blob], `cap_preview_${Date.now()}.png`, {type: 'image/png'})
                    resolve(file)
                } else {
                    resolve(null)
                }
            }, 'image/png')
        })
    }

    /* ================= CREATE ORDER ================= */

    const createOrder = async () => {

        if (!user?.access_token) {
            setValidationError("Please login first")
            setShowValidation(true)
            return
        }

        if (!selectedColor) {
            setValidationError("Please select a color first")
            setShowValidation(true)
            return
        }


        if (!isCustomized()) {
            setValidationError("Please customize your cap with an image or text before creating an order")
            setShowValidation(true)
            return
        }

        setShowValidation(false)
        setValidationError("")
        setIsLoading(true)

        try {
            const formData = new FormData()

            // Datos básicos
            formData.append("user", user.id)
            formData.append("size", size || "")
            formData.append("color", selectedColor?.color_name || "")
            formData.append("type", "Cap")
            formData.append("specification", specification || "")
            formData.append("font", font || "Arial")
            formData.append("variation", selectedVariant?.name || "Cap")
            formData.append("qantity", currentQuantity)
            formData.append("price", totalPrice)

            // Generar preview
            const preview = await generatePreviewImage()
            if (preview) {
                formData.append("preview_img", preview)
            }

            // Imagen personalizada
            if (capState.current.clientFile) {
                formData.append("client_img", capState.current.clientFile)
            }

            const res = await fetch(`${ENV.API_URL}/order/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                },
                body: formData
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => null)
                throw new Error(errorData?.detail || `Error ${res.status}: Order failed`)
            }

            await res.json()

            // Mostrar mensaje de éxito elegante
            setSuccessMessage("✅ Order created successfully")
            setShowSuccess(true)

            // Ocultar después de 3 segundos
            setTimeout(() => {
                setShowSuccess(false)
                setSuccessMessage("")
            }, 3000)

        } catch (err) {
            setValidationError(err.message)
            setShowValidation(true)
        } finally {
            setIsLoading(false)
        }
    }

    /* ================= UI ================= */

    const currentState = getCurrentState()
    const hasImage = currentState.image !== null
    const hasText = currentState.text !== ""

    return (
        <div style={{
            maxWidth: 520,
            margin: "auto",
            padding: 30,
            background: "white",
            borderRadius: 16,
            boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
            color: "#333",
            position: "relative"
        }}>

            <h2 style={{textAlign: "center", marginBottom: 20, color: "#333"}}>
                🧢 Design Your Cap
            </h2>

            {selectedColor && (
                <div style={{
                    textAlign: "center",
                    marginBottom: 20,
                    fontWeight: "600",
                    fontSize: 14,
                    opacity: 0.9,
                    color: "#666"
                }}>
                    Selected Color: {selectedColor.color_name}
                </div>
            )}

            {/* Mensaje de éxito personalizado */}
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
                    <span style={{fontSize: 20}}>✅</span>
                    <span style={{flex: 1}}>{successMessage}</span>
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

            <div style={{marginBottom: 10, fontSize: 13, color: "#666", textAlign: "center"}}>
                💡 Click and drag on text or image to move it
            </div>

            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{
                    borderRadius: 12,
                    background: "#f0f0f0",
                    display: "block",
                    margin: "0 auto 20px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    cursor: isDragging ? "grabbing" : "grab"
                }}
            />

            <div style={{marginBottom: 20}}>
                <label style={labelStyle}>Upload Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={inputStyle}
                />
            </div>

            {/* Controles de imagen */}
            {hasImage && (
                <div style={{
                    background: "#f8f9fa",
                    padding: 15,
                    borderRadius: 8,
                    marginBottom: 15,
                    border: selectedElement === 'image' ? "2px solid #00c9ff" : "1px solid #e0e0e0"
                }}>
                    <div style={{marginBottom: 12, display: "flex", justifyContent: "space-between"}}>
                        <label style={labelStyle}>Image Controls</label>
                        {selectedElement === 'image' && (
                            <span style={{color: "#00c9ff", fontSize: 12}}>✓ Selected</span>
                        )}
                    </div>

                    <div style={{marginBottom: 12}}>
                        <label style={labelStyle}>Size: {Math.round(imageScale * 100)}%</label>
                        <input
                            type="range"
                            min="0.1"
                            max="1.5"
                            step="0.01"
                            value={imageScale}
                            onChange={handleImageScaleChange}
                            style={{width: "100%", marginTop: 5}}
                        />
                    </div>

                    <div style={{marginBottom: 12}}>
                        <label style={labelStyle}>Rotation: {imageRotation}°</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                            value={imageRotation}
                            onChange={handleImageRotationChange}
                            style={{width: "100%", marginTop: 5}}
                        />
                    </div>
                </div>
            )}

            <div style={{marginBottom: 15}}>
                <label style={labelStyle}>Custom Text</label>
                <input
                    type="text"
                    placeholder="Add custom text"
                    value={currentText}
                    onChange={handleTextChange}
                    style={inputStyle}
                />
            </div>

            {/* Controles de texto */}
            {hasText && (
                <div style={{
                    background: "#f8f9fa",
                    padding: 15,
                    borderRadius: 8,
                    marginBottom: 15,
                    border: selectedElement === 'text' ? "2px solid #00c9ff" : "1px solid #e0e0e0"
                }}>
                    <div style={{marginBottom: 12, display: "flex", justifyContent: "space-between"}}>
                        <label style={labelStyle}>Text Controls</label>
                        {selectedElement === 'text' && (
                            <span style={{color: "#00c9ff", fontSize: 12}}>✓ Selected</span>
                        )}
                    </div>

                    <div style={{marginBottom: 12}}>
                        <label style={labelStyle}>Font: <strong>{font || "Arial"}</strong></label>
                    </div>

                    <div style={{marginBottom: 12}}>
                        <label style={labelStyle}>Text Size: {textSize}px</label>
                        <input
                            type="range"
                            min="12"
                            max="72"
                            value={textSize}
                            onChange={handleTextSizeChange}
                            style={{width: "100%", marginTop: 5}}
                        />
                    </div>

                    <div style={{display: "flex", alignItems: "center", gap: 10}}>
                        <label style={labelStyle}>Color:</label>
                        <input
                            type="color"
                            value={textColor}
                            onChange={handleTextColorChange}
                            style={{width: 50, height: 40, cursor: "pointer"}}
                        />
                        <span style={{fontFamily: "monospace", color: "#666"}}>
                            {textColor}
                        </span>
                    </div>

                    <div style={{marginTop: 10, fontSize: 12, color: "#999"}}>
                        Position: X: {Math.round(currentState.textState.x)}, Y: {Math.round(currentState.textState.y)}
                    </div>
                </div>
            )}

            {/* Mensaje de validación personalizado */}
            {showValidation && validationError && (
                <div style={{
                    marginTop: 10,
                    marginBottom: 10,
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
                    <span style={{fontSize: 20}}>⚠️</span>
                    <span style={{flex: 1}}>{validationError}</span>
                    <button
                        onClick={() => setShowValidation(false)}
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
            <button
                onClick={createOrder}
                disabled={isLoading}
                style={{
                    marginTop: 15,
                    width: "100%",
                    padding: 14,
                    borderRadius: 10,
                    border: "none",
                    fontWeight: "bold",
                    fontSize: 15,
                    background: isLoading
                        ? "#888"
                        : "linear-gradient(135deg,#6a5acd,#00c9ff)",
                    color: "white",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1,
                    transition: "all 0.3s ease"
                }}
            >
                {isLoading ? "Creating..." : "Create Order"}
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

const sideBtn = (active) => ({
    padding: "8px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    background: active ? "#6a5acd" : "#e0e0e0",
    color: active ? "white" : "#666",
    transition: "0.2s"
})

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