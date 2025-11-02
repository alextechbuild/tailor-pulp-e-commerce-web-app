// ----------------------------------------------- CSS

import "./AnimationWrapper.css";

// ----------------------------------------------- React

import { useEffect, useRef } from "react";

// ----------------------------------------------- Local utils

import { animate } from "../../utils/AnimationWrapper/AnimationWrapper.js";

// ----------------------------------------------- Global utils

import { isDict } from "../../utils/DictObjectUtils.js";




function AnimationWrapper({trigger_height_percentage, maincontent, animation_page_list}) {


    // A chaque re-render, l'animation globale recommence à la page d'animation actuelle. Nécessite de redémarrer le front pour actualisation


    const container = useRef(null);
    const svg = useRef(null);


    useEffect(() => {


        const index_state = {animation_page_list_index : 0};


        const r_maincontent = maincontent.current;
        const r_container = container.current;
        const r_svg = svg.current;


        if (r_maincontent && r_container && r_svg 
        && Array.isArray(animation_page_list) && animation_page_list.length > 0 && isDict(animation_page_list[0])) {

            const r_animation_page_list = animation_page_list;
            const raf_id_state = {raf_id : null};
            const is_animation_launched_state = {is_animation_launched : false};

            const delete_all_animated_elements = (svg, container) => {

                if (svg && container) {

                    const svg_children = Array.from(svg.children);

                    for (const child of svg_children) {

                        svg.removeChild(child);
                    }

                    const container_children = Array.from(container.children);

                    for (const child of container_children) {

                        if (child.className !== svg.className) {

                            container.removeChild(child);
                        }
                    }
                }
            };

            const animation_trigger_handler = () => {

                if (!is_animation_launched_state.is_animation_launched) {

                    if (r_container.getBoundingClientRect().top > 0 && (r_container.getBoundingClientRect().top - r_maincontent.getBoundingClientRect().top) < (r_maincontent.clientHeight * trigger_height_percentage)) {

                        is_animation_launched_state.is_animation_launched = true;

                        animate(r_container, r_svg, r_animation_page_list, index_state, raf_id_state);
                    }
                }
                else {

                    if ((r_container.getBoundingClientRect().top - r_maincontent.getBoundingClientRect().top) > (r_maincontent.clientHeight * trigger_height_percentage)) {

                        is_animation_launched_state.is_animation_launched = false;

                        cancelAnimationFrame(raf_id_state.raf_id);
                        index_state.animation_page_list_index = 0;
                        raf_id_state.raf_id = null;
                        delete_all_animated_elements(r_svg, r_container);
                    }
                    else if (r_container.getBoundingClientRect().top <= 0) {

                        is_animation_launched_state.is_animation_launched = false;

                        cancelAnimationFrame(raf_id_state.raf_id);
                        index_state.animation_page_list_index = 0;
                        raf_id_state.raf_id = null;
                        delete_all_animated_elements(r_svg, r_container);
                    }
                }
            }

            r_maincontent.addEventListener("scroll", animation_trigger_handler);

            const animation_refresh_handler = () => {

                cancelAnimationFrame(raf_id_state.raf_id);
                index_state.animation_page_list_index = 0;
                raf_id_state.raf_id = null;
                delete_all_animated_elements(r_svg, r_container);

                if (is_animation_launched_state.is_animation_launched) animate(r_container, r_svg, r_animation_page_list, index_state, raf_id_state);
            };

            ["DOMContentLoad", "resize"].forEach((el, _) => {

                window.addEventListener(el, animation_refresh_handler);
            });

            return () => {

                if (r_maincontent) r_maincontent.removeEventListener("scroll", animation_trigger_handler);

                ["DOMContentLoad", "resize"].forEach((el, _) => {

                    window.removeEventListener(el, animation_refresh_handler);
                });

                cancelAnimationFrame(raf_id_state.raf_id);
                if (r_svg && r_container) delete_all_animated_elements(r_svg, r_container);
            };
        }

    }, []);

    
    return (

        <div ref={container} className="animation-wrapper">
            <svg ref={svg} className="animation-wrapper-svg" viewBox="0 0 1 1">
            </svg>
        </div>
    );
}

export default AnimationWrapper;
