import React from 'react';
import DesignerCanvas from "../ProductDesigner/CanvasDesigner";


const DesignSection = () => {
    return (
        <>
            <div className="col-lg-12 col-md-12">
                <div className="row pb-3 ">
                    <DesignerCanvas/>
                </div>
            </div>

        </>
    );
};

export default DesignSection;