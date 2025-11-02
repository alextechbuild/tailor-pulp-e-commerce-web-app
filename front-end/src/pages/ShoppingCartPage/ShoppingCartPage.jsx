// ----------------------------------------------- Environment variables

const back_end_url = import.meta.env.VITE_BACKEND_URL;

// ----------------------------------------------- CSS

import "./ShoppingCartPage.css";

// ----------------------------------------------- External media

import tb_main_img from "../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- React

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------- Components

import ToolBar from "../../components/ToolBar/ToolBar.jsx";

import Footer from "../../components/Footer/Footer.jsx";

// ----------------------------------------------- Global utils

import { isDict } from "../../utils/DictObjectUtils.js";

// ----------------------------------------------- Contexts

import { useClientContext } from "../../contexts/ClientContextProvider/ClientContextProvider.jsx";




function ShoppingCartPage() {


    const {token, shoppingCart, setShoppingCart} = useClientContext();

    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];


    const [productsSizesChoicesList, setProductsSizesChoicesList] = useState(["", ""]);
    const [productsSizesChoicesBackup, setProductsSizesChoicesBackup] = useState(["", ""]);
    const [productsSizesList, setProductsSizesList] = useState([["S", "M"], ["L", "XL", "XXL"]]);
    const [indexChoosenSizesList, setIndexChoosenSizesList] = useState([1, 2]);

    const [productsQuantitiesChoicesList, setProductsQuantitiesChoicesList] = useState(["", ""]);
    const [productsQuantitiesChoicesBackup, setProductsQuantitiesChoicesBackup] = useState(["", ""]);
    const [productsQuantitiesList, setProductsQuantitiesList] = useState([["[1...20]", "[1...50]"], ["[1...2]", "[1...9]"]]); // "[...]" à titre indicatif, il s'agit d'une liste de listes


    const [confirmOrdersChangesVisible, setConfirmOrdersChangesVisible] = useState([false, false]);
    const [cancelOrdersChangesVisible, setCancelOrdersChangesVisible] = useState([false, false]);


    const navigateToLoggingPage = useNavigate();
    const navigateToEditPage = useNavigate();




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

                    setShoppingCart("expired");
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


                let products_sizes_choices_list = [];
                let products_sizes_list = [];
                let index_choosen_sizes_list = [];

                result.message.product.forEach((row, _) => {

                    (row?.product_size) ? products_sizes_choices_list.push(row.product_size) : products_sizes_choices_list.push("No Size");
                    
                    (row?.available_sizes) ? products_sizes_list.push(row.available_sizes.split(",")) : products_sizes_list.push(["No Size"]);

                    index_choosen_sizes_list.push(0);
                });

                setProductsSizesChoicesList(products_sizes_choices_list);
                setProductsSizesChoicesBackup(products_sizes_choices_list);
                setProductsSizesList(products_sizes_list);
                setIndexChoosenSizesList(index_choosen_sizes_list);

                let products_quantities_choices_list = [];
                let products_quantities_list = [];

                result.message.product.forEach((row, _) => {

                    (row?.product_quantity) ? products_quantities_choices_list.push(row.product_quantity) : products_quantities_choices_list.push("No Quantity");

                    if (row?.available_quantities) {

                        let temp = row.available_quantities.split(",");

                        products_quantities_list.push(temp.map((el, _) => (Array.from({length : parseInt(el)}, (unused, i) => (i + 1)))));
                    }
                    else {

                        products_quantities_list.push([[0]]);
                    }
                });

                setProductsQuantitiesChoicesList(products_quantities_choices_list);
                setProductsQuantitiesChoicesBackup(products_quantities_choices_list);
                setProductsQuantitiesList(products_quantities_list);

                setConfirmOrdersChangesVisible(Array.from({length : index_choosen_sizes_list.length}, (_, unused) => (false)));
                setCancelOrdersChangesVisible(Array.from({length : index_choosen_sizes_list.length}, (_, unused) => (false)));
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

            setShoppingCart("expired");
            navigateToLoggingPage("/logging-page");

            console.error(`${error}`);
        }
    }




    const modify_client_information = () => {

        navigateToEditPage('/edit-page');
    }




    async function delete_order(shopping_cart_id) {

        try {

            if (shopping_cart_id) {

                const back_end_response = await fetch(`${back_end_url}/client/deleteOrder?Id=${shopping_cart_id}`, {

                    method : "DELETE",
                    credentials : "include",
                    headers : {

                        "Content-Type" : "application/json",
                        "Accept" : "application/json",
                        ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                    }
                });

                if (!back_end_response.ok) {

                    if (back_end_response.status === 402) {

                        setShoppingCart("expired");
                        navigateToLoggingPage("/logging-page");
                    }
                    else {

                        throw new Error(`${back_end_response.status}`);
                    }
                }

                const result = await back_end_response.json();

                if (result?.message) {

                    fetch_client_shopping_cart_refresh();
                }
                else {

                    throw new Error(`Shopping cart not found`);
                }
            }
            else {

                throw new Error(`shopping_cart_id not found`);
            }
        }
        catch(error) {

            throw new Error(error);
        }
    }




    async function confirm_order_changes(shopping_cart_id, global_list_index, new_ordered_product_size, new_ordered_product_quantity) {

        try {

            // La quantité est un str (car STRING_AGG depuis le serveur pour la concaténation des quantités en 1 seule ligne)
            if ([shopping_cart_id, global_list_index].every((el, _) => (typeof el === "number" && el >= 0)) && new_ordered_product_quantity && new_ordered_product_size) {

                const back_end_response = await fetch(`${back_end_url}/client/modifyOrder`, {

                    method : "PUT",
                    credentials : "include",
                    headers : {

                        "Content-Type" : "application/json",
                        "Accept" : "application/json",
                        ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                    },
                    body : JSON.stringify({

                        shoppingCartId : shopping_cart_id,
                        newOrderedProductSize : new_ordered_product_size,
                        newOrderedProductQuantity : new_ordered_product_quantity
                    })
                });

                if (!back_end_response.ok) {

                    if (back_end_response.status === 402) {

                        setShoppingCart("expired");
                        navigateToLoggingPage("/logging-page");
                    }
                    else {

                        throw new Error(`${back_end_response.status}`);
                    }
                }

                const result = await back_end_response.json();

                if (result?.message) {

                    setConfirmOrdersChangesVisible((prev) => {

                        const copy = [...prev];

                        copy[global_list_index] = false;

                        return copy;
                    });

                    setCancelOrdersChangesVisible((prev) => {

                        const copy = [...prev];

                        copy[global_list_index] = false;

                        return copy;
                    });

                    fetch_client_shopping_cart_refresh();
                }
                else {

                    throw new Error(`Client order to modify not found`);
                }
            }
            else {

                throw new Error(`shopping_cart_id or global_list_index or new_ordered_product_size or new_ordered_product_quantity not found`);
            }
        }
        catch(error) {

            throw new Error(error);
        }
    }




    const cancel_order_changes = (global_list_index) => {

        if ( productsSizesChoicesList
        && Array.isArray(productsSizesChoicesList)
        && productsSizesChoicesList.length > 0 ) {
        
            if ( productsQuantitiesChoicesList
            && Array.isArray(productsQuantitiesChoicesList)
            && productsQuantitiesChoicesList.length > 0 ) {

                setProductsSizesChoicesList(productsSizesChoicesBackup);
                setProductsQuantitiesChoicesList(productsQuantitiesChoicesBackup);

                setConfirmOrdersChangesVisible((prev) => {

                    const copy = [...prev];

                    copy[global_list_index] = false;

                    return copy;
                });

                setCancelOrdersChangesVisible((prev) => {

                    const copy = [...prev];

                    copy[global_list_index] = false;

                    return copy;
                });
            }   
        }
    };




    const modify_size_product_selection = (e, global_list_index) => {

        if ( productsSizesChoicesList
        && Array.isArray(productsSizesChoicesList)
        && productsSizesChoicesList.length > 0 ) {

            if ( indexChoosenSizesList
            && Array.isArray(indexChoosenSizesList)
            && indexChoosenSizesList.length > 0 ) {

                setProductsSizesChoicesList((prev) => {

                    const copy = [...prev];

                    copy[global_list_index] = e.target.value;

                    return copy;
                });

                const choosen_size_position = productsSizesList[global_list_index].indexOf(e.target.value);

                setIndexChoosenSizesList((prev) => {

                    const copy = [...prev];

                    copy[global_list_index] = choosen_size_position;

                    return copy;
                });

                if (!confirmOrdersChangesVisible[global_list_index]) {

                    setConfirmOrdersChangesVisible((prev) => {

                        const copy = [...prev];

                        copy[global_list_index] = true;

                        return copy;
                    });
                }

                if (!cancelOrdersChangesVisible[global_list_index]) {

                    setCancelOrdersChangesVisible((prev) => {

                        const copy = [...prev];

                        copy[global_list_index] = true;

                        return copy;
                    });
                }
            }
        }
    };




    const modify_quantity_product_selection = (e, global_list_index) => {

        if ( productsQuantitiesChoicesList
        && Array.isArray(productsQuantitiesChoicesList)
        && productsQuantitiesChoicesList.length > 0 ) {

            setProductsQuantitiesChoicesList((prev) => {

                const copy = [...prev];

                copy[global_list_index] = e.target.value;

                return copy;
            });

            if (!confirmOrdersChangesVisible[global_list_index]) {

                setConfirmOrdersChangesVisible((prev) => {

                    const copy = [...prev];

                    copy[global_list_index] = true;

                    return copy;
                });
            }

            if (!cancelOrdersChangesVisible[global_list_index]) {

                setCancelOrdersChangesVisible((prev) => {

                    const copy = [...prev];

                    copy[global_list_index] = true;

                    return copy;
                });
            }
        }
    };




    async function delete_all_orders() {

        try {

            const back_end_response = await fetch(`${back_end_url}/client/deleteAllOrders`, {

                method : "DELETE",
                headers : {

                    "Content-Type" : "application/json",
                    "Accept" : "application/json",
                    ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                }
            });

            if (!back_end_response.ok) {

                if (back_end_response.status === 402) {

                    setShoppingCart("expired");
                    navigateToLoggingPage("/logging-page");
                }
                else {

                    throw new Error(`${back_end_response.status}`);
                }
            }

            const result = await back_end_response.json();

            if (result?.message) {

                setShoppingCart(result.message);
            }
            else {

                throw new Error(`Shopping cart not found`);
            }
        }
        catch(error) {

            throw new Error(error);
        }
    };




    async function confirm_all_orders() {

        try {

            if (shoppingCart && shoppingCart !== "expired") {

                const back_end_response = await fetch(`${back_end_url}/client/createCheckoutSession`, {

                    method : "POST",
                    headers : {

                        "Content-Type" : "application/json",
                        "Accept" : "application/json",
                        ...(token ? {"Authorization" : `Bearer ${token}`} : {})
                    },
                    body : JSON.stringify({

                        clientShoppingCart : shoppingCart
                    })
                });

                if (!back_end_response.ok) {

                    throw new Error(`${back_end_response.status}`);
                }

                const result = await back_end_response.json();

                if (result?.message && result.message?.url) {

                    const session_url = result.message.url;
                    
                    // Redirection vers Stripe Checkout
                    window.location.href = session_url;
                }
                else {

                    throw new Error(`Stripe session id not found`);
                }
            }
            else {

                throw new Error(`shoppingCart not found`);
            }
        }
        catch(error) {

            throw new Error(`${error}`);
        }
    }




    useEffect(() => {

        // On relance au refresh le fetch du panier client uniquement si le shoppingCart n'est pas trouvé (car dans ce cas le user est déjà connecté avec ou sans token car cookie token présent)
        // Si le cookie token n'est pas trouvé, le user est déconnecté, on ne lance pas de fetch sur le panier car pas de clientId dans token
        fetch_client_shopping_cart_refresh();

    }, []);




    return (

        <div
        className="shopping-cart-page">

            <ToolBar
            images={tb_imgs_list}
            />


            <div 
            className="shopping-cart-page-maincontent">

                {( shoppingCart 
                && isDict(shoppingCart)
                && Object.keys(shoppingCart).length > 0 ) 
                && (

                    <div 
                    className="shopping-cart-page-wrapper">

                        {Object.entries(shoppingCart).map(([key, value], i) => (

                            ( value 
                            && Array.isArray(value) 
                            && value.length > 0 )
                            && (

                                <div 
                                key={`${i}-csch`}
                                className="client-shopping-cart-history">

                                    {( key === "client" ) && (

                                        <div
                                        key={`${i}-cschc`}
                                        className="client-shopping-cart-history-client">

                                            <h3> Your Information </h3>

                                            <div 
                                            key={`${i}-cschc-list`}>

                                                { ( value
                                                && Array.isArray(value)
                                                && value.length > 0 )
                                                && ( value.map((element, j) => (

                                                    ( element 
                                                    && isDict(element) 
                                                    && Object.keys(element).length > 0 )
                                                    && (Object.entries(element).map(([sub_key, sub_value], k) => (

                                                        <p
                                                        key={`${i},${j},${k}-cschc-list-p`}
                                                        className="client-shopping-cart-history-client-info">
                                                            {sub_key.charAt(0).toUpperCase() + sub_key.slice(1).replace("_", " ")} : {sub_value}
                                                        </p>
                                                    )))
                                                )))}

                                                <button
                                                key={`${i}-cschci-button`}
                                                className="client-shopping-cart-history-client-modify-info"
                                                onClick={() => (modify_client_information())}>
                                                <span> Modify Information </span>
                                                </button>

                                            </div>

                                        </div>
                                    )}

                                    {( key === "product" ) && (

                                        <div
                                        key={`${i}-cschp`}
                                        className="client-shopping-cart-history-orders">
                                        
                                            <h3> Your Ordered Products </h3>

                                            { ( value
                                            && Array.isArray(value)
                                            && value.length > 0 )
                                            && ( value.map((element, j) => (

                                                ( element 
                                                && isDict(element) 
                                                && Object.keys(element).length > 0 )
                                                && (Object.entries(element).map(([sub_key, sub_value], k) => {

                                                    if (sub_key === "shopping_cart_id") {

                                                        return (

                                                            <div
                                                            key={`${i},${j},${k}-cscho`}>

                                                                <button
                                                                key={`${i},${j},${k}-cschod`}
                                                                className="client-shopping-cart-history-order-delete"
                                                                onClick={() => (delete_order(sub_value))}>
                                                                <span> &#x1F5D1; </span>
                                                                </button>

                                                                {( confirmOrdersChangesVisible[j] 
                                                                && productsSizesChoicesList[j]
                                                                && productsQuantitiesChoicesList[j] ) 
                                                                && (

                                                                    <button
                                                                    key={`${i},${j},${k}-cschococ`}
                                                                    className="client-shopping-cart-history-order-confirm-changes"
                                                                    onClick={() => (confirm_order_changes(sub_value, j, productsSizesChoicesList[j], productsQuantitiesChoicesList[j]))}>
                                                                    <span> Confirm Order Changes </span>
                                                                    </button>
                                                                )}

                                                                {cancelOrdersChangesVisible[j] && (

                                                                    <button
                                                                    key={`${i},${j},${k}-cschocac`}
                                                                    className="client-shopping-cart-history-order-cancel-changes"
                                                                    onClick={() => (cancel_order_changes(j))}>
                                                                    <span> Cancel Order Changes </span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    else if (sub_key === "product_name") {

                                                        return (

                                                            <div
                                                            key={`${i},${j},${k}-cschpn`}
                                                            className="client-shopping-cart-history-product-name">
                                                                Product : {sub_value}
                                                            </div>
                                                        );
                                                    }
                                                    else if (sub_key === "available_sizes") {

                                                        return (

                                                            <select
                                                            key={`${i},${j},${k}-cschps-size-select`}
                                                            className="client-shopping-cart-history-product-size"
                                                            value={productsSizesChoicesList[j]}
                                                            onChange={(e) => (modify_size_product_selection(e, j))}>

                                                                <option
                                                                key={`${i},${j},${k},initial-cschps-size-select-option`} 
                                                                value = {productsSizesChoicesList[j]}>
                                                                Current Size : {productsSizesChoicesList[j]}
                                                                </option>

                                                                {( productsSizesList
                                                                && productsSizesList[j] 
                                                                && Array.isArray(productsSizesList[j]) 
                                                                && productsSizesList[j].length > 0 ) 
                                                                && ( 
                                                                    
                                                                    (productsSizesList[j].map((size, l) => (

                                                                        <option 
                                                                        key={`${i},${j},${k},${l}-cschps-size-select-option`} 
                                                                        value={size}>
                                                                            {size}
                                                                        </option>
                                                                    )))
                                                                )}

                                                            </select>
                                                        );
                                                    }
                                                    else if (sub_key === "available_quantities") {

                                                        return (

                                                            <>
                                                                <select
                                                                key={`${i},${j},${k}-cschps-quantity-select`}
                                                                className="client-shopping-cart-history-product-quantity"
                                                                value={productsQuantitiesChoicesList[j]}
                                                                onChange={(e) => (modify_quantity_product_selection(e, j))}>

                                                                    <option
                                                                    key={`${i},${j},${k},initial-cschps-quantity-select-option`} 
                                                                    value={productsQuantitiesChoicesList[j]}>
                                                                    Current Quantity : {productsQuantitiesChoicesList[j]}
                                                                    </option>

                                                                    {( productsQuantitiesList
                                                                    && productsQuantitiesList[j]
                                                                    && productsQuantitiesList[j][indexChoosenSizesList[j]] 
                                                                    && Array.isArray(productsQuantitiesList[j][indexChoosenSizesList[j]]) 
                                                                    && productsQuantitiesList[j][indexChoosenSizesList[j]].length > 0 ) 
                                                                    && ( 
                                                                        
                                                                        (productsQuantitiesList[j][indexChoosenSizesList[j]].map((quantity, l) => (

                                                                            <option 
                                                                            key={`${i},${j},${k},${l}-cschps-quantity-select-option`} 
                                                                            value={quantity}>
                                                                                {quantity}
                                                                            </option>
                                                                        )))
                                                                    )}

                                                                </select>

                                                                <hr key={`${i},${j},${k}-cschps-quantity-select-hr`}/>
                                                            </>
                                                        );
                                                    }
                                                    else if (sub_key === "unit_price") {

                                                        return (

                                                            <div
                                                            key={`${i},${j},${k}-cschpup`}
                                                            className="client-shopping-cart-history-product-unit-price">
                                                                <p> Unit Price : {sub_value} &euro; </p>
                                                                <p> 
                                                                    Price for {productsQuantitiesChoicesList[j]} units : &nbsp;
                                                                    {parseFloat(sub_value) * parseFloat(productsQuantitiesChoicesList[j])} &euro; 
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    else if (sub_key === "image_path") { 

                                                        return (

                                                            <div
                                                            key={`${i},${j},${k}-cschip-order`}>

                                                                <img
                                                                key={`${i},${j},${k}-cschip-order-img`}
                                                                className="client-shopping-cart-history-order-img"
                                                                src={sub_value}
                                                                alt='Product'/>

                                                            </div>
                                                        );
                                                    }
                                                })

                                            ))))}
                                        
                                        </div>
                                    )}

                                </div>
                            )
                        ))}

                        {shoppingCart?.product && (

                            <div 
                            className="client-shopping-cart-options">
                                <button
                                className="client-shopping-cart-history-delete-all-orders"
                                onClick={() => (delete_all_orders())}>
                                <span> &#x1F5D1; Delete All Orders </span>
                                </button>

                                <button
                                className="client-shopping-cart-history-confirm-all-orders"
                                onClick={() => (confirm_all_orders())}>
                                <span> &#128179; Confirm All Orders </span>
                                </button>
                            </div>
                        )}

                    </div>
                )}

            </div>


            <Footer/>

        </div>
    );
}

export default ShoppingCartPage;
