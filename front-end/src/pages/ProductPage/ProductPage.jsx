// ----------------------------------------------- Environment variables

const back_end_url = import.meta.env.VITE_BACKEND_URL;

// ----------------------------------------------- CSS

import "./ProductPage.css";

// ----------------------------------------------- External media

import tb_main_img from "../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- React

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------- Components

import ToolBar from "../../components/ToolBar/ToolBar.jsx";

import Footer from "../../components/Footer/Footer.jsx";

// ----------------------------------------------- Global utils

import { isDict } from "../../utils/DictObjectUtils.js";

// ----------------------------------------------- Contexts

import { useSelectedProductContext } from "../../contexts/SelectedProductContextProvider/SelectedProductContextProvider.jsx";
import { useClientContext } from "../../contexts/ClientContextProvider/ClientContextProvider.jsx";




function ProductPage() {


    const {selectedProduct, setSelectedProduct} = useSelectedProductContext();
    const {token} = useClientContext();

    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];

    const navigateToShoppingCartPage = useNavigate();
    const navigateToLoggingPage = useNavigate();


    // On reprend les sessionStorage de l'image et des textes utilisés dans le défilé principal
    const [imgCardWrapperImgPropertiesSave, setImgCardWrapperImgPropertiesSave] = useState(() => {

        const stored = sessionStorage.getItem("img_card_wrapper_img_properties");
        return stored ? JSON.parse(stored) : null;
    });
    const [textCardWrapperTextPropertiesSave, setTextCardWrapperTextPropertiesSave] = useState(() => {

        const stored = sessionStorage.getItem("text_card_wrapper_text_properties");
        return stored ? JSON.parse(stored) : null;
    });

    const [product, setProduct] = useState(() => {

        let product_information = [];

        if ( selectedProduct
        && Array.isArray(selectedProduct) 
        && selectedProduct.length > 0 ) {

            selectedProduct.forEach((el, i) => {

                if ( i === 0
                && el?.tagName?.toLowerCase() === "img"
                && el?.dataset
                && el.dataset?.productId && el.dataset?.productName && el.dataset?.productCategory && el.dataset?.src
                && el?.src ) {

                    const img = selectedProduct[0];

                    product_information = {

                        ...product_information,
                        product_id : img.dataset.productId,
                        product_name : img.dataset.productName,
                        product_category : img.dataset.productCategory,
                        product_src : img.src,
                        product_sizes_quantities : JSON.parse(img.dataset.productSizesQuantities)
                    };
                }
                else if (Array.isArray(el)) {

                    el.forEach((text_div, _) => {

                        if (text_div instanceof HTMLHeadingElement || text_div instanceof HTMLParagraphElement) {

                            let text_div_type = "";

                            if (text_div.tagName.toLowerCase() === "h1") {

                                text_div_type = "h1";
                            }
                            else if (text_div.tagName.toLowerCase() === "h2") {

                                text_div_type = "h2";
                            }
                            else if (text_div.tagName.toLowerCase() === "h3") {

                                text_div_type = "h3";
                            }
                            else if (text_div.tagName.toLowerCase() === "h4") {

                                text_div_type = "h4";
                            }
                            else if (text_div.tagName.toLowerCase() === "p") {

                                text_div_type = "p";
                            }

                            if (!product_information.product_description) {

                                product_information = {

                                    ...product_information,
                                    product_description : [

                                        [text_div_type, text_div.textContent]
                                    ]
                                };
                            }
                            else {

                                product_information = {

                                    ...product_information,
                                    product_description : [

                                        ...product_information.product_description,
                                        [text_div_type, text_div.textContent]
                                    ]
                                };
                            }
                        }
                    });
                }
            });
        }
        // Pour le product, pas besoin du style on restaure juste les infos produit
        else if ( imgCardWrapperImgPropertiesSave 
        && isDict(imgCardWrapperImgPropertiesSave)
        && Object.keys(imgCardWrapperImgPropertiesSave).length > 0
        && imgCardWrapperImgPropertiesSave?.dataset
        && imgCardWrapperImgPropertiesSave.dataset?.["product-id"] 
        && imgCardWrapperImgPropertiesSave.dataset?.["product-name"] 
        && imgCardWrapperImgPropertiesSave.dataset?.["product-category"] 
        && imgCardWrapperImgPropertiesSave.dataset?.["src"] 
        && imgCardWrapperImgPropertiesSave.dataset?.["product-sizes-quantities"] ) {

            product_information = {

                product_id : imgCardWrapperImgPropertiesSave.dataset["product-id"],
                product_name : imgCardWrapperImgPropertiesSave.dataset["product-name"],
                product_category : imgCardWrapperImgPropertiesSave.dataset["product-category"],
                product_src : imgCardWrapperImgPropertiesSave.dataset["src"],
                product_sizes_quantities : imgCardWrapperImgPropertiesSave.dataset["product-sizes-quantities"]
            };

            if ( textCardWrapperTextPropertiesSave
            && textCardWrapperTextPropertiesSave?.text_card_wrapper_text_list
            && Array.isArray(textCardWrapperTextPropertiesSave.text_card_wrapper_text_list)
            && textCardWrapperTextPropertiesSave.text_card_wrapper_text_list.length > 0 ) {

                textCardWrapperTextPropertiesSave.text_card_wrapper_text_list.forEach((text_section, _) => {

                    const [text_type_div, text] = text_section;

                    if (!product_information.product_description) {

                        product_information = {

                            ...product_information,
                            product_description : [

                                [text_type_div, text]
                            ]
                        };
                    }
                    else {

                        product_information = {

                            ...product_information,
                            product_description : [

                                ...product_information.product_description,
                                [text_type_div, text]
                            ]
                        };
                    }
                });
            }
        }
        
        return product_information;
    });
    const [productSizesList, setProductSizesList] = useState(() => {

        let product_sizes_quantities_list = [];
        let product_sizes_list = [];

        if ( product
        && isDict(product)
        && Object.keys(product).length > 0
        && product?.product_sizes_quantities ) {

            product_sizes_quantities_list = product.product_sizes_quantities;

            if ( Array.isArray(product_sizes_quantities_list) 
            && product_sizes_quantities_list.length > 0 ) {

                product_sizes_quantities_list.forEach((product_size_quantity, _) => {

                    product_sizes_list.push({value : product_size_quantity.size, label : product_size_quantity.size});
                });

                if (product_sizes_list.length > 0) {

                    return product_sizes_list;
                }
            }
        }

        return [];
    });

    const [productSizeChoice, setProductSizeChoice] = useState("");

    const [productQuantitiesList, setProductQuantitiesList] = useState([]);

    const [productQuantityChoice, setProductQuantityChoice] = useState("");



    
    const confirm_size_product_selection = (e, product_id) => {

        const selected_product_size = e.target.value;

        if (selected_product_size) {

            async function get_product_available_quantity(product_id, product_size) {

                try {

                    if (product_id && product_size) {

                        const back_end_response = await fetch(`${back_end_url}/product/getProductQuantity?productId=${product_id}&productSize=${product_size}`, {

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

                        if (result.message
                        && Array.isArray(result.message)
                        && result.message.length > 0
                        && isDict(result.message[0])
                        && result.message[0].available_quantity) {

                            const available_quantity = result.message[0].available_quantity;

                            setProductQuantitiesList(Array.from({length : available_quantity}, (_, i) => ({value : i + 1, label : i + 1})));
                        }
                        else {

                            throw new Error(`Product quantity not found`);
                        }
                    }
                    else {

                        throw new Error(`product_id or product_size not found`);
                    }
                }
                catch(error) {

                    throw new Error(`${error}`);
                }
            }

            setProductSizeChoice(selected_product_size);
            get_product_available_quantity(product_id, selected_product_size);
        }
    }




    // sessionStorage orderer_product pour redirection login
    async function add_product_to_shopping_cart(product_id, product_size, product_quantity) {

        try {

            const ordered_product = JSON.parse(sessionStorage.getItem("ordered_product")) || null;

            if ((product_id && product_size && product_quantity) || (ordered_product)) {
                    
                if (token) {

                    const back_end_response = await fetch(`${back_end_url}/product/AddProductToShoppingCart`, {

                        method : "POST",
                        credentials : "include", // Pour envoyer cookies
                        headers : {

                            "Content-Type" : "application/json",
                            "Accept" : "application/json",
                            ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                        },
                        body : JSON.stringify({

                            productId : product_id || ordered_product?.product_id,
                            orderedSize : product_size || ordered_product?.product_size,
                            orderedQuantity : product_quantity || ordered_product?.product_quantity
                        })
                    });

                    if (!back_end_response.ok) {

                        if (back_end_response.status === 402) {

                            sessionStorage.setItem("addedProductWhileLoggedOut", String(true));
                            navigateToLoggingPage("/logging-page");
                        }
                        else {

                            throw new Error(`${back_end_response.status}`);
                        }
                    }

                    const result = await back_end_response.json();

                    if (result.message) {

                        console.log(result.message);
                        // Pour optimiser de l'espace mémoire. L'utilisateur pourra toujours revenir en arrière et voir les informations produit stockées en sessionStorage
                        setSelectedProduct(null);

                        navigateToShoppingCartPage("/shopping-cart-page");
                    }
                    else {

                        throw new Error(`Product not found`);
                    }
                }
                else {

                    if (product_id && product_size && product_quantity) {

                        sessionStorage.setItem("ordered_product", JSON.stringify({

                            product_id : product_id,
                            product_size : product_size,
                            product_quantity : product_quantity
                        }));
                    }

                    sessionStorage.setItem("addedProductWhileLoggedOut", String(true));
                    navigateToLoggingPage("/logging-page");
                }
            }
            else {

                throw new Error(`product_id or product_name or product_size or product_quantity not found`);
            }
        }
        catch(error) {

            throw new Error(error);
        }
    }

    


    return (

        <div 
        className="product-page">

            <ToolBar
            images={tb_imgs_list}
            />


            <div 
            className="product-page-maincontent">

                {( product
                && isDict(product)
                && product?.product_id
                && product?.product_name
                && product?.product_category
                && product?.product_src
                && product?.product_sizes_quantities )
                && (

                    <div 
                    className="product-page-wrapper">

                        <div 
                        className="product-page-wrapper-description">

                            <img src={product.product_src} alt="Image"/>

                            <div 
                            className="product-page-wrapper-description-text">

                                {( Array.isArray(product.product_description) 
                                && (product.product_description.length > 0) )
                                && (

                                    product.product_description.map((text_section, i) => {

                                        const [text_type, text] = text_section;

                                        if (text_type === "h1") return (<h1 key={`${i}-ppwd-text`}> {text} </h1>);
                                        else if (text_type === "h2") return (<h2 key={`${i}-ppwd-text`}> {text} </h2>);
                                        else if (text_type === "h3") return (<h3 key={`${i}-ppwd-text`}> {text} </h3>);
                                        else if (text_type === "h4") return (<h4 key={`${i}-ppwd-text`}> {text} </h4>);
                                        else if (text_type === "p") return (<p key={`${i}-ppwd-text`}> {text} </p>);
                                        else return (<p key={`${i}-ppwd-text`}> Error </p>);
                                    })
                                )}
                                
                            </div>

                        </div>

                        <div 
                        className="product-page-wrapper-buybox">

                            <select 
                            className="product-page-wrapper-buybox-select-size"
                            value={productSizeChoice} 
                            onChange={(e) => (confirm_size_product_selection(e, product.product_id))}>

                                <option 
                                value=""> 
                                Select a size 
                                </option>
                                {( productSizesList 
                                && productSizesList.length > 0 ) 
                                && (

                                    productSizesList.map((size, i) => (

                                        <option 
                                        key={`${i}-ppwbss-option`} 
                                        value={size.value}>
                                            {size.label}
                                        </option>
                                    ))
                                )}

                            </select>

                            <select 
                            className="product-page-wrapper-buybox-select-quantity"
                            value={productQuantityChoice} 
                            onChange={(e) => (setProductQuantityChoice(e.target.value))}>

                                <option 
                                value=""> 
                                Select a quantity 
                                </option>
                                {( productQuantitiesList 
                                && productQuantitiesList.length > 0 ) 
                                && (

                                    productQuantitiesList.map((quantity, i) => (

                                        <option 
                                        key={`${i}-ppwbsq-option`} 
                                        value={quantity.value}>
                                            {quantity.label}
                                        </option>
                                    ))
                                )}

                            </select>

                            <button
                            className="product-page-wrapper-buybox-add-button"
                            onClick={() => (add_product_to_shopping_cart(product.product_id, productSizeChoice, productQuantityChoice))}> 
                            <span> Add To Shopping Cart </span>
                            </button>
                            
                        </div>

                    </div>
                )}

            </div>


            <Footer/>

        </div>
    );
}

export default ProductPage;
