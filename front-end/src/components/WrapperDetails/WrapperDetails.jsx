// ----------------------------------------------- CSS

import "./WrapperDetails.css";

// ----------------------------------------------- External media

import ecofriendly_img from "../../assets/HomePage/ecofriendly.png";
import highquality_img from "../../assets/HomePage/highquality.png";
import delivery_img from "../../assets/HomePage/delivery.png";




function WrapperDetails() {

    
    return (

        <div 
        className="wrapper-details">
            
            <div 
            className="wrapper-details-detail">
                <img src={delivery_img} alt="Delivery"/>
                <h5> <span className="wdd-local-bold"> International </span> Delivery </h5>
            </div>
            <div 
            className="wrapper-details-detail">
                <img src={highquality_img} alt="High-quality image"/>
                <h5> <span className="wdd-local-bold"> High-quality </span> Textiles </h5>
            </div>
            <div 
            className="wrapper-details-detail">
                <img src={ecofriendly_img} alt="Eco-friendly image"/>
                <h5> <span className="wdd-local-bold"> Eco-friendly </span> Clothing </h5>
            </div>

        </div>
    );
}

export default WrapperDetails;
