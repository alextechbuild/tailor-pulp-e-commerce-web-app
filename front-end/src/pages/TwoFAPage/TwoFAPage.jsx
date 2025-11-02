// ----------------------------------------------- Environment variables

const back_end_url = import.meta.env.VITE_BACKEND_URL;

// ----------------------------------------------- CSS

import "./TwoFAPage.css";

// ----------------------------------------------- External media

import tb_main_img from "../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- React

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------- Components

import ToolBar from "../../components/ToolBar/ToolBar.jsx";

import Footer from "../../components/Footer/Footer.jsx";

// ----------------------------------------------- Contexts

import { useClientContext } from "../../contexts/ClientContextProvider/ClientContextProvider.jsx";
import { useTwoFAContext } from "../../contexts/TwoFAContextProvider/TwoFAContextProvider.jsx";




function TwoFAPage() {




    const {token, setToken, setClientFirstName} = useClientContext();
    const {is2FAEnabled, setIs2FAEnabled, mailPasswordTo2FAConfirm, setMailPasswordTo2FAConfirm, isInTwoFAPage, setIsInTwoFAPage} = useTwoFAContext();


    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];


    const [isFirstStep, setIsFirstStep] = useState(true);
    const [qrCode, setQrCode] = useState(null);
    const [TOTPSecret, setTOTPSecret] = useState(null);

    const [isSecondStep, setIsSecondStep] = useState(false);

    const [isThirdStep, setIsThirdStep] = useState(false);
    const [TOTPCode, setTOTPCode] = useState(null);


    const navigateToLoggingPage = useNavigate();
    const navigateToProductPage = useNavigate();




    async function generate_totp_secret() {

        try {

            const back_end_response = await fetch(`${back_end_url}/authentication/generateTOTPSecret`, {

                method : "GET",
                credentials : "include",
                headers : {

                    "Content-Type" : "application/json",
                    "Accept" : "application/json",
                    ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                }
            });

            if (!back_end_response.ok) {

                throw new Error(`${back_end_response.status}`);
            }

            const result = await back_end_response.json();

            if (result?.message && result.message?.dataURL && result.message?.secretBase32) {

                setQrCode(result.message.dataURL);
                setTOTPSecret(result.message.secretBase32);

                setIsFirstStep(false);
                setIsSecondStep(true);
            }
            else {

                throw new Error(`totp_secret not found`);
            }
        }
        catch(error) {

            throw new Error(`${error}`);
        }
    }


    const go_to_third_step = () => {

        setIsSecondStep(false);
        setIsThirdStep(true);
    }




    async function enable_2fa() {

        try {

            if (TOTPCode && TOTPSecret) {

                const back_end_response = await fetch(`${back_end_url}/authentication/enable-2fa`, {

                    method : "POST",
                    credentials : "include",
                    headers : {

                        "Content-Type" : "application/json",
                        "Accept" : "applicatipn/json",
                        ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                    },
                    body : JSON.stringify({

                        code : TOTPCode,
                        secret : TOTPSecret
                    })
                });

                if (!back_end_response.ok) {

                    throw new Error(`${back_end_response.status}`);
                }

                const result = await back_end_response.json();

                if (result?.message) {

                    setQrCode(null);
                    setTOTPSecret(null);
                    setTOTPCode(null);

                    setIsThirdStep(false);
                    setIsFirstStep(true);
                    setIs2FAEnabled(true);

                    setIsInTwoFAPage(false);

                    navigateToLoggingPage("/logging-page");
                }
                else {

                    setTOTPCode(null);
                    throw new Error(`2fa not enabled`);
                }
            }
            else {

                throw new Error(`TOTPCode or TOTPSecret not found`);
            }
        }
        catch(error) {

            throw new Error(`${error}`);
        }
    }




    async function disable_2fa() {

        try {

            if (TOTPCode) {

                const back_end_response = await fetch(`${back_end_url}/authentication/disable-2fa?code=${TOTPCode}`, {

                    method : "DELETE",
                    credentials : "include",
                    headers : {

                        "Content-Type" : "application/json",
                        "Accept" : "applicatipn/json",
                        ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                    }
                });

                if (!back_end_response.ok) {

                    throw new Error(`${back_end_response.status}`);
                }

                const result = await back_end_response.json();

                if (result?.message) {

                    setTOTPCode(null);
                    setIs2FAEnabled(false);

                    setIsInTwoFAPage(false);

                    navigateToLoggingPage("/logging-page");
                }
                else {

                    throw new Error(`2fa not disabled`);
                }
            }
            else {

                throw new Error(`TOTPCode not found`);
            }
        }
        catch(error) {

            throw new Error(`${error}`);
        }
    }




    async function confirm_2fa() {

        try {

            if (TOTPCode && mailPasswordTo2FAConfirm && Array.isArray(mailPasswordTo2FAConfirm) && mailPasswordTo2FAConfirm.length === 2) {

                const [userEmail, userPassword] = mailPasswordTo2FAConfirm;

                const back_end_response = await fetch(`${back_end_url}/authentication/confirm-2fa`, {

                    method : "POST",
                    credentials : "include",
                    headers : {

                        "Content-Type" : "application/json",
                        "Accept" : "application/json"
                    },
                    body : JSON.stringify({

                        clientEmail : userEmail,
                        clientPassword : userPassword,
                        code : TOTPCode
                    })
                });

                if (!back_end_response.ok) {

                    if (back_end_response.status === 402) {

                        setToken(null);
                        setClientFirstName(null);
                        setTOTPCode(null);
                        setMailPasswordTo2FAConfirm(null);

                        setIsInTwoFAPage(false);

                        navigateToLoggingPage("/logging-page");
                    }
                    else {

                        throw new Error(`${back_end_response.status}`);
                    }
                }

                const result = await back_end_response.json();

                if (result?.message) {

                    setToken(result.message.token);
                    setClientFirstName(result.message.clientFirstName);
                    setTOTPCode(null);
                    setMailPasswordTo2FAConfirm(null);

                    setIsInTwoFAPage(false);

                    const addedProductWhileLoggedOut = JSON.parse(sessionStorage.getItem("addedProductWhileLoggedOut")) || null;

                    if (addedProductWhileLoggedOut) navigateToProductPage(`/product-page`);

                    navigateToLoggingPage("/logging-page");
                }
                else {

                    setToken(null);
                    setClientFirstName(null);
                    setTOTPCode(null);

                    throw new Error(`Token not found`);
                }
            }
            else {

                throw new Error(`TOTPCode or mailPasswordTo2FAConfirm not found`);
            }
        }
        catch(error) {

            throw new Error(`${error}`);
        }
    }




    useEffect(() => {

        if (isInTwoFAPage) {

            if (token && !is2FAEnabled && !(is2FAEnabled === null || is2FAEnabled === undefined) && isFirstStep) generate_totp_secret();
        }
        else {

            // Vérifie si l'utilisateur n'a pas cliqué sur les fonctionnalités 2FA
            // Permet de rediriger l'utilisateur vers la page de logging dans le cas où l'utilisateur irait sur la TwoFaPage sans avoir rempli les input dans la logging page
            navigateToLoggingPage(`/logging-page`);
        }

    }, [])




    return (

        <div
        className="twofa-page">

            <ToolBar
            images={tb_imgs_list}
            />

            <div 
            className="twofa-page-maincontent">

                {/* Vérifie si l'utilisateur a bien rempli les input dans la logging page */}
                {( isInTwoFAPage ) 
                && (

                    (!token ? (

                        <div 
                        className="twofa-page-wrapper">

                            {( is2FAEnabled ) 
                            && (
                                <>
                                    <h2> Please, <span className="underline"> enter the code </span> generated from your authentication application below : </h2>

                                    <input
                                    className="twofa-page-code-input"
                                    type="text"
                                    name="totpcode"
                                    placeholder="Enter 6-digit Code"
                                    onChange={(e) => (setTOTPCode(e.target.value))}
                                    required/>

                                    <button
                                    className="twofa-page-confirm-2fa-button"
                                    onClick={() => (confirm_2fa())}>
                                    <span> Confirm </span>
                                    </button>
                                </>
                            )}
                        
                        </div>

                    ) : (

                        <div 
                        className="twofa-page-wrapper">

                            {( !is2FAEnabled
                            && !(is2FAEnabled === null || is2FAEnabled === undefined) ) 
                            ? (
                                <>
                                    <>
                                        {( isSecondStep
                                        && qrCode
                                        && TOTPSecret )
                                        && (
                                            <>
                                                <h2> Please, <span className="underline"> choose one </span> of the methods below and <span className="underline"> click on "Proceed" </span> to proceed to the next step : </h2>
                                                <p> <span className="bold"> Scan </span> this <span className="underline"> QR code </span> with an <span className="bold"> authentication </span> app (Microsoft Authenticator, Google Authenticator, etc.) </p>
                                                <img src={qrCode} alt="QrCode 2FA"/>
                                                <p> OR, If you prefer to <span className="bold"> enter </span> the <span className="bold"> TOTP secret </span> <span className="underline"> manually </span>, here it is : &nbsp;
                                                    <span className="bold">
                                                        <span className="underline"> 
                                                            <span className="important">
                                                                {TOTPSecret} 
                                                            </span>
                                                        </span>
                                                    </span>
                                                </p>
                                                <button
                                                className="twofa-page-proceed-button"
                                                onClick={() => (go_to_third_step())}>
                                                <span> Proceed </span>
                                                </button>
                                            </>
                                        )}
                                    </>

                                    <>
                                        {( isThirdStep )
                                        && (

                                            <>
                                                <h2> Please, <span className="underline"> enter the code </span> generated from your authentication application below : </h2>

                                                <input
                                                className="twofa-page-code-input"
                                                type="text"
                                                name="totpcode"
                                                placeholder="Enter 6-digit Code"
                                                onChange={(e) => (setTOTPCode(e.target.value))}
                                                required/>

                                                <button
                                                className="twofa-page-enable-2fa-button"
                                                onClick={() => (enable_2fa())}>
                                                <span> Enable 2FA </span>
                                                </button>
                                            </>
                                        )}
                                    </>
                                </>
                            ) : ( 

                                <>
                                    <h2> Please, <span className="underline"> enter the code </span> generated from your authentication application below : </h2>

                                    <input
                                    className="twofa-page-code-input"
                                    type="text"
                                    name="totpcode"
                                    placeholder="Enter 6-digit Code"
                                    onChange={(e) => (setTOTPCode(e.target.value))}
                                    required/>

                                    <button
                                    className="twofa-page-disable-2fa-button"
                                    onClick={() => (disable_2fa())}>
                                    <span> Disable 2FA </span>
                                    </button>
                                </>
                            )}

                        </div>
                    ))
                )}

            </div>


            <Footer/>

        </div>
    );
}

export default TwoFAPage;
