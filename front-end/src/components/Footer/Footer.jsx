// ----------------------------------------------- CSS

import "./Footer.css";

// ----------------------------------------------- React

import { useNavigate } from "react-router-dom";




function Footer() {


    const navigateToPrivacyPolicy = useNavigate();
    const navigateToLegalNotices = useNavigate();
    const navigateToContactPage = useNavigate();
    const navigateToAboutPage = useNavigate();

    
    return (

        <div className="footer">
            

            <div className="footer-wrapper">

                <div 
                className="footer-resources">

                    <h5> Resources </h5>

                    <div 
                    className="footer-resources-buttons">
                        <button 
                        className="footer-button"
                        onClick={() => (navigateToPrivacyPolicy(`/privacy-policy`))}> <span> Privacy Policy </span> </button>

                        <button 
                        className="footer-button" 
                        onClick={() => (navigateToLegalNotices(`/legal-notices`))}> <span> Legal Notices </span> </button>

                        <button 
                        className="footer-button" 
                        onClick={() => (navigateToLegalNotices(`/shipping-policies`))}> <span> Shipping Policies </span> </button>

                        <button 
                        className="footer-button" 
                        onClick={() => (navigateToLegalNotices(`/refund-policy`))}> <span> Refund Policy </span> </button>

                        <button 
                        className="footer-button" 
                        onClick={() => (navigateToLegalNotices(`/terms-of-sale`))}> <span> Terms of Sale </span> </button>
                    </div>

                </div>

                <div 
                className="footer-about-us">

                    <h5> About Us </h5>

                    <div 
                    className="footer-about-us-links">
                        <p> [email address] </p>

                        <button 
                        className="footer-button" 
                        onClick={() => (navigateToAboutPage(`/about-page`))}> <span> About Us </span> </button>

                        <button 
                        className="footer-button" 
                        onClick={() => (navigateToContactPage(`/contact-page`))}> <span> Contact </span> </button>

                        <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
                            <img
                            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
                            alt="Pinterest"
                            style={{height: "30px"}}/>
                        </a>

                        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                            <img
                            src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Tiktok_icon.svg"
                            alt="TikTok"
                            style={{height: "30px"}}/>
                        </a>

                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                            alt="Facebook"
                            style={{height: "30px"}}/>
                        </a>

                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <img
                            src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                            alt="Instagram"
                            style={{height: "30px"}}/>
                        </a>

                        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                            <img
                            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"
                            alt="X"
                            style={{ height: "30px"}}/>
                        </a>
                    </div>

                </div>

            </div>

            <div 
            className="footer-more">

                <p> © 2026 AlexTechBuild, All rights reserved </p>

                <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">
                    <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                    alt="Stripe"
                    style={{height: "30px"}}/>
                </a>

                <a href="https://www.visa.fr" target="_blank" rel="noopener noreferrer">
                    <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                    alt="Visa"
                    style={{height: "30px"}}/>
                </a>

                <a href="https://www.mastercard.fr" target="_blank" rel="noopener noreferrer">
                    <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                    alt="Mastercard"
                    style={{height: "30px"}}/>
                </a>

            </div>


        </div>
    );
}

export default Footer;
