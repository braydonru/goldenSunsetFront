// src/config/env.js

const getEnv = (key, fallback = null) => {
    const value = process.env[key];

    if (!value && fallback === null) {
        console.warn(`⚠️ Variable de entorno faltante: ${key}`);
    }

    return value || fallback;
};

export const ENV = {
    API_URL: getEnv('REACT_APP_API_URL'),
};
