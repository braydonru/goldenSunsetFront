import React from "react";
import {Link} from "react-router-dom";

const StatCard = ({ title, count, icon, loading, url }) => {
    return (
            <Link to={url} style={{"color":"black",textDecoration:"none"}}>
            <div className="card shadow h-100 border-0" style={{marginTop: '30px', marginBottom: '30px'}}>
                <div className="card-body d-flex align-items-center justify-content-between">

                    <div>
                        <h6 className="text-muted mb-2">{title}</h6>

                        {loading ? (
                            <div className="spinner-border spinner-border-sm" />
                        ) : (
                            <h2 className="fw-bold mb-0">{count}</h2>
                        )}
                    </div>

                    <div style={{ fontSize: "40px", opacity: 0.2 }}>
                        {icon}
                    </div>

                </div>
            </div>
            </Link>
    );
};

export default StatCard;
