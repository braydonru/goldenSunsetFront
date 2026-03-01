import React from 'react';
import {useDesignerStore} from "./designer.store";
import ColorSelector from "./ColorSelector";
import SizeSection from "./SizeSection";
import FontSelector from "./FontSelector";

const SideBarForCaps = () => {
    const selectedColor = useDesignerStore(s => s.selectedColor);
    const setSelectedColor = useDesignerStore(s => s.setSelectedColor);
    return (
        <>
            <div className="col-lg-10 col-md-12">
                <ColorSelector
                    onColorSelect={setSelectedColor}
                    selectedColor={selectedColor}
                />
                <FontSelector/>
            </div>

        </>
    )
};

export default SideBarForCaps;