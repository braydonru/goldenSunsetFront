import React from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import ProductForm from "./ProductForm";

const CreateProduct = () => {
    return (
        <>
            <TopBar/>
            <Navbar/>
            <h1 align={'center'}>Create your products here</h1>
            <ProductForm/>
            <Footer/>
        </>
    );
};

export default CreateProduct;