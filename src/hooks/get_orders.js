import {useEffect, useState} from "react";
import {ENV} from "../conf/env";

export const get_orders = async ()=>{
    const response = await fetch(`${ENV.API_URL}/order/order`);
    return await response.json();
}


export const useOrdersCount = () => {
    const [countOrders, setCount] = useState(0);
    const [loadingOrders, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${ENV.API_URL}/order/order`);
                const data = await res.json();
                setCount(data.length);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return { countOrders, loadingOrders };
};