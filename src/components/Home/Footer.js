import React from 'react';
import {Link} from "react-router-dom";
import Reviews from "./Reviews";

const Footer = () => {
    return (
        <>
            <div className="container-fluid  text-dark mt-5 pt-5">
                <div className="row px-xl-5 pt-5" >
                    <div className="col-lg-5 col-md-12 mb-5 pr-3 pr-xl-5">
                        <Link to="" className="text-decoration-none">
                            <h1 className="mb-4 display-5 font-weight-semi-bold" style={{
                                background: 'linear-gradient(135deg, #CD7F32, #DAA520)',
                                color: 'transparent',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                display: 'inline-block'}}>Golden Sunset Made by Josh</h1>
                        </Link>
                        <p className="mb-2"><i className="fa fa-map-marker-alt text-primary mr-3"></i>2132 Monterrey Blvd, Hermosa Beach, CA 90254</p>
                        <p className="mb-2"><i className="fa fa-envelope text-primary mr-3"></i>goldensunsetjosh@gmail.com</p>
                        <p className="mb-0"><i className="fa fa-phone-alt text-primary mr-3"></i>+1(310) 629 6791</p>
                    </div>
                    <div className="col-lg-2 col-md-12 mb-5 pr-3 pr-xl-5"></div>
                    <div className="col-lg-5 col-md-12 mb-5 pr-3 pr-xl-5">

                        <Reviews/>

                    </div>
                </div>


                <div className="row border-top border-light mx-xl-5 py-4">
                    <div className="col-md-6 px-xl-0">
                        <p className="mb-md-0 text-center text-md-left text-dark">
                            &copy; <Link className="text-dark font-weight-semi-bold" to="">Golden Sunset Made by Josh</Link>.
                            All Rights Reserved.
                        </p>
                    </div>
                    <div className="col-md-6 px-xl-0 text-center text-md-right">
                        <img className="img-fluid" src="img/payments.png" alt=""/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;
