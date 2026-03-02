import { useNavigate } from "react-router-dom";

const ProductResolver = ({ product, children }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        switch (product.type) {
            case 'Pullovers':
                navigate(`/designer/shirt/${product.id}`);
                break;
            case 'Mugs':
                navigate(`/designer/mug/${product.id}`);
                break;
            case 'Tumblers':
                navigate(`/designer/thermo/${product.id}`);
                break;
            case 'Plates':
                navigate(`/designer/plates/${product.id}`);
                break;
            case 'Caps':
                navigate(`/designer/caps/${product.id}`);
                break;
            default:
                navigate(`/product/${product.id}`);
        }
    };

    return (
        <div onClick={handleClick} style={{cursor:'pointer'}}>
            {children}
        </div>
    );
};

export default ProductResolver;
