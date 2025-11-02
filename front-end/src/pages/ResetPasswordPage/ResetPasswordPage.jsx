// ----------------------------------------------- Environment variables

const back_end_url = import.meta.env.VITE_BACKEND_URL;

// ----------------------------------------------- CSS

import "./ResetPasswordPage.css";

// ----------------------------------------------- External media

import tb_main_img from "../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- React

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------- Librairies externes

import { TextField } from "@mui/material";

// ----------------------------------------------- Components

import ToolBar from "../../components/ToolBar/ToolBar.jsx";

import Footer from "../../components/Footer/Footer.jsx";




function ResetPasswordPage() {

    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];


    const reset_password_page_new_password = useRef(null);
    const new_password = useRef("");


    const [email, setEmail] = useState("");
    const [isFirstStep, setIsFirstStep] = useState(true);

    const [isSecondStep, setIsSecondStep] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    

    const [isThirdStep, setIsThirdStep] = useState(false);


    const navigateToLoggingPage = useNavigate();




    async function send_verification_code() {

        try {

            if (email) {

                const back_end_response = await fetch(`${back_end_url}/authentication/sendVerificationCode?Email=${email}`, {

                    method : "GET",
                    headers : {
                        "Content-Type" : "application/json",
                        "Accept" : "application/json"
                    }
                });

                if (!back_end_response.ok) {

                    throw new Error(`${back_end_response.status}`);
                }

                const result = await back_end_response.json();

                if (result?.message) {
                    
                    setIsFirstStep(false);
                    setIsSecondStep(true);
                }
                else {

                    throw new Error(`Empty request or transporter sendMail not found`);
                }
            }
            else {

                throw new Error(`email not found`);
            }
        }
        catch(error) {

            throw new Error(`${error}`);
        }
    }




    const confirm_verification_code = () => {

        if (verificationCode) {

            setIsSecondStep(false);
            setIsThirdStep(true);
        }
    }


    const set_new_password = (e) => {

        new_password.current = e.target.value;
    }


    const toggle_new_password = () => {

        if (reset_password_page_new_password.current) {

            (reset_password_page_new_password.current.type === "password") ? reset_password_page_new_password.current.type = "text" : reset_password_page_new_password.current.type = "password";
        }
    }


    const go_back_to_second_step = () => {

        setIsSecondStep(true);
        setIsThirdStep(false);
    }




    async function confirm_new_password_in_time() {

        try {

            if (email && verificationCode && new_password.current) {

                const password = new_password.current;

                const back_end_response = await fetch(`${back_end_url}/authentication/modifyClientPassword`, {

                    method : "PATCH",
                    headers : {
                        "Content-Type" : "application/json",
                        "Accept" : "application/json"
                    },
                    body : JSON.stringify({

                        Email : email,
                        code : verificationCode,
                        clientNewPassword : password
                    })
                });

                if (!back_end_response.ok) {

                    throw new Error(`${back_end_response.status}`);
                }

                const result = await back_end_response.json();

                if (result?.message) {
                    
                    setIsFirstStep(true);
                    setEmail("");
                    setIsSecondStep(false);
                    setVerificationCode("");
                    setIsThirdStep(false);
                    new_password.current = "";

                    navigateToLoggingPage('/logging-page');
                }
                else {

                    throw new Error(`Empty request`);
                }
            }
            else {

                throw new Error(`email or password not found`);
            }
        }
        catch(error) {

            throw new Error(`${error}`);
        }
    }




    const go_back = () => {

        navigateToLoggingPage('/logging-page');
    }




    return (

        <div
        className="reset-password-page">


            <ToolBar
            images={tb_imgs_list}/>


            <div 
            className="reset-password-page-maincontent">

                <div
                className="reset-password-page-wrapper">

                    {isFirstStep 
                    && (

                        <>
                            <TextField
                            label="Enter Your Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}/>

                            <button
                            className="reset-password-page-wrapper-send-button"
                            onClick={() => (send_verification_code())}>
                            <span> Send Verification Code </span>
                            </button>

                            <button 
                            className="reset-password-page-wrapper-go-back-button"
                            onClick={() => (go_back())}> 
                            <span> Go Back </span>
                            </button>
                        </>
                    )}
                    {isSecondStep
                    && (

                        <>
                            <TextField
                            label="Enter Verification Code"
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}/>

                            <button
                            className="reset-password-page-wrapper-send-button"
                            onClick={() => (confirm_verification_code())}>
                            <span> Confirm Verification Code </span>
                            </button>
                        </>
                    )}
                    {isThirdStep
                    && (

                        <>
                            <div
                            className="new-password-wrapper">
                                <input
                                ref={reset_password_page_new_password}
                                className="reset-password-page-wrapper-new-password-input"
                                type="password"
                                name="password"
                                placeholder="Enter New Password"
                                onChange={(e) => (set_new_password(e))}
                                required/>

                                <button 
                                className="reset-password-page-wrapper-toggle-new-password-button"
                                onClick={() => (toggle_new_password())}> 
                                👁 
                                </button>
                            </div>

                            <div
                            className="new-password-options-wrapper">
                                <button
                                className="reset-password-page-wrapper-confirm-button"
                                onClick={() => (confirm_new_password_in_time())}>
                                <span> Confirm New Password </span>
                                </button>

                                <button
                                className="reset-password-page-wrapper-back-button"
                                onClick={() => (go_back_to_second_step())}>
                                <span> Go Back </span>
                                </button>
                            </div>
                        </>
                    )}

                </div>

            </div>


            <Footer/>


        </div>
    );
}

export default ResetPasswordPage;
