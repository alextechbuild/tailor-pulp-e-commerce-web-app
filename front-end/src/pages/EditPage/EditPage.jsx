// ----------------------------------------------- Environment variables

const back_end_url = import.meta.env.VITE_BACKEND_URL;

// ----------------------------------------------- CSS

import "./EditPage.css";

// ----------------------------------------------- External media

import tb_main_img from "../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- React

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------- Librairies externes

import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import countryList from "react-select-country-list";

// ----------------------------------------------- Components

import ToolBar from "../../components/ToolBar/ToolBar.jsx";

import Footer from "../../components/Footer/Footer.jsx";

// ----------------------------------------------- Global utils

import { isDict } from "../../utils/DictObjectUtils.js";

// ----------------------------------------------- Contexts

import { useClientContext } from "../../contexts/ClientContextProvider/ClientContextProvider.jsx";




function EditPage() {




    const {token, shoppingCart, setShoppingCart} = useClientContext();

    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];


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

    const [isNewsLetterSubscriptionChecked, setIsNewsLetterSubscriptionChecked] = useState(false);


    const navigateToLoggingPage = useNavigate();
    const navigateToShoppingCartPage = useNavigate();




    async function fetch_client_shopping_cart_refresh() {

        try {

            const back_end_response = await fetch(`${back_end_url}/client/me`, {

                method : "GET",
                credentials : "include",
                headers : {

                    "Content-Type" : "application/json",
                    "Accept" : "application/json",
                    ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                }
            });

            if (!back_end_response.ok) {

                if (back_end_response.status === 402) {

                    navigateToLoggingPage("/logging-page");
                }
                else {

                    throw new Error(`${back_end_response.status}`);
                }
            }

            const result = await back_end_response.json();

            if ( result?.message 
            && result.message?.client 
            && result.message?.product ) {

                setShoppingCart(result.message);

            }
            else {

                if (result?.message) {

                    setShoppingCart(result.message);
                }
                else {

                    throw new Error(`Shopping cart not found`);
                }
            }
        }
        catch(error) {

            navigateToLoggingPage("/logging-page");
        }
    }




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




    async function confirm_info_changes() {

        try {

            const back_end_response = await fetch(`${back_end_url}/client/modifyClientInfo`, {

                method : "POST",
                credentials : "include",
                headers : {

                    "Content-Type" : "application/json",
                    "Accept" : "application/json",
                    ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                },
                body : JSON.stringify({

                    clientFirstName : firstName,
                    clientLastName : lastName,
                    clientCountry : country,
                    clientPhoneNumber : phoneNumber,
                    clientAddress : address,
                    clientTown : town,
                    clientPostCode : postCode, 
                    newsletterSubscription : isNewsLetterSubscriptionChecked
                })
            });

            if (!back_end_response.ok) {

                throw new Error(`${back_end_response.status}`);
            }

            const result = await back_end_response.json();

            if (result?.message) {

                alert(result.message);
                navigateToShoppingCartPage('/shopping-cart-page');
            }
        }
        catch(error) {

            throw new Error(`${error}`);
        }
    }




    const go_back = () => {

        navigateToShoppingCartPage('/shopping-cart-page');
    }




    useEffect(() => {
    
        fetch_client_shopping_cart_refresh();

    }, []);

    


    return (

        <div
        className="edit-page">

            <ToolBar 
            images={tb_imgs_list}/>

            <div 
            className="edit-page-maincontent">

                {/* Mémo : à chaque refresh, le token est fetch par le useEffect dans ToolBar. Le token comme le cookie token expirent suivant expiresIn de token */}

                {( shoppingCart 
                && isDict(shoppingCart)
                && Object.keys(shoppingCart).length > 0 ) 
                && (

                    <div 
                    className="edit-page-wrapper">

                        {Object.entries(shoppingCart).map(([key, value], i) => (

                            ( value 
                            && Array.isArray(value) 
                            && value.length > 0 ) && (

                                ( key === "client" ) && (

                                    <div
                                    key={`${i}-epwi`}
                                    className="edit-page-wrapper-info-client">

                                        <h3> Your Information </h3>

                                        <div 
                                        key={`${i}-epwi-list`}>

                                            { ( value
                                            && Array.isArray(value)
                                            && value.length > 0 )
                                            && ( value.map((element, j) => (

                                                ( element 
                                                && isDict(element) 
                                                && Object.keys(element).length > 0 )
                                                && (Object.entries(element).map(([sub_key, sub_value], k) => (

                                                    <p
                                                    key={`${i},${j},${k}-epwici-p`}
                                                    className="edit-page-wrapper-info-client-info">
                                                        {sub_key.charAt(0).toUpperCase() + sub_key.slice(1).replace("_", " ")} : {sub_value}
                                                    </p>
                                                )))
                                            )))}

                                        </div>

                                    </div>
                                )
                            )
                        ))}

                        <div 
                        className="edit-page-wrapper-edit">

                            <h3> Edit one or more of your personal information here </h3>

                            <div 
                            style={{display: "flex", flexDirection: "column", gap: "10px"}}
                            className="edit-page-wrapper-form">

                                {/* Infos initiales */}
                                <TextField
                                label="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}/>

                                <TextField
                                label="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}/>

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

                                {/* Confirmation modification */}
                                <button 
                                className="edit-page-wrapper-edit-confirm-changes"
                                onClick={() => (confirm_info_changes())}> 
                                <span> Modify </span>
                                </button>

                            </div>

                        </div>

                        <button 
                        className="edit-page-wrapper-go-back-button"
                        onClick={() => (go_back())}> 
                        <span> Go Back </span>
                        </button>

                    </div>
                )}

            </div>


            <Footer/>

        </div>
    );
}

export default EditPage;
