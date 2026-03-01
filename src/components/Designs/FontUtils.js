// utils/fontUtils.js
export const loadGoogleFont = (fontName) => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('No window object'));
            return;
        }

        // Verificar si ya está cargada
        if (document.fonts.check(`12px "${fontName}"`)) {
            resolve(true);
            return;
        }

        // Crear elemento de prueba
        const testElement = document.createElement('span');
        testElement.style.fontFamily = `"${fontName}"`;
        testElement.style.fontSize = '1px';
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.textContent = 'Font test';
        document.body.appendChild(testElement);

        // Usar FontFace API
        const fontFace = new FontFace(
            fontName,
            `url(https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;700&display=swap)`,
            { display: 'swap' }
        );

        fontFace.load()
            .then(loadedFont => {
                document.fonts.add(loadedFont);
                // Verificar que se cargó
                setTimeout(() => {
                    const isLoaded = document.fonts.check(`12px "${fontName}"`);
                    if (document.body.contains(testElement)) {
                        document.body.removeChild(testElement);
                    }
                    resolve(isLoaded);
                }, 100);
            })
            .catch(error => {
                if (document.body.contains(testElement)) {
                    document.body.removeChild(testElement);
                }
                resolve(false);
            });
    });
};

export const extractFontFamily = (fontString) => {
    // Para fuentes como "'Poppins', sans-serif" -> "Poppins"
    const match = fontString.match(/'([^']+)'/);
    if (match && match[1]) {
        return match[1];
    }

    // Para fuentes seguras como "Arial, sans-serif" -> "Arial"
    return fontString.split(',')[0].trim();
};