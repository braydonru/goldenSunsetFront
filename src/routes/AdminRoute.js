import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user?.superuser) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
