// ----------------------------------------------- CSS

import "./WrapperAccessoriesDiscovery.css";

// ----------------------------------------------- React

import { useNavigate } from "react-router-dom";




function WrapperAccessoriesDiscovery() {


    const navigateToJewelleryPage = useNavigate();

    const navigate_to_jewellery_page = () => {

        navigateToJewelleryPage('/accessories-jewellery-page');
    }
    

    return (

        <div 
        className="wrapper-accessories-discovery">
            
            <div 
            className="wrapper-accessories-discovery-description">

                <h5> Accessories </h5>
                <h4> Our Handcrafted Jewellery </h4>
                <p> In addition to our unique clothing, we also offer handmade jewellery, designed with the same passion and attention to detail. </p>

            </div>

            <button
            className="wrapper-accessories-discovery-button"
            onClick={navigate_to_jewellery_page}> 
            <span> Learn More </span> 
            </button>

        </div>
    );
}

export default WrapperAccessoriesDiscovery;
