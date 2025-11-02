// ----------------------------------------------- CSS

import "./SlidesWrapper.css";

// ----------------------------------------------- React

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------- Local Utils

import { start_animation, manage_slides_wrapper_slide_click } from "../../utils/SlidesWrapper/SlidesWrapper.js";




function SlidesWrapper({images}) {




    const el_list = useRef([]);
    const img_list = useRef([]);
    const loader_point_list = useRef([]);
    const circle_list = useRef([]);


    const navigateToBottomsPage = useNavigate();
    const navigateToClothesTopsPage = useNavigate();
    const navigateToAccessoriesJewelleryPage = useNavigate();
    const navigateToWinterCollectionPage = useNavigate();
    const navigateToSummerCollectionPage = useNavigate();

    


    useEffect(() => {


        const progress = {obj : 0};
        const circumference = 2 * Math.PI * 8;
        const animation_id = {obj : null};
        const global_index = {obj : 0};
        const current_index = {obj : 0};
        const next_index = {obj : 1};
        const loader_point_list_index = {obj : 0};
        const slides_wrapper_handler_list = [];


        const r_el_list = el_list.current;
        const r_img_list = img_list.current;
        const r_loader_point_list = loader_point_list.current;
        const r_circle_list = circle_list.current;


        if (r_el_list && r_img_list && r_loader_point_list && r_circle_list) {

            start_animation(
                progress, circumference, r_circle_list, animation_id, global_index, r_el_list, current_index, 
                r_img_list, next_index
            );

            if (slides_wrapper_handler_list.length === 0) {

                r_loader_point_list.forEach((element, index) => {

                    const slides_wrapper_handler = () => {

                        loader_point_list_index.obj = index;
                        manage_slides_wrapper_slide_click(
                            loader_point_list_index, progress, circumference, r_circle_list, animation_id, global_index, 
                            r_el_list, current_index, r_img_list, next_index
                        );
                    };

                    // Evènement click dans useEffect pour synchroniser toutes les RAF exécutées dans le useEffect()
                    element.addEventListener("click", slides_wrapper_handler);
                    slides_wrapper_handler_list.push({element, slides_wrapper_handler});
                });
            }

            return () => {

                cancelAnimationFrame(animation_id.obj);
                
                if (slides_wrapper_handler_list.length > 0) {

                    slides_wrapper_handler_list.forEach(({element, handler}, _) => {

                        element.removeEventListener("click", handler);
                    });

                    slides_wrapper_handler_list.length = 0;
                }
            };
        }
        
    }, []);




    const navigate_to_bottoms_page = () => {

        navigateToBottomsPage('/clothes-bottoms-page');
    }
    const navigate_to_clothes_tops_page = () => {

        navigateToClothesTopsPage('/clothes-tops-page');
    }
    const navigate_to_accessories_jewellery_page = () => {

        navigateToAccessoriesJewelleryPage('/accessories-jewellery-page');
    }

    const navigate_to_winter_collection_page = () => {

        navigateToWinterCollectionPage('/2025-winter-collection-page');
    }

    const navigate_to_summer_collection_page = () => {

        navigateToSummerCollectionPage('/2025-summer-collection-page');
    }




    return(
        <>
            <div className="slides-wrapper">
                <div className="slides-wrapper-el">

                    <div ref={(new_el) => (el_list.current[0] = new_el)} className="active">
                        <div className="slides-wrapper-el-description">
                            <h5>
                                Our Latest Exclusives
                            </h5>
                            <p>
                                Show off your style, embrace orange : discover our unique pieces
                            </p>
                            <button
                            className="slides-wrapper-el-description-discover-button"
                            onClick={navigate_to_clothes_tops_page}> 
                            <span> Discover Now </span> 
                            </button>
                        </div>
                        <div className="slides-wrapper-el-pin pin-1"> <button className="slides-wrapper-el-pin-button" onClick={navigate_to_bottoms_page}> Trousers </button> </div>
                        <div className="slides-wrapper-el-pin pin-2"> <button className="slides-wrapper-el-pin-button" onClick={navigate_to_clothes_tops_page}> Tops </button> </div>
                        <div className="slides-wrapper-el-pin pin-3"> <button className="slides-wrapper-el-pin-button" onClick={navigate_to_accessories_jewellery_page}> Jewellery </button> </div>
                    </div>
                    <div ref={(new_el) => (el_list.current[1] = new_el)}>
                        <div className="slides-wrapper-el-description">
                            <h5>
                                Our 2025 Winter Collection
                            </h5>
                            <p>
                                Warm up your days in style : the vibrant orange of our winter collection will brighten your day
                            </p>
                            <button
                            className="slides-wrapper-el-description-discover-button"
                            onClick={navigate_to_winter_collection_page}> 
                            <span> Discover Now </span> 
                            </button>
                        </div>
                        <div className="slides-wrapper-el-pin pin-4"> <button className="slides-wrapper-el-pin-button" onClick={navigate_to_winter_collection_page}> Trousers </button> </div>
                        <div className="slides-wrapper-el-pin pin-5"> <button className="slides-wrapper-el-pin-button" onClick={navigate_to_winter_collection_page}> Tops </button> </div>
                    </div>
                    <div ref={(new_el) => (el_list.current[2] = new_el)}>
                        <div className="slides-wrapper-el-description">
                            <h5>
                                Our 2025 Summer Collection
                            </h5>
                            <p>
                                Enjoy the summer sunshine : let yourself be inspired by the vibrant energy of our summer collection
                            </p>
                            <button
                            className="slides-wrapper-el-description-discover-button"
                            onClick={navigate_to_summer_collection_page}> 
                            <span> Discover Now </span> 
                            </button>
                        </div>
                        <div className="slides-wrapper-el-pin pin-6"> <button className="slides-wrapper-el-pin-button" onClick={navigate_to_summer_collection_page}> Tops </button> </div>
                        <div className="slides-wrapper-el-pin pin-7"> <button className="slides-wrapper-el-pin-button" onClick={navigate_to_summer_collection_page}> Shorts </button> </div>
                    </div>
                </div>
                <div className="slides-wrapper-img">
                    <img ref={(el) => (img_list.current[0] = el)} src={images[0]} className="active" alt="Image1"/>
                    <img ref={(el) => (img_list.current[1] = el)} src={images[1]} alt="Image2"/>
                    <img ref={(el) => (img_list.current[2] = el)} src={images[2]} alt="Image3"/>
                </div>
            </div>
            <div className="loader-wrapper">
                <div ref={(el) => (loader_point_list.current[0] = el)} className="loader-point">
                    <svg width="20" height="20">
                        <circle ref={(el) => (circle_list.current[0] = el)} cx="10" cy="10" r="8"></circle>
                    </svg>
                </div>
                <div ref={(el) => (loader_point_list.current[1] = el)} className="loader-point">
                    <svg width="20" height="20">
                        <circle ref={(el) => (circle_list.current[1] = el)} cx="10" cy="10" r="8"></circle>
                    </svg>
                </div>
                <div ref={(el) => (loader_point_list.current[2] = el)} className="loader-point">
                    <svg width="20" height="20">
                        <circle ref={(el) => (circle_list.current[2] = el)} cx="10" cy="10" r="8"></circle>
                    </svg>
                </div>
            </div>
        </>
    );
}

export default SlidesWrapper;
