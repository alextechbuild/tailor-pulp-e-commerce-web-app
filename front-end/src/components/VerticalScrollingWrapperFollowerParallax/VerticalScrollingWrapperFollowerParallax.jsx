// CSS

import "./VerticalScrollingWrapperFollowerParallax.css";

// React

import { useEffect, useRef } from "react";

// Utils

import { manage_touchtype_delta, manage_vertical_scrolling_wrapper } from "../../utils/VerticalScrollingWrapperFollowerParallax/VerticalScrollingWrapperFollowerParallax.js";




function VerticalScrollingWrapperFollowerParallax({trigger_height_percentage, maincontent}) {


    const vertical_scrolling_wrapper = useRef(null);
    const background_1 = useRef(null);
    const background_2 = useRef(null);
    const follower = useRef(null);
    const svg = useRef(null);
    const path = useRef(null);

    const is_in_wrapper = useRef({obj : false});
    const alternate_sense_value = useRef({obj : 1});
    const tick = useRef({obj : false});
    const raf_id = useRef({obj : null});
    const progress = useRef({obj : 0});
    const background_1_pos = useRef({obj : 0});
    const background_2_pos = useRef({obj : 0});
    const touchtype_event_delta_y1 = useRef({obj : 0});
    const touchtype_event_delta_y2 = useRef({obj : 0});
    const deltaY = useRef({obj : 0});


    useEffect(() => {

        if (maincontent.current && vertical_scrolling_wrapper.current && background_1.current && background_2.current && follower.current && 
            svg.current && path.current) {

            const touchtype_delta_handler = (e) => {
                                    
                manage_touchtype_delta(e, touchtype_event_delta_y1.current);
            }

            const path_total_length = path.current.getTotalLength();

            path.current.style.strokeDasharray = path_total_length;
            path.current.style.strokeDashoffset = path_total_length;

            const vertical_scrolling_wrapper_handler = (e) => {

                manage_vertical_scrolling_wrapper(e, touchtype_event_delta_y1.current, touchtype_event_delta_y2.current, deltaY.current, 
                    vertical_scrolling_wrapper.current, maincontent.current, trigger_height_percentage, is_in_wrapper.current, progress.current, path_total_length, 
                    alternate_sense_value.current, tick.current, raf_id.current, path.current, follower.current, svg.current, background_1.current, 
                    background_1_pos.current, background_2.current, background_2_pos.current);
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

                cancelAnimationFrame(raf_id.current.obj);
            }
        }

    }, [])


    return (

        <div ref={vertical_scrolling_wrapper} className="vertical-scrolling-wrapper-follower-parallax">
            <div ref={follower} className="vertical-scrolling-wrapper-follower-parallax-follower"></div>
            <div ref={background_1} className="vertical-scrolling-wrapper-follower-parallax-background-1">
            </div>
            <div ref={background_2} className="vertical-scrolling-wrapper-follower-parallax-background-2">
            </div>
            <svg ref={svg} className="vertical-scrolling-wrapper-follower-parallax-svg" viewBox="0 0 1 1" preserveAspectRatio="none">
                <path ref={path} d="m 0.23046875,0.82421875
c 0,0 0.0234375,-0.26171875 0.33984375,-0.38671875 0,0 0.171875,-0.09375 0.234375,-0.265625"/>
            </svg>
        </div>
    );
}

export default VerticalScrollingWrapperFollowerParallax;
