// ----------------------------------------------- CSS

import "./VerticalScrollingWrapperFollower.css";

// ----------------------------------------------- React

import { useEffect, useRef } from "react";

// ----------------------------------------------- Local utils

import { manage_touchtype_delta, manage_vertical_scrolling_wrapper } from "../../utils/VerticalScrollingWrapperFollower/VerticalScrollingWrapperFollower.js";




function VerticalScrollingWrapperFollower({trigger_height_percentage, maincontent}) {


    const vertical_scrolling_wrapper = useRef(null);
    const follower = useRef(null);
    const svg = useRef(null);
    const path = useRef(null);

    const is_in_wrapper = useRef({obj : false});
    const alternate_sense_value = useRef({obj : 1});
    const tick = useRef({obj : false});
    const raf_id = useRef({obj : null});
    const progress = useRef({obj : 0});
    const touchtype_event_delta_y1 = useRef({obj : 0});
    const touchtype_event_delta_y2 = useRef({obj : 0});
    const deltaY = useRef({obj : 0});


    useEffect(() => {

        if (maincontent.current && vertical_scrolling_wrapper.current && follower.current && svg.current && path.current) {

            const touchtype_delta_handler = (e) => {
            
                manage_touchtype_delta(e, touchtype_event_delta_y1.current);
            }

            const path_total_length = path.current.getTotalLength();

            path.current.style.strokeDasharray = path_total_length;
            path.current.style.strokeDashoffset = path_total_length;

            const vertical_scrolling_wrapper_handler = (e) => {

                manage_vertical_scrolling_wrapper(e, touchtype_event_delta_y1.current, touchtype_event_delta_y2.current, deltaY.current, 
                    vertical_scrolling_wrapper.current, maincontent.current, trigger_height_percentage, is_in_wrapper.current, progress.current, path_total_length, 
                    alternate_sense_value.current, tick.current, raf_id.current, path.current, follower.current, svg.current);
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

    }, []);


    return(

        <div ref={vertical_scrolling_wrapper} className="vertical-scrolling-wrapper-follower">
            <div ref={follower} className="vertical-scrolling-wrapper-follower-follower"></div>
            <svg ref={svg} className="vertical-scrolling-wrapper-follower-svg" viewBox="0 0 1 1" preserveAspectRatio="none">
                <path ref={path} d="m 0.48507847,0.86582263
c 0,0 0.21989505,-0.29114588 0.0454532,-0.56877874 0,0 -0.18304113,0.0565093 -0.16092875,0.10319091 0,0 -0.10073398,-0.0393111 -0.036854,-0.10564791 0,0 0.0651086,-0.0577378 0.19164036,0.002456 0,0 -0.10441943,-0.20515342 -0.0270265,-0.13021723 0,0 0.0442247,0.0380826 0.0368541,0.13635957 0,0 0.11424713,0.17075644 0.16952803,0.0749363 0,0 -0.0909063,-0.13390247 -0.17812721,-0.0786216"/>
            </svg>
        </div>
    );
}

export default VerticalScrollingWrapperFollower;
