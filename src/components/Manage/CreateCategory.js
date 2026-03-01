import React from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import ProductForm from "./ProductForm";
import Footer from "../Home/Footer";
import CategoryForm from "./CategoryForm";

const CreateCategory = () => {
    return (
        <>
            <TopBar/>
            <Navbar/>
            <h1 align={'center'}>Create your category here</h1>
            <CategoryForm/>
            <Footer/>
        </>
    );
};

export default CreateCategory;