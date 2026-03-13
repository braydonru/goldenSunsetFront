import React from 'react';

const Carousel = () => {
    return (
        <>
            <div
                id="header-carousel"
                className="carousel slide"
                data-ride="carousel"
                style={{
                    width: '100%',
                    marginLeft: '0',
                    marginTop: '-2em'
                }}
            >
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            className="d-block w-100"
                            src="img/carousel-1.png"
                            alt={'img'}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '480px',
                                objectFit: 'contain',
                                backgroundColor: '#f8f9fa' // Opcional: color de fondo para áreas vacías
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Carousel;