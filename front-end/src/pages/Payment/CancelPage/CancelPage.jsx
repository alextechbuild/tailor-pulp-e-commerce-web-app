// ----------------------------------------------- CSS

import "./CancelPage.css";

// ----------------------------------------------- External media

import tb_img1 from "../../../assets/ToolBar/Accessories.jpg";

// ----------------------------------------------- React

import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// ----------------------------------------------- Components

import ToolBar from "../../../components/ToolBar/ToolBar.jsx"

import Footer from "../../../components/Footer/Footer.jsx";




function CancelPage() {


    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");


    const tb_imgs_list = [tb_img1];

    const maincontent = useRef(null);


    const navigateToLoggingPage = useNavigate();

    


    useEffect(() => {

        let timeout_id;

        if (sessionId) {

            timeout_id = setTimeout(() => {

                navigateToLoggingPage(`/logging-page`);

            }, 1000);
        }
        else {

            navigateToLoggingPage(`/logging-page`);
        }

        return () => {

            if (timeout_id) clearTimeout(timeout_id);
        }

    }, [sessionId]);




    return (

        <div className="cancel-page">

            <ToolBar
            images={tb_imgs_list}/>

            {sessionId && (

                <div 
                ref={maincontent} 
                className="maincontent">

                    <h1> Payment cancelled. Redirecting to your shopping cart page. </h1>

                </div>
            )}

            <Footer/>

        </div>
    );
}

export default CancelPage;
