import React from 'react';
import TopBar from "./Home/TopBar";
import Navbar from "./Home/Navbar";
import Footer from "./Home/Footer";
import SideBar from "./Designs/SideBar";
import DesignSection from "./Designs/DesignSection";


const Designs = () => {
    return (
        <>
            <div className="container-fluid pt-5">
                <div className="row px-xl-5">
                <SideBar/>
                <DesignSection/>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default Designs;