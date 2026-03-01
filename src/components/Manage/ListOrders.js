import React from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import OrdersTable from "../Orders/OrdersTable";
import Footer from "../Home/Footer";

const ListOrders = () => {
    return (
        <>
            <TopBar/>
            <Navbar/>
            <OrdersTable/>
            <Footer/>
        </>
    );
};

export default ListOrders;