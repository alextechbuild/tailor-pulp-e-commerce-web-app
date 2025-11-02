// ----------------------------------------------- CSS

import "./LegalNotices.css";

// ----------------------------------------------- External media

import tb_main_img from "../../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- Components

import ToolBar from "../../ToolBar/ToolBar.jsx"

import Footer from "../Footer.jsx";




function LegalNotices() {


    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];

    
    return (

        <div 
        className="legal-notices">

            <ToolBar
            images={tb_imgs_list}/>


            <div 
            className="legal-notices-maincontent">

                <div 
                className="privacy-wrapper">

                    <h1>Legal notices</h1>
                    <p><strong>Date of update: 14 October 2025</strong></p>

                    <p>In accordance with the provisions of Articles 6-III and 19 of Law No. 2004-575 of 21 June 2004 on Confidence in the Digital Economy (LCEN), users of the [Name of website] website are hereby informed of the identity of the various parties involved in its creation and monitoring.</p>

                    <h2>1. Website publisher</h2>
                    <p>The website [Website name] is published by:</p>
                    <ul>
                    <li><strong>Company name</strong>: [Company name]</li>
                    <li><strong>Legal form</strong>: [e.g. Limited company, simplified joint stock company, etc.]</li>
                    <li><strong>Share capital</strong>: [Amount in £]</li>
                    <li><strong>Head office address</strong>: [Full address]</li>
                    <li><strong>Email</strong>: [email address]</li>
                    <li><strong>Telephone</strong>: [Telephone number]</li>
                    <li><strong>RCS</strong>: [Town] [Number]</li>
                    <li><strong>Intra-community VAT number</strong>: [Number]</li>
                    </ul>
                    <p>The Director of Publication is:</p>
                    <ul>
                    <li><strong>[Name of the person responsible]</strong></li>
                    </ul>

                    <h2>2. Host</h2>
                    <p>The site is hosted by:</p>
                    <ul>
                    <li><strong>Host name</strong>: [e.g. OVH, AWS, etc.]</li>
                    <li><strong>Address</strong>: [Full address]</li>
                    <li><strong>Telephone</strong>: [Telephone number]</li>
                    </ul>

                    <h2>3. Intellectual property</h2>
                    <p>All content on this website (text, images, logos, videos, etc.) is protected by intellectual property law and belongs to [Company name], unless otherwise stated. Any reproduction, representation, modification, or partial or total exploitation of this content without written authorisation is strictly prohibited.</p>

                    <h2>4. Terms of use</h2>
                    <p>Use of this website implies full and complete acceptance of these legal notices. The website [Website name] strives to provide reliable information, but cannot be held responsible for any errors or omissions in the published content.</p>

                    <h2>5. Personal data</h2>
                    <p>Data collected via the website is processed in accordance with the privacy policy. The website complies with the <strong>GDPR</strong> and the recommendations of the <strong>CNIL</strong> to ensure the protection of users' personal data.</p>
                    <p>As part of the services we offer, we use third-party services such as <strong>Stripe</strong> for payment processing, <strong>Google reCAPTCHA</strong> for site security, and <strong>OpenStreetMap</strong> for map features and geolocation services. These services may collect personal data (e.g., IP addresses, geolocation data, and technical data related to your interactions with our website). For more information on how your data is handled by these services, please refer to our <strong><a href="[link-to-privacy-policy]">Privacy Policy</a></strong>.</p>

                    <h2>6. Cookies</h2>
                    <p>The website only uses <strong>essential cookies</strong> necessary for its operation and security. These include:</p>
                    <ul>
                    <li><strong>Google reCAPTCHA</strong> cookies for bot prevention and site security.</li>
                    <li><strong>OpenStreetMap</strong> cookies for interactive maps and geolocation services.</li>
                    </ul>
                    <p>No cookies are used for marketing or advertising purposes. No cookies are transmitted to third-party services, including Google reCAPTCHA, without your consent. For more details on how cookies are used, please refer to our <strong><a href="[link-to-privacy-policy]">Privacy Policy</a></strong>.</p>

                    <h2>7. Liability</h2>
                    <p>The website publisher cannot be held liable for any direct or indirect damage resulting from access to or use of the website, including inaccessibility, loss of data, or intrusion by malicious third parties.</p>

                    <h2>8. Applicable law and jurisdiction</h2>
                    <p>This website is subject to French law. In the event of a dispute, the French courts shall have jurisdiction.</p>

                </div>

            </div>

            <Footer/>

        </div>
    );
}

export default LegalNotices;
