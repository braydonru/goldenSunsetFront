import {useState, useEffect, useCallback} from "react";
import { useDesignerStore } from "./designer.store";
import {get_size_by_variant} from "../../hooks/get_variants";

export default function SizeSelector({ onChange }) {

    const {
        selectedVariant,
        setSize,
        setSpecification,
        specification
    } = useDesignerStore();

    const [sizes, setSizes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);

    const precio = () => {
        if (selected === "3XL") return "+5$";
        if (selected === "4XL" || selected === "5XL") return "+7$";
        return "";
    };

    const updateSpecification = useCallback((value) => {
        setSpecification(value);
    }, [setSpecification]);

    // Cargar tallas cuando cambie la variante
    useEffect(() => {

        if (!selectedVariant?.id) {
            setSizes([]);
            setSelected(null);
            return;
        }

        const fetchSizes = async () => {

            setLoading(true);

            try {

                const response = await get_size_by_variant(selectedVariant.id);

                setSizes(response);

                if (response.length > 0) {
                    setSelected(response[0].size);
                } else {
                    setSelected(null);
                }

            } catch (error) {

                console.error(error);
                setSizes([]);
                setSelected(null);

            } finally {

                setLoading(false);

            }

        };

        fetchSizes();

    }, [selectedVariant]);

    // Actualizar el store
    useEffect(() => {

        if (selected) {

            setSize(selected);

            if (onChange) {
                onChange(selected);
            }

        }

    }, [selected, setSize, onChange]);

    return (
        <>
            <div className="size-box">

                <h5 className="title">Choose Size</h5>

                {loading && <p>Loading sizes...</p>}

                {!loading && (

                    <div className="sizes">

                        {sizes.map((item) => (

                            <label
                                key={item.id}
                                className={`size ${
                                    selected === item.size ? "active" : ""
                                }`}
                            >

                                <input
                                    type="radio"
                                    name="size"
                                    value={item.size}
                                    checked={selected === item.size}
                                    onChange={() => setSelected(item.size)}
                                />

                                {item.size}

                            </label>

                        ))}

                    </div>

                )}

                {selected && (

                    <p className="selected">

                        Selected size: <strong>{selected}</strong>

                    </p>

                )}

                <strong style={{color: "red"}}>
                    {precio()}
                </strong>

            </div>

            <input
                type="text"
                placeholder="✏️ Specifications Here (Optional)"
                value={specification}
                onChange={(e) => updateSpecification(e.target.value)}
                style={inputStyle}
            />
        </>
    );
}

const inputStyle = {
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    transition: "border-color 0.3s"
};