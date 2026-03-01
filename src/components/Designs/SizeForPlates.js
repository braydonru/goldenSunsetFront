import { useState, useEffect, useRef, useCallback } from 'react'
import { useDesignerStore } from "./designer.store";

const SIZES = [
    { label: '8" x 10"', stock: 2 },
    { label: '11" x 14"', stock: 3 },
    { label: '6" x 8"', stock: 10 },
    { label: '4" x 6"', stock: 2 },
]

// Tamaño fijo para Car Plate
const CAR_PLATE_SIZE = '6" x 12"';

export default function SizeForPlates({ onChange }) {
    const { setSize, setSpecification, specification, selectedVariant } = useDesignerStore()
    const [selected, setSelected] = useState(null)

    // Detectar si es Car Plate
    const isCarPlate = useCallback(() => {
        return selectedVariant?.name?.toLowerCase().includes('car plate') ||
            selectedVariant?.name?.toLowerCase().includes('carplate') ||
            selectedVariant?.name?.toLowerCase() === 'car';
    }, [selectedVariant]);

    const updateSpecification = useCallback((value) => {
        setSpecification(value)
    }, [setSpecification])

    // Actualizar el store cuando cambia selected
    useEffect(() => {
        if (selected) {
            setSize(selected)
            if (onChange) {
                onChange(selected)
            }
        }
    }, [selected, setSize, onChange])

    // Inicializar con la talla por defecto según el tipo de placa
    useEffect(() => {
        if (!selected) {
            if (isCarPlate()) {
                // Para Car Plate, usar tamaño fijo
                setSelected(CAR_PLATE_SIZE);
            } else {
                // Para placas normales, usar tamaño por defecto
                setSelected('M');
            }
        }
    }, [selected, isCarPlate]);

    // Actualizar cuando cambia la variante (por si se cambia de Car Plate a normal o viceversa)
    useEffect(() => {
        if (isCarPlate()) {
            setSelected(CAR_PLATE_SIZE);
        } else {
            // Si no hay selección o la selección actual es el tamaño de Car Plate, resetear
            if (!selected || selected === CAR_PLATE_SIZE) {
                setSelected('M');
            }
        }
    }, [isCarPlate]);

    const selectSize = (size) => {
        setSelected(size)
    }

    // Si es Car Plate, mostrar solo el tamaño fijo (no como selector)
    if (isCarPlate()) {
        return (
            <>
                <div className="size-box">
                    <h5 className="title">Size (Fixed for Car Plate)</h5>
                    <div className="sizes">
                        <div className="size fixed-size">
                            {CAR_PLATE_SIZE}
                        </div>
                        <p className="selected">
                            Selected size: <strong>{CAR_PLATE_SIZE}</strong>
                        </p>
                    </div>
                </div>
                <h5>Specifications</h5>
                <input
                    type="text"
                    placeholder="✏️ Specifications Here (Optional)"
                    value={specification}
                    onChange={(e) => updateSpecification(e.target.value)}
                    style={inputStyle}
                />
            </>
        )
    }

    // Para placas normales, mostrar el selector de tamaños
    return (
        <>
            <div className="size-box">
                <h5 className="title">Choose Size</h5>
                <div className="sizes">
                    {SIZES.map((s) => (
                        <label
                            key={s.label}
                            className={`size 
                                ${selected === s.label ? 'active' : ''}
                                ${s.stock === 0 ? 'disabled' : ''}`}
                        >
                            <input
                                type="radio"
                                name="size"
                                value={s.label}
                                checked={selected === s.label}
                                disabled={s.stock === 0}
                                onChange={() => selectSize(s.label)}
                            />
                            {s.label}
                        </label>
                    ))}
                </div>
                {selected && (
                    <p className="selected">
                        Selected size: <strong>{selected}</strong>
                    </p>
                )}
            </div>
            <h5>Specifications</h5>
            <input
                type="text"
                placeholder="✏️ Specifications Here (Optional)"
                value={specification}
                onChange={(e) => updateSpecification(e.target.value)}
                style={inputStyle}
            />
        </>
    )
}

const inputStyle = {
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    transition: 'border-color 0.3s',
    marginBottom: '10px'
}