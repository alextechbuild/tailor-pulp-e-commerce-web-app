// ----------------------------------------------- CSS

import "./ShippingPolicies.css";

// ----------------------------------------------- External media

import tb_main_img from "../../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- Components

import ToolBar from "../../ToolBar/ToolBar.jsx"

import Footer from "../Footer.jsx";




function ShippingPolicies() {


    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];

    
    return (

        <div 
        className="shipping-policies">
            
            <ToolBar
            images={tb_imgs_list}/>


            <div 
            className="shipping-policies-maincontent">

                <div 
                className="privacy-wrapper">

                    <h1>Shipping Policy</h1>
                    <p><strong>Date of update: 14 October 2025</strong></p>

                    <h2>1. Serviced Areas and Geographical Restrictions</h2>
                    <p>X provides international delivery services. However, certain regions cannot currently be delivered to for political, environmental, or security reasons. These include: Haiti, Crimea, Sevastopol, Belarus, Russia, North Korea, Syria, Yemen, and Somalia. Other areas may experience delays or temporary suspensions for similar reasons.</p>
                    <p>In addition, shipments to the United States are temporarily suspended due to changes in customs and tax regulations. We recommend that you check the shipping availability before placing an order if your destination falls within a restricted area.</p>

                    <h2>2. Shipping Rates and Logistics Providers</h2>
                    <p>Delivery costs depend on the destination country. Unless otherwise specified, X ships:</p>
                    <ul>
                    <li><strong>Within Europe (excluding France):</strong> via <strong>Delivengo</strong>.</li>
                    <li><strong>For the rest of the world:</strong> via <strong>Colissimo</strong>.</li>
                    </ul>
                    <p><strong>Colissimo</strong> may also be used for certain European orders requiring specific insurance coverage.</p>
                    <p>Shipments are tracked via <strong>Laposte.co.uk</strong>. Once the parcel has entered the destination country, tracking can continue on the local postal service's website using the same tracking number.</p>

                    <h2>3. Transfer of Responsibility</h2>
                    <p>Once the order has been shipped, the risks associated with loss or damage to the parcel are transferred to the customer, who becomes the owner of the parcel at that point. Any issues regarding damage or loss after shipment must be reported directly to the carrier.</p>

                    <h2>4. Preparation and Delivery Times</h2>
                    <p>Shipments are generally made within a maximum of <strong>10 working days</strong> after the order is placed. <strong>Personalised items</strong> may require a specific delivery time, which will be communicated to the customer when the order is placed.</p>
                    <p>Deliveries take between <strong>3 and 15 days</strong> on average, depending on the destination country and the logistics provider used.</p>
                    <p>X cannot be held responsible for delays due to external circumstances such as customs, weather conditions, or geopolitical events, but we undertake to assist the customer in any dealings with the carrier.</p>

                    <h2>5. Delays, Losses, and Stock Shortages</h2>
                    <p>An unusual delay does not necessarily mean that the parcel has been lost. It may be temporarily blocked at a stage of transport or delayed for reasons beyond X's control (e.g., customs, severe weather, etc.).</p>
                    <p>In the exceptional case where a product is no longer available, the customer will be contacted to agree either on a new deferred shipment or a full refund.</p>

                    <h2>6. Delivery Information and Customer Obligations</h2>
                    <p>The customer is responsible for checking the accuracy of all information provided when placing the order. X cannot be held responsible for delays or failed deliveries caused by an incorrect or incomplete address provided by the customer.</p>
                    <p>If a parcel is returned to us for this reason, a refund will be made, less the shipping costs incurred. Please ensure that your shipping address is complete and accurate to avoid any issues with delivery.</p>

                </div>

            </div>

            <Footer/>

        </div>
    );
}

export default ShippingPolicies;
