import {useState, useEffect, useRef, useCallback} from 'react'
import { useDesignerStore } from "./designer.store";
import {color} from "three/src/Three.TSL";

const SIZES = [
    { label: 'XS', stock: 2 },
    { label: 'S', stock: 3 },
    { label: 'M', stock: 10 },
    { label: 'L', stock: 2 },
    { label: 'XL', stock: 7 },
    { label: '2XL', stock: 7 },
    { label: '3XL', stock: 7 },
    { label: '4XL', stock: 7 },
    { label: '5XL', stock: 7 },
]

export default function SizeSelector({ onChange }) {
    const { setSize, setSpecification,specification } = useDesignerStore()

    const [selected, setSelected] = useState(null)

    const precio = ()=>{
        if (selected==="3XL")
            return "+5$"
        if (selected==="4XL" || selected==="5XL"){
            return "+7$"
        }
    }

    const updateSpecification = useCallback((value) => {
        setSpecification(value)
    }, [])

    // SOLO actualizar el store cuando cambia selected
    useEffect(() => {
        if (selected) {
            setSize(selected)
            if (onChange) {
                onChange(selected)
            }
        }
    }, [selected, setSize, onChange])

    // Inicializar con una talla por defecto UNA VEZ
    useEffect(() => {
        // Establecer talla por defecto si no hay selección
        if (!selected) {
            const defaultSize = 'M' // Puedes cambiar esto
            setSelected(defaultSize)
        }
    }, [selected])

    const selectSize = (size) => {
        setSelected(size)
    }

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

            )
            }
            <strong style={{color: 'red'}}>{precio()}</strong>
        </div>
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
    transition: 'border-color 0.3s'
}