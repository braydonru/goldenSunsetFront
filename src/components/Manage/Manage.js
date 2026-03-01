import React from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import StatCard from "./StatCard";
import { useProductCount } from "../../hooks/get_products";
import { useOrdersCount } from "../../hooks/get_orders";
import { useCategoryCount } from "../../hooks/get_category";
import { FaBoxOpen, FaShoppingBag, FaPalette, FaTags } from "react-icons/fa";
import { useColorCount } from "../../hooks/get_colors";
import './Manage.css'; // Crearemos este archivo

const Manage = () => {
    const { countProducts, loadingProducts } = useProductCount();
    const { countOrders, loadingOrders } = useOrdersCount();
    const { countCategory, loadingCategory } = useCategoryCount();
    const { countColor, loadingColor } = useColorCount();

    // Array de tarjetas para facilitar el mapeo
    const statsCards = [
        {
            id: 1,
            title: "Colors",
            count: countColor,
            loading: loadingColor,
            icon: <FaPalette />,
            url: "listcolors",
            color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        },
        {
            id: 2,
            title: "Products",
            count: countProducts,
            loading: loadingProducts,
            icon: <FaBoxOpen />,
            url: "listproducts",
            color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        },
        {
            id: 3,
            title: "Orders",
            count: countOrders,
            loading: loadingOrders,
            icon: <FaShoppingBag />,
            url: "listorders",
            color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        },
        {
            id: 4,
            title: "Categories",
            count: countCategory,
            loading: loadingCategory,
            icon: <FaTags />,
            url: "listcategories",
            color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
        },
        {
            id: 5,
            title: "Variants",
            count: '',
            loading: loadingCategory,
            icon: <FaTags />,
            url: "listvariants",
            color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
        },
        {
            id: 6,
            title: "Designs",
            count: '',//Poner aqui el contador de disennos
            loading: '',//Poner aqui el loading de disennos
            icon: <FaTags />,
            url: "/Manage/listdesigns",//Poner aqui el url de disennos
            color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
        }
    ];

    return (
        <>
            <TopBar />
            <Navbar />

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome to the administration panel</p>
                </div>

                <div className="stats-grid">
                    {statsCards.map((card) => (
                        <div key={card.id} className="stat-card-wrapper">
                            <StatCard
                                title={card.title}
                                count={card.count}
                                loading={card.loading}
                                icon={card.icon}
                                url={card.url}
                                color={card.color}
                            />
                        </div>
                    ))}
                </div>

            </div>

            <Footer />
        </>
    );
};

export default Manage;