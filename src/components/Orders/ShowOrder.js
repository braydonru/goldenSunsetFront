import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import OrderVisualizer from "./OrderVisualizer";
import {ENV} from "../../conf/env";

const ShowOrder = () => {
    // 1. Obtiene el ID de la URL
    const { orderId } = useParams();
    const navigate = useNavigate();

    // 2. Estados
    const [orden, setOrden] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Función para cargar datos desde la API
    const fetchOrderData = async (orderId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${ENV.API_URL}/order/order/${orderId}`);

            if (!response.ok) {
                throw new Error('Error al cargar la orden');
            }

            const data = await response.json();
console.log(data)
            // Mapea los datos según la estructura que espera OrderVisualizer
            const formattedData = {
                id: data.id || data._id,
                owner: data.owner,
                type: data.type,
                size: data.size,
                color: data.color,
                specification: data.specification,
                font: data.font,
                date: data.date,
                client_img: data.client_img,
                preview_img: data.preview_img,
                client_img_back: data.client_img_back,
                preview_img_back: data.preview_img_back,
                variation: data.variation,
            };

            setOrden(formattedData);
        } catch (err) {
            console.error('Error fetching order:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 4. Carga los datos cuando cambia el orderId
    useEffect(() => {
        if (orderId) {
            fetchOrderData(orderId);
        } else {
            // Si no hay ID, muestra error o redirige
            setError('No se proporcionó ID de orden');
            setLoading(false);
        }
    }, [orderId]);

    // 5. Función para manejar el cierre
    const handleClose = () => {
        navigate(-1); // Regresa a la página anterior
    };

    // 6. Función para manejar descarga
    const handleDownload = async (ordenData, calidad) => {
        try {
            // Lógica para descargar la imagen
            const response = await fetch(
                calidad === 'high'
                    ? ordenData.printedImageUrl
                    : calidad === 'medium'
                        ? ordenData.previewImageUrl
                        : ordenData.imageUrl
            );

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `orden-${ordenData.id}-${calidad}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error('Error downloading:', err);
            alert('Error al descargar la imagen');
        }
    };

    // 7. Estados de carga y error
    if (loading) {
        return (
            <>
                <TopBar />
                <Navbar />
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6 text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3">Cargando orden #{orderId}...</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <TopBar />
                <Navbar />
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="alert alert-danger">
                                <h4>Error</h4>
                                <p>{error}</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(-1)}
                                >
                                    Volver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <TopBar />
            <Navbar />

            {orden && (
                <OrderVisualizer
                    orden={orden}
                    onClose={handleClose}
                    onDownload={handleDownload}
                />
            )}

            <Footer />
        </>
    );
};

export default ShowOrder;