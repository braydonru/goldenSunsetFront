import React from 'react';
import MugEditor from "../MugDesigner3D/MugDesigner3D";
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import MugForThermo from "../MugDesigner3D/MugForThermo";

const ForThermos = () => {
    return (
        <>
            <TopBar/>
            <Navbar/>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-md-10 col-sm-12"> {/* Ajusta el ancho máximo */}
                        <div className="pb-3">
                            <MugForThermo/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ForThermos;