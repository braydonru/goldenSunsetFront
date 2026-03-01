import React from 'react';
import ColorSection from "./ColorSection";
import SizeSection from "./SizeSection";
import FontSelector from "./FontSelector";
import ColorSelector from "./ColorSelector";
import {useDesignerStore} from "./designer.store";

const SideBar = () => {
    const selectedColor = useDesignerStore(s => s.selectedColor);
    const setSelectedColor = useDesignerStore(s => s.setSelectedColor);
    return (
        <>
            <div className="col-lg-10 col-md-12">
                <ColorSelector
                    onColorSelect={setSelectedColor}
                    selectedColor={selectedColor}
                />
                <SizeSection/>
                <FontSelector />
            </div>

        </>
    );
};

export default SideBar;