// hooks/get_variants.js
import { ENV } from '../conf/env';

// Obtener todas las variantes
export const get_variants_all = async () => {
    try {
        const response = await fetch(`${ENV.API_URL}/product_variant/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching variants');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in get_variants_all:', error);
        return [];
    }
};

// Activar variante
export const enableVariant = async (id) => {
    try {
        const response = await fetch(`${ENV.API_URL}/product_variant/enable/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
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
            message: 'Variant activated successfully'
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error activating variant'
        };
    }
};

// Desactivar variante
export const disableVariant = async (id) => {
    try {
        const response = await fetch(`${ENV.API_URL}/product_variant/disable/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
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
            message: 'Variant deactivated successfully'
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error deactivating variant'
        };
    }
};

// Crear nueva variante
export const createVariant = async (formData) => {
    try {
        const response = await fetch(`${ENV.API_URL}/product_variant/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                // No incluir Content-Type, el navegador lo pondrá automáticamente
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
            message: 'Variant created successfully'
        };

    } catch (error) {
        console.error('Create variant error:', error);
        return {
            success: false,
            error: error.message || 'Error creating variant'
        };
    }
};


export const get_variants_by_category = async (category) => {
    try {
        const response = await fetch(`${ENV.API_URL}/product_variant/by_category?category=${category}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching variants by category');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in get_variants_by_category:', error);
        return [];
    }
};

