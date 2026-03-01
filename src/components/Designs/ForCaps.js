import React from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import SideBar from "./SideBar";
import DesignSection from "./DesignSection";
import VariantSelector from "./VariantSelector";
import DesignerCanvasForCaps from "../ProductDesigner/DesignerCanvasForCaps";
import SideBarForCaps from "./SideBarForCaps";

const ForCaps = () => {
    return (
        <>
            <TopBar/>
            <Navbar/>
            <div className="row align-items-start" style={{width: '100%'}}>
                <div className="col-3">
                    <SideBarForCaps/>
                </div>
                <div className="col-6">
                    <DesignerCanvasForCaps/>
                </div>
                <div className="col-3">
                    <VariantSelector category={'Caps'}/>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ForCaps;