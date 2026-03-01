import SideBar from "./SideBar";
import DesignSection from "./DesignSection";
import VariantSelector from "./VariantSelector";
import TopBar from "../Home/TopBar";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";



const ForPullover = () => {

    return (
        <>
            <TopBar/>
            <Navbar/>

                <div className="row align-items-start" style={{width:'100%'}}>
                    <div className="col-3">
                        <SideBar/>
                    </div>
                    <div className="col-6">
                        <DesignSection/>
                    </div>
                    <div className="col-3">
                        <VariantSelector category={'Pullovers'}/>
                    </div>
                </div>

            <Footer/>
        </>
    );
};

export default ForPullover;