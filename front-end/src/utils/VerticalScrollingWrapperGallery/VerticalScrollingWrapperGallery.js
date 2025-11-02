export const manage_touchtype_delta = (e, touchtype_event_delta_y1) => {

    touchtype_event_delta_y1.obj = e.touches[0].clientY;
}

export const manage_vertical_scrolling_wrapper = (
    e, touchtype_event_delta_y1, touchtype_event_delta_y2, deltaY, vertical_scrolling_wrapper, maincontent, trigger_height_percentage, content, is_in_wrapper, 
    offset, card_list, maincontent_offset
) => {

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

        if ((deltaY.obj > 0 && vertical_scrolling_wrapper.getBoundingClientRect().top < maincontent.clientHeight * trigger_height_percentage && vertical_scrolling_wrapper.getBoundingClientRect().bottom > maincontent.clientHeight * trigger_height_percentage)
        || (deltaY.obj < 0 && vertical_scrolling_wrapper.getBoundingClientRect().top < maincontent.clientHeight * trigger_height_percentage && vertical_scrolling_wrapper.getBoundingClientRect().bottom > maincontent.clientHeight * trigger_height_percentage)) {

            is_in_wrapper.obj = true;
        }
    }
    else {

        if (deltaY.obj > 0 && Math.ceil(content.scrollTop) < content.scrollHeight - content.clientHeight) {

            e.preventDefault();
            content.focus(); /* Ici et pas dans le !is_in_wrapper.obj car sinon déclenche un scroll indépendant */
            maincontent.scrollTo({top : vertical_scrolling_wrapper.offsetTop + maincontent_offset, behavior : "smooth"});
            content.scrollBy({top : offset, behavior : "smooth"});

            card_list.forEach((element, _) => {

                if (element) {

                    if ((element.getBoundingClientRect().top - content.getBoundingClientRect().top) <= (content.clientHeight)) {

                        if (element.classList.contains("vsw2cwc-exit")) element.classList.remove("vsw2cwc-exit");
                        element.classList.add("vsw2cwc-active");
                    }
                    else if ((element.getBoundingClientRect().top - content.getBoundingClientRect().top) > (content.clientHeight)) {

                        if (element.classList.contains("vsw2cwc-active")) element.classList.remove("vsw2cwc-active");
                        element.classList.add("vsw2cwc-exit");
                    }
                }
            });
        }
        else if (deltaY.obj < 0 && Math.ceil(content.scrollTop) > 0) {

            e.preventDefault();
            content.focus();
            maincontent.scrollTo({top : vertical_scrolling_wrapper.offsetTop + maincontent_offset, behavior : "smooth"});
            content.scrollBy({top : -offset, behavior : "smooth"});

            card_list.forEach((element, _) => {

                if (element) {

                    if ((element.getBoundingClientRect().top - content.getBoundingClientRect().top) <= 0) {

                        if (element.classList.contains("vsw2cwc-exit")) element.classList.remove("vsw2cwc-exit");
                        element.classList.add("vsw2cwc-active");
                    }
                    else if ((element.getBoundingClientRect().top - content.getBoundingClientRect().top) > 0) {

                        if (element.classList.contains("vsw2cwc-active")) element.classList.remove("vsw2cwc-active");
                        element.classList.add("vsw2cwc-exit");
                    }
                }
            });
        }
        else {

            is_in_wrapper.obj = false;
            if (typeof content.focus === "function") content.blur();
            card_list.forEach((el) => { if (el) el.classList.remove("vsw2cwc-active", "vsw2cwc-exit")});
        }
    }
}
