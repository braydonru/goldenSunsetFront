import React from 'react';
import FontSelector from "./FontSelector";
import SizeForPlates from "./SizeForPlates";
import VariantSelector from "./VariantSelector";

const SideBarForPlates = () => {
    return (
        <>
            <div className="col-lg-3 col-md-12">
                <VariantSelector category={"Plates"}/>
                <SizeForPlates/>
            </div>

        </>
    );
};

export default SideBarForPlates;