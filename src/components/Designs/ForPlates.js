import React from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import CanvasDesignerForPlates from "./CanvasDesignerForPlates";
import SideBar from "./SideBar";
import SideBarForPlates from "./SideBarForPlates";



const ForPlates = () => {
    return (
        <>
            <TopBar/>
            <Navbar/>
            <div className="container-fluid pt-5">
                <div className="row px-xl-5">
                    <SideBarForPlates/>
                    <CanvasDesignerForPlates/>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ForPlates;