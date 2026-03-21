import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from "../../store/auth.store";

const Navbar = () => {
    const { isAuthenticated, user,clearAuth } = useAuthStore();

    return (
        <div className="container-fluid mb-5">
            <div className="row border-top px-xl-5">
                <div className="col-lg-12">
                    <nav className="navbar navbar-expand-lg navbar-light py-3 py-lg-0 px-0 ">

                        <button
                            type="button"
                            className="navbar-toggler"
                            data-toggle="collapse"
                            data-target="#navbarCollapse"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div
                            className="collapse navbar-collapse justify-content-between"
                            id="navbarCollapse"
                        >
                            {/* LEFT LINKS */}
                            <div className="navbar-nav mr-auto py-0">
                                <NavLink to="/" className="nav-item nav-link">Home</NavLink>



                                <NavLink to="/us" className="nav-item nav-link">About Us</NavLink>

                                <NavLink to="/allreviews" className="nav-item nav-link">Reviews</NavLink>
                                <NavLink to="/alldesigns" className="nav-item nav-link">Designs</NavLink>
                                <NavLink to="/orders_ready" className="nav-item nav-link">Orders</NavLink>
                                {/* 👑 SOLO SUPERUSER */}
                                {user?.superuser && (

                                    <NavLink to="/Manage" className="nav-item nav-link">
                                        Manage
                                    </NavLink>
                                )}
                            </div>


                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
