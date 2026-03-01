import React, { useState, useEffect } from 'react';
import TableRow from './TableRow';
import {get_orders} from "../../hooks/get_orders";

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

        const fetchOrders = async () => {
            try {
                const ordersData = await get_orders();
                setOrders(Array.isArray(ordersData) ? ordersData : []);
            } catch (err) {
                console.error('Error:', err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
    useEffect(() => {

        fetchOrders();
    }, []);

    const handleOrderDelete = (deletedOrderId) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== deletedOrderId));
    };

    if (loading) {
        return <div className="text-center py-5">Loading orders...</div>;
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No orders found.</p>
            </div>
        );
    }

    return (
        <div className="container-fluid pt-5">
            <div className="row px-xl-5">
                <div className="col-lg-12 table-responsive mb-5">
                    <table className="table table-bordered text-center mb-0">
                        <thead className="bg-secondary text-dark">
                        <tr>
                            <th>Owner</th>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Color</th>
                            <th>Date</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody className="align-middle">
                        {orders.map(order => (
                            <TableRow
                                key={order.id}
                                order={order}
                                onDelete={handleOrderDelete}
                                fetchOrders={fetchOrders}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersTable;