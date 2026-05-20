import React, {useEffect, useState} from 'react';
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import VariantSelector from "./VariantSelector";
import Footer from "../Home/Footer";
import {useParams} from "react-router-dom";
import {ENV} from "../../conf/env";
import CanvasGenericDesigner from "../ProductDesigner/CanvasGenericDesigner";
import SideBarForGenerics from "./SideBarForGenerics";

const GenericDesignTemplate = () => {
    const {id} = useParams();
    const [product, setProduct] = useState();

    useEffect(() => {
        const fetchProducts = async (idproduct) => {
            try {
                const res = await fetch(`${ENV.API_URL}/product/${idproduct}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                setProduct(await res.json());
            } catch (error) {
                console.log(error);
                return []
            }
        }
        if (id) {
            fetchProducts(id)
        }
    }, [id]);


    return (
        <>
            <TopBar/>
            <Navbar/>
            <div className="row align-items-start" style={{width: '100%'}}>
                <div className="col-3">
                    <SideBarForGenerics/>
                </div>
                <div className="col-6">
                    <CanvasGenericDesigner/>
                </div>
                <div className="col-3">
                    <VariantSelector category={product?.type}/>
                </div>
            </div>

            <Footer/>
        </>
    );
};

export default GenericDesignTemplate;