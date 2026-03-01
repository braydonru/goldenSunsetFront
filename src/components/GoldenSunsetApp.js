import React, {useState,useEffect} from 'react';
import TopBar from "./Home/TopBar";
import Navbar from "./Home/Navbar";
import Carousel from "./Home/Carousel";
import ProductRow from "./Home/ProductRow";
import PreFooter from "./Home/PreFooter";
import Footer from "./Home/Footer";
import {get_categories_enable} from "../hooks/get_category";
import AboutUsSection from "./Home/AboutUsSection";

const GoldenSunsetApp = () => {
    const [category,setCategory] = useState([]);

useEffect(() => {
    const fetchCategory = async () => {
        const response = await get_categories_enable();
        setCategory(response);
    };
    fetchCategory();},
    [])


    return (
        <>
           <TopBar/>
            <Navbar/>
            <Carousel/>
            <ProductRow category={category} />
            <PreFooter/>
            <AboutUsSection/>
            <Footer/>
        </>
    );
};

export default GoldenSunsetApp;