import { ENV } from '../conf/env';
import {useEffect, useState} from "react";

export const get_colors_all = async () => {
    try {
        const response = await fetch(`${ENV.API_URL}/colors/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching colors');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in get_colors_all:', error);
        return [];
    }
};

// Activar color
export const enableColor = async (id) => {
    try {
        const response = await fetch(`${ENV.API_URL}/colors/enable_color?id=${id}`, {
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
            message: 'Color activated successfully'
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error activating color'
        };
    }
};


export const disableColor = async (id) => {
    try {
        const response = await fetch(`${ENV.API_URL}/colors/disable_color?id=${id}`, {
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
            message: 'Color deactivated successfully'
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error deactivating color'
        };
    }
};


export const createColor = async (colorData) => {
    try {
        const formData = new FormData();

        // Campos normales
        formData.append('color_name', colorData.color_name);
        formData.append('color_code', colorData.color_code);
        formData.append('variant', colorData.variant);
        // 🔥 Archivos reales
        formData.append('front_image', colorData.front_image);
        formData.append('back_image', colorData.back_image);

        const response = await fetch(`${ENV.API_URL}/colors/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                // ❗ NO pongas Content-Type cuando usas FormData
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            if (errorData?.detail) {
                if (Array.isArray(errorData.detail)) {
                    const errorMessages = errorData.detail
                        .map(err => err.msg)
                        .join(', ');

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
            data,
            message: 'Color created successfully'
        };

    } catch (error) {
        console.error('Create color error:', error);

        return {
            success: false,
            error: error.message || 'Error creating color'
        };
    }
};


export const useColorCount = () => {
    const [countColor, setColor] = useState(0);
    const [loadingColor, setLoading] = useState(true);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const res = await fetch(`${ENV.API_URL}/colors`);
                const data = await res.json();
                setColor(data.length);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchColors();
    }, []);

    return { countColor, loadingColor };
};


export const get_colors_by_variant = async (variant) => {
    try {
        const response = await fetch(`${ENV.API_URL}/colors/by_variant/${variant}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching colors by variant');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in get_colors_by_variant:', error);
        return [];
    }
};