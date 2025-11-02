// ----------------------------------------------- CSS

import "./WrapperClothesDiscovery.css";

// ----------------------------------------------- React

import { useNavigate } from "react-router-dom";




function WrapperClothesDiscovery() {


    const navigateToClothesPage = useNavigate();

    const navigate_to_clothes_page = () => {

        navigateToClothesPage('/clothes-tops-page');
    }
    

    return (

        <div 
        className="wrapper-clothes-discovery">
            
            <h5> Clothes </h5>
            <h4> Our Latest Creations </h4>

            <button
            className="wrapper-clothes-discovery-button"
            onClick={navigate_to_clothes_page}> 
            <span> Discover Now </span> 
            </button>

        </div>
    );
}

export default WrapperClothesDiscovery;
