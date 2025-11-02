// ----------------------------------------------- CSS

import "./WinterPage.css";

// ----------------------------------------------- External media

import tb_main_img from "../../../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../../../assets/ToolBar/Collections.jpg";

// ----------------------------------------------- Components

import ToolBar from "../../../../components/ToolBar/ToolBar.jsx";

import VerticalScrollingBoard from "../../../../components/VerticalScrollingBoard/VerticalScrollingBoard.jsx";

import Footer from "../../../../components/Footer/Footer.jsx";

// ----------------------------------------------- Local utils

import { winter_imported_texts_list } from "../../../../utils/VerticalScrollingBoard/ImgWrappersTextsListUtils.js";




function WinterPage({VerticalScrollingBoardImgs}) {


    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];

    
    return (

        <div 
        className="winter-page">

            <div 
            className="winter-page-wrapper">

                <ToolBar
                images={tb_imgs_list}/>


                <div 
                className="winter-page-maincontent">

                    <VerticalScrollingBoard VerticalScrollingBoardImgs={VerticalScrollingBoardImgs} imported_texts_list={winter_imported_texts_list}/>

                </div>


                <Footer/>

            </div>

            <div className="shopping-page-strip-1-overlay"></div>
            <div className="shopping-page-strip-2-overlay"></div>
            <div className="shopping-page-strip-3-overlay"></div>
            <div className="shopping-page-strip-4-overlay"></div>

            <div className="shopping-page-strip-5-overlay"></div>
            <div className="shopping-page-strip-6-overlay"></div>
            <div className="shopping-page-strip-7-overlay"></div>
            <div className="shopping-page-strip-8-overlay"></div>

        </div>
    );
}

export default WinterPage;
