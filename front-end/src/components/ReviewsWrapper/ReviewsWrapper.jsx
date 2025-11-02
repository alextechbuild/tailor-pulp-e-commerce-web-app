// ----------------------------------------------- CSS

import "./ReviewsWrapper.css";

// ----------------------------------------------- React

import { useEffect, useRef } from "react";

// ----------------------------------------------- Local Utils

import { start_animation, manage_slides_wrapper_slide_click } from "../../utils/SlidesWrapper/SlidesWrapper.js";




function ReviewsWrapper() {




    const el_list = useRef([]);
    const img_list = useRef([]);
    const loader_point_list = useRef([]);
    const circle_list = useRef([]);

    


    useEffect(() => {


        const progress = {obj : 0};
        const circumference = 2 * Math.PI * 8;
        const animation_id = {obj : null};
        const global_index = {obj : 0};
        const current_index = {obj : 0};
        const next_index = {obj : 1};
        const loader_point_list_index = {obj : 0};
        const reviews_wrapper_handler_list = [];


        const r_el_list = el_list.current;
        const r_img_list = img_list.current;
        const r_loader_point_list = loader_point_list.current;
        const r_circle_list = circle_list.current;


        if (r_el_list && r_img_list && r_loader_point_list && r_circle_list) {

            start_animation(
                progress, circumference, r_circle_list, animation_id, global_index, r_el_list, current_index, 
                r_img_list, next_index
            );

            if (reviews_wrapper_handler_list.length === 0) {

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
                    reviews_wrapper_handler_list.push({element, slides_wrapper_handler});
                });
            }

            return () => {

                cancelAnimationFrame(animation_id.obj);
                
                if (reviews_wrapper_handler_list.length > 0) {

                    reviews_wrapper_handler_list.forEach(({element, handler}, _) => {

                        element.removeEventListener("click", handler);
                    });

                    reviews_wrapper_handler_list.length = 0;
                }
            };
        }
        
    }, []);




    return(
        <>
            <div className="reviews-wrapper">

                <h4> Your Reviews </h4>

                <div className="reviews-wrapper-el">
                    <div ref={(new_el) => (el_list.current[0] = new_el)} className="active">
                        <div className="reviews-wrapper-el-description">
                            <p>
                                "I love this brand! The clothes are comfortable and stylish, and the jewellery really adds a unique touch to every outfit. I recommend it 100%!"
                            </p>
                            <h5> Emma </h5>
                        </div>
                    </div>
                    <div ref={(new_el) => (el_list.current[1] = new_el)}>
                        <div className="reviews-wrapper-el-description">
                            <p>
                                "Fast delivery and super friendly customer service. The pieces are even more beautiful than on the website, and the quality is top notch. I'm a fan!"
                            </p>
                            <h5> Fred </h5>
                        </div>
                    </div>
                    <div ref={(new_el) => (el_list.current[2] = new_el)}>
                        <div className="reviews-wrapper-el-description">
                            <p>
                                "I fell in love with their orange hoodie and winter shawl: perfect for autumn! The colours are vibrant and hold up very well in the wash."
                            </p>
                            <h5> Enya </h5>
                        </div>
                    </div>
                    <div ref={(new_el) => (el_list.current[3] = new_el)}>
                        <div className="reviews-wrapper-el-description">
                            <p>
                                "Tailor'Pulp truly has a unique style. The clothes are modern and comfortable, and the handmade jewellery adds that little touch of elegance that makes all the difference."
                            </p>
                            <h5> Jenna </h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="rw-loader-wrapper">
                <div ref={(el) => (loader_point_list.current[0] = el)} className="rw-loader-point">
                    <svg width="20" height="20">
                        <circle ref={(el) => (circle_list.current[0] = el)} cx="10" cy="10" r="8"></circle>
                    </svg>
                </div>
                <div ref={(el) => (loader_point_list.current[1] = el)} className="rw-loader-point">
                    <svg width="20" height="20">
                        <circle ref={(el) => (circle_list.current[1] = el)} cx="10" cy="10" r="8"></circle>
                    </svg>
                </div>
                <div ref={(el) => (loader_point_list.current[2] = el)} className="rw-loader-point">
                    <svg width="20" height="20">
                        <circle ref={(el) => (circle_list.current[2] = el)} cx="10" cy="10" r="8"></circle>
                    </svg>
                </div>
                <div ref={(el) => (loader_point_list.current[3] = el)} className="rw-loader-point">
                    <svg width="20" height="20">
                        <circle ref={(el) => (circle_list.current[3] = el)} cx="10" cy="10" r="8"></circle>
                    </svg>
                </div>
            </div>
        </>
    );
}

export default ReviewsWrapper;
