// ----------------------------------------------- CSS

import "./VerticalScrollingWrapperGallery.css";

// ----------------------------------------------- React

import { useState, useEffect, useRef } from "react";

// ----------------------------------------------- Local utils

import { manage_touchtype_delta, manage_vertical_scrolling_wrapper } from "../../utils/VerticalScrollingWrapperGallery/VerticalScrollingWrapperGallery.js";




function VerticalScrollingWrapperGallery({images, trigger_height_percentage, maincontent, offset, maincontent_offset}) {


    const vertical_scrolling_wrapper = useRef(null);
    const img_list = useRef([]);
    const content = useRef(null);
    const card_list = useRef([]);

    const previous_img_index = useRef(0);
    const current_img_index = useRef(1);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const is_in_wrapper = useRef({obj : false});
    const touchtype_event_delta_y1 = useRef({obj : 0});
    const touchtype_event_delta_y2 = useRef({obj : 0});
    const deltaY = useRef({obj : 0});


    const go_to_next_img = () => {

        previous_img_index.current = currentImgIndex;

        setCurrentImgIndex((prev) => {

            if (prev === img_list.current.length - 1) {

                prev = 0;
            }
            else {

                prev += 1;
            }

            current_img_index.current = currentImgIndex;

            return prev;
        });
    }


    const go_to_previous_img = () => {

        previous_img_index.current = currentImgIndex;

        setCurrentImgIndex((prev) => {

            if (prev === 0) {

                prev = img_list.current.length - 1;
            }
            else {

                prev -= 1;
            }

            current_img_index.current = currentImgIndex;

            return prev;
        });
    }


    useEffect(() => {

        if (maincontent.current && vertical_scrolling_wrapper.current && img_list.current && content.current && card_list.current) {

            const touchtype_delta_handler = (e) => {
                        
                manage_touchtype_delta(e, touchtype_event_delta_y1.current);
            }

            if (img_list.current.length > 0) {

                if (img_list.current[currentImgIndex]) {

                    img_list.current.forEach((el) => (el.classList.remove("vswgiw-active", "vswgiw-exit")));

                    img_list.current[previous_img_index.current].classList.remove("vswgiw-exit");
                    img_list.current[current_img_index.current].classList.add("vswgiw-active");
                }
            }

            const vertical_scrolling_wrapper_handler = (e) => {

                manage_vertical_scrolling_wrapper(e, touchtype_event_delta_y1.current, touchtype_event_delta_y2.current, deltaY.current, 
                    vertical_scrolling_wrapper.current, maincontent.current, trigger_height_percentage, content.current, is_in_wrapper.current, offset, 
                    card_list.current, maincontent_offset);
            }

            maincontent.current.addEventListener("touchstart", touchtype_delta_handler, {passive : false});

            ["wheel", "touchmove", "touchend"].forEach((el, _) => {

                maincontent.current.addEventListener(el, vertical_scrolling_wrapper_handler, {passive : false});
            });

            return () => {

                if (maincontent.current) {

                    maincontent.current.removeEventListener("touchstart", touchtype_delta_handler);

                    ["wheel", "touchmove", "touchend"].forEach((el, _) => {

                        maincontent.current.removeEventListener(el, vertical_scrolling_wrapper_handler);
                    });
                }
            }
        }

    }, [currentImgIndex]);


    return (

        <div ref={vertical_scrolling_wrapper} className="vertical-scrolling-wrapper-gallery">
            <div className="vertical-scrolling-wrapper-gallery-img-wrapper">
                <div className="vertical-scrolling-wrapper-gallery-img-wrapper-img">
                    {images.map((el, index) => {
                        return(
                            <img ref={(img_el) => (img_list.current[index] = img_el)} key={index} src={el} alt={`Image ${index}`}/>
                        );
                    })}
                </div>
                <div className="vertical-scrolling-wrapper-gallery-img-wrapper-button">
                    <button onClick={go_to_previous_img}> <span> &larr; </span> </button>
                    <button onClick={go_to_next_img}> <span> &rarr; </span> </button>
                </div>
            </div>
            <div ref={content} className="vertical-scrolling-wrapper-gallery-content-wrapper">
                <div ref={(el) => (card_list.current[0] = el)} className="vertical-scrolling-wrapper-gallery-content-wrapper-card border"></div>
                <div ref={(el) => (card_list.current[1] = el)} className="vertical-scrolling-wrapper-gallery-content-wrapper-card">
                    <p>
                        " Sustainability is at the heart of every choice we make. We use ethical materials, respectful processes and eco-designed packaging. 
                    </p>
                    <p>
                        From recycled fabrics to natural, chemical-free dyes, we work to reduce our environmental footprint while honouring the craftsmanship and 
                        colour that defines us. "
                    </p>
                    <div className="right-right-angled-triangle"></div>
                </div>
                <div ref={(el) => (card_list.current[2] = el)} className="vertical-scrolling-wrapper-gallery-content-wrapper-card">
                    <p>
                        " Design is at the heart of every creation. We carefully consider every shape, texture and detail, combining aesthetics with functionality. 
                    </p>
                    <p>
                        From clean lines to responsible materials, we design pieces that stand the test of time while celebrating the colour that defines us: 
                        orange, a symbol of creativity. "
                    </p>
                    <div className="left-right-angled-triangle"></div>
                </div>
                <div ref={(el) => (card_list.current[3] = el)} className="vertical-scrolling-wrapper-gallery-content-wrapper-card border"></div>
            </div>
        </div>
    );
}

export default VerticalScrollingWrapperGallery;
