import MugViewer from "../MugDesigner3D/MugViewer";
import MugViewerForThermo from "../MugDesigner3D/ViewerForThermo";
import { ENV } from "../../conf/env";

export const productRenderers = {
    'T-Shirt': ({ imageUrl, owner, onLoad }) => (
        <img
            src={imageUrl}
            alt={`Producto de ${owner}`}
            className="imagen-producto"
            onLoad={onLoad}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
    ),

    'Cup': ({ imageUrl }) => {
        // Construir la URL completa aquí también por si acaso
        const fullUrl = imageUrl?.startsWith('http')
            ? imageUrl
            : `${ENV.API_URL}${imageUrl || ''}`;

        console.log('🟢 Cup renderer - URL:', fullUrl); // Debug

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <MugViewer
                    textureUrl={fullUrl}
                    showInstructions={false}
                    cameraPosition={[0, 0.6, 4]}
                    cameraFov={45}
                />
            </div>
        );
    },

    'Thermo': ({ imageUrl }) => {
        const fullUrl = imageUrl?.startsWith('http')
            ? imageUrl
            : `${ENV.API_URL}${imageUrl || ''}`;

        console.log('🔵 Thermo renderer - URL:', fullUrl); // Debug

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <MugViewerForThermo
                    textureUrl={fullUrl}
                    showInstructions={false}
                    cameraPosition={[0, 0.6, 4]}
                    cameraFov={40}
                />
            </div>
        );
    },
};