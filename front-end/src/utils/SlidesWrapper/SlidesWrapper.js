function reset_all_loader_points(circle_list, circumference) {

    circle_list.forEach((element, _) => {if (element !== null) element.style.strokeDashoffset = circumference});
}

function change_current_element_image(el_list, current_index, img_list, next_index) {
    
    el_list.forEach((element, _) => {if (element !== null) element.classList.remove("active", "exit-right")});

    if (el_list[current_index.obj] !== null) el_list[current_index.obj].classList.add("exit-right");
    if (el_list[next_index.obj] !== null) el_list[next_index.obj].classList.add("active");

    if (Array.isArray(img_list) && img_list.length > 0) {

        img_list.forEach((element, _) => {if (element !== null) element.classList.remove("active", "exit-right")});

        if (img_list[current_index.obj] !== null) img_list[current_index.obj].classList.add("exit-right");
        if (img_list[next_index.obj] !== null) img_list[next_index.obj].classList.add("active");
    }
}

function animate_loader_point(
    progress, circumference, circle_list, animation_id, global_index, el_list, current_index, img_list, next_index
) {

    if (progress.obj < circumference) {

        progress.obj += circumference / 500;
        if (circle_list[global_index.obj] !== null) circle_list[global_index.obj].style.strokeDashoffset = circumference + progress.obj;

        animation_id.obj = requestAnimationFrame(() => (
            animate_loader_point(
                progress, circumference, circle_list, animation_id, global_index, el_list, current_index, img_list, next_index
            )
        ));
    }
    else {

        progress.obj = 0;
        current_index.obj = global_index.obj;
        next_index.obj = (current_index.obj + 1) % circle_list.length;

        change_current_element_image(el_list, current_index, img_list, next_index);
        global_index.obj = (global_index.obj + 1) % circle_list.length;

        start_animation(
            progress, circumference, circle_list, animation_id, global_index, el_list, current_index, img_list, next_index
        );
    }
};

export function start_animation(
    progress, circumference, circle_list, animation_id, global_index, el_list, current_index, img_list, next_index
) {

    cancelAnimationFrame(animation_id.obj);
    progress.obj = 0; // Réinitialiser la barre de progression à chaque clic de loader
    reset_all_loader_points(circle_list, circumference);

    animation_id.obj = requestAnimationFrame(() => (
        animate_loader_point(
            progress, circumference, circle_list, animation_id, global_index, el_list, current_index, img_list, next_index
        )
    ));
};

export const manage_slides_wrapper_slide_click = (
    loader_point_list_index, progress, circumference, circle_list, animation_id, global_index, el_list, current_index, img_list, next_index
) => {

    if (loader_point_list_index.obj === 0) {

        current_index.obj = circle_list.length - 1;
        next_index.obj = (current_index.obj + 1) % circle_list.length;
    }
    else if (loader_point_list_index.obj > 0) {

        current_index.obj = loader_point_list_index.obj - 1;
        next_index.obj = (current_index.obj + 1) % circle_list.length;
    }

    change_current_element_image(el_list, current_index, img_list, next_index);
    global_index.obj = loader_point_list_index.obj;
    start_animation(
        progress, circumference, circle_list, animation_id, global_index, el_list, current_index, img_list, next_index
    );
};
