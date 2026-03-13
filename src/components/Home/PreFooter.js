import React from 'react';
import CardLeft from "./CardLeft";
import CardRight from "./CardRight";

const PreFooter = () => {
    return (
        <>
            <div className="container-fluid offer pt-5">
                <div className="row px-xl-5">
                    <CardLeft/>

                    {/* Imagen central */}
                    <div className="col-lg-4 col-md-6 mb-4 d-flex align-items-center justify-content-center">
                        <img
                            src="/img/1.png"
                            alt="Oferta especial"
                            className="img-fluid"
                            style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </div>

                    <CardRight/>
                </div>
            </div>
        </>
    );
};

export default PreFooter;