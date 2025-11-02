// ----------------------------------------------- CSS

import "./TestPage.css";

// ----------------------------------------------- External media

import tb_main_img from "../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../assets/ToolBar/Collections.jpg";

import hswg_img1 from "../../assets/HomePage/Model1.jpg";
import hswg_img2 from "../../assets/HomePage/Model2.jpg";
import hswg_img3 from "../../assets/HomePage/Model3.jpg";
import hswg_img4 from "../../assets/HomePage/Model4.jpg";
import hswg_img5 from "../../assets/HomePage/Model5.png";
import hswg_img6 from "../../assets/HomePage/Model6.jpg";
import hswg_img7 from "../../assets/HomePage/Model7.jpg";
import hswg_img8 from "../../assets/HomePage/Model8.jpg";

// ----------------------------------------------- React

import { useRef, useState } from "react";

// ----------------------------------------------- Components

import ToolBar from "../../components/ToolBar/ToolBar.jsx";

import Footer from "../../components/Footer/Footer.jsx";




function TestPage() {


    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];

    const test_page_maincontent = useRef(null);


    return (

        <div
        className="test-page">


            <div
            className="test-page-wrapper">

                <ToolBar
                images={tb_imgs_list}/>


                <div 
                ref={test_page_maincontent} 
                className="test-page-maincontent">

                    {/*
                    <AnimationWrapper 
                    trigger_height_percentage={trigger_height_percentages_list[1]} 
                    maincontent={maincontent}/>

                    <VerticalScrollingWrapperFollower 
                    trigger_height_percentage={trigger_height_percentages_list[2]} 
                    maincontent={maincontent}/>

                    <VerticalScrollingWrapperGallery 
                    images={vswg_img_list} 
                    trigger_height_percentage={trigger_height_percentages_list[3]} 
                    maincontent={maincontent} 
                    offset={offsets_list[1]}/>
                    */}

                </div>


                <Footer/>

            </div>

            {/*
            <div className="test-page-strip-1-overlay"></div>
            <div className="test-page-strip-2-overlay"></div>
            <div className="test-page-strip-3-overlay"></div>
            <div className="test-page-strip-4-overlay"></div>
            */}

        </div>
    );
}

export default TestPage;
