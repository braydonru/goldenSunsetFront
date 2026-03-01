import React from 'react';
import {NavLink} from "react-router-dom";

const LeftMenu = () => {
    return (
        <>

                        <a className="btn shadow-none d-flex align-items-center justify-content-between bg-primary text-white w-100"
                           data-toggle="collapse" href="#navbar-vertical"
                           style={{height: '65px', marginTop: '-1px', padding: '0 30px'}}>
                            <h6 className="m-0">Categories</h6>
                            <i className="fa fa-angle-down text-dark"></i>
                        </a>
                        <nav
                            className="collapse show navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0"
                            id="navbar-vertical">
                            <div className="navbar-nav w-100 overflow-hidden" style={{height: '150px'}}>

                                <NavLink to="/orders" className="nav-item nav-link">Orders</NavLink>
                                <NavLink to="/createProduct" className="nav-item nav-link">Products</NavLink>
                                <NavLink to="/createCategory" className="nav-item nav-link">Categories</NavLink>
                                <NavLink to="/createColor" className="nav-item nav-link">Colors</NavLink>
                            </div>
                        </nav>

        </>
    );
};

export default LeftMenu;