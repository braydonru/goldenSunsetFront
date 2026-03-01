import { useEffect, useState } from "react";
import { ENV } from "../conf/env";


export const get_products = async ()=>{
    const response = await fetch(`${ENV.API_URL}/product/enable`);
    return await response.json();
}


export const get_products_all = async ()=>{
    const response = await fetch(`${ENV.API_URL}/product/`);
    return await response.json();
}

export const useProductCount = () => {
    const [countProducts, setCount] = useState(0);
    const [loadingProducts, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${ENV.API_URL}/product/`);
                const data = await res.json();
                setCount(data.length);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { countProducts, loadingProducts };
};
// hooks/get_products.js

export const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${ENV.API_URL}/product/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return {
                success: false,
                error: errorData?.detail || `Error ${response.status}`
            };
        }

        return {
            success: true,
            message: 'Product successfully deactivated'
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error deactivating product'
        };
    }
};

export const activateProduct = async (id) => {
    try {
        const response = await fetch(`${ENV.API_URL}/product/activate/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return {
                success: false,
                error: errorData?.detail || `Error ${response.status}`
            };
        }

        return {
            success: true,
            message: 'Product successfully activated'
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error activating product'
        };
    }
};

// hooks/get_products.js

// Crear nuevo producto
export const createProduct = async (formData) => {
    try {
        const response = await fetch(`${ENV.API_URL}/product/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                // No incluir Content-Type, el navegador lo pondrá automáticamente con FormData
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            if (errorData?.detail) {
                if (Array.isArray(errorData.detail)) {
                    const errorMessages = errorData.detail.map(err => err.msg).join(', ');
                    return {
                        success: false,
                        error: errorMessages
                    };
                }
                return {
                    success: false,
                    error: errorData.detail
                };
            }

            return {
                success: false,
                error: `Error ${response.status}: ${response.statusText}`
            };
        }

        const data = await response.json();
        return {
            success: true,
            data: data,
            message: 'Product created successfully'
        };

    } catch (error) {
        console.error('Create product error:', error);
        return {
            success: false,
            error: error.message || 'Error creating product'
        };
    }
};