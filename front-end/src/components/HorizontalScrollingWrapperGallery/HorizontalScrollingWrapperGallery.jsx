// ----------------------------------------------- CSS

import "./HorizontalScrollingWrapperGallery.css";

// ----------------------------------------------- React

import { useEffect, useRef } from "react";

// ----------------------------------------------- Local utils

import { manage_touchtype_delta, manage_horizontal_scrolling_wrapper } from "../../utils/HorizontalScrollingWrapperGallery/HorizontalScrollingWrapperGallery.js";




function HorizontalScrollingWrapperGallery({elements_list, trigger_height_percentage, maincontent, offset}) {


    const horizontal_scrolling_wrapper = useRef(null);
    const content = useRef(null);
    const el_list = useRef([]);


    useEffect(() => {


        const is_in_wrapper = {obj : false};
        const touchtype_event_delta_x1 = {obj : 0};
        const touchtype_event_delta_x2 = {obj : 0};
        const deltaX = {obj : 0};
        const touchtype_event_delta_y1 = {obj : 0};
        const touchtype_event_delta_y2 = {obj : 0};
        const deltaY = {obj : 0};


        const r_maincontent = maincontent.current;
        const r_horizontal_scrolling_wrapper = horizontal_scrolling_wrapper.current;
        const r_content = content.current;
        const r_el_list = el_list.current;

        
        if (r_maincontent && r_horizontal_scrolling_wrapper && r_content && r_el_list) {

            const touchtype_delta_handler = (e) => {

                manage_touchtype_delta(e, touchtype_event_delta_y1, touchtype_event_delta_x1);
            }

            const horizontal_scrolling_wrapper_handler = (e) => {

                manage_horizontal_scrolling_wrapper(
                    e, touchtype_event_delta_y1, touchtype_event_delta_y2, deltaY, touchtype_event_delta_x1, 
                    touchtype_event_delta_x2, deltaX, r_horizontal_scrolling_wrapper, r_maincontent, trigger_height_percentage, 
                    r_content, is_in_wrapper, offset, r_el_list
                );
            }

            r_maincontent.addEventListener("touchstart", touchtype_delta_handler, {passive : false});

            ["wheel", "touchmove", "touchend"].forEach((el, _) => {

                r_maincontent.addEventListener(el, horizontal_scrolling_wrapper_handler, {passive : false});
            });

            return () => {

                if (r_maincontent) {

                    r_maincontent.removeEventListener("touchstart", touchtype_delta_handler);

                    ["wheel", "touchmove", "touchend"].forEach((el, _) => {

                        r_maincontent.removeEventListener(el, horizontal_scrolling_wrapper_handler);
                    });
                }
            };
        }

    }, []);


    return (

        <div 
        ref={horizontal_scrolling_wrapper} 
        className="horizontal-scrolling-wrapper-gallery">

            <div 
            ref={content} 
            className="horizontal-scrolling-wrapper-gallery-content">

                {elements_list.map(([img, title, text], index) => (

                    <div 
                    ref={(el) => (el_list.current.push(el))} 
                    key={index}>

                        <img 
                        key={index} 
                        src={img} 
                        alt={`Image ${index + 1}`} />
                        
                        <div 
                        className="hswgc-description">
                            <h5> {title} </h5>
                            <p> {text} </p>
                            <p className="hswgc-description-tooltip"> (Scroll To Continue &rarr; ) </p>
                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default HorizontalScrollingWrapperGallery;
