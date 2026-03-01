import React from 'react';
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ReviewGallery from "./ReviewGallery";

const AllReviews = () => {
    return (
        <>
            <TopBar/>
            <Navbar/>
            <ReviewGallery/>
            <Footer/>
        </>
    );
};

export default AllReviews;