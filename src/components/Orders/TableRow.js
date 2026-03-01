import React, { useState } from 'react';
import { ENV } from "../../conf/env";
import { useNavigate } from "react-router-dom";

const TableRow = ({ order, fetchOrders }) => {
    const { id, owner, date, size, type, color } = order;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const eliminarRecurso = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${ENV.API_URL}/order/delete/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            await fetchOrders();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (e) => {
        // Evitar navegación si se hizo clic en el botón de eliminar
        if (e.target.closest('button')) {
            return;
        }
        navigate(`/showorder/${id}`);
    };

    return (
        <tr onClick={handleRowClick} style={{ cursor: 'pointer' }}>
            <td className="align-middle">{owner}</td>
            <td className="align-middle">{type}</td>
            <td className="align-middle">{size}</td>
            <td className="align-middle">{color}</td>
            <td className="align-middle">{date}</td>
            <td className="align-middle" onClick={(e) => e.stopPropagation()}>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        eliminarRecurso(id);
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <i className="fa fa-spinner fa-spin"></i>
                    ) : (
                        <i className="fa fa-times"></i>
                    )}
                </button>
                {error && <small className="text-danger d-block">{error}</small>}
            </td>
        </tr>
    );
};

export default TableRow;