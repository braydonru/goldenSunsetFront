import React from 'react';
import {NavLink} from "react-router-dom";

const TopBar = () => {
    return (
        <>
        <div>
            <div className="container-fluid">
                {/*<div className="row py-2 px-xl-5">*/}
                {/*    <div className="col-lg-6 d-none d-lg-block">*/}
                {/*        <div className="d-inline-flex align-items-center">*/}
                {/*            <NavLink className="text-dark" to="#">FAQs</NavLink>*/}
                {/*            <span className="text-muted px-2">|</span>*/}
                {/*            <NavLink className="text-dark" to="#">Help</NavLink>*/}
                {/*            <span className="text-muted px-2">|</span>*/}
                {/*            <NavLink className="text-dark" to="#">Support</NavLink>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="col-lg-6 text-center text-lg-right">*/}
                {/*        <div className="d-inline-flex align-items-center">*/}
                {/*            <NavLink className="text-dark px-2" to="">*/}
                {/*                <i className="fab fa-facebook-f"></i>*/}
                {/*            </NavLink>*/}
                {/*            <NavLink className="text-dark px-2" to="">*/}
                {/*                <i className="fab fa-twitter"></i>*/}
                {/*            </NavLink>*/}
                {/*            <NavLink className="text-dark px-2" to="">*/}
                {/*                <i className="fab fa-linkedin-in"></i>*/}
                {/*            </NavLink>*/}
                {/*            <NavLink className="text-dark px-2" to="">*/}
                {/*                <i className="fab fa-instagram"></i>*/}
                {/*            </NavLink>*/}
                {/*            <NavLink className="text-dark pl-2" to="">*/}
                {/*                <i className="fab fa-youtube"></i>*/}
                {/*            </NavLink>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="row align-items-center py-3 px-xl-5">
                    <div className="col-lg-6 d-none d-lg-block">

                            <h1 className="m-0 display-5 font-weight-semi-bold" style={{
                                background: 'linear-gradient(135deg, #CD7F32, #DAA520)',
                                color: 'transparent',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                display: 'inline-block'}}>
                                Golden Sunset Made by Josh
                            </h1>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default TopBar;
