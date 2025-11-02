export const manage_touchtype_delta = (e, touchtype_event_delta_y1) => {

    touchtype_event_delta_y1.obj = e.touches[0].clientY;
}

export const manage_vertical_scrolling_wrapper = (
    e, touchtype_event_delta_y1, touchtype_event_delta_y2, deltaY, vertical_scrolling_wrapper, maincontent, trigger_height_percentage, is_in_wrapper, progress, 
    path_total_length, alternate_sense_value, tick, raf_id, path, follower, svg, background_1, background_1_pos, background_2, background_2_pos) => {

    if (e.type === "wheel") {

        deltaY.obj = e.deltaY;
    }
    else if (e.type === "touchend") {

        touchtype_event_delta_y2.obj = e.changedTouches[0].clientY;

        if (Math.abs(touchtype_event_delta_y2.obj - touchtype_event_delta_y1.obj) > 100) {

            (touchtype_event_delta_y2.obj > touchtype_event_delta_y1.obj) ? deltaY.obj = -1 : deltaY.obj = 1;
        }
        else {

            deltaY.obj = 0;
        }
    }

    if (!is_in_wrapper.obj) {

        follower.style.visibility = "hidden";

        if ((deltaY.obj > 0 && vertical_scrolling_wrapper.getBoundingClientRect().top < maincontent.clientHeight * trigger_height_percentage && vertical_scrolling_wrapper.getBoundingClientRect().bottom > maincontent.clientHeight * trigger_height_percentage)
        || (deltaY.obj < 0 && vertical_scrolling_wrapper.getBoundingClientRect().top < maincontent.clientHeight * trigger_height_percentage && vertical_scrolling_wrapper.getBoundingClientRect().bottom > maincontent.clientHeight * trigger_height_percentage)) {

            is_in_wrapper.obj = true;
            (progress.obj === 0) ? progress.obj = path_total_length * 0.01 : progress.obj = path_total_length * 0.99;
        }
    }
    else {

        if (progress.obj > 0 - path_total_length / 25 && progress.obj < path_total_length + path_total_length / 25) {

            (deltaY.obj > 0) ? alternate_sense_value.obj = 1 : alternate_sense_value.obj = -1;
            e.preventDefault();
            vertical_scrolling_wrapper.focus();
            maincontent.scrollTo({top: vertical_scrolling_wrapper.offsetTop, behavior: "smooth"});

            if (!tick.obj) {

                raf_id.obj = requestAnimationFrame(() => {

                    if (alternate_sense_value.obj === 1) {

                        if (progress.obj < path_total_length) {

                            progress.obj += (path_total_length / 25);

                            background_1_pos.obj = -(progress.obj) * 200;
                            background_2_pos.obj = (progress.obj) * 400;
                            background_1.style.transform = `translate(-50%, -50%) translateY(${background_1_pos.obj}px)`;
                            background_2.style.transform = `translate(-50%, -50%) translateY(${background_2_pos.obj}px)`;

                            const point = path.getPointAtLength(path_total_length - progress.obj);
                            follower.style.visibility = "visible";
                            follower.style.top = `${(point.y * svg.clientHeight) - follower.getBoundingClientRect().height / 2}px`;
                            follower.style.left = `${(point.x * svg.clientWidth) - follower.getBoundingClientRect().width / 2}px`;

                            path.style.strokeDashoffset = path_total_length + progress.obj;
                        }
                        else {

                            progress.obj = path_total_length;

                            const point = path.getPointAtLength(path_total_length - progress.obj);
                            follower.style.visibility = "visible";
                            follower.style.top = `${(point.y * svg.clientHeight) - follower.getBoundingClientRect().height / 2}px`;
                            follower.style.left = `${(point.x * svg.clientWidth) - follower.getBoundingClientRect().width / 2}px`;

                            path.style.strokeDashoffset = path_total_length + path_total_length;
                            maincontent.scrollTo({top: vertical_scrolling_wrapper.offsetTop + vertical_scrolling_wrapper.offsetHeight, behavior: "smooth"});
                            is_in_wrapper.obj = false;

                            if (typeof vertical_scrolling_wrapper.focus === "function") vertical_scrolling_wrapper.blur();
                        }
                    }
                    else {

                        if (progress.obj > 0) {

                            progress.obj -= (path_total_length / 25);

                            background_1_pos.obj = -(progress.obj) * 200;
                            background_2_pos.obj = (progress.obj) * 400;
                            background_1.style.transform = `translate(-50%, -50%) translateY(${background_1_pos.obj}px)`;
                            background_2.style.transform = `translate(-50%, -50%) translateY(${background_2_pos.obj}px)`;
                            
                            const point = path.getPointAtLength(path_total_length - progress.obj);
                            follower.style.visibility = "visible";
                            follower.style.top = `${(point.y * svg.clientHeight) - follower.getBoundingClientRect().height / 2}px`;
                            follower.style.left = `${(point.x * svg.clientWidth) - follower.getBoundingClientRect().width / 2}px`;

                            path.style.strokeDashoffset = path_total_length + progress.obj;
                        }
                        else {

                            progress.obj = 0;

                            const point = path.getPointAtLength(path_total_length - progress.obj);
                            follower.style.visibility = "visible";
                            follower.style.top = `${(point.y * svg.clientHeight) - follower.getBoundingClientRect().height / 2}px`;
                            follower.style.left = `${(point.x * svg.clientWidth) - follower.getBoundingClientRect().width / 2}px`;

                            path.style.strokeDashoffset = path_total_length;
                            maincontent.scrollTo({top: maincontent.scrollTop + vertical_scrolling_wrapper.getBoundingClientRect().top - maincontent.clientHeight, behavior: "smooth"});
                            is_in_wrapper.obj = false;

                            if (typeof vertical_scrolling_wrapper.focus === "function") vertical_scrolling_wrapper.blur();
                        }
                    }

                    tick.obj = false;
                });

                tick.obj = true;
            }
        }
    }
}
