export const manage_dropdown_click = (e, submenu_wrapper) => {

    (window.getComputedStyle(submenu_wrapper).display === "none") ? submenu_wrapper.style.display = "flex" : submenu_wrapper.style.display = "none";
    e.stopPropagation();
}

export const check_submenu_wrappers_visual_layout = (
    submenu_wrappers_list, visual_layout_animation_id, is_window_resized, resized_submenu_wrappers_dict
) => {

    submenu_wrappers_list.forEach((element, index) => {

        if (element) {

            if (window.getComputedStyle(element).display === "flex") {

                if (!is_window_resized.obj) {

                    // * 2 pour laisser de la marge pour le repositionnement
                    if (!resized_submenu_wrappers_dict.obj.hasOwnProperty(index.toString()) && element.getBoundingClientRect().left + element.getBoundingClientRect().width > (window.innerWidth - element.getBoundingClientRect().left) * 2) {

                        resized_submenu_wrappers_dict.obj = {...resized_submenu_wrappers_dict.obj, [index] : "_"};
                        
                        element.style.top = "0%";
                        element.style.left = "0%";
                        const original_transform_origin = getComputedStyle(element).transformOrigin;
                        element.style.transformOrigin = "center left";
                        element.style.transform = "translateX(-100%)";
                        element.style.transformOrigin = original_transform_origin;
                    }
                    /*
                    else if (element.getBoundingClientRect().left < 0) {

                        element.style.transform = "";
                        element.style.top = `0%`;
                        element.style.left = `100%`;
                    }
                    */
                }
                else {

                    if (Object.keys(resized_submenu_wrappers_dict.obj).length > 0) {

                        if (resized_submenu_wrappers_dict.obj[index]) {

                            element.style.transform = "";
                            element.style.top = `0%`;
                            element.style.left = `100%`;
                            delete resized_submenu_wrappers_dict.obj[index];
                        }
                    }
                    else if (Object.keys(resized_submenu_wrappers_dict.obj).length === 0) {

                        is_window_resized.obj = false;
                    }
                }
            }
        }
    });

    visual_layout_animation_id.obj = requestAnimationFrame(() => (

        check_submenu_wrappers_visual_layout(
            submenu_wrappers_list, visual_layout_animation_id, is_window_resized, resized_submenu_wrappers_dict
        )
    ));
}
