import React from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import UsersManager from "./UsersManager";

const ListUsers = () => {
    return (
        <>
            <TopBar/>
            <Navbar/>
            <UsersManager/>
            <Footer/>
        </>
    );
};

export default ListUsers;