// ----------------------------------------------- Environment variables

const back_end_url = import.meta.env.VITE_BACKEND_URL;

// ----------------------------------------------- CSS

import "./ToolBar.css";

// ----------------------------------------------- React

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ----------------------------------------------- Local utils

import { manage_dropdown_click, check_submenu_wrappers_visual_layout } from "../../utils/ToolBar/ToolBar.js";

// ----------------------------------------------- Contexts

import { useClientContext } from "../../contexts/ClientContextProvider/ClientContextProvider.jsx";
import { useTwoFAContext } from "../../contexts/TwoFAContextProvider/TwoFAContextProvider.jsx";




function ToolBar({images}) {


    const {token, setToken, clientFirstName, setClientFirstName, shoppingCart, setIsClientSubscribedToNewsletter} = useClientContext();
    const {setIs2FAEnabled} = useTwoFAContext();

    const menu = useRef(null);
    const [isMenuListVisible, setIsMenuListVisible] = useState(false);
    const submenu_wrappers_list = useRef([]);
    const dropdowns_list = useRef([]);

    const visual_layout_animation_id = useRef({obj : null});
    const dropdowns_handler_list = useRef([]);




    // Si on rafraîchit la page depuis la page d'accueil, on a besoin de récupérer le token et le clientFirstName pour pouvoir mettre à jour la barre
    useEffect(() => {

        async function fetch_client_information_refresh() {

            try {

                const back_end_response = await fetch(`${back_end_url}/authentication/me`, {

                    method : "GET",
                    credentials : "include",
                    headers : {

                        "Content-Type" : "application/json",
                        "Accept" : "application/json"
                    }
                });

                if (!back_end_response.ok) {

                    if (back_end_response.status === 402) {

                        console.log("Token not found");
                    }
                    else {

                        throw new Error(`${back_end_response.status}`);
                    }
                }

                const result = await back_end_response.json();

                if (result?.message && result.message?.token && result.message?.clientFirstName && result.message.hasOwnProperty(`is2FAEnabled`) && result.message.hasOwnProperty(`isSubscribedToNewsletter`)) {

                    setToken(result.message.token);
                    setClientFirstName(result.message.clientFirstName);
                    setIs2FAEnabled(result.message.is2FAEnabled);
                    setIsClientSubscribedToNewsletter(result.message.isSubscribedToNewsletter);
                }
            }
            catch(error) {

                throw new Error(error);
            }
        }

        // On relance au refresh le fetch du panier client uniquement si le userId n'est pas trouvé (car dans ce cas le user est déjà connecté avec ou sans token car cookie token présent)
        // Si le cookie token n'est pas trouvé, le user est déconnecté, on ne lance pas de fetch sur le panier car pas de clientId dans token
        if (!token || !clientFirstName) fetch_client_information_refresh();

    }, []);




    useEffect(() => {


        const r_menu = menu.current;
        const r_submenu_wrappers_list = submenu_wrappers_list.current;
        const r_dropdowns_list = dropdowns_list.current;


        if (r_menu && r_submenu_wrappers_list && r_dropdowns_list) {

            const is_window_resized = {obj : false};
            const resized_submenu_wrappers_dict = {obj : {}};
            const media_query = '(hover: hover) and (pointer: fine)';

            visual_layout_animation_id.current.obj = requestAnimationFrame(() => (

                check_submenu_wrappers_visual_layout(
                    r_submenu_wrappers_list, visual_layout_animation_id.current, is_window_resized, resized_submenu_wrappers_dict
                )
            ));

            const resize_submenu_wrappers_visual_layout_handler = () => {

                is_window_resized.obj = true;
                cancelAnimationFrame(visual_layout_animation_id.current.obj);

                visual_layout_animation_id.current.obj = requestAnimationFrame(() => (

                    check_submenu_wrappers_visual_layout(
                        r_submenu_wrappers_list, visual_layout_animation_id.current, is_window_resized, resized_submenu_wrappers_dict
                    )
                ));
            }

            window.addEventListener("resize", resize_submenu_wrappers_visual_layout_handler);

            if (!window.matchMedia(media_query).matches) {

                if (dropdowns_handler_list.current.length === 0) {

                    r_dropdowns_list.forEach((element, index) => {

                        const dropdown_handler = (e) => {

                            manage_dropdown_click(e, r_submenu_wrappers_list[index]);
                        }

                        element.addEventListener("click", dropdown_handler);
                        dropdowns_handler_list.current.push({element, dropdown_handler});
                    });
                }
            }

            return () => {

                window.removeEventListener("resize", resize_submenu_wrappers_visual_layout_handler);
                
                if (dropdowns_handler_list.current.length > 0) {

                    dropdowns_handler_list.current.forEach(({element, handler}, _) => {

                        element.removeEventListener("click", handler);
                    });

                    dropdowns_handler_list.current.length = 0;
                }

                cancelAnimationFrame(visual_layout_animation_id.current.obj);
            };
        }

    }, [isMenuListVisible]);


    return (

        <div className="toolbar">

            <div ref={menu} className="menu">

                <button onClick={() => (setIsMenuListVisible((prev) => (!prev)))} className="menu-toggle"> ☰ </button>

                <ul className="menu-list" style={{display : isMenuListVisible ? "block" : "none"}}>

                    <li className="menu-link"> <Link to="/"> Home </Link> </li>
                    <li className="menu-link"> <Link to="/about-page"> About </Link> </li>
                    <li className="menu-link"> <Link to="/contact-page"> Contact </Link> </li>


                    <li ref={(el) => (dropdowns_list.current[0] = el)} className="dropdown">
                        Shop
                        <div ref={(el) => (submenu_wrappers_list.current[0] = el)} className="submenu-wrapper">

                            <img src={images[0]} alt="Main photo of toolbar"/>

                            <ul className="submenu">


                                <li ref={(el) => (dropdowns_list.current[1] = el)} className="dropdown">
                                    Accessories
                                    <div ref={(el) => (submenu_wrappers_list.current[1] = el)} className="submenu-wrapper">
                                        <img src={images[1]} alt="Accessories photo"/>
                                        <ul className="submenu">
                                            <li className="menu-link"> <Link to="/accessories-jewellery-page"> Jewellery </Link> </li>
                                            <li className="menu-link"> <Link to="/accessories-winter-page"> Winter Accessories / Neck and Hand Wear </Link> </li>
                                            <li className="menu-link"> <Link to="/accessories-garden-page"> Garden </Link> </li>
                                        </ul>
                                    </div>
                                </li>

                                <li ref={(el) => (dropdowns_list.current[2] = el)} className="dropdown">
                                    Clothes
                                    <div ref={(el) => (submenu_wrappers_list.current[2] = el)} className="submenu-wrapper">
                                        <img src={images[2]} alt="Clothes photo"/>
                                        <ul className="submenu">
                                            <li className="menu-link"> <Link to="/clothes-hats-page"> Hats / Headwear </Link> </li>
                                            <li className="menu-link"> <Link to="/clothes-tops-page"> Tops </Link> </li>
                                            <li className="menu-link"> <Link to="/clothes-bottoms-page"> Bottoms / Lower Body Clothing </Link> </li>
                                        </ul>
                                    </div>
                                </li>

                                <li ref={(el) => (dropdowns_list.current[3] = el)} className="dropdown">
                                    Exclusive Collections
                                    <div ref={(el) => (submenu_wrappers_list.current[3] = el)} className="submenu-wrapper">
                                        <img src={images[3]} alt="Collections photo"/>
                                        <ul className="submenu">
                                            <li className="menu-link"> <Link to="/2025-winter-collection-page"> 2025 Hiver </Link> </li>
                                            <li className="menu-link"> <Link to="/2025-summer-collection-page"> 2025 Summer </Link> </li>
                                        </ul>
                                    </div>
                                </li>


                            </ul>

                        </div>

                    </li>


                    <li className="menu-link"> <Link to="/logging-page"> {token ? `Welcome, ${clientFirstName} \u{1F464}` : `Login`} </Link> </li>
                    <li className="menu-link"> <Link to="/shopping-cart-page"> {(token && shoppingCart !== "expired") && `My Shopping Cart \u{1F9FA}`} </Link> </li>
                
                </ul>

            </div>

        </div>
    );
}

export default ToolBar;
