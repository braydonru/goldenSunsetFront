import React from 'react';
import TopBar from "./Home/TopBar";
import Navbar from "./Home/Navbar";
import Footer from "./Home/Footer";
import OrdersTable from "./Orders/OrdersTable";

const Orders = () => {
    return (
        <>
            <TopBar/>
            <Navbar/>
            <OrdersTable/>
            <Footer/>
        </>
    );
};

export default Orders;