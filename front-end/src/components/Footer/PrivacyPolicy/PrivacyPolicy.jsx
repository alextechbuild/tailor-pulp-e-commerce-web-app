// ----------------------------------------------- CSS

import "./PrivacyPolicy.css";

// ----------------------------------------------- External media

import tb_main_img from "../../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- Components

import ToolBar from "../../ToolBar/ToolBar.jsx"

import Footer from "../Footer.jsx";




function PrivacyPolicy() {


    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];

    
    return (

        <div 
        className="privacy-policy">
            
            <ToolBar
            images={tb_imgs_list}/>


            <div 
            className="privacy-policy-maincontent">

                <div 
                className="privacy-wrapper">

                    <h1>Privacy Policy</h1>
                    <p><strong>Date of update: September 2025</strong></p>

                    <p>Your privacy is important to us. This privacy policy describes how we collect, use, and protect your personal data when you use our e-commerce site. We are committed to complying with the General Data Protection Regulation (GDPR) and the recommendations of the CNIL.</p>

                    <h2>1. Data controller</h2>
                    <p>The data controller is:</p>
                    <p><strong>[company name]</strong></p>
                    <p>Address: [address]</p>
                    <p>Email: [email address]</p>
                    <p>Telephone: [phone number]</p>
                    <p>If you have any questions about your personal data, you can contact our Data Protection Officer (DPO) at the above email address.</p>

                    <h2>2. Personal data collected</h2>
                    <p>We only collect data that is necessary for processing your orders and improving our services, including:</p>
                    <ul>
                        <li><strong>Identification information:</strong> surname, first name, email address, telephone number.</li>
                        <li><strong>Billing and delivery information:</strong> address, payment method (via Stripe).</li>
                        <li><strong>Technical information:</strong> IP address, browser type, pages visited.</li>
                        <li><strong>Security-related data:</strong> via Google reCAPTCHA to verify that you are not a robot.</li>
                        <li><strong>Geolocation data:</strong> if you interact with embedded <strong>OpenStreetMap</strong> services, such as map views or location searches, certain technical data like IP address and interaction data (e.g., zoom or click actions) may be collected.</li>
                    </ul>
                    <p><strong>Note:</strong> All data stored in the database is encrypted using <strong>asymmetric encryption</strong>, ensuring its security and confidentiality.</p>

                    <h2>3. Purposes of processing</h2>
                    <p>Your data is used to:</p>
                    <ol>
                        <li><strong>Manage your orders and payments</strong> (via Stripe).</li>
                        <li><strong>Ensure the security of the site</strong> (protection against bots and fraud via Google reCAPTCHA).</li>
                        <li><strong>Provide geolocation and map services</strong> (via OpenStreetMap for interactive maps).</li>
                        <li><strong>Improve your user experience</strong> and analyse the performance of the site.</li>
                        <li><strong>Comply with our legal and accounting obligations</strong>.</li>
                    </ol>

                    <h2>4. Legal basis for processing</h2>
                    <p>We process your data on the following legal bases:</p>
                    <ul>
                        <li><strong>Performance of a contract:</strong> processing orders and payments.</li>
                        <li><strong>Consent:</strong> for the use of cookies or optional services (such as OpenStreetMap).</li>
                        <li><strong>Legitimate interest:</strong> site security and fraud prevention (Google reCAPTCHA).</li>
                        <li><strong>Legal obligation:</strong> retention of invoices and accounting data.</li>
                    </ul>

                    <h2>5. Data sharing</h2>
                    <p>We do not sell or rent your personal data to third parties. However, we may share your data with:</p>
                    <ul>
                        <li><strong>Stripe</strong> for payment processing.</li>
                        <li><strong>Google reCAPTCHA</strong> for security and bot prevention.</li>
                        <li><strong>OpenStreetMap</strong> for geolocation services and interactive map features.</li>
                        <li><strong>Technical service providers</strong> for maintenance, hosting, and sending communications.</li>
                    </ul>

                    <h2>6. Data security</h2>
                    <ul>
                        <li>All your sensitive data stored in our database is <strong>encrypted using asymmetric encryption</strong>.</li>
                        <li>Access to data is strictly limited to authorised personnel.</li>
                        <li>We implement technical and organisational measures to protect your data against unauthorised access, loss, or alteration.</li>
                    </ul>

                    <h2>7. Retention period</h2>
                    <ul>
                        <li><strong>Order data:</strong> <strong>10 years</strong> (in accordance with French legal requirements).</li>
                        <li><strong>User account data:</strong> retained for as long as the account is active.</li>
                        <li><strong>Marketing communications data:</strong> up to <strong>3 years</strong> after your last contact, unless consent is withdrawn.</li>
                    </ul>

                    <h2>8. Your rights</h2>
                    <p>In accordance with the GDPR, you have the following rights:</p>
                    <ul>
                        <li><strong>Access, rectification, and erasure</strong> of your data.</li>
                        <li><strong>Portability</strong> of your data.</li>
                        <li><strong>Restriction or objection</strong> to the processing of your data.</li>
                        <li><strong>Withdrawal of consent</strong> at any time.</li>
                        <li><strong>Right to lodge a complaint</strong> with the CNIL.</li>
                    </ul>
                    <p>To exercise your rights, contact us at [email address].</p>

                    <h2>9. Cookies and similar technologies</h2>
                    <p>We use essential cookies necessary for the functioning of the website, security, and the proper execution of your orders. This includes:</p>
                    <ul>
                        <li><strong>Google reCAPTCHA</strong> cookies for bot prevention and site security.</li>
                        <li><strong>OpenStreetMap</strong> cookies for interactive maps and geolocation features.</li>
                    </ul>
                    <p>These cookies may collect technical data such as your IP address, interactions with the map, and other data necessary for these services. You can manage your cookie preferences at any time through your browser settings.</p>
                    <p>We do not use cookies for marketing purposes, and we do not transmit any cookies to third-party services without your consent.</p>

                    <h2>10. Policy changes</h2>
                    <p>We reserve the right to update this privacy policy at any time. The date of the last update will always be indicated at the top of this page.</p>

                </div>

            </div>

            <Footer/>

        </div>
    );
}

export default PrivacyPolicy;
