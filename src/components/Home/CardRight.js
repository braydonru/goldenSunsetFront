import React from 'react';

const CardRight = () => {
    return (
        <>
            <div className="col-md-4 pb-4">
                <div className="position-relative text-center text-md-left text-white mb-2 py-5 px-5">
                    <img src="img/josh.png" alt=""/>
                    <div className="position-relative" style={{zIndex: '1'}}>
                        <h5 className="text-uppercase mb-3" style={{background: 'linear-gradient(135deg, #6a5acd, #00c9ff)',color: 'transparent',WebkitBackgroundClip: 'text',backgroundClip: 'text',display: 'inline-block'}}>Make it happen with us!</h5>
                        <h1 className="mb-4 font-weight-semi-bold" style={{color:'white'}}>Josh</h1>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardRight;