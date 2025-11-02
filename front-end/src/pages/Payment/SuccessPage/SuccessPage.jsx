// ----------------------------------------------- Environment variables

const back_end_url = import.meta.env.VITE_BACKEND_URL;

// ----------------------------------------------- CSS

import "./SuccessPage.css";

// ----------------------------------------------- External media

import tb_img1 from "../../../assets/ToolBar/Accessories.jpg";

// ----------------------------------------------- React

import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// ----------------------------------------------- Components

import ToolBar from "../../../components/ToolBar/ToolBar.jsx"

import Footer from "../../../components/Footer/Footer.jsx";

// ----------------------------------------------- Contexts

import { useClientContext } from "../../../contexts/ClientContextProvider/ClientContextProvider.jsx";




function SuccessPage() {


    const {token, setShoppingCart} = useClientContext();


    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");


    const tb_imgs_list = [tb_img1];

    const maincontent = useRef(null);


    const navigateToLoggingPage = useNavigate();

    


    useEffect(() => {

        if (sessionId) {

            async function remove_client_order() {

                try {

                    const back_end_response = await fetch(`${back_end_url}/client/removeOrder`, {

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

                        setShoppingCart(null);
                        navigateToLoggingPage(`/logging-page`);
                    }
                    else {

                        throw new Error(`Order not found`);
                    }
                }
                catch(error) {

                    navigateToLoggingPage(`/logging-page`);

                    throw new Error(`${error}`);
                }
            }

            remove_client_order();
        }
        else {

            navigateToLoggingPage(`/logging-page`);
        }

    }, [sessionId]);




    return (

        <div className="success-page">

            <ToolBar
            images={tb_imgs_list}/>

            {sessionId && (

                <div 
                ref={maincontent} 
                className="maincontent">

                    <h1> Payment successful. Redirecting to your shopping cart page. </h1>

                </div>
            )}

            <Footer/>

        </div>
    );
}

export default SuccessPage;
