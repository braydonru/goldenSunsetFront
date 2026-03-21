import React from 'react';
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import ReadyOrders from "../Orders/ReadyOrders";
import Footer from "./Footer";

const OrdersUser = () => {
    return (
        <>
            <TopBar/>
            <Navbar/>
            <ReadyOrders/>
            <Footer/>
        </>
    );
};

export default OrdersUser;