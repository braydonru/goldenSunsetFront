import React, { useState } from 'react';
import MugViewer from './MugViewer';
import MugCustomizer from './MugCustomizer';
import Toast from './Toast';
import { ENV } from "../../conf/env";
import { useAuthStore } from '../../store/auth.store'
import CustomizerForThermo from "./CustomizerForThermo";
import ViewerForThermo from "./ViewerForThermo";
import {useParams} from "react-router-dom";
import {useDesignerStore} from "../Designs/designer.store";

export default function MugForThermo() {
    const {id} = useParams();
    const [textureUrl, setTextureUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const quantity = useDesignerStore(state => state.quantity);
    const totalprice = useDesignerStore(state => state.totalprice);
    const { user } = useAuthStore();

    const handleImageUpload = (objectUrl, file) => {
        setTextureUrl(objectUrl);
        setFile(file);
    };

    const handleReset = () => {
        setTextureUrl(null);
        setFile(null);
    };

    const handleCreateOrder = async () => {
        if (!file) {
            setToast({ message: 'Debes subir una imagen', type: 'error' });
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('user', user.id);
            formData.append('size', 'standard');
            formData.append('color', '-');
            formData.append('type', 'Thermo');
            formData.append('client_img', file);
            formData.append('preview_img', file);
            formData.append("qantity", quantity.toString())
            formData.append("price", totalprice)

            const res = await fetch(`${ENV.API_URL}/order/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.access_token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error();

            setToast({message: '✅ Order created successfully', type: 'success'});
            handleReset();

        } catch {
            setToast({message: '❌ Error creating order', type: 'error'});
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div style={{ display: 'flex', gap: 30 }}>
                <div style={{ flex: 3, height: 500 }}>
                    <ViewerForThermo textureUrl={textureUrl} />
                </div>

                <div style={{ flex: 1 }}>
                    <CustomizerForThermo
                        currentImage={textureUrl}
                        onImageUpload={handleImageUpload}
                        onReset={handleReset}
                        id={id}
                    />

                    <button
                        onClick={handleCreateOrder}
                        disabled={loading}
                        style={{
                            width: '100%',
                            marginTop: 20,
                            padding: 12,
                            background: '#2c3e50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Creating order...' : 'Create order'}
                    </button>
                </div>
            </div>
        </>
    );
}
