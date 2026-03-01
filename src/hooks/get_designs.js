import { ENV } from '../conf/env';

// Obtener todos los diseños
export const get_designs_all = async () => {
    try {
        const response = await fetch(`${ENV.API_URL}/design/get_all_designs`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching designs');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in get_designs_all:', error);
        return [];
    }
};

// Obtener diseños habilitados
export const get_enabled_designs = async () => {
    try {
        const response = await fetch(`${ENV.API_URL}/design/get_enable_design`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching enabled designs');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in get_enabled_designs:', error);
        return [];
    }
};

// Activar diseño
export const enableDesign = async (id) => {
    try {
        const response = await fetch(`${ENV.API_URL}/design/enable_design/${id}`, {
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
            message: 'Design activated successfully'
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error activating design'
        };
    }
};

// Desactivar diseño
export const disableDesign = async (id) => {
    try {
        const response = await fetch(`${ENV.API_URL}/design/disable_design/${id}`, {
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
            message: 'Design deactivated successfully'
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Error deactivating design'
        };
    }
};

// Crear nuevo diseño
export const createDesign = async (formData) => {
    try {
        const response = await fetch(`${ENV.API_URL}/design/create_design`, {
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
            message: 'Design created successfully'
        };

    } catch (error) {
        console.error('Create design error:', error);
        return {
            success: false,
            error: error.message || 'Error creating design'
        };
    }
};