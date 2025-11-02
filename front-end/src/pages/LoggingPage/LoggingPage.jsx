// ----------------------------------------------- Environment variables

const back_end_url = import.meta.env.VITE_BACKEND_URL;
const recaptcha_website_key = import.meta.env.VITE_RECAPTCHA_WEBSITE_KEY;

// ----------------------------------------------- CSS

import "./LoggingPage.css";

// ----------------------------------------------- External media

import tb_main_img from "../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- React

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ----------------------------------------------- Librairies externes

import { GoogleLogin } from "@react-oauth/google";

import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import countryList from "react-select-country-list";

import ReCAPTCHA from 'react-google-recaptcha';

// ----------------------------------------------- Components

import ToolBar from "../../components/ToolBar/ToolBar.jsx";

import Footer from "../../components/Footer/Footer.jsx";

// ----------------------------------------------- Global Utils

import { animate_letters } from "../../utils/AnimateWordsUtils.js";

// ----------------------------------------------- Contexts

import { useClientContext } from "../../contexts/ClientContextProvider/ClientContextProvider.jsx";
import { useTwoFAContext } from "../../contexts/TwoFAContextProvider/TwoFAContextProvider.jsx";




function LoggingPage() {




    const {token, setToken, setClientFirstName, shoppingCart, setShoppingCart, isClientSubscribedToNewsletter, setIsClientSubscribedToNewsletter} = useClientContext();
    const {is2FAEnabled, setIs2FAEnabled, setMailPasswordTo2FAConfirm, setIsInTwoFAPage} = useTwoFAContext();

    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];

    const p_list = useRef([]);

    /* Overlay */
    const logging_page_overlay = useRef(null);
    const logging_page_overlay_svg = useRef(null);
    const logging_page_clip_path = useRef(null);
    const logging_page_wrapper = useRef(null);


    const client_email = useRef("");
    const client_password = useRef("");
    const logging_page_signup_password = useRef(null);
    const logging_page_login_password = useRef(null);


    const [toggleSignup, setToggleSignup] = useState(false);
    const [toggleLogin, setToggleLogin] = useState(false);


    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [country, setCountry] = useState("");
    const countries = countryList().getData(); // Liste complète des pays

    const [phoneNumber, setPhoneNumber] = useState("");

    const [townsList, setTownsList] = useState([]);
    const [townInputValue, setTownInputValue] = useState("");
    const [town, setTown] = useState("");
    const [townValue, setTownValue] = useState("");
    const [addressesList, setAddressesList] = useState([]);
    const [addressInputValue, setAddressInputValue] = useState("");
    const [address, setAddress] = useState("");
    const [addressValue, setAddressValue] = useState("");
    const [postCodesList, setPostCodesList] = useState([]);
    const [postCodeInputValue, setPostCodeInputValue] = useState("");
    const [postCode, setPostCode] = useState("");
    const [postCodeValue, setPostCodeValue] = useState("");

    const [birthYear, setBirthYear] = useState(null);
    const [isNewsLetterSubscriptionChecked, setIsNewsLetterSubscriptionChecked] = useState(false);


    const location = useLocation();


    const navigateToProductPage = useNavigate();
    const navigateToResetPasswordPage = useNavigate();
    const navigateToTwoFAPage = useNavigate();


    const [shoppingCartExpirationMessage, setShoppingCartExpirationMessage] = useState(() => {

        const stored = sessionStorage.getItem("shoppingCartExpirationMessage");
        return stored ? stored : null;
    });


    const recaptcha = useRef(null);




    const toggle_signup = () => {

        if (shoppingCartExpirationMessage) {

            setShoppingCartExpirationMessage(null);
            sessionStorage.setItem("shoppingCartExpirationMessage", "");
        }
        setToggleSignup((prev) => (!prev));
    }


    const signup_login_switch = () => {

        toggle_signup();
        toggle_login();
    }


    const set_password = (e) => {

        client_password.current = e.target.value;
    }


    const toggle_password = () => {

        if (toggleSignup && logging_page_signup_password.current) {

            (logging_page_signup_password.current.type === "password") ? logging_page_signup_password.current.type = "text" : logging_page_signup_password.current.type = "password";
        }

        if (toggleLogin && logging_page_login_password.current) {

            (logging_page_login_password.current.type === "password") ? logging_page_login_password.current.type = "text" : logging_page_login_password.current.type = "password";
        }
    }




    async function confirm_signup() {

        if (email && client_password.current && firstName && lastName && country && phoneNumber && address && town && postCode && birthYear && recaptcha.current) {

            try {

                const recaptcha_token = await recaptcha.current.executeAsync();
                if (recaptcha.current) recaptcha.current.reset();

                if (recaptcha_token) {

                    const back_end_response = await fetch(`${back_end_url}/registration/signup`, {

                        method : "POST",
                        headers : {

                            "Content-Type" : "application/json",
                            "Accept" : "application/json"
                        },
                        body : JSON.stringify({

                            clientEmail : email,
                            clientPassword : client_password.current,
                            clientFirstName : firstName,
                            clientLastName : lastName,
                            clientCountry : country,
                            clientPhoneNumber : phoneNumber,
                            clientAddress : address,
                            clientTown : town,
                            clientPostCode : postCode,
                            clientBirthYear : birthYear,
                            reCaptchaToken : recaptcha_token,
                            newsletterSubscription : isNewsLetterSubscriptionChecked
                        })
                    });

                    if (!back_end_response.ok) {

                        throw new Error(`Signup : ${back_end_response.status}`);
                    }

                    const result = await back_end_response.json();

                    if (result?.message) {

                        toggle_signup();
                        client_password.current = "";
                        alert(result.message);
                    }
                }
                else {

                    throw new Error(`recaptcha_token not found`);
                }
            }
            catch(error) {

                throw new Error(`${error}`);
            }
        }
    }




    const toggle_login = () => {

        if (shoppingCartExpirationMessage) {

            setShoppingCartExpirationMessage(null);
            sessionStorage.setItem("shoppingCartExpirationMessage", "");
        }
        setToggleLogin((prev) => (!prev));
    }


    const reset_password = () => {

        navigateToResetPasswordPage(`/reset-password-page`);
    }


    const set_email = (e) => {

        client_email.current = e.target.value;
    }




    async function confirm_login() {

        try {

            if (client_email.current && client_password.current) {

                const current_email = client_email.current;
                const current_password = client_password.current;

                const back_end_response = await fetch(`${back_end_url}/authentication/login`, {

                    method : "POST",
                    credentials : "include",
                    headers : {

                        "Content-Type" : "application/json",
                        "Accept" : "application/json"
                    },
                    body : JSON.stringify({

                        clientEmail : current_email,
                        clientPassword : current_password
                    })
                });

                if (back_end_response.status === 402) {

                    setToken(null);
                    setClientFirstName(null);
                    setShoppingCart(null);

                    throw new Error(`Token : ${back_end_response.status}`);
                }

                const result = await back_end_response.json();

                if (result?.message) {

                    if (result.message?.token && result.message?.clientFirstName) {

                        setToken(result.message.token);
                        setClientFirstName(result.message.clientFirstName);
                        if (shoppingCart === "expired") setShoppingCart(null); // Réinitialisation indépendante à titre indicatif (suit les setShoppingCart(null) dans confirm_login())

                        toggle_login();
                        client_email.current = "";
                        client_password.current = "";

                        const addedProductWhileLoggedOut = JSON.parse(sessionStorage.getItem("addedProductWhileLoggedOut")) || null;

                        if (addedProductWhileLoggedOut) navigateToProductPage(`/product-page`);
                    }
                    else if (result.message?.twofa_enabled) {

                        if (shoppingCart === "expired") setShoppingCart(null); // Réinitialisation indépendante à titre indicatif (suit les setShoppingCart(null) dans confirm_login())

                        setMailPasswordTo2FAConfirm([current_email, current_password]);
                        setIs2FAEnabled(true);
                        setIsInTwoFAPage(true);
                        navigateToTwoFAPage(`/twofa-page`);

                        toggle_login();
                        client_email.current = "";
                        client_password.current = "";
                    }
                    else {

                        setToken(null);
                        setClientFirstName(null);
                        setShoppingCart(null);

                        throw new Error(`Empty message`);
                    }
                }
                else {

                    setToken(null);
                    setClientFirstName(null);
                    setShoppingCart(null);

                    throw new Error(`Token not found`);
                }
            }
            else {

                throw new Error(`client_email or client_password not found`);
            }
        }
        catch(error) {

            setToken(null);
            setClientFirstName(null);
            setShoppingCart(null);

            throw new Error(`${error}`);
        }
    }




    const enable_2fa = () => {

        setIsInTwoFAPage(true);
        navigateToTwoFAPage(`/twofa-page`);
    }

    
    const disable_2fa = () => {

        setIsInTwoFAPage(true);
        navigateToTwoFAPage(`/twofa-page`);
    }




    async function confirm_logout() {

        try {

            const back_end_response = await fetch(`${back_end_url}/authentication/logout`, {

                method : "POST",
                credentials : "include",
                headers : {

                    "Content-Type" : "application/json",
                    "Accept" : "application/json",
                    ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                },
                body : JSON.stringify({})
            });

            if (!back_end_response.ok) {

                throw new Error(`${back_end_response.status}`);
            }

            const result = await back_end_response.json();

            if (result?.message) {

                if (shoppingCart === "expired") sessionStorage.setItem("shoppingCartExpirationMessage", "Your client session has expired and you have been logged out. Please log in again.");

                setToken(null);
                setClientFirstName(null);
                setShoppingCart(null);
            }
            else {

                throw new Error(`Logout error`);
            }
        }
        catch(error) {

            throw new Error(error);
        }
    }




    async function confirm_newsletter_unsubscription() {

        if (isClientSubscribedToNewsletter) {

            try {

                const back_end_response = await fetch(`${back_end_url}/client/unsubscribeToNewsletter`, {

                    method : "POST",
                    credentials : "include",
                    headers : {

                        "Content-Type" : "application/json",
                        "Accept" : "application/json",
                        ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                    },
                    body : JSON.stringify({})
                });

                if (!back_end_response.ok) {

                    throw new Error(`${back_end_response.status}`);
                }

                const result = await back_end_response.json();

                if (result?.message) {

                    setIsClientSubscribedToNewsletter(false);
                }
                else {

                    throw new Error(`client_id not found`);
                }
            }
            catch(error) {

                throw new Error(`${error}`);
            }
        }
    }




    async function confirm_sign_out() {

        try {

            confirm_logout();

            const back_end_response = await fetch(`${back_end_url}/authentication/signout`, {

                method : "DELETE",
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

            if (result?.message) {

                console.log("Signout successful");
            }
            else {

                throw new Error(`client_id not found`);
            }
        }
        catch(error) {

            throw new Error(`${error}`);
        }
    }




    useEffect(() => {

        setToggleSignup(false);
        setToggleLogin(false);

    }, [location]);




    useEffect(() => {

        if (townInputValue.length >= 3) {

            async function fetch_town() {

                try {

                    const nomatim_response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(townInputValue)}&format=json&addressdetails=1&limit=5`);
                
                    const result = await nomatim_response.json();

                    if (Array.isArray(result) && result.length > 0) {

                        const town = result.map((el, _) => (el.name));

                        setTownsList([...new Set(town)]);
                    }
                }
                catch(error) {

                    throw new Error(`${error}`);
                }
            }

            const timer_id = setTimeout(async () => {

                await fetch_town();

            }, 300);

            return () => {

                if (timer_id) clearTimeout(timer_id);
            }
        }
        else {

            setTownsList([]);
        }

    }, [townInputValue]);




    useEffect(() => {

        if (postCodeInputValue.length >= 4) {

            async function fetch_postcode() {

                try {

                    const nomatim_response = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postCodeInputValue)}&format=json&addressdetails=1&limit=5`);
                
                    const result = await nomatim_response.json();

                    if (Array.isArray(result) && result.length > 0 && result[0]?.address?.postcode) {

                        const postcode = result[0].address.postcode;

                        setPostCodesList([postcode]);
                    }
                }
                catch(error) {

                    throw new Error(`${error}`);
                }
            }

            const timer_id = setTimeout(async () => {

                await fetch_postcode();

            }, 300);

            return () => {

                if (timer_id) clearTimeout(timer_id);
            }
        }
        else {

            setPostCodesList([]);
        }

    }, [postCodeInputValue]);




    useEffect(() => {

        if (addressInputValue.length >= 2) {

            async function fetch_address() {

                try {

                    const nomatim_response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressInputValue)}&format=json&addressdetails=1&limit=5`);
                
                    const result = await nomatim_response.json();

                    if (Array.isArray(result) && result.length > 0) {

                        const address = result.map((el, _) => (el.display_name));

                        setAddressesList([...new Set(address)]);
                    }
                }
                catch(error) {

                    throw new Error(`${error}`);
                }
            }

            const timer_id = setTimeout(async () => {

                await fetch_address();

            }, 300);

            return () => {

                if (timer_id) clearTimeout(timer_id);
            }
        }
        else {

            setAddressesList([]);
        }

    }, [addressInputValue]);




    const set_town_value = (new_value) => {

        setTownValue(new_value);
        setTown(new_value);
    }


    const set_postcode_value = (new_value) => {

        setPostCodeValue(new_value);
        setPostCode(new_value);
    }


    const set_address_value = (new_value) => {

        setAddressValue(new_value);
        setAddress(new_value);
    }




    async function manage_googlelogin_success(credential_response) {

        try {

            if (credential_response?.credential) {

                const back_end_response = await fetch(`${back_end_url}/authentication/GoogleLogin`, {

                    method : "POST",
                    credentials : "include",
                    headers : {

                        "Content-Type" : "application/json",
                        "Accept" : "application/json"
                    },
                    body : JSON.stringify({

                        Credential : credential_response.credential
                    })
                });

                if (!back_end_response.ok) {

                    throw new Error(`${back_end_response.status}`);
                }

                const result = await back_end_response.json();

                console.log("aaa:", result);
                if (result?.message) {

                    if (result.message?.token && result.message?.clientFirstName) {

                        setToken(result.message.token);
                        setClientFirstName(result.message.clientFirstName);
                        if (shoppingCart === "expired") setShoppingCart(null); // Réinitialisation indépendante à titre indicatif (suit les setShoppingCart(null) dans confirm_login())

                        const addedProductWhileLoggedOut = JSON.parse(sessionStorage.getItem("addedProductWhileLoggedOut")) || null;

                        if (addedProductWhileLoggedOut) navigateToProductPage(`/product-page`);
                    }
                    else {

                        setToken(null);
                        setClientFirstName(null);
                        setShoppingCart(null);

                        throw new Error(`Empty message`);
                    }
                }
                else {

                    setToken(null);
                    setClientFirstName(null);
                    setShoppingCart(null);

                    throw new Error(`Google Login : Token not found`);
                }
            }
            else {

                throw new Error(`Google Login : credential not found`);
            }
        }
        catch(error) {

            setToken(null);
            setClientFirstName(null);
            setShoppingCart(null);

            throw new Error(`${error}`);
        }
    }




    useEffect(() => {

        if (p_list.current && Array.isArray(p_list.current) && p_list.current.length > 0) {

            for (let i = 0 ; i < p_list.current.length ; i ++) {

                animate_letters(p_list.current[i], 0.25);
            }
        }


        let raf_id = {obj : null};

        const r_logging_page_overlay = logging_page_overlay.current;
        const r_logging_page_overlay_svg = logging_page_overlay_svg.current;
        const r_logging_page_clip_path = logging_page_clip_path.current;
        const r_logging_page_wrapper = logging_page_wrapper.current;

        if (r_logging_page_overlay && r_logging_page_overlay_svg && r_logging_page_clip_path && r_logging_page_wrapper) {

            let elapsed_time = {obj : null};
            const duration = 500; // 6 secondes en ms
            let progress = {obj : 0};

            let scale = {obj : 1.5};

            const objectBoundingBox_lim_x_coord_px = (0.5 + (1 - 0.5) * 1) * r_logging_page_overlay.getBoundingClientRect().width;
            const objectBoundingBox_lim_y_coord_px = (0.5 + (1 - 0.5) * 1) * r_logging_page_overlay.getBoundingClientRect().height;

            function animate_overlay(time) {

                if (!elapsed_time.obj) {
                    
                    elapsed_time.obj = time;
                    r_logging_page_clip_path.style.transformBox = 'fill-box';
                    r_logging_page_clip_path.style.transformOrigin = 'center';
                };

                progress.obj = Math.min((time - elapsed_time.obj) / duration, 1);

                if (progress.obj < 1) {

                    const current_scale = 1 + progress.obj * (scale.obj - 1); // * 2 pour scale final de 3

                    const scaled_objectBoundingBox_lim_x_coord_px = (0.5 + (1 - 0.5) * current_scale) * r_logging_page_overlay.getBoundingClientRect().width;
                    const scaled_objectBoundingBox_lim_y_coord_px = (0.5 + (1 - 0.5) * current_scale) * r_logging_page_overlay.getBoundingClientRect().height;

                    const offset_x = scaled_objectBoundingBox_lim_x_coord_px - objectBoundingBox_lim_x_coord_px;
                    const offset_y = scaled_objectBoundingBox_lim_y_coord_px - objectBoundingBox_lim_y_coord_px;

                    r_logging_page_clip_path.style.transform = `scale(${current_scale}) translate(-${offset_x/scale.obj}px, -${offset_y/scale.obj}px)`;
                    raf_id.obj = requestAnimationFrame(animate_overlay);
                }
                else {
                    
                    const overlay_ending_animation = r_logging_page_overlay.animate(
                        
                        [
                            {opacity : 1},
                            {opacity : 0}
                        ],
                        {
                            duration : 500,
                            easing : 'ease-in',
                            fill : 'forwards'
                        }
                    );

                    overlay_ending_animation.finished.then(() => {

                        // Ne persistent pas au remontage
                        r_logging_page_overlay.style.visibility = "hidden";
                        r_logging_page_overlay_svg.style.visibility = "hidden";
                        r_logging_page_wrapper.style.zIndex = "1";
                    });
                }
            }

            raf_id.obj = requestAnimationFrame(animate_overlay);

            return () => {

                if (raf_id.obj) cancelAnimationFrame(raf_id.obj);
            }
        }

    }, []);

    


    return (

        <div
        className="logging-page">

            <div 
            ref={logging_page_overlay} 
            className="logging-page-overlay">

                <div className="logging-page-strip-1-overlay"></div>
                <div className="logging-page-strip-2-overlay"></div>
                <div className="logging-page-strip-3-overlay"></div>
                <div className="logging-page-strip-4-overlay"></div>

            </div>
            <svg ref={logging_page_overlay_svg} viewBox="0 0 1 1" preserveAspectRatio="none">
            </svg>


            <div 
            ref={logging_page_wrapper} 
            className="logging-page-wrapper">

                <ToolBar 
                images={tb_imgs_list}/>

                <div 
                className="logging-page-maincontent">

                    {/* Mémo : à chaque refresh, le token est fetch par le useEffect dans ToolBar. Le token comme le cookie token expirent suivant expiresIn de token */}

                    {!token ? (

                        <>
                            {
                                (shoppingCartExpirationMessage)
                            }
                            {
                                <div className="google-login">
                                    <GoogleLogin 
                                    onSuccess={(credential_response) => (manage_googlelogin_success(credential_response))} 
                                    onError={() => (console.log("Google Login Error"))}/>
                                </div>
                            }
                            {
                                (!toggleSignup && !toggleLogin) ? (

                                    <div className="animated-button-wrapper">
                                        <button 
                                        className="logging-page-signup-signup-button"
                                        onClick={() => (toggle_signup())}>
                                        <span> <p ref={(el) => (p_list.current[0] = el)}> Create Account </p> </span>
                                        </button>
                                    </div>
                                ) : (

                                    <>
                                        {!toggleLogin && (

                                            <div 
                                            className="signup-page-wrapper">

                                                <button 
                                                className="signup-page-wrapper-signup-login-switch-button"
                                                onClick={() => (signup_login_switch())}>
                                                <span> Already signed up ? Login </span>
                                                </button>

                                                <div 
                                                style={{display: "flex", flexDirection: "column", gap: "10px"}}
                                                className="signup-page-wrapper-form">

                                                    {/* Infos initiales */}
                                                    <TextField
                                                    label="First name"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}/>

                                                    <TextField
                                                    label="Last name"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}/>

                                                    <TextField
                                                    label="Email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}/>

                                                    <div 
                                                    className="password-wrapper">
                                                        <input
                                                        ref={logging_page_signup_password}
                                                        className="signup-page-wrapper-signup-password-input"
                                                        type="password"
                                                        name="password"
                                                        placeholder="Password"
                                                        onChange={(e) => (set_password(e))}
                                                        required/>

                                                        <button 
                                                        className="signup-page-wrapper-signup-toggle-password-button"
                                                        onClick={() => (toggle_password())}> 
                                                        👁 
                                                        </button>
                                                    </div>

                                                    {/* Pays */}
                                                    <FormControl>
                                                        <InputLabel> Country </InputLabel>
                                                        <Select value={country} onChange={(e) => setCountry(e.target.value)}>
                                                        {countries.map((c) => (
                                                            <MenuItem key={c.value} value={c.value}>
                                                            {c.label}
                                                            </MenuItem>
                                                        ))}
                                                        </Select>
                                                    </FormControl>

                                                    {/* Téléphone */}
                                                    <PhoneInput
                                                    country={country.toLowerCase()}
                                                    value={phoneNumber}
                                                    onChange={(phoneNumber) => setPhoneNumber(phoneNumber)}
                                                    inputStyle={{ width: "100%" }}/>

                                                    {/* Ville + code postal + adresse */}
                                                    <Autocomplete
                                                    options={townsList}
                                                    value={townValue}
                                                    onChange={(_, new_town) => (set_town_value(new_town))}
                                                    inputValue={townInputValue}
                                                    onInputChange={(_, new_value) => (setTownInputValue(new_value))}
                                                    renderInput={(params) => <TextField {...params} label="Town"/>}
                                                    freeSolo={true}/>

                                                    <Autocomplete
                                                    options={postCodesList}
                                                    value={postCodeValue}
                                                    onChange={(_, new_postcode) => (set_postcode_value(new_postcode))}
                                                    inputValue={postCodeInputValue}
                                                    onInputChange={(_, new_value) => (setPostCodeInputValue(new_value))}
                                                    renderInput={(params) => <TextField {...params} label="PostCode"/>}
                                                    freeSolo={true}/>
                                                    
                                                    <Autocomplete
                                                    options={addressesList}
                                                    value={addressValue}
                                                    onChange={(_, new_address) => (set_address_value(new_address))}
                                                    inputValue={addressInputValue}
                                                    onInputChange={(_, new_value) => (setAddressInputValue(new_value))}
                                                    renderInput={(params) => <TextField {...params} label="Address"/>}
                                                    freeSolo={true}/>

                                                    {/* Année de naissance */}
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <DatePicker
                                                        views={["year"]}
                                                        label="birthYear"
                                                        value={birthYear ? new Date(birthYear, 0) : null}
                                                        onChange={(newValue) => setBirthYear(newValue.getFullYear().toString())}/>
                                                    </LocalizationProvider>

                                                    {/* reCAPTCHA invisible */}
                                                    <ReCAPTCHA
                                                    ref={recaptcha}
                                                    sitekey={recaptcha_website_key}
                                                    size="invisible"/>

                                                    {/* Newsletter */}
                                                    <div
                                                    className="signup-page-wrapper-signup-newsletter">
                                                        <input
                                                        className="signup-page-wrapper-signup-newsletter-checkbox"
                                                        type="checkbox"
                                                        checked={isNewsLetterSubscriptionChecked}
                                                        onChange={(e) => (setIsNewsLetterSubscriptionChecked(e.target.checked))}/>
                                                        <span> I wish to subscribe to the newsletter </span>
                                                    </div>

                                                    {/* Confirmation inscription */}
                                                    <button 
                                                    className="logging-page-signup-confirm-button"
                                                    onClick={() => (confirm_signup())}> 
                                                    <span> Sign up </span>
                                                    </button>

                                                </div>

                                            </div>
                                        )}
                                    </>
                                )
                            }
                            {
                                (!toggleLogin && !toggleSignup) ? (

                                    <div className="animated-button-wrapper">
                                        <button
                                        className="logging-page-login-login-button"
                                        onClick={() => (toggle_login())}>
                                        <span> <p ref={(el) => (p_list.current[1] = el)}> Login </p> </span>
                                        </button>
                                    </div>
                                ) : (

                                    <>
                                        {!toggleSignup && (

                                            <div 
                                            className="logging-page-login-wrapper">

                                                <button 
                                                className="logging-page-wrapper-signup-login-switch-button"
                                                onClick={() => (signup_login_switch())}>
                                                <span> No account ? Sign up </span>
                                                </button>

                                                <button 
                                                className="logging-page-wrapper-login-reset-password-button"
                                                onClick={() => (reset_password())}>
                                                <span> Forgot password ? </span>
                                                </button>

                                                <div
                                                className="logging-page-wrapper-login-form">

                                                    <input
                                                    className="logging-page-wrapper-login-email-button"
                                                    type="email"
                                                    name="email"
                                                    placeholder="example@gmail.com"
                                                    onChange={(e) => (set_email(e))}
                                                    required/>

                                                    <div 
                                                    className="password-wrapper">
                                                        <input
                                                        ref={logging_page_login_password}
                                                        className="logging-page-wrapper-login-password-input"
                                                        type="password"
                                                        name="password"
                                                        placeholder="Password"
                                                        onChange={(e) => (set_password(e))}
                                                        required/>

                                                        <button 
                                                        className="logging-page-wrapper-login-toggle-password-button"
                                                        onClick={() => (toggle_password())}> 
                                                        👁 
                                                        </button>
                                                    </div>

                                                    <button
                                                    className="logging-page-wrapper-login-confirm-button"
                                                    onClick={() => (confirm_login())}>
                                                    <span> Login </span>
                                                    </button>

                                                </div>

                                            </div>
                                        )}
                                    </>
                                )
                            }
                        </>
                    ) : (

                        <div 
                        className="logging-page-configuration-wrapper">

                            {
                                (shoppingCart === "expired" && ( confirm_logout() ))
                            }

                            {/* Redirige vers TwoFAPage suivant l'activation 2FA par l'utilisateur */}
                            {( !is2FAEnabled 
                            && !(is2FAEnabled === null || is2FAEnabled === undefined) ) 
                            ? (

                                <button
                                className="logging-page-enable-2fa-button"
                                onClick={() => (enable_2fa())}>
                                <span> Enable Two-Factor Authentication (2FA) </span>
                                </button>

                            ) : (

                                <button
                                className="logging-page-disable-2fa-button"
                                onClick={() => (disable_2fa())}>
                                <span> Disable Two-Factor Authentication (2FA) </span>
                                </button>
                            )}

                            {( isClientSubscribedToNewsletter ) 
                            && (

                                <button
                                className="logging-page-logout-unsubscribe-button"
                                onClick={() => (confirm_newsletter_unsubscription())}>
                                <span> Unsubscribe From Newsletter </span>
                                </button>
                            )}

                            <button
                            className="logging-page-logout-sign-out-button"
                            onClick={() => (confirm_sign_out())}>
                            <span> Sign Out </span>
                            </button>

                            <button
                            className="logging-page-logout-confirm-button"
                            onClick={() => (confirm_logout())}>
                            <span> Logout </span>
                            </button>
                        
                        </div>
                    )}

                </div>


                <Footer/>

            </div>


            <svg width="0" height="0">
                <defs>
                    <clipPath ref={logging_page_clip_path} id="logging-page-clip-path-id" clipPathUnits="objectBoundingBox">
                        <path d="
                        M 0,0
                        V 1
                        H 1
                        V 0
                        Z

                        m 0.3533556,0.33226706
                        v 0.12752751
                        c 0,0.006052 7.6764e-4,0.0105923 0.002291,0.0136182 0.001529,0.002881 0.004894,0.004683 0.0100873,0.005404
                        l -0.002903,0.0233454
                        c -0.007744,-2.8811e-4 -0.0137546,-0.001874 -0.0180344,-0.004757 -0.004276,-0.002881 -0.007285,-0.007059 -0.009018,-0.012535 -0.001628,-0.005476 -0.002447,-0.0121035 -0.002447,-0.0198857
                        v -0.1281804
                        z

                        m 0.4248794,0
                        v 0.12752751
                        c 0,0.006052 7.6764e-4,0.0105923 0.002291,0.0136182 0.001529,0.002881 0.004889,0.004683 0.0100861,0.005404
                        l -0.002903,0.0233454
                        c -0.007744,-2.8811e-4 -0.0137558,-0.001874 -0.0180349,-0.004757 -0.004276,-0.002881 -0.007284,-0.007059 -0.009016,-0.012535 -0.001628,-0.005476 -0.002447,-0.0121035 -0.002447,-0.0198857
                        v -0.1281804
                        z

                        m -0.47730242,0.001944
                        c 0.003359,0 0.006216,0.001585 0.008559,0.004757 0.002447,0.003026 0.003671,0.007204 0.003671,0.012535 0,0.005331 -0.001224,0.009583 -0.003671,0.0127534 -0.002344,0.003026 -0.005194,0.004537 -0.008559,0.004537 -0.003262,0 -0.006113,-0.001511 -0.008559,-0.004537 -0.002447,-0.00317 -0.003671,-0.007422 -0.003671,-0.0127534 0,-0.005331 0.001224,-0.009509 0.003671,-0.012535 0.002447,-0.00317 0.005299,-0.004757 0.008559,-0.004757
                        z

                        m 0.23123904,0.001513
                        h 0.0198687
                        v 0.0142646
                        c 0,0.004611 -1.5671e-4,0.009511 -4.5592e-4,0.0146979 -2.9915e-4,0.005187 -7.6763e-4,0.0104497 -0.00138,0.0157811 -5.1287e-4,0.005331 -0.001068,0.0107332 -0.00168,0.016209
                        H 0.5356846
                        c -7.0991e-4,-0.005476 -0.00138,-0.0108776 -0.001985,-0.016209 -5.1288e-4,-0.005331 -9.1193e-4,-0.0105942 -0.001224,-0.0157811 -1.9941e-4,-0.005331 -3.134e-4,-0.0103035 -3.134e-4,-0.0149145
                        z

                        m 0.0719851,0.0127516
                        c 0.0155889,0 0.0274586,0.003965 0.03561,0.0118904 0.008253,0.007926 0.01238,0.0204626 0.01238,0.0376105 0,0.0118164 -0.001887,0.02147 -0.005656,0.0289633 -0.003768,0.00735 -0.009323,0.0127534 -0.0166584,0.0162126 -0.007234,0.003315 -0.0160478,0.00497 -0.0264404,0.00497
                        h -0.009018
                        v 0.0518758
                        H 0.57343755
                        V 0.35258384
                        c 0.004889,-0.001441 0.0101384,-0.002448 0.015743,-0.003024 0.005604,-7.213e-4 0.0105967,-0.001082 0.0149777,-0.001082
                        z

                        m -0.48601436,0.001731
                        h 0.0855881
                        V 0.3752799
                        H 0.17132914
                        V 0.49999945
                        H 0.1505438
                        V 0.37527954
                        H 0.1181424
                        Z

                        m 0.48723768,0.0235619
                        c -0.002141,0 -0.004178,1.3778e-4 -0.006115,4.3117e-4 -0.001934,1.3776e-4 -0.003567,2.9013e-4 -0.004889,4.3318e-4
                        v 0.0482018
                        h 0.008711
                        c 0.005909,0 0.0109018,-7.1928e-4 0.0149777,-0.002161 0.004178,-0.001441 0.007284,-0.003965 0.009323,-0.007566 0.002141,-0.003602 0.003209,-0.008717 0.003209,-0.015346 0,-0.006341 -0.001068,-0.0112405 -0.003209,-0.0146979 -0.002141,-0.003459 -0.005143,-0.005837 -0.009016,-0.007133 -0.003768,-0.001441 -0.0081,-0.002161 -0.0129917,-0.002162
                        z

                        m -0.36955452,0.009941
                        c 0.008456,0 0.0151306,0.001874 0.0200216,0.00562 0.004889,0.003746 0.008355,0.009005 0.0103924,0.0157793 0.002037,0.006772 0.003059,0.0147701 0.003059,0.0239927
                        v 0.0678734
                        c -0.002955,8.6445e-4 -0.007335,0.001944 -0.0131434,0.003241 -0.005709,0.001441 -0.0124822,0.002163 -0.0203275,0.002163 -0.006623,0 -0.0124311,-0.001154 -0.0174237,-0.003459 -0.004993,-0.00245 -0.008914,-0.006341 -0.0117673,-0.011672 -0.002754,-0.005476 -0.004127,-0.0127534 -0.004127,-0.0218321 0,-0.008646 0.001529,-0.0155627 0.004583,-0.0207492 0.003157,-0.005187 0.007336,-0.008863 0.0125332,-0.0110239 0.005194,-0.002306 0.0107486,-0.003461 0.0166584,-0.003461 0.002955,0 0.005656,2.1758e-4 0.008102,6.4875e-4 0.002545,4.3117e-4 0.004432,9.371e-4 0.005656,0.001513
                        v -0.003891
                        c 0,-0.004035 -5.1288e-4,-0.007637 -0.001529,-0.0108072 -9.1194e-4,-0.00317 -0.002598,-0.00562 -0.005045,-0.00735 -0.002344,-0.001874 -0.005604,-0.002811 -0.009782,-0.002811 -0.004381,0 -0.008354,4.3115e-4 -0.0119192,0.001298 -0.003567,8.6445e-4 -0.006522,0.001946 -0.008866,0.003243
                        l -0.002598,-0.0229123
                        c 0.002447,-0.001153 0.00596,-0.002304 0.0105456,-0.003457 0.004686,-0.001298 0.009679,-0.001946 0.0149769,-0.001946
                        z

                        m 0.17866301,0
                        c 0.007541,0 0.0142129,0.002524 0.0200216,0.007566 0.005909,0.0049 0.0104946,0.0118146 0.0137558,0.0207492 0.003262,0.008791 0.004889,0.0191661 0.004889,0.0311266 0,0.0119609 -0.001634,0.0224061 -0.004889,0.0313404 -0.003157,0.008935 -0.007641,0.0159255 -0.0134499,0.0209682 -0.005709,0.0049 -0.0124822,0.007348 -0.0203281,0.007348 -0.007641,0 -0.0144166,-0.002448 -0.0203263,-0.007348 -0.005808,-0.005043 -0.0103427,-0.0120331 -0.0136035,-0.0209682 -0.003262,-0.008935 -0.004889,-0.0193802 -0.004889,-0.0313404 0,-0.0119609 0.001685,-0.0223364 0.005045,-0.0311266 0.003359,-0.008791 0.007947,-0.0157053 0.0137546,-0.0207492 0.005909,-0.005044 0.012583,-0.007566 0.0200216,-0.007566
                        z

                        m 0.42212853,4.3317e-4
                        c 0.008559,0 0.0158954,0.002448 0.0220088,0.007348 0.006216,0.004755 0.0109541,0.0116016 0.0142129,0.0205351 0.003262,0.008791 0.004889,0.0192385 0.004889,0.031343 0,0.011672 -0.00138,0.0219033 -0.004127,0.0306933 -0.002649,0.008791 -0.006623,0.0157053 -0.0119205,0.0207492 -0.005194,0.0049 -0.0116167,0.00735 -0.019258,0.00735 -0.003567,0 -0.006877,-5.7823e-4 -0.009934,-0.001731 -0.002955,-0.00101 -0.005604,-0.002378 -0.007948,-0.004107
                        V 0.5399872
                        H 0.80467393
                        V 0.39062629
                        c 0.002545,-0.001153 0.005553,-0.002163 0.009018,-0.003028 0.003463,-0.00101 0.007183,-0.001802 0.0111558,-0.002378 0.003971,-7.1928e-4 0.007895,-0.00108 0.0117673,-0.00108
                        z

                        M 0.50343818,0.3843583
                        c 0.001731,0 0.003768,2.1358e-4 0.006115,6.4877e-4 0.002344,2.8811e-4 0.004588,7.1928e-4 0.006725,0.001298 0.002245,5.7624e-4 0.004075,0.0013 0.005501,0.002163
                        l -0.003359,0.0233429
                        c -0.001836,-7.1927e-4 -0.004127,-0.001441 -0.006878,-0.002161 -0.002649,-7.213e-4 -0.005656,-0.00108 -0.009018,-0.00108 -0.002037,0 -0.004127,2.1356e-4 -0.006265,6.4876e-4 -0.002037,4.3117e-4 -0.003567,9.371e-4 -0.004583,0.001513
                        v 0.0892692
                        H 0.47180309
                        V 0.39257341
                        c 0.003671,-0.001874 0.008151,-0.003676 0.0134499,-0.005404 0.005402,-0.001874 0.0114609,-0.002811 0.0181852,-0.002811
                        z

                        m -0.2124389,0.002378
                        h 0.0198687
                        v 0.11326239
                        h -0.0198687
                        z

                        m 0.37704136,0
                        h 0.0200216
                        v 0.0592262
                        c 0,0.007637 4.5584e-4,0.0138331 0.00138,0.0185887 0.001027,0.004755 0.002701,0.008213 0.005045,0.0103739 0.002344,0.002161 0.005448,0.003243 0.009323,0.003243 0.002344,0 0.004588,-1.3786e-4 0.006726,-4.3317e-4 0.002239,-2.8813e-4 0.004022,-5.7624e-4 0.00535,-8.6445e-4
                        v -0.0901358
                        h 0.0198612
                        v 0.10937191
                        c -0.003671,0.001441 -0.008458,0.002809 -0.014367,0.004107 -0.005808,0.001441 -0.0121247,0.002163 -0.0189515,0.002163 -0.008762,0 -0.0156905,-0.002233 -0.0207853,-0.006702 -0.004993,-0.004468 -0.008507,-0.0105924 -0.0105456,-0.0183746 -0.002037,-0.007926 -0.003059,-0.0170756 -0.003059,-0.02745
                        z

                        M 0.41448852,0.4081351
                        c -0.003873,0 -0.007183,0.001441 -0.009934,0.004324 -0.002754,0.002881 -0.004842,0.006917 -0.006267,0.0121053 -0.001426,0.005187 -0.002136,0.0113831 -0.002136,0.0185887 0,0.007205 7.0992e-4,0.0134738 0.002136,0.0188052 0.001426,0.005187 0.003516,0.009294 0.006267,0.0123219 0.002754,0.002881 0.006061,0.004322 0.009934,0.004322 0.003873,0 0.007132,-0.001441 0.009781,-0.004322 0.002754,-0.002881 0.004837,-0.006989 0.006265,-0.0123219 0.001529,-0.005331 0.002291,-0.0115998 0.002291,-0.0188052 0,-0.007205 -7.6763e-4,-0.0134016 -0.002291,-0.0185887 -0.001426,-0.005187 -0.003516,-0.009222 -0.006265,-0.0121053 -0.002649,-0.002881 -0.00591,-0.004324 -0.009781,-0.004324
                        z

                        m 0.42197726,2.1557e-4
                        c -0.002649,0 -0.004993,2.1358e-4 -0.00703,6.4877e-4 -0.002037,2.8811e-4 -0.003671,5.7824e-4 -0.004889,8.6608e-4
                        v 0.0626834
                        c 0.001529,0.001441 0.003567,0.002737 0.006115,0.003891 0.002649,0.001153 0.005396,0.001731 0.008253,0.001731 0.003262,0 0.00601,-7.213e-4 0.008253,-0.002163 0.002344,-0.001585 0.004276,-0.003818 0.005808,-0.006702 0.001529,-0.003026 0.002649,-0.006629 0.003365,-0.0108072 7.0993e-4,-0.004178 0.001068,-0.009005 0.001068,-0.0144812 0,-0.007205 -8.1381e-4,-0.0134738 -0.002447,-0.0188052 -0.001628,-0.005331 -0.004022,-0.009439 -0.007183,-0.0123219 -0.003059,-0.003026 -0.006827,-0.004537 -0.0113103,-0.004537
                        z

                        m -0.5969725,0.0412846
                        c -0.002955,0 -0.005755,4.3115e-4 -0.008405,0.001298 -0.002545,7.213e-4 -0.004635,0.002163 -0.006265,0.004324 -0.001628,0.002161 -0.002447,0.005331 -0.002447,0.009511 0,0.005765 0.001328,0.0098 0.003971,0.0121053 0.002754,0.002306 0.006417,0.003457 0.0110039,0.003457 0.002649,0 0.005096,-7.663e-5 0.007338,-2.1559e-4 0.002239,-2.8813e-4 0.004022,-6.4877e-4 0.00535,-0.00108
                        v -0.0276665
                        c -9.1194e-4,-4.3117e-4 -0.002395,-7.9584e-4 -0.004432,-0.001082
                        C 0.24367272,0.44985561 0.24163024,0.449638 0.239492,0.449638
                        Z
                        "/>
                    </clipPath>
                </defs>
            </svg>

        </div>
    );
}

export default LoggingPage;
