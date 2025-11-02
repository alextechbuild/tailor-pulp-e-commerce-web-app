// ----------------------------------------------- CSS

import "./RefundPolicy.css";

// ----------------------------------------------- External media

import tb_main_img from "../../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- Components

import ToolBar from "../../ToolBar/ToolBar.jsx"

import Footer from "../Footer.jsx";




function RefundPolicy() {


    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];

    
    return (

        <div 
        className="refund-policy">
            
            <ToolBar
            images={tb_imgs_list}/>


            <div 
            className="refund-policy-maincontent">

                <div 
                className="privacy-wrapper">

                    <h1>Refund Policy</h1>
                    <p><strong>Date of update: 14 October 2025</strong></p>

                    <h2>1. Non-returnable products</h2>
                    <p>Custom-made or personalised items — such as rings, stackable rings, bracelets, stamped jewellery or any personalised order — cannot be returned. In accordance with Article L.221-28 of the French Consumer Code, the right of withdrawal does not apply to these products.</p>

                    <h2>2. Eligible products for return</h2>
                    <p>For all other items, such as standard pendants or earrings, the customer has <strong>14 days</strong> from receipt to make a return, in accordance with Article L.121-21 of the French Consumer Code. To initiate a return, simply contact X at X within this period to receive the necessary instructions. Refunds or exchanges will be processed after receipt and inspection of the items, less the initial delivery costs.</p>

                    <h2>3. Conditions for returned items</h2>
                    <p>Returned products must be new, complete and intact, ideally in their original packaging or in suitable packaging to ensure their protection and resale. Accessories such as boxes or pouches are considered part of the order. The right of withdrawal does not apply to items damaged as a result of mishandling by the customer.</p>

                    <h2>4. Reporting defects or damage</h2>
                    <p>The customer must check the condition of the items upon receipt. Any manufacturing defects or major damage must be reported to X within <strong>7 days</strong> of delivery, either by email to X or via the contact form available on X. For defective or damaged items, X will offer an appropriate solution: repair, replacement or refund.</p>

                    <h2>5. Return costs and risks</h2>
                    <p>Returns are generally at the customer's expense and must be shipped at their own risk. X recommends using a tracked delivery service, as X cannot be held responsible for loss during return transport. For defective or damaged items, return costs will be covered by X.</p>

                    <h2>6. Refunds and exchanges</h2>
                    <p>Refunds do not cover the initial shipping costs or additional costs associated with a failed or delayed delivery. Refunds are made using the same payment method used for the order. Exchanges are possible for items eligible for return; to arrange an exchange, contact X at X.</p>

                </div>

            </div>

            <Footer/>

        </div>
    );
}

export default RefundPolicy;
