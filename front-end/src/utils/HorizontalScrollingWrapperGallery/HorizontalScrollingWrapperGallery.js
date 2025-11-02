
export const manage_touchtype_delta = (e, touchtype_event_delta_y1, touchtype_event_delta_x1) => {

    touchtype_event_delta_y1.obj = e.touches[0].clientY;
    touchtype_event_delta_x1.obj = e.touches[0].clientX;
}

export const manage_horizontal_scrolling_wrapper = (
    e, touchtype_event_delta_y1, touchtype_event_delta_y2, deltaY, touchtype_event_delta_x1, touchtype_event_delta_x2, deltaX, horizontal_scrolling_wrapper, 
    maincontent, trigger_height_percentage, content, is_in_wrapper, offset, el_list
) => {

    if (e.type === "wheel") {

        deltaY.obj = e.deltaY;
        deltaX.obj = e.deltaX;
    }
    else if (e.type === "touchend") {

        touchtype_event_delta_y2.obj = e.changedTouches[0].clientY;

        if (Math.abs(touchtype_event_delta_y2.obj - touchtype_event_delta_y1.obj) > 100) {

            (touchtype_event_delta_y2.obj > touchtype_event_delta_y1.obj) ? deltaY.obj = -1 : deltaY.obj = 1;
        }
        else {

            deltaY.obj = 0;
        }

        touchtype_event_delta_x2.obj = e.changedTouches[0].clientX;

        if (Math.abs(touchtype_event_delta_x2.obj - touchtype_event_delta_x1.obj) > 100) {

            (touchtype_event_delta_x2.obj > touchtype_event_delta_x1.obj) ? deltaX.obj = -1 : deltaX.obj = 1;
        }
        else {

            deltaX.obj = 0;
        }
    }

    if (!is_in_wrapper.obj) {

        if ((deltaY.obj > 0 && horizontal_scrolling_wrapper.getBoundingClientRect().top < maincontent.clientHeight * trigger_height_percentage && horizontal_scrolling_wrapper.getBoundingClientRect().bottom > maincontent.clientHeight * trigger_height_percentage)
        || (deltaY.obj < 0 && horizontal_scrolling_wrapper.getBoundingClientRect().top < maincontent.clientHeight * trigger_height_percentage && horizontal_scrolling_wrapper.getBoundingClientRect().bottom > maincontent.clientHeight * trigger_height_percentage)) {

            is_in_wrapper.obj = true;
        }
    }
    else {

        if ((deltaY.obj > 0 || deltaX.obj > 0) && Math.ceil(content.scrollLeft) < content.scrollWidth - content.clientWidth) {

            e.preventDefault();
            content.focus();
            maincontent.scrollTo({top : horizontal_scrolling_wrapper.offsetTop, behavior : "smooth"});
            content.scrollBy({left : offset, behavior : "smooth"});

            el_list.forEach((element, _) => {

                if (element) {

                    if ((element.getBoundingClientRect().left - content.getBoundingClientRect().left) <= (content.clientWidth)) {

                        if (element.classList.contains("hswgc-exit")) element.classList.remove("hswgc-exit");
                        element.classList.add("hswgc-active");
                    }
                    else if ((element.getBoundingClientRect().left - content.getBoundingClientRect().left) > (content.clientWidth)) {

                        if (element.classList.contains("hswgc-active")) element.classList.remove("hswgc-active");
                        element.classList.add("hswgc-exit");
                    }
                }
            });
        }
        else if ((deltaY.obj < 0 || deltaX.obj < 0) && Math.ceil(content.scrollLeft) > 0) {

            e.preventDefault();
            content.focus();
            maincontent.scrollTo({top : horizontal_scrolling_wrapper.offsetTop, behavior : "smooth"});
            content.scrollBy({left : -offset, behavior : "smooth"});

            el_list.forEach((element, _) => {

                if (element) {

                    if ((element.getBoundingClientRect().left - content.getBoundingClientRect().left) <= 0) {

                        if (element.classList.contains("hswgc-exit")) element.classList.remove("hswgc-exit");
                        element.classList.add("hswgc-active");
                    }
                    else if ((element.getBoundingClientRect().left - content.getBoundingClientRect().left) > 0) {

                        if (element.classList.contains("hswgc-active")) element.classList.remove("hswgc-active");
                        element.classList.add("hswgc-exit");
                    }
                }
            });
        }
        else {
            
            is_in_wrapper.obj = false;
            if (typeof content.focus === "function") content.blur();
            el_list.forEach((el) => {if (el) el.classList.remove("hswgc-active", "hswgc-exit")});
        }
    }
};
