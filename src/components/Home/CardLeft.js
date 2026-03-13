import React from 'react';
const CardLeft = () => {
    return (
        <>
            <div className="col-md-4 pb-4">
                <div className="position-relative text-center text-md-right text-white mb-2 py-5 px-5">
                    <img src="img/josh.png" alt="" style={{width: "1000px"}}/>
                    <div className="position-relative" style={{zIndex: '1'}}>
                        <h5 className="text-uppercase mb-3" style={{background: 'linear-gradient(135deg, #CD7F32, #DAA520)',color: 'transparent',WebkitBackgroundClip: 'text',backgroundClip: 'text',display: 'inline-block'}}>Have an idea?</h5>
                        <h1 className="mb-4 font-weight-semi-bold" style={{color:'white'}}>Carlos</h1>
                    </div>
                </div>
            </div>
            </>
            );
            };

            export default CardLeft;