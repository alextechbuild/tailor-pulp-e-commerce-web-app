// ----------------------------------------------- Environment variables

const back_end_url = import.meta.env.VITE_BACKEND_URL;

// ----------------------------------------------- CSS

import "./VerticalScrollingBoard.css";

// ----------------------------------------------- React

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------- Local utils

import { h_list } from "../../utils/VerticalScrollingBoard/ImgWrappersTextsListUtils.js";
import { 
    manage_zoom_button, manage_zoom_button_display, 
    manage_img_wrapper_format, 
    manage_img_card_wrapper_touchstart, manage_img_card_wrapper_touchend,
    manage_fold_button, manage_unfold_button,
    manage_preview_mode_button, manage_preview_mode_resize,
    manage_research_button,
    manage_close_button,
    manage_save_button,
    manage_previous_button, manage_next_button,
    extract_card_product_information,
    manage_imgs_wrappers_imgs_reloading
} from "../../utils/VerticalScrollingBoard/VerticalScrollingBoard.js";

// ----------------------------------------------- Contexts

import { useSelectedProductContext } from "../../contexts/SelectedProductContextProvider/SelectedProductContextProvider.jsx";




function VerticalScrollingBoard({VerticalScrollingBoardImgs, imported_texts_list}) {


    const {setSelectedProduct} = useSelectedProductContext();

    const get_imgs_texts_list = (loaded_imgs_list, imported_texts_list) => {

        if (loaded_imgs_list instanceof Array && imported_texts_list instanceof Array) {

            if (loaded_imgs_list.length === imported_texts_list.length) {

                return Array.from({length : loaded_imgs_list.length}, (_, index) => {

                    return [loaded_imgs_list[index], imported_texts_list[index]];
                });
            }
        }
    }

    const global_imgs_btns_wrapper = useRef(null); // ".vertical-scrolling-wrapper-board-img-wrapper"

    const global_imgs_wrapper = useRef(null); // ".vertical-scrolling-wrapper-board-img-wrapper-imgs"
    const imgs_texts_list = get_imgs_texts_list(VerticalScrollingBoardImgs, imported_texts_list);
    const img_wrappers_list = useRef([]); // ".vertical-scrolling-wrapper-board-img-wrapper-imgs-col-img"
    const imgs_wrappers_handlers_list = useRef([]);


    const media_query_format = useRef(null);
    const media_query_device = useRef(null);

    const global_img_card_wrapper = useRef(null); // ".vertical-scrolling-wrapper-board-img-wrapper-card"
    const img_card_wrapper = useRef(null); // ".vertical-scrolling-wrapper-board-img-wrapper-card-img"
    const lens = useRef(null); // ".vertical-scrolling-wrapper-board-img-wrapper-card-img-lens"
    const text_card_wrapper = useRef(null); // ".vertical-scrolling-wrapper-board-img-wrapper-card-text"
    const global_img_card_options_wrapper = useRef(null); // ".vertical-scrolling-wrapper-board-img-wrapper-card-options"
    const zoom_button = useRef(null); // ".vswbibwco-zoom"


    const global_img_card_btn_wrapper = useRef(null); // ".vertical-scrolling-wrapper-board-img-wrapper-card-btn"
    const unfold_button = useRef(null); // ".vswbibwcb-unfold"
    const fold_button = useRef(null); // ".vswbibwcb-fold"
    const preview_mode_button = useRef(null); // ".vswbibwcb-preview-mode"
    const searchbar_input = useRef(null); // ".vsw2ibwcb-searchbar-input"
    const searchbar_value = useRef("");
    const searchbar_button = useRef(null); // ".vsw2ibwcb-searchbar-button"
    const close_button = useRef(null); // ".vswbibwcb-close"


    const save_button = useRef(null); // ".vswbibwco-save"
    const previous_button = useRef(null); // ".vswbibwco-previous"
    const next_button = useRef(null); // ".vswbibwco-next"

    const navigateToProductPage = useNavigate();
    const see_product_button = useRef(null); // ".vswbibwco-see"




    const [zoomButtonPropertiesSave, setZoomButtonPropertiesSave] = useState(() => {
        const stored = sessionStorage.getItem("zoom_button_properties");
        return stored ? JSON.parse(stored) : null;
    });
    const [imgCardWrapperPropertiesSave, setImgCardWrapperPropertiesSave] = useState(() => {
        const stored = sessionStorage.getItem("img_card_wrapper_properties");
        return stored ? JSON.parse(stored) : null;
    });
    const [globalImgCardWrapperPropertiesSave, setGlobalImgCardWrapperPropertiesSave] = useState(() => {
        const stored = sessionStorage.getItem("global_img_card_wrapper_properties");
        return stored ? JSON.parse(stored) : null;
    });
    const [unfoldButtonPropertiesSave, setUnfoldButtonPropertiesSave] = useState(() => {
        const stored = sessionStorage.getItem("unfold_button_properties");
        return stored ? JSON.parse(stored) : null;
    });
    const [foldButtonPropertiesSave, setFoldButtonPropertiesSave] = useState(() => {
        const stored = sessionStorage.getItem("fold_button_properties");
        return stored ? JSON.parse(stored) : null;
    });
    const [imgCardWrapperImgPropertiesSave, setImgCardWrapperImgPropertiesSave] = useState(() => {
        const stored = sessionStorage.getItem("img_card_wrapper_img_properties");
        return stored ? JSON.parse(stored) : null;
    });
    const [lensImgPropertiesSave, setLensImgPropertiesSave] = useState(() => {
        const stored = sessionStorage.getItem("lens_img_properties");
        return stored ? JSON.parse(stored) : null;
    });
    const [textCardWrapperTextPropertiesSave, setTextCardWrapperTextPropertiesSave] = useState(() => {
        const stored = sessionStorage.getItem("text_card_wrapper_text_properties");
        return stored ? JSON.parse(stored) : null;
    });




    useEffect(() => {




        const r_global_imgs_btns_wrapper = global_imgs_btns_wrapper.current;
        const r_global_imgs_wrapper = global_imgs_wrapper.current;
        const r_img_wrappers_list = img_wrappers_list.current;
        let r_media_query_format = media_query_format.current;
        let r_media_query_device = media_query_device.current;
        const r_global_img_card_wrapper = global_img_card_wrapper.current;
        const r_img_card_wrapper = img_card_wrapper.current;
        const r_lens = lens.current;
        const r_text_card_wrapper = text_card_wrapper.current;
        const r_global_img_card_options_wrapper = global_img_card_options_wrapper.current;
        const r_zoom_button = zoom_button.current;
        const r_global_img_card_btn_wrapper = global_img_card_btn_wrapper.current;
        const r_unfold_button = unfold_button.current;
        const r_fold_button = fold_button.current;
        const r_preview_mode_button = preview_mode_button.current;
        const r_searchbar_input = searchbar_input.current;
        const r_searchbar_button = searchbar_button.current;
        const r_close_button = close_button.current;
        const r_save_button = save_button.current;
        const r_previous_button = previous_button.current;
        const r_next_button = next_button.current;
        const r_see_product_button = see_product_button.current;




        const empty_img = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="; // N'est pas modifiée (passage par valeur donc sera copie)
        let previous_deleted_img_wrapper_info_history = [];

        r_media_query_format = window.matchMedia("(min-width: 400px) and (max-width: 1000px)");
        r_media_query_device = window.matchMedia("(hover: none) and (pointer: coarse)");

        let img_wrapper_handler_list = [];
        const canMovedToNextFrameMiwtc = {obj : true};
        const miwtc_raf_id = {obj : null}; // miwtc = manage_img_wrapper_temporary_deletion
        const mmml_arg_refs = {img_card : null, lens : null, img_lens : null}; // mmml = manage_mouse_move_lens
        const isZoomEnabled = JSON.parse(sessionStorage.getItem("isZoomEnabled")) || {obj : false};


        const touchtype_event_delta_x1 = {obj : 0};
        const touchtype_event_delta_x2 = {obj : 0};
        const deltaX = {obj : 0};
        const touchtype_event_delta_y1 = {obj : 0};
        const touchtype_event_delta_y2 = {obj : 0};
        const global_index = JSON.parse(sessionStorage.getItem("global_index")) || {obj : 0};
        const hasTouchedScreen = JSON.parse(sessionStorage.getItem("hasTouchedScreen")) || {obj : false};


        const isPreviewModeEnabled = JSON.parse(sessionStorage.getItem("isPreviewModeEnabled")) || {obj : false};


        const hasClickedOnPrevOrNext = JSON.parse(sessionStorage.getItem("hasClickedOnPrevOrNext")) || {obj : false};


        let img_wrappers_collection = null;
        if (r_global_imgs_wrapper) img_wrappers_collection = r_global_imgs_wrapper.getElementsByClassName("vertical-scrolling-wrapper-board-img-wrapper-imgs-col-img");
        const img_wrappers_imgs_loaded_count = {obj : 0};
        let imgs_wrappers_imgs_list = [];
        const global_imgs_wrapper_scrollable_fixed_height = {obj : 0};
        const last_scroll = {obj: 0};
        const current_scroll = {obj : 0};
        const delta = {obj : 0};


        let text_card_wrapper_text_list = (JSON.parse(sessionStorage.getItem("text_card_wrapper_text_list")))?.text_card_wrapper_text_list || [];


        // Pour debounce le calcul du scroll dans le défilé principal
        let giw_timeout_id = {obj : null}; // giw = global_imgs_wrapper

        // Pour restaurer le scroll du défilé principal
        const VerticalScrollingBoard_global_imgs_wrapper_scrolling_position = sessionStorage.getItem("VerticalScrollingBoard_global_imgs_wrapper_scrolling_position") || null;




        if (
            r_global_imgs_btns_wrapper && r_global_imgs_wrapper && r_img_wrappers_list.length && 
            r_media_query_format && r_media_query_device && r_global_img_card_wrapper && r_img_card_wrapper && r_lens && 
            r_text_card_wrapper && r_global_img_card_options_wrapper && r_zoom_button && r_global_img_card_btn_wrapper && 
            r_unfold_button && r_fold_button && r_preview_mode_button && r_searchbar_input && r_searchbar_button && r_close_button && r_save_button && 
            r_previous_button && r_next_button && r_see_product_button
        ) {


            // ----------------------------------------------- Gestion de la restauration du scroll du défilé principal


            // parseInt(scroll, 10) convertit la chaîne savedScroll en nombre entier en base 10 (pour que JavaScript n’interprète pas la valeur comme de l’octal si elle commence par 0)
            if (VerticalScrollingBoard_global_imgs_wrapper_scrolling_position) r_global_imgs_wrapper.scrollTo(0, parseInt(VerticalScrollingBoard_global_imgs_wrapper_scrolling_position, 10));




            // ----------------------------------------------- Gestion du zoom sur l'image par l'utilisateur sur la carte (Loupe)


            // Handler

            const zoom_button_handler = () => {

                manage_zoom_button(isZoomEnabled);
            }


            // Listener

            r_zoom_button.addEventListener("click", zoom_button_handler);


            // Handler

            const zoom_button_display_handler = (e) => {

                manage_zoom_button_display(e, r_zoom_button);
            }


            // Listener

            r_media_query_device.addEventListener("change", zoom_button_display_handler);




            // ----------------------------------------------- Gestion de chaque miniature depuis le défilé principal et dans la carte


            // Listener

            r_img_wrappers_list.forEach((img_wrapper, index) => {

                if (img_wrapper) {

                    // Handler

                    const img_wrapper_format_handler = () => {

                        // A chaque clic sur une même miniature, on conserve l'index de cette miniature dans un index global
                        // On a besoin de l'index global pour y accéder depuis le swipe utilisateur

                        // Si on le met pas, on swipe depuis le début et on peut retomber sur l'image qui vient d'être supprimée de la colonne (car transférée dans la carte),
                        // et donc on ne peut pas accéder aux propriétés de cet élément supprimé (comme le parent)
                        global_index.obj = index;

                        manage_img_wrapper_format(
                            img_wrapper, r_global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, r_global_img_card_wrapper, 
                            r_img_card_wrapper, r_lens, r_text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, 
                            hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs,
                            img_wrapper_handler_list
                        );
                    }

                    img_wrapper.addEventListener("click", img_wrapper_format_handler);

                    imgs_wrappers_handlers_list.current.push([img_wrapper, img_wrapper_format_handler]);
                }
            });




            // ----------------------------------------------- Gestion du swipe de l'image par l'utilisateur sur la carte (Smartphone, Tablette)


            // Handler

            const img_card_wrapper_touchstart_handler = (e) => {

                manage_img_card_wrapper_touchstart(
                    e, r_global_img_card_btn_wrapper, r_global_img_card_options_wrapper, r_text_card_wrapper, touchtype_event_delta_x1, 
                    touchtype_event_delta_y1
                );
            }


            // Listener

            r_global_img_card_wrapper.addEventListener("touchstart", img_card_wrapper_touchstart_handler);


            // Handler 

            const img_card_wrapper_touchend_handler = (e) => {

                manage_img_card_wrapper_touchend(
                    e, r_global_img_card_btn_wrapper, r_global_img_card_options_wrapper, touchtype_event_delta_x1, 
                    touchtype_event_delta_x2, deltaX, touchtype_event_delta_y1, touchtype_event_delta_y2, global_index, 
                    r_img_wrappers_list, r_global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, r_global_img_card_wrapper, 
                    r_img_card_wrapper, r_lens, r_text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, 
                    canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs, img_wrapper_handler_list
                );
            }


            // Listener

            r_global_img_card_wrapper.addEventListener("touchend", img_card_wrapper_touchend_handler);




            // ----------------------------------------------- Gestion du repliement (Fold) / dépliement (Unfold) complet de la carte


            // Handler

            const fold_button_handler = () => {

                manage_fold_button(r_fold_button, r_global_img_card_wrapper, r_unfold_button);
            }


            // Listener

            r_fold_button.addEventListener("click", fold_button_handler);


            // Handler

            const unfold_button_handler = () => {

                manage_unfold_button(r_unfold_button, r_global_img_card_wrapper, r_fold_button);
            }


            // Listener

            r_unfold_button.addEventListener("click", unfold_button_handler);




            // ----------------------------------------------- Gestion du mode Preview (aperçu) de la carte


            // Handler

            const preview_mode_button_handler = () => {

                manage_preview_mode_button(
                    r_global_img_card_wrapper, r_img_card_wrapper, r_media_query_format, isPreviewModeEnabled, r_unfold_button, 
                    r_fold_button
                );
            }


            // Listener

            r_preview_mode_button.addEventListener("click", preview_mode_button_handler);


            // Handler

            const preview_mode_resize_handler = () => {

                manage_preview_mode_resize(
                    r_global_img_card_wrapper, r_img_card_wrapper, r_media_query_format, isPreviewModeEnabled
                );
            }


            // Listener

            window.addEventListener("resize", preview_mode_resize_handler);




            // ----------------------------------------------- Gestion du mode Preview (aperçu) de la carte


            // Handler

            const searchbar_input_handler = (e) => {

                searchbar_value.current = e.target.value;
            }


            // Listener

            r_searchbar_input.addEventListener("change", searchbar_input_handler);


            // Handler

            const searchbar_button_handler = () => {

                const searched_word = searchbar_value.current;
                const isCaseSensitiveEnabled = false;

                manage_research_button(
                    global_index, r_img_wrappers_list, r_global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, r_global_img_card_wrapper, 
                    r_img_card_wrapper, r_lens, r_text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, 
                    canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs, img_wrapper_handler_list, imported_texts_list, searched_word, h_list, isCaseSensitiveEnabled
                );
            }


            // Listener

            r_searchbar_button.addEventListener("click", searchbar_button_handler);




            // ----------------------------------------------- Gestion de la fermeture de la carte (Close)


            // Handler

            const close_button_handler = () => {

                manage_close_button(
                    r_global_img_card_wrapper, r_unfold_button, r_fold_button, previous_deleted_img_wrapper_info_history, 
                    r_global_imgs_wrapper, empty_img
                );
            }


            // Listener

            r_close_button.addEventListener("click", close_button_handler);




            // ----------------------------------------------- Gestion de la sauvegarde de l'image de la carte


            // Handler

            const save_button_handler = () => {

                manage_save_button(r_img_wrappers_list, global_index);
            }


            // Listener

            r_save_button.addEventListener("click", save_button_handler);




            // ----------------------------------------------- Gestion du swipe de l'image par l'utilisateur sur la carte (PC)


            // Handler

            const previous_button_handler = () => {

                manage_previous_button(
                    global_index, r_img_wrappers_list, r_global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, 
                    r_global_img_card_wrapper, r_img_card_wrapper, r_lens, r_text_card_wrapper, isPreviewModeEnabled, 
                    hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, 
                    mmml_arg_refs, img_wrapper_handler_list
                );

                let product_information = extract_card_product_information(r_img_wrappers_list, global_index);
                
                if (product_information.length > 0) {

                    text_card_wrapper_text_list.length = 0;

                    product_information.filter((el, _) => (el?.tagName?.toLowerCase() !== "img")).forEach((el, _) => {

                        el.forEach((text_type, _) => {

                            if (text_type) {

                                if (text_type.tagName.toLowerCase() === "h1") text_card_wrapper_text_list.push(["h1", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "h2") text_card_wrapper_text_list.push(["h2", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "h3") text_card_wrapper_text_list.push(["h3", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "h4") text_card_wrapper_text_list.push(["h4", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "p") text_card_wrapper_text_list.push(["p", text_type.textContent]);
                            }
                        });
                    });
                }
            }


            // Listener

            r_previous_button.addEventListener("click", previous_button_handler);


            // Handler

            const next_button_handler = () => {

                manage_next_button(
                    global_index, r_img_wrappers_list, r_global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, 
                    r_global_img_card_wrapper, r_img_card_wrapper, r_lens, r_text_card_wrapper, isPreviewModeEnabled, 
                    hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, 
                    mmml_arg_refs, img_wrapper_handler_list
                );

                let product_information = extract_card_product_information(r_img_wrappers_list, global_index);
                
                if (product_information.length > 0) {

                    text_card_wrapper_text_list.length = 0;

                    product_information.filter((el, _) => (el?.tagName?.toLowerCase() !== "img")).forEach((el, _) => {

                        el.forEach((text_type, _) => {

                            if (text_type) {

                                if (text_type.tagName.toLowerCase() === "h1") text_card_wrapper_text_list.push(["h1", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "h2") text_card_wrapper_text_list.push(["h2", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "h3") text_card_wrapper_text_list.push(["h3", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "h4") text_card_wrapper_text_list.push(["h4", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "p") text_card_wrapper_text_list.push(["p", text_type.textContent]);
                            }
                        });
                    });
                }
            }


            // Listener

            r_next_button.addEventListener("click", next_button_handler);




            // ----------------------------------------------- Gestion de l'aperçu du produit pour achat


            async function fetch_product_sizes_and_quantity(product) {

                let product_id;

                // product peut être soit le produit sous la forme d'une liste d'infos soit l'image de la carte en sessionStorage
                // Array (product_information du bouton)
                // On met ? car l'image peut ne pas être définie dans la miniature si elle n'a pas été chargée
                if (Array.isArray(product) && product.length > 0 && product[0]?.tagName?.toLowerCase() === "img") {

                    const img = product[0];

                    if (img?.dataset && img.dataset?.productId && img.dataset?.productName) {

                        product_id = img.dataset.productId;
                    }
                }
                // Image chargée ou déchargée (image produit du sessionStorage)
                else if (product?.dataset && product.dataset?.productId && product.dataset?.productName && product.dataset?.productCategory && product.dataset?.src) {

                    product_id = product.dataset.productId;
                }

                if (product_id) {

                    try {

                        const back_end_response = await fetch(`${back_end_url}/product/getSizesAndQuantities?productId=${product_id}`, {

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

                        if (result.message) {

                            const product_sizes_quantities_list = result.message;

                            if (Array.isArray(product) && product.length > 0 && product[0].tagName.toLowerCase() === "img") {

                                product[0].setAttribute("data-product-sizes-quantities", JSON.stringify(product_sizes_quantities_list));

                                setSelectedProduct(product);
                                navigateToProductPage("/product-page");
                            }
                            else if (product?.dataset && product.dataset?.productId && product.dataset?.productName && product.dataset?.productCategory && product.dataset?.src) {

                                sessionStorage.setItem("img_card_wrapper_img_properties", JSON.stringify({

                                    dataset : {

                                        "product-id" : product_id,
                                        "product-name" : product.dataset.productName,
                                        "product-category" : product.dataset.productCategory,
                                        "src" : product.src,
                                        "product-sizes-quantities" : product_sizes_quantities_list
                                    },
                                    style : {
                                        
                                        width : product.style.width,
                                        height : product.style.height
                                    }
                                }));

                                sessionStorage.setItem("text_card_wrapper_text_list", JSON.stringify({text_card_wrapper_text_list}));
                                sessionStorage.setItem("text_card_wrapper_text_properties", JSON.stringify({text_card_wrapper_text_list}));
                            }
                        }
                        else {

                            throw new Error(`Sizes and quantities not found`);
                        }
                    }
                    catch(error) {

                        throw new Error(`${error}`);
                    }
                }
            }


            // Handler

            const see_product_button_handler = () => {

                let product_information = extract_card_product_information(r_img_wrappers_list, global_index);
                
                if (product_information.length > 0) {

                    text_card_wrapper_text_list.length = 0;

                    product_information.filter((el, _) => (el?.tagName?.toLowerCase() !== "img")).forEach((el, _) => {

                        el.forEach((text_type, _) => {

                            if (text_type) {

                                if (text_type.tagName.toLowerCase() === "h1") text_card_wrapper_text_list.push(["h1", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "h2") text_card_wrapper_text_list.push(["h2", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "h3") text_card_wrapper_text_list.push(["h3", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "h4") text_card_wrapper_text_list.push(["h4", text_type.textContent]);
                                else if (text_type.tagName.toLowerCase() === "p") text_card_wrapper_text_list.push(["p", text_type.textContent]);
                            }
                        });
                    });

                    fetch_product_sizes_and_quantity(product_information);
                }
                else {

                    text_card_wrapper_text_list = [];
                }
            }


            // Listener

            r_see_product_button.addEventListener("click", see_product_button_handler);




            // ----------------------------------------------- Gestion du chargement / rechargement d'images suivant le scroll utilisateur dans le défilé principal


            // Handler

            const imgs_wrappers_imgs_reloading_handler = (e) => {
            
                manage_imgs_wrappers_imgs_reloading(
                    e, img_wrappers_imgs_loaded_count, imgs_wrappers_imgs_list, img_wrappers_collection, r_global_imgs_wrapper, 
                    empty_img, global_imgs_wrapper_scrollable_fixed_height, last_scroll, current_scroll, delta
                );

                if (giw_timeout_id.obj) clearTimeout(giw_timeout_id.obj);

                if (VerticalScrollingBoard_global_imgs_wrapper_scrolling_position) {

                    if (r_global_imgs_wrapper.scrollTop.toString() !== VerticalScrollingBoard_global_imgs_wrapper_scrolling_position) {

                        giw_timeout_id.obj = setTimeout(() => {
                            
                            sessionStorage.setItem("VerticalScrollingBoard_global_imgs_wrapper_scrolling_position", r_global_imgs_wrapper.scrollTop.toString());
                        
                        }, 1000);
                    }
                }
                else {

                    sessionStorage.setItem("VerticalScrollingBoard_global_imgs_wrapper_scrolling_position", r_global_imgs_wrapper.scrollTop.toString()); 
                }
            }


            // Listener

            r_global_imgs_wrapper.addEventListener("scroll", imgs_wrappers_imgs_reloading_handler);


            // Handler

            const imgs_wrappers_imgs_format_reloading_handler = () => {

                // Gérer le rechargement des images des miniatures dans le défilé principal pour redimensionner chaque miniature à chaque changement de format
                // Cela permet de recalculer les dimensions de chaque miniature à chaque changement de format
                // Ce n'est pas un scroll utilisateur donc event = null
                manage_imgs_wrappers_imgs_reloading(
                    null, img_wrappers_imgs_loaded_count, imgs_wrappers_imgs_list, img_wrappers_collection, r_global_imgs_wrapper, 
                    empty_img, global_imgs_wrapper_scrollable_fixed_height, last_scroll, current_scroll, delta
                );
            }
            

            // Listener

            r_media_query_format.addEventListener("change", imgs_wrappers_imgs_format_reloading_handler);




            // ----------------------------------------------- Appels
            
            
            // Charger les images des miniatures dans le défilé principal pour la toute première fois
            // Ce n'est pas un scroll utilisateur donc event = null
            manage_imgs_wrappers_imgs_reloading(
                null, img_wrappers_imgs_loaded_count, imgs_wrappers_imgs_list, img_wrappers_collection, r_global_imgs_wrapper, 
                empty_img, global_imgs_wrapper_scrollable_fixed_height, last_scroll, current_scroll, delta
            );




            // ----------------------------------------------- Nettoyage


            return () => {

                if (
                    r_global_imgs_btns_wrapper && r_global_imgs_wrapper && imgs_wrappers_handlers_list.current.length &&
                    r_media_query_format && r_media_query_device && r_global_img_card_wrapper && r_img_card_wrapper && r_lens && 
                    r_text_card_wrapper && r_global_img_card_options_wrapper && r_zoom_button && r_global_img_card_btn_wrapper && 
                    r_unfold_button && r_fold_button && r_preview_mode_button && r_searchbar_input && r_searchbar_button && r_close_button && r_save_button && 
                    r_previous_button && r_next_button && r_see_product_button
                ) {

                    r_zoom_button.removeEventListener("click", zoom_button_handler);
                    r_media_query_device.removeEventListener("change", zoom_button_display_handler);

                    if (miwtc_raf_id.obj) cancelAnimationFrame(miwtc_raf_id.obj);

                    if (imgs_wrappers_handlers_list.current.length > 0) {

                        imgs_wrappers_handlers_list.current.forEach(([element, handler]) => {

                            element.removeEventListener("click", handler);
                        });

                        imgs_wrappers_handlers_list.current.length = 0;
                    }

                    r_global_img_card_wrapper.removeEventListener("touchstart", img_card_wrapper_touchstart_handler);
                    r_global_img_card_wrapper.removeEventListener("touchend", img_card_wrapper_touchend_handler);

                    r_fold_button.removeEventListener("click", fold_button_handler);
                    r_unfold_button.removeEventListener("click", unfold_button_handler);

                    r_preview_mode_button.removeEventListener("click", preview_mode_button_handler);
                    window.removeEventListener("resize", preview_mode_resize_handler);

                    r_searchbar_input.removeEventListener("change", searchbar_input_handler);
                    r_searchbar_button.removeEventListener("click", searchbar_button_handler);

                    r_close_button.removeEventListener("click", close_button_handler);

                    r_save_button.removeEventListener("click", save_button_handler);

                    r_previous_button.removeEventListener("click", previous_button_handler);
                    r_next_button.removeEventListener("click", next_button_handler);

                    r_see_product_button.removeEventListener("click", see_product_button_handler);

                    r_global_imgs_wrapper.removeEventListener("scroll", imgs_wrappers_imgs_reloading_handler);
                    r_media_query_format.removeEventListener("change", imgs_wrappers_imgs_format_reloading_handler);




                    sessionStorage.setItem("isZoomEnabled", JSON.stringify(isZoomEnabled));

                    sessionStorage.setItem("global_index", JSON.stringify(global_index));
                    sessionStorage.setItem("hasTouchedScreen", JSON.stringify(hasTouchedScreen));

                    sessionStorage.setItem("isPreviewModeEnabled", JSON.stringify(isPreviewModeEnabled));

                    sessionStorage.setItem("hasClickedOnPrevOrNext", JSON.stringify(hasClickedOnPrevOrNext));




                    sessionStorage.setItem("zoom_button_properties", JSON.stringify({

                        style : {

                            display : r_zoom_button.style.display
                        }
                    }));
                    sessionStorage.setItem("img_card_wrapper_properties", JSON.stringify({

                        style : {
                            
                            opacity : r_img_card_wrapper.style.opacity,
                            height : r_img_card_wrapper.style.height
                        }
                    }));
                    sessionStorage.setItem("global_img_card_wrapper_properties", JSON.stringify({

                        style : {
                            
                            display : r_global_img_card_wrapper.style.display,
                            maxHeight : r_global_img_card_wrapper.style.maxHeight,
                            minHeight : r_global_img_card_wrapper.style.minHeight
                        }
                    }));
                    sessionStorage.setItem("unfold_button_properties", JSON.stringify({

                        style : {
                            
                            display : r_unfold_button.style.display
                        }
                    }));
                    sessionStorage.setItem("fold_button_properties", JSON.stringify({

                        style : {
                            
                            display : r_fold_button.style.display
                        }
                    }));


                    if (r_img_card_wrapper?.querySelector("img")) {

                        const img = r_img_card_wrapper.querySelector("img");

                        fetch_product_sizes_and_quantity(img);
                    }
                    if (r_lens?.querySelector("img")) {

                        const img_lens = r_lens.querySelector("img");

                        if (img_lens?.dataset && img_lens?.dataset.src) {

                            sessionStorage.setItem("lens_img_properties", JSON.stringify({

                                dataset : {

                                    "src" : r_lens?.querySelector("img")?.src
                                }
                            }));
                        }
                    }

                    if (giw_timeout_id.obj) clearTimeout(giw_timeout_id.obj);
                }
            }
        }

    }, []);




    return (

        <div 
        className="vertical-scrolling-wrapper-board">

            {( VerticalScrollingBoardImgs 
            && Array.isArray(VerticalScrollingBoardImgs) 
            && VerticalScrollingBoardImgs.length > 0 
            && imgs_texts_list.length > 0 
            && Array.isArray(imgs_texts_list[0]) 
            && imgs_texts_list[0].length === 2 )
            && (

                <div 
                ref={global_imgs_btns_wrapper} 
                className="vertical-scrolling-wrapper-board-img-wrapper">

                    <div 
                    ref={global_img_card_wrapper} 
                    style={globalImgCardWrapperPropertiesSave?.style} 
                    className="vertical-scrolling-wrapper-board-img-wrapper-card">

                        <div 
                        ref={global_img_card_btn_wrapper} 
                        className="vertical-scrolling-wrapper-board-img-wrapper-card-btn">
                            <button 
                            ref={fold_button}
                            style={foldButtonPropertiesSave?.style} 
                            className="vsw2ibwcb-fold"> &#x25B2; </button>
                            <button 
                            ref={unfold_button} 
                            style={unfoldButtonPropertiesSave?.style} 
                            className="vsw2ibwcb-unfold"> &#x25BC; </button>
                            <button 
                            ref={preview_mode_button} 
                            className="vsw2ibwcb-preview-mode"> &#128065;&#65039; </button>
                            <input 
                            ref={searchbar_input}
                            type="text"
                            placeholder="Search a product"
                            className="vsw2ibwcb-searchbar-input"/>
                            <button 
                            ref={searchbar_button}
                            className="vsw2ibwcb-searchbar-button"> &#128269;&#65039; Search </button>
                            <button 
                            ref={close_button} 
                            className="vsw2ibwcb-close"> &#10005; </button>
                        </div>
                        <div 
                        ref={img_card_wrapper} 
                        style={imgCardWrapperPropertiesSave?.style}
                        className="vertical-scrolling-wrapper-board-img-wrapper-card-img">
                            {/* Insérer une unique balise img */}
                            {/* On récupère temporairement l'image de la minia actuelle stockée en sessionStorage si refresh, back, forward. Si son sessionStorage est vide, on ne l'affiche pas */}
                            {( imgCardWrapperImgPropertiesSave
                            && Object.keys(imgCardWrapperImgPropertiesSave).length > 0 
                            && Object.keys(imgCardWrapperImgPropertiesSave).map((key, _) => (Object.keys(imgCardWrapperImgPropertiesSave[key]).length)).every((properties_number) => (properties_number > 0)) )
                            && 
                            <img 
                            dataset-product-id={imgCardWrapperImgPropertiesSave["dataset"]["product-id"]}
                            dataset-product-name={imgCardWrapperImgPropertiesSave["dataset"]["product-name"]}
                            dataset-product-category={imgCardWrapperImgPropertiesSave["dataset"]["product-category"]}
                            src={imgCardWrapperImgPropertiesSave["dataset"]["src"]}/>}
                            <div 
                            ref={lens} 
                            className="vertical-scrolling-wrapper-board-img-wrapper-card-img-lens">
                                {/* Insérer la même image pour zoomer */}
                                {( lensImgPropertiesSave 
                                && Object.keys(lensImgPropertiesSave).length > 0 
                                && Object.keys(lensImgPropertiesSave).map((key, _) => (Object.keys(lensImgPropertiesSave[key]).length)).every((properties_number) => (properties_number > 0)) )
                                && <img src={lensImgPropertiesSave["dataset"]["src"]}/>}
                            </div>
                        </div>
                        <div 
                        ref={global_img_card_options_wrapper} 
                        className="vertical-scrolling-wrapper-board-img-wrapper-card-options">
                            <button 
                            ref={previous_button} 
                            className="vswbibwco-previous"> &#x25C0; </button>
                            <button 
                            ref={next_button} 
                            className="vswbibwco-next"> &#x25B6; </button>
                            <button 
                            ref={zoom_button} 
                            style={zoomButtonPropertiesSave?.style}
                            className="vswbibwco-zoom"> &#128269;&#65039; </button>
                            <button 
                            ref={save_button} 
                            className="vswbibwco-save"> &#128190;&#65039; </button>
                            <button
                            ref={see_product_button}
                            className="vswbibwco-see"> &#128717; </button>
                        </div>
                        <div 
                        ref={text_card_wrapper} 
                        className="vertical-scrolling-wrapper-board-img-wrapper-card-text">
                            {/* Insérer h1, h2, h3, p */}
                            {/* On récupère temporairement les sections de texte de la minia actuelle stockée en sessionStorage si refresh, back, forward. Si son sessionStorage est vide, on ne les affiche pas */}
                            {( textCardWrapperTextPropertiesSave
                            && textCardWrapperTextPropertiesSave.text_card_wrapper_text_list
                            && Array.isArray(textCardWrapperTextPropertiesSave.text_card_wrapper_text_list)
                            && textCardWrapperTextPropertiesSave.text_card_wrapper_text_list.length > 0 )
                            && textCardWrapperTextPropertiesSave.text_card_wrapper_text_list.map((el, i) => {

                                const [text_type, text] = el;

                                if (text_type === "h1") return (<h1 key={`${i}-vswbiwct-text`}> {text} </h1>);
                                else if (text_type === "h2") return (<h2 key={`${i}-vswbiwct-text`}> {text} </h2>);
                                else if (text_type === "h3") return (<h3 key={`${i}-vswbiwct-text`}> {text} </h3>);
                                else if (text_type === "h4") return (<h4 key={`${i}-vswbiwct-text`}> {text} </h4>);
                                else if (text_type === "p") return (<p key={`${i}-vswbiwct-text`}> {text} </p>);
                                else return (<p key={`${i}-vswbiwct-text`}> Error </p>);
                            })}
                        </div>

                    </div>

                    <div 
                    ref={global_imgs_wrapper} 
                    className="vertical-scrolling-wrapper-board-img-wrapper-imgs">

                        {/* On itère 2 fois car on souhaite remplir 2 colonnes contenant un maximum de 16 images chacune */}
                        {Array.from({length : 2}).map((_, i) => (

                            <div 
                            key={`${i}-vswbiwic`} 
                            className="vertical-scrolling-wrapper-board-img-wrapper-imgs-col">

                                {imgs_texts_list.map((img_text, j) => {

                                    if (j >= imgs_texts_list.length * (i / 2) && j < imgs_texts_list.length / (2 - i)) {

                                        const [img, text] = img_text;

                                        if (img && Object.keys(img).length > 0) {

                                            return (
                                                
                                                <div 
                                                key={`${i},${j}-vswbiwici`}
                                                ref={(el) => (img_wrappers_list.current[j] = el)}
                                                className="vertical-scrolling-wrapper-board-img-wrapper-imgs-col-img">

                                                    <img 
                                                    key={`${i},${j}-vswbiwici-img`}  
                                                    data-product-id={img.product_id}
                                                    data-product-name={img.name}
                                                    data-product-category={img.category}
                                                    data-src={img.image_path}
                                                    alt="Image"/>

                                                    {( Array.isArray(text)
                                                    && text.length > 0 
                                                    && Array.isArray(text[0]) 
                                                    && text[0].length === 2 )
                                                    && text.map((text_info, k) => {

                                                        const [text_type, text] = text_info;

                                                        if (text_type === "h1") {

                                                            return (

                                                                <h1 key={`${i},${j},${k}-vswbiwici-text`}> {text} </h1>
                                                            )
                                                        }
                                                        else if (text_type === "h2") {

                                                            return (

                                                                <h2 key={`${i},${j},${k}-vswbiwici-text`}> {text} </h2>
                                                            )
                                                        }
                                                        else if (text_type === "h3") {

                                                            return (

                                                                <h3 key={`${i},${j},${k}-vswbiwici-text`}> {text} </h3>
                                                            )
                                                        }
                                                        else if (text_type === "h4") {

                                                            return (

                                                                <h4 key={`${i},${j},${k}-vswbiwici-text`}> {text} </h4>
                                                            )
                                                        }
                                                        else if (text_type === "p") {

                                                            return (

                                                                <p key={`${i},${j},${k}-vswbiwici-text`}> {text} </p>
                                                            )
                                                        }
                                                        else {

                                                            return (

                                                                <p key={`${i},${j},${k}-vswbiwici-text`}> Error </p>
                                                            )
                                                        }
                                                    })}

                                                </div>
                                            );
                                        }
                                        else {

                                            return (

                                                <p key={`${i},${j}-vswbiwici-text`}> Error </p>
                                            );
                                        }
                                    }
                                })}

                            </div>
                        ))}

                    </div>

                </div>
            )}
        </div>
    );
}

export default VerticalScrollingBoard;
