// ----------------------------------------------- CSS

import "./TermsOfSale.css";

// ----------------------------------------------- External media

import tb_main_img from "../../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- Components

import ToolBar from "../../ToolBar/ToolBar.jsx"

import Footer from "../Footer.jsx";




function TermsOfSale() {


    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];

    
    return (

        <div 
        className="terms-of-sale">
            
            <ToolBar
            images={tb_imgs_list}/>


            <div 
            className="terms-of-sale-maincontent">

                <div 
                className="privacy-wrapper">

                    <h1>Terms and Conditions</h1>

                    <h2>1. Legal Information</h2>
                    <p>The online store [Store Name] is operated by [Company Name], [Legal Form], registered at the RCS of [City] under the number [SIRET Number].</p>
                    <p>Headquarters address: [Full Address]</p>
                    <p>VAT number: [VAT Number]</p>
                    <p>Email address: [Email Address]</p>
                    <p>Phone number: [Phone Number]</p>
                    <p>Publishing Director: [Name of the Director]</p>
                    <p>Website hosting provider: [Hosting Provider Name], [Hosting Provider Address]</p>

                    <h2>2. Acceptance of the Terms and Conditions</h2>
                    <p>By placing an order on our website, the customer agrees to these Terms and Conditions without reservation.</p>

                    <h2>3. Products</h2>
                    <p>The products offered for sale are those described on our site. We strive to present the items accurately, but variations may occur due to display settings.</p>

                    <h2>4. Orders</h2>
                    <p>The customer can place an order online via our website. The order is considered final once payment has been validated. We reserve the right to cancel or refuse any order from a customer with whom there is a prior dispute.</p>

                    <h2>5. Prices</h2>
                    <p>The prices of the products are indicated in euros, including all taxes (TTC), including the applicable VAT in France. Shipping fees are calculated separately and are indicated during the order process.</p>

                    <h2>6. Payment</h2>
                    <p>Payment for orders can be made by credit card, PayPal, or any other method available on our site. Payment is secured via [Payment Provider Name] (e.g., Stripe). The order will only be shipped after payment has been validated.</p>

                    <h2>7. Shipping</h2>
                    <p>Delivery times are indicated during the order process. We commit to shipping orders within the announced timeframes, subject to product availability. Shipping fees are borne by the customer unless stated otherwise at the time of order.</p>

                    <h2>8. Right of Withdrawal</h2>
                    <p>In accordance with Article L.221-18 of the Consumer Code, the customer has 14 days from the receipt of the products to exercise their right of withdrawal. The returned products must be in their original condition, unused, and in their original packaging. Return shipping fees are borne by the customer unless the product is defective or non-compliant. A refund will be issued within 14 days from the receipt of the returned products.</p>

                    <h2>9. Warranties</h2>
                    <p>All our products benefit from the legal warranty of conformity as provided in Articles L.217-4 and following of the Consumer Code, as well as the warranty against hidden defects as provided in Articles 1641 and following of the Civil Code. In case of a defective or non-compliant product, the customer can request an exchange or a refund.</p>

                    <h2>10. Liability</h2>
                    <p>We cannot be held responsible for damages resulting from improper use of the products or poor maintenance. Our liability is limited to the amount of the concerned order.</p>

                    <h2>11. Intellectual Property</h2>
                    <p>All elements of the site [Website Name] are protected by copyright, trademark law, and design rights. Any unauthorized reproduction, representation, or use is prohibited.</p>

                    <h2>12. Personal Data</h2>
                    <p>In accordance with the General Data Protection Regulation (GDPR), we collect and process customers' personal data only for managing orders and business relationships. The collected data is:</p>
                    <ul>
                        <li>Name and surname</li>
                        <li>Email address</li>
                        <li>Delivery address</li>
                        <li>Phone number</li>
                        <li>Payment information (via Stripe)</li>
                    </ul>
                    <p>This data is retained for the duration necessary to manage the order and business relationship and will not be shared with third parties without the customer's prior consent.</p>
                    <p>The customer has the right to access, rectify, erase, restrict processing, object to processing, and request the portability of their personal data. To exercise these rights, the customer can contact us at: [Email Address].</p>
                    <p>For more information, please refer to our Privacy Policy.</p>

                    <h2>13. Cookies</h2>
                    <p>Our site uses cookies to enhance the user experience and analyze navigation. These cookies are used for:</p>
                    <ul>
                        <li><strong>Google reCAPTCHA</strong>: for site security and bot prevention.</li>
                        <li><strong>OpenStreetMap</strong>: for interactive maps and geolocation services.</li>
                        <li><strong>Stripe</strong>: for secure payment processing.</li>
                    </ul>
                    <p>The customer can manage their cookie preferences through their browser settings. For more information, please refer to our Cookie Policy.</p>

                    <h2>14. Governing Law and Jurisdiction</h2>
                    <p>These Terms and Conditions are governed by French law. In case of a dispute, the competent courts will be those within the jurisdiction of the headquarters of [Company Name], unless mandatory legal provisions provide otherwise.</p>

                    <h2>15. Modifications of the Terms and Conditions</h2>
                    <p>We reserve the right to modify these Terms and Conditions at any time. Changes will apply as soon as they are published on our site.</p>
                    <p>For any questions or further information, the customer can contact us at: [Email Address].</p>

                </div>

            </div>

            <Footer/>

        </div>
    );
}

export default TermsOfSale;
