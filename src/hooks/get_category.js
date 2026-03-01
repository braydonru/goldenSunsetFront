import {useEffect, useState} from "react";
import {ENV} from "../conf/env";



// Obtener todas las categorías
export const get_categories_all = async () => {
    try {
        const response = await fetch(`${ENV.API_URL}/category/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching categories');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in get_categories_all:', error);
        return [];
    }
};

export const get_categories_enable = async () => {
    try {
        const response = await fetch(`${ENV.API_URL}/category/enable`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching categories');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in get_categories_all:', error);
        return [];
    }
};

// Activar categoría
export const enableCategory = async (id) => {
    try {
        const response = await fetch(`${ENV.API_URL}/category/enable/${id}`, {
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

        const data = await response.json();
        return {
            success: true,
            message: data.message || 'Category activated successfully'
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error activating category'
        };
    }
};

// Desactivar categoría
export const disableCategory = async (id) => {
    try {
        const response = await fetch(`${ENV.API_URL}/category/disable/${id}`, {
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

        const data = await response.json();
        return {
            success: true,
            message: data.message || 'Category deactivated successfully'
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error deactivating category'
        };
    }
};


export const useCategoryCount = () => {
    const [countCategory, setCategory] = useState(0);
    const [loadingCategory, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`${ENV.API_URL}/category`);
                const data = await res.json();
                setCategory(data.length);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, []);

    return { countCategory, loadingCategory };
};

// hooks/get_category.js

// Crear nueva categoría
export const createCategory = async (formData) => {
    try {
        const response = await fetch(`${ENV.API_URL}/category/create`, {
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
            message: 'Category created successfully'
        };

    } catch (error) {
        console.error('Create category error:', error);
        return {
            success: false,
            error: error.message || 'Error creating category'
        };
    }
};