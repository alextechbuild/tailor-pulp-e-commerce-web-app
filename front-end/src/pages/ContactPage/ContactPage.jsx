// ----------------------------------------------- Environment variables

const back_end_url = import.meta.env.VITE_BACKEND_URL;

// ----------------------------------------------- CSS

import "./ContactPage.css";

// ----------------------------------------------- External media

import tb_main_img from "../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- React

import { useRef, useState } from "react";

// ----------------------------------------------- Librairies externes

import { TextField } from "@mui/material";

// ----------------------------------------------- Components

import ToolBar from "../../components/ToolBar/ToolBar.jsx";

import Footer from "../../components/Footer/Footer.jsx";




function ContactPage() {


    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];


    const [email, setEmail] = useState("");
    const [textArea, setTextArea] = useState("");
    const [status, setStatus] = useState("");




    async function send_message(e) {

        try {

            e.preventDefault();
            
            if (email && textArea) {

                const back_end_response = await fetch(`${back_end_url}/client/sendFormMessage`, {

                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json",
                        "Accept" : "application/json"
                    },
                    body : JSON.stringify({

                        Email : email,
                        Message : textArea
                    })
                });

                if (!back_end_response.ok) {

                    throw new Error(`${back_end_response.status}`);
                }

                const result = await back_end_response.json();

                if (result?.message) {
                    
                    setStatus(result.message);
                }
                else {

                    setStatus("Error");
                }
            }
            else {

                setStatus("Please, complete the 'Email' and 'Text Area' fields");
            }
        }
        catch(error) {

            throw new Error(`${error}`);
        }
    }




    return (

        <div
        className="contact-page">


            <div
            className="contact-page-wrapper">

                <ToolBar
                images={tb_imgs_list}/>


                <div 
                className="contact-page-maincontent">

                    <div
                    className="contact-page-maincontent-wrapper">

                        <h2> Any question ? Contact us </h2>

                        <form 
                        className="contact-page-maincontent-wrapper-form" 
                        onSubmit={send_message}>

                            <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}/>

                            <textarea
                            name="Message"
                            className="contact-page-maincontent-wrapper-textarea"
                            placeholder="Enter Your Message Here"
                            value={textArea}
                            onChange={(e) => setTextArea(e.target.value)}
                            required/>

                            <button 
                            type="submit"
                            className="contact-page-maincontent-wrapper-send-button"> 
                            <span> Send Message </span> 
                            </button>

                        </form>

                        <p className="contact-page-maincontent-wrapper-status"> {status} </p>

                        <p className="contact-page-maincontent-wrapper-gdpr">
                            The information sent via this form is used solely to respond to your message.
                            It is not stored for more than six months and is never passed on to third parties.
                            In accordance with the GDPR, you can exercise your rights of access, rectification and deletion
                            by contacting us at the assistance email.
                        </p>

                    </div>

                </div>


                <Footer/>

            </div>

            <div className="contact-page-strip-1-overlay"></div>
            <div className="contact-page-strip-2-overlay"></div>
            <div className="contact-page-strip-3-overlay"></div>
            <div className="contact-page-strip-4-overlay"></div>

        </div>
    );
}

export default ContactPage;
