import React from 'react';
import MugEditor from "../MugDesigner3D/MugDesigner3D";
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import VariantSelector from "./VariantSelector";

const ForCups = () => {
    return (
        <>
            <TopBar/>
            <Navbar/>
            <div className="row align-items-start" style={{width:'98%', marginLeft:'2%'}}>
                <div className="col-3">
                    <VariantSelector category={'Cups'}/>
                </div>
                <div className="col-6">
                    <MugEditor/>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ForCups;