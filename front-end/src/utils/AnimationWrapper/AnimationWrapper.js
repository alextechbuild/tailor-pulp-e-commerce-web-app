
function countAllChildNodes(root = document.body) {

    let count = 0;

    for (const child of root.childNodes) {

        count += 1;
        count += countAllChildNodes(child); // Compte ses enfants récursivement
    }

    return count;
}








function move_to_next_animation(container, svg, animation_page_list, index_state, raf_id_state) {
    
    console.log(countAllChildNodes());

    raf_id_state.raf_id = null;
    
    if (index_state.animation_page_list_index < animation_page_list.length) {
        
        animate(container, svg, animation_page_list, index_state, raf_id_state);
    }
    else {
        
        // Permet à windows.addEventListener de redémarrer la dernière animation autant de fois que l'utilisateur resize
        index_state.animation_page_list_index = animation_page_list.length - 1;
    }
}








export function animate(container, svg, animation_page_list, index_state, raf_id_state) {








    const original_animated_elements_dict = animation_page_list[index_state.animation_page_list_index];
    const hasAnimationPageSubElements = original_animated_elements_dict["hasAnimationPageSubElements"];








    function get_object_copy(object) {

        if (object === null || typeof object !== "object") {

            return object;
        }

        if (object instanceof Date) {

            return new Date(object.getTime());
        }

        if (Array.isArray(object)) {

            return object.map(get_object_copy);
        }

        if (object instanceof Map) {

            return new Map(Array.from(object.entries(), ([k, v]) => [get_object_copy(k), get_object_copy(v)]));
        }

        if (object instanceof Set) {

            return new Set(Array.from(object.values(), get_object_copy));
        }

        const object_copy = {};

        for (const key in object) {

            if (Object.hasOwn(object, key)) {

                object_copy[key] = get_object_copy(object[key]);
            }
        }

        return object_copy;
    }








    function isDict(object) {

        return Object.prototype.toString.call(object) === '[object Object]';
    }








    function get_flatten_animated_elements_dict(animated_elements_dict) {


        // L'objectif est d'utiliser une stack pour pouvoir aplatir le dictionnaire des éléments animés
        // L'aplatissement du dictionnaire permettra de récupérer les chemins sous forme de liste, pour ne pas à avoir utiliser requestAnimationFrame dans des boucles for

        // On récupère toujours le premier élément de la stack actuelle (de la forme { path : [clé/indice, ..., clé/indice], value : liste d'informations d'un élément animé/objet})

        // Une liste d'informations d'un élément animé est une liste de paramètres que l'on souhaite récupérer en tant que telle dans le dictionnaire aplati




        // path sera la variable représentant le chemin d'index (commençant par une clé ou par un indice de liste, et se poursuivant par 0 ou plusieurs clés ou 
        // 0 ou plusieurs indices de liste) menant à la valeur (liste d'informations d'un élément animé ou objet, pas les 2 en même temps) associée à la clé ou à l'indice actuel 
        // du dictionnaire

        // value sera la variable représentant la valeur associée à la clé ou à l'indice actuel du dictionnaire. value est déterminé par le chemin d'index path
            


        // Initialisation de la stack globale
        const current_animated_elements_dict_stack = [{path : [], value : animated_elements_dict}];
        // Initialisation du dictionnaire aplati
        const flatten_animated_elements_list = [];


        // Tant que la stack globale n'est pas vidée
        while (current_animated_elements_dict_stack.length > 0) {


            const {path, value} = current_animated_elements_dict_stack.pop();








            if (isDict(value)) {

                const current_level_keys_list = Object.keys(value);


                for (let i = current_level_keys_list.length - 1 ; i >= 0 ; --i) {

                    const current_level_key = current_level_keys_list[i];

                    // Les éléments sont décalés vers le bas (sens de désempilement de la stack actuelle)
                    current_animated_elements_dict_stack.push({path : [...path, current_level_key], value : value[current_level_key]});
                }
            }
            else if (Array.isArray(value)) {

                // Si la valeur du premier élément est une liste d'informations d'un élément animé
                if (value.length === 8 && 
                Array.isArray(value[0]) && 
                (Array.isArray(value[1])) && 
                (Array.isArray(value[2]) && value[2].length === 2) && 
                [value[0][0], value[2][0]].every(v => typeof v === "number") && 
                [value[2][1], value[3], value[4]].every(v => typeof v === "boolean") && 
                (Array.isArray(value[5]) && value[5].length === 2) && 
                (Array.isArray(value[6]) && value[6].length === 4) && 
                typeof value[7] === "string") {
                    
                    // La valeur est une liste d'informations d'un élément animé, et on créé progressivement le dictionnaire aplati
                    flatten_animated_elements_list.push({path, value});
                }
                // Si la valeur du premier élément est une liste des informations d'un sous-élément d'un élément animé
                else if (value.length === 8 && 
                (Array.isArray(value[0]) && value[0].length === 2 && 
                (Array.isArray(value[1])) && 
                (Array.isArray(value[2]) && value[2].length === 2) && 
                [value[0][1], value[0][1]].every(v => typeof v === "string")) && 
                [value[2][1], value[3], value[4]].every(v => typeof v === "boolean") && 
                (Array.isArray(value[5]) && value[5].length === 2) && 
                (Array.isArray(value[6]) && value[6].length === 4) && 
                [value[2][0], value[5][0], value[5][1], value[6][0], value[6][1], value[6][2], value[6][3]].every(v => typeof v === "number") && 
                typeof value[7] === "string") {

                    // La valeur est une liste des informations d'un sous-élément d'un élément animé, et on créé progressivement le dictionnaire aplati
                    flatten_animated_elements_list.push({path, value});
                }
                // Si la valeur du premier élément n'est pas une liste d'informations d'un élément animé
                else if (value.length > 0) {

                    // Même sens de parcours que pour le dictionnaire
                    for (let i = value.length - 1 ; i >= 0 ; --i) {

                        // Les éléments sont décalés de la même façon
                        current_animated_elements_dict_stack.push({path : [...path, i], value : value[i]});
                    }
                }
            }
        }

        // On retourne le dictionnaire aplati complètement rempli
        return flatten_animated_elements_list;
    }








    function translate_path_to_starting_coordinates(svg, data_path, x_start, y_start, animated_element_width, animated_element_height, preview_mode) {

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        path.setAttribute("d", data_path);

        // Les coordonnées des points du SVG Path sont équivalentes aux coordonnées des centres d'éléments HTML
        // Retourne en pixels
        const first_path_point = path.getPointAtLength(0);
        // On fait la différence en x et en y entre les coordonnées du centre du point de l'élément animé et les coordonnées du premier point (0,0) du SVG Path (début)
        const dx = (x_start + animated_element_width/2) - (first_path_point.x) * svg.clientWidth;
        const dy = (y_start + animated_element_height/2) - (first_path_point.y) * svg.clientHeight;

        // Gère l'affichage du SVG Path (chemin d'animation) suivant la valeur assignée au mode aperçu
        (preview_mode) ? path.setAttribute("visibility", "visible") : path.setAttribute("visibility", "hidden");


        // On déplace le visuel du SVG Path aux coordonnées du centre du point de l'élément animé 
        // Le système de coordonnées du SVG Path n'est pas déplacé
        path.style.top = `${dy}px`;
        path.style.left = `${dx}px`;

        svg.appendChild(path);

        // On récupère path, dx et dy pour les réutiliser par la suite car on souhaite animer l'élément le long du SVG Path
        return {path, dx, dy};
    }








    function add_animated_elements_to_page(container, svg, flatten_animated_elements_list, preview_mode, is_not_sub_element) {

        // Parcours du dictionnaire aplati pour récupérer chaque valeur de la liste d'informations de chaque élément animé
        for (let i = 0; i < flatten_animated_elements_list.length ; ++i) {

            // Ajout de la référence en mémoire vers un élément DOM dans la liste d'informations de cet élément animé
            flatten_animated_elements_list[i]["value"].push(document.createElement('div'));






            const element_time_between_trails = flatten_animated_elements_list[i]["value"][2][0]; // Intervalle de temps entre les traînées de particule

            let x_start = 0;
            let y_start = 0;
            
            if (is_not_sub_element) {

                x_start = container.getBoundingClientRect().width * flatten_animated_elements_list[i]["value"][6][0] + flatten_animated_elements_list[i]["value"][6][2];
                y_start = container.getBoundingClientRect().height * flatten_animated_elements_list[i]["value"][6][1] + flatten_animated_elements_list[i]["value"][6][3];
            }
            else {

                x_start = flatten_animated_elements_list[i]["value"][6][0] + flatten_animated_elements_list[i]["value"][6][2];
                y_start = flatten_animated_elements_list[i]["value"][6][1] + flatten_animated_elements_list[i]["value"][6][3];
            }
            
            const data_path = flatten_animated_elements_list[i]["value"][7];
            const element = flatten_animated_elements_list[i]["value"][8];


            const animated_element_type_key = flatten_animated_elements_list[i]["path"][0];

            element.classList.add(animated_element_type_key);





            element.style.left = `${x_start}px`;
            element.style.top = `${y_start}px`;
            (preview_mode) ? element.style.opacity = 1 : element.style.opacity = 0;






            element.animationStarted = false;
            element.passing = false;
            element.initializedTriggeredPointsList = false;
            (element_time_between_trails > 0) ? element.hasDrags = true : element.hasDrags = false;
            element.isInReverseDirection = false;


            element.animationStartedTime = null;
            element.alternate_mode_switching_value = 0;


            element.triggered_points_list = [];
            element.triggered_path_length_list = [];

            element.triggered_path_length_list_save = [];
            element.triggered_path_length_dict = {};
            element.sub_elements_info_list = [];


            element.animated_sub_elements_dict = {};
            element.animated_sub_elements_dict[animated_element_type_key] = {};
            element.animated_sub_elements_dict["preview_before_first_launch"] = preview_mode;

            element.flatten_animated_sub_elements_list = [];





            container.appendChild(element);

            // Déstructuration pour récupérer les valeurs associées respectivement à path, dx et dy
            // L'objectif est de déplacer le SVG Path aux coordonnées initiales de l'élément animé
            // getBoundingClientRect() permet de récupérer dynamiquement les informations de cet élément animé
            const {path, dx, dy} = translate_path_to_starting_coordinates(svg, data_path, x_start, y_start, element.getBoundingClientRect().width, element.getBoundingClientRect().height, animated_elements_dict["preview_before_first_launch"]);





            // Ajout de path, dx et dy au dictionnaire aplati (désormais de longueur 9)
            flatten_animated_elements_list[i]["value"].push(path);
            flatten_animated_elements_list[i]["value"].push(dx);
            flatten_animated_elements_list[i]["value"].push(dy);
        }
    }








    function add_element_trails(element, x, y, letParticlesRemainVisible) {

        // On ajoute l'animation d'apparition et de disparition des particules lors des traînées
        const style = document.createElement("style");

        style.textContent = `
            @keyframes element_trails_fade_in {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes element_trails_fade_out {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;

        document.head.appendChild(style);



        const element_clone = element.cloneNode(false);


        // On définit le style de l'élément cloné
        element_clone.style.zIndex = "inherit";
        element_clone.style.position = "absolute";
        element_clone.style.width = `${element.getBoundingClientRect().width}px`;
        element_clone.style.height = `${element.getBoundingClientRect().height}px`;
        element_clone.style.backgroundColor = getComputedStyle(element).backgroundColor;
        element_clone.style.borderRadius = getComputedStyle(element).borderRadius;


        // On centre la particule de traînée sur le chemin d'animation
        element_clone.style.left = `${x - (element.getBoundingClientRect().width/2)}px`;
        element_clone.style.top = `${y - (element.getBoundingClientRect().height/2)}px`;

        element_clone.style.animation = "element_trails_fade_in 0.25s forwards";



        container.appendChild(element_clone);


        // Timer (asynchrone) 0.25s (250 ms) pour faire en sorte que la particule de traînée disparaisse après 0.25s
        setTimeout(() => {

            if (letParticlesRemainVisible === false) element_clone.style.animation = "element_trails_fade_out 0.25s forwards";

            setTimeout(() => {

                // remove() ne lance pas d'erreur si le noeud a déjà été supprimé ou n’a pas de parent
                if (letParticlesRemainVisible === false) element_clone.remove();
                document.head.removeChild(style);

            }, 250);
                                        
        }, 250);

        
        // On repasse à true pour permettre la création d'autres particules de traînée juste après celle-ci
        // Les timeout gèrent la disparition indépendamment, et on ne souhaite pas attendre l'exécution des timeout pour créer d'autres particules de traînée
        element.hasDrags = true;
    }








    function add_inclination_angle(element_automatic_inclination_mode_bool, element, path, element_progress, translating_point, svg) {

        if (element_automatic_inclination_mode_bool) {

            if (((path.getTotalLength() * element_progress) + 0.1) <= path.getTotalLength()) {

                const closest_point = path.getPointAtLength((path.getTotalLength() * element_progress) + 0.1);
                // atan2 gère les cas de division par zéro
                const inclination_angle_in_rad = Math.atan2((closest_point.y * svg.clientHeight) - (translating_point.y * svg.clientHeight), (closest_point.x * svg.clientWidth) - (translating_point.x * svg.clientWidth));
                // Conversion en degrés pour transform
                const inclination_angle_in_deg = inclination_angle_in_rad * (180 / Math.PI);

                const original_transform_origin = getComputedStyle(element).transformOrigin;
                element.style.transformOrigin = "center";
                element.style.transform = `rotate(${inclination_angle_in_deg}deg)`;
                element.style.transformOrigin = original_transform_origin;
            }
        }
    }








    function fill_element_animated_sub_elements_values_dict(element_triggered_points_list, element_triggered_type_path_list, type_path_dict, svg, dx, dy, element, animated_element_type_key, id_key, element_type_beginning_animation_class, element_type_ending_animation_class, element_triggered_info_list, element_time_between_trails, letParticlesRemainVisible, element_automatic_inclination_mode_bool, element_alternate_mode_bool, ending_animation_trigger_progress_percentages_list, offset_x_start, offset_y_start, element_animated_sub_elements_dict) {

        // Initialisation d'une liste temporaire qui sera constituée d'un ou plusieurs sous-éléments (chacun représenté par une liste d'informations) 
        // de l'élément animé concerné
        const temp_list = [];

        // Parcours de la liste des points déclencheurs de l'élément animé concerné
        for (let i = 0; i < element_triggered_points_list.length ; ++i) {

            // Si le type de chemin de chaque sous-élément est valide (reconnu dans le dictionnaire des types de chemin de sous-élément)
            if (element_triggered_type_path_list[i] in type_path_dict) {

                // C'est comme si on déplaçait le premier point déclencheur aux coordonnées du visuel du SVG Path
                // (auquel on vient retirer la moitié de la largeur puis la moitié de la hauteur pour positionner le point déclencheur par rapport à son centre)
                const sub_x_start = (element_triggered_points_list[i].x * svg.clientWidth) + dx - (element.getBoundingClientRect().width/2);
                const sub_y_start = (element_triggered_points_list[i].y * svg.clientHeight) + dy - (element.getBoundingClientRect().height/2);

                // Chaque sous-élément (de l'élément animé concerné) est représenté par une liste d'informations le concernant :
                temp_list.push([
                    [element_type_beginning_animation_class, element_type_ending_animation_class],
                    element_triggered_info_list,
                    [element_time_between_trails, letParticlesRemainVisible],
                    element_automatic_inclination_mode_bool,
                    element_alternate_mode_bool,
                    ending_animation_trigger_progress_percentages_list,
                    [sub_x_start, sub_y_start, offset_x_start, offset_y_start],
                    type_path_dict[element_triggered_type_path_list[i]]
                ]);
            }
        }

        element_animated_sub_elements_dict[animated_element_type_key][id_key] = [...temp_list];
    }








    function delete_all_animated_elements_at_current_animation_ending(container, svg, animation_page_list, index_state, raf_id_state, hasAnimationPageSubElements) {

        if (hasAnimationPageSubElements) {

            let timeoutId; // accès partagée (pour que clearTimeout accède au compteur précédent)

            observer = new MutationObserver(() => {

                // Chaque fois qu’un changement se produit (une mutation), on nettoie le compteur précédent enregistré dans la variable partagée timeoutId
                clearTimeout(timeoutId);

                // Lance un compteur qui déclenchera un callback pour supprimer les enfants après 1 seconde
                timeoutId = setTimeout(() => {

                    observer.disconnect(); // on arrête de surveiller après le nettoyage (le reste du code dans le setTimeout est exécuté)

                    if (animation_page_list[index_state.animation_page_list_index]["animation_page_effect_class_to_activate"] && typeof animation_page_list[index_state.animation_page_list_index]["animation_page_effect_class_to_activate"] === "string") {

                        const element_to_modify = document.getElementById(animation_page_list[index_state.animation_page_list_index]["animation_page_effect_class_to_activate"])

                        if (element_to_modify) {

                            element_to_modify.classList.remove(animation_page_list[index_state.animation_page_list_index]["animation_page_effect_class_to_activate"]);

                            void element_to_modify.offsetWidth;

                            element_to_modify.classList.add(animation_page_list[index_state.animation_page_list_index]["animation_page_effect_class_to_activate"].concat("-activated"));

                            const children = element_to_modify.querySelectorAll('*');

                            children.forEach((el) => {

                                    const animated_class_list = Array.from(el.classList).filter(c => c.startsWith('animated-'));

                                    animated_class_list.forEach(cls => el.classList.remove(cls));

                                    void el.offsetWidth;

                                    animated_class_list.forEach(cls => el.classList.add(cls));
                                }
                            );
                        }
                    }

                    index_state.animation_page_list_index += 1;
                    move_to_next_animation(container, svg, animation_page_list, index_state, raf_id_state);
                                        
                }, 1000);
            });


            // Démarre la surveillance du noeud DOM passé en premier argument de observe() sur l'objet courant
            observer.observe(container, {

                childList: true,
                attributes: true,
                subtree: true,
            });
        }
        else {

            if (animation_page_list[index_state.animation_page_list_index]["animation_page_effect_class_to_activate"] && typeof animation_page_list[index_state.animation_page_list_index]["animation_page_effect_class_to_activate"] === "string") {

                const element_to_modify = document.getElementById(animation_page_list[index_state.animation_page_list_index]["animation_page_effect_class_to_activate"])

                if (element_to_modify) {

                    element_to_modify.classList.remove(animation_page_list[index_state.animation_page_list_index]["animation_page_effect_class_to_activate"]);

                    void element_to_modify.offsetWidth;

                    element_to_modify.classList.add(animation_page_list[index_state.animation_page_list_index]["animation_page_effect_class_to_activate"].concat("-activated"));

                    const children = element_to_modify.querySelectorAll('*');

                    children.forEach((el) => {

                            const animated_class_list = Array.from(el.classList).filter(c => c.startsWith('animated-'));

                            animated_class_list.forEach(cls => el.classList.remove(cls));

                            void el.offsetWidth;

                            animated_class_list.forEach(cls => el.classList.add(cls));
                        }
                    );
                }
            }

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

            index_state.animation_page_list_index += 1;
            move_to_next_animation(container, svg, animation_page_list, index_state, raf_id_state);
        }
    }








    function start_animation(time) {

        if (!animationStartTime) animationStartTime = time;


        const elapsed = time - animationStartTime;


        // Intiialisation de la variable représentant le progrès global des éléments qui ne sont pas des sous-éléments (qui ne sont pas dans animted_sub_elements_dict)
        // Progrès global de parcours de tous ces l'éléments spécifiques (exprimé en pourcentages, entre 0 et 1), commence à 0 (0%) pour finir à 1 (100%)
        // 
        // Quand global_progress > 1, on reste à 1 pour que getPointAtLength reste à sa valeur maximale
        const global_progress = Math.min(elapsed / animated_elements_dict["first_level_animation_speeds_list"][first_level_animation_speeds_list_index], 1);


        // Initialisation de l'index global pour parcourir chaque élément du dictionnaire aplati
        let global_i = 0;







        // Définition à l'intérieur de start_animation pour accéder aux variables de start_animation (pour rester dans le même scope)
        function animate_elements() {

            // Si le parcours est terminé, la fonction animate_elements est retournée dans start_animation
            if (global_i === flatten_animated_elements_list.length) return;


            // Parcours élément par élément (commence à 0 par défaut)


            // Chemins du dictionnaire aplati
            const animated_element_type_key = flatten_animated_elements_list[global_i]["path"][0];
            const id_key = flatten_animated_elements_list[global_i]["path"][1];

            const element_type_beginning_animation_class = animated_elements_dict[animated_element_type_key]["animation_class"][0];
            const element_type_ending_animation_class = animated_elements_dict[animated_element_type_key]["animation_class"][1];


            // Valeurs du dictionnaire aplati
            const elements_list = flatten_animated_elements_list[global_i]["value"];

            const element_triggered_number = elements_list[0][0];
            const element_triggered_durations_list = elements_list[0][1];
            const element_triggered_type_path_list = elements_list[0][2];

            const element_triggered_info_list = elements_list[1];
            const element_time_between_trails = elements_list[2][0];
            const letParticlesRemainVisible = elements_list[2][1];
            const element_automatic_inclination_mode_bool = elements_list[3];
            const element_alternate_mode_bool = elements_list[4];
            const ending_animation_trigger_progress_percentages_list = elements_list[5];
            const x_start = elements_list[6][0];
            const y_start = elements_list[6][1];
            const offset_x_start = elements_list[6][2];
            const offset_y_start = elements_list[6][3];
            const element = elements_list[8];
            const path = elements_list[9];
            let dx = elements_list[10];
            let dy = elements_list[11];
            
            dx = (container.getBoundingClientRect().width * x_start + offset_x_start + element.getBoundingClientRect().width/2) - (path.getPointAtLength(0).x) * svg.clientWidth;
            dy = (container.getBoundingClientRect().height * y_start + offset_y_start + element.getBoundingClientRect().height/2) - (path.getPointAtLength(0).y) * svg.clientHeight;
            path.style.top = `${dy}px`;
            path.style.left = `${dx}px`;


            // Par défaut, lorsque le mode alterné est désactivé, le progrès de parcours de l'élément animé sur son chemin (exprimé en pourcentages, entre 0 et 1),
            // commence à 0 (0%) pour finir à 1 (100%)
            // 
            // 
            // Pour faciliter les manipulations des éléments animés individuellement, on souhaite la variable global_progress puisse toujours commencer par 0 et 
            // finir toujours par 1
            // 
            // Dans ces conditions, on va d'abord récupérer la valeur de global_progress pour l'assigner individuellement à chaque élément animé
            // 
            // On pose var = global_progress (dans le sens initial)
            // 
            // 
            // Ensuite, pour avoir un mode alterné (autoriser le sens inverse), on souhaite pouvoir commencer à 1 lorsque global_progress commence à 0, et finir à 0
            // lorsque global_progress finit à 1. On cherche donc à enlever 1 à chaque valeur de element_progress
            // 
            // On a var = global_progress
            // var - 1 = global_progress - 1
            // Math.abs(var - 1) = Math.abs(global_progress - 1)
            // new_var = Math.abs(global_progress - 1)
            // 
            // 
            // Comme dans le sens initial, var = global_progress + 0, on a :
            // 
            // 
            // element_progress = Math.abs(global_progress + element.alternate_mode_switching_value);
            const element_progress = Math.abs(global_progress + element.alternate_mode_switching_value);


            const translating_point = path.getPointAtLength(path.getTotalLength() * element_progress);
            



            add_inclination_angle(element_automatic_inclination_mode_bool, element, path, element_progress, translating_point, svg);


            // Le visuel du SVG Path est déplacé aux coordonnées du centre du point de l'élément animé
            // 
            // Comme le système de coordonnées du SVG Path n'est pas déplacé, on translate les coordonnées de chaque future nouvelle position de l'élément animé
            // aux coordonnées du SVG Path
            // 
            // On va décaler en x et en y
            // 
            // C'est comme si on déplaçait chaque nouveau point aux coordonnées du visuel du SVG Path
            const x = (translating_point.x * svg.clientWidth) + dx;
            const y = (translating_point.y * svg.clientHeight) + dy;


            // On met à jour le style de l'élément pour l'afficher sur la page web actuelle
            element.style.left = `${x - (element.getBoundingClientRect().width/2)}px`;
            element.style.top = `${y - (element.getBoundingClientRect().height/2)}px`;


            // Début de l'animation de cet élément

            if (!element.animationStarted) {

                // Passe à true, on ne s'occupe plus de la gestion de l'apparition pendant tout son trajet (tant que global_progress < 1)
                element.animationStarted = true;
                // On lance son animation de début spécifique à son type d'élément animé (exemple : opacité 0 vers opacité 1 pour un translating_point, etc.)
                element.classList.add(element_type_beginning_animation_class);
            }


            // Si le mode traînées de particule est activé pour cet élément animé
            if (element.hasDrags) {

                // Repassera à true après une particule de traînée
                element.hasDrags = false;


                // On attend le temps entre les traînées de particule précisé dans le dictionnaire original
                setTimeout(() => {

                    // Si cet élément animé commence son animation, s'il ne commence pas à disparaître peu à peu et s'il a bien un temps entre les traînées valide, on ajoute les particules de traînée
                    if (element.animationStarted && element.classList.contains(element_type_beginning_animation_class) && element_time_between_trails > 0) add_element_trails(element, x, y, letParticlesRemainVisible);

                }, element_time_between_trails);
            }



            // Gestion des sous-éléments animés de cet élément animé


            // Lorsque cet élément animé passe après un ou plusieurs points sur son chemin, chacun de ces points (points déclencheurs) déclenche l'animation 
            // de sous-éléments, parcourant chacun un chemin spécifique (dont le type est précisé dans le dictionnaire original)


            // Ces points déclencheurs sont répartis à égale distance sur le chemin de cet élément animé
            // (ex : 3 points déclencheurs seront respectivement situés à 1/4, 2/4 et 3/4 de la longueur totale du chemin de cet élément animé par rapport à son 
            // origine 0,0)




            // Si cet élément animé a un nombre de points déclencheurs supérieur à 0, si le nombre de points déclencheurs est égal au nombre des types de chemins 
            // de sous-élément, et si l'élément n'a pas encore initialisé la liste de ses points déclencheurs

            if (element_triggered_number >= 1 && element_triggered_number === element_triggered_type_path_list.length && !element.initializedTriggeredPointsList) {


                // Lorsqu'on a N points déclencheurs répartis à égale distance sur le chemin de la longueur totale de cet élément animé, 
                // la longueur totale de cet élément animé est constituée de N + 1 segments
                // L'objectif est de récupérer les N segments (on ne prend pas le dernier segment (N + 1))


                // Initialisation de la variable path_length qui représente la longueur du premier segment de la longueur totale du chemin de chaque élément animé
                // Le +1 permet de garantir qu'on récupère exclusivement les N segments
                let path_length = path.getTotalLength() * (1/(element_triggered_number + 1));

                // Ajout des coodonnées du point situé à la longueur du premier segment
                element.triggered_points_list.push(path.getPointAtLength(path_length));
                // Ajout de la longueur du premier segment
                element.triggered_path_length_list.push(path_length);
                // Ajout de la clé pour récupérer l'indice de la longueur de chaque segment dans la liste précédente
                // Commence par défaut à l'indice 0
                element.triggered_path_length_dict["0"] = path_length;


                // S'il y a au minimum 2 points déclencheurs
                if (element_triggered_number >= 2) {

                    for (let j = 2 ; j <= element_triggered_number ; ++j) {

                        // Ajout des coodonnées du point situé à la longueur du segment suivant (ex : si le premier segment a pour longueur 1/5 avant cette boucle, 
                        // on aura 2/5, 3/5 et 4/5)
                        element.triggered_points_list.push(path.getPointAtLength(path_length * j));
                        // Ajout de la longueur du segment suivant
                        element.triggered_path_length_list.push(path_length * j);
                        // Au minimum 2 points déclencheurs, donc Commence par défaut à l'indice 1 (pour j - 1)
                        element.triggered_path_length_dict[String(j - 1)] = path_length * j;
                    }
                }

                // Si la sauvegarde de la liste des longueurs de segment associées à chaque point déclencheur de cet élément animé n'a pas encore été faite
                if (element.triggered_path_length_list_save.length === 0) {

                    // Sauvegarde des longueurs de segment associées à chaque point déclencheur de cet élément animé pour les itérations suivantes de global_i à chaque
                    // nouvelle fois que global_progress est réinitialisé
                    element.triggered_path_length_list_save = [...element.triggered_path_length_list];
                }

                // Cet élément animé a bien initialisé la liste de ses points déclencheurs, donc pas besoin de repasser par cette étape
                element.initializedTriggeredPointsList = true;



                // On remplit les valeurs du dictionnaire des sous-éléments de cet élément animé
                fill_element_animated_sub_elements_values_dict(element.triggered_points_list, element_triggered_type_path_list, type_path_dict, svg, dx, dy, element, animated_element_type_key, id_key, element_type_beginning_animation_class, element_type_ending_animation_class, element_triggered_info_list, element_time_between_trails, letParticlesRemainVisible, element_automatic_inclination_mode_bool, element_alternate_mode_bool, ending_animation_trigger_progress_percentages_list, offset_x_start, offset_y_start, element.animated_sub_elements_dict);
                // On aplatit le dictionnaire des sous-éléments de cet élément animé
                element.flatten_animated_sub_elements_list = get_flatten_animated_elements_dict(element.animated_sub_elements_dict);
                // On ajoute les sous-éléments de cet élément animé au conteneur et au DOM (page web actuelle)
                add_animated_elements_to_page(container, svg, element.flatten_animated_sub_elements_list, animated_elements_dict["preview_before_first_launch"], false);


                // On récupère la liste des informations des sous-éléments de cet élément animé
                element.sub_elements_info_list = element.flatten_animated_sub_elements_list;




                // Réinitialisation de la variable pour pouvoir répéter le même processus pour le prochain élément animé
                path_length = 0;
            }       



            // Si cet élément animé initialisé la liste de ses points déclencheurs et s'il y a bien des longueurs de segment pour chaque point déclencheur
            if (element.initializedTriggeredPointsList && !(element.triggered_path_length_list.length === 0)) {

                // On initialise l'indice d'un sous-élément de cet élément animé
                let sub_element_index = null;

                // Parcours de chaque longueur de segment dans la liste des longueurs de segment associées aux points déclencheurs
                for (let triggered_path_length of element.triggered_path_length_list) {

                    // Si cet élément animé dépasse une des longueurs de segment
                    // (supérieur ou égal quand le progrès global commence à 0 pour finir à 1, et inférieur ou égal quand le progrès global commence à 1 pour finir à 0)
                    if ((!element.isInReverseDirection && ((path.getTotalLength() * global_progress) >= triggered_path_length))
                    || (element.isInReverseDirection && ((path.getTotalLength() * global_progress) <= triggered_path_length))) {

                        // Dès qu'on trouve la longueur de segment associée au point déclencheur que l'élément animé a franchi, on le retire pour pouvoir
                        // déclencher les autres points déclencheurs dans les itérations suivantes de global_i avant que global_progress atteigne 1

                        // Cherche l'index de la valeur dans le tableau liste
                        const triggered_path_length_list_index = element.triggered_path_length_list.indexOf(triggered_path_length);

                        if (triggered_path_length_list_index !== -1) {

                            element.triggered_path_length_list.splice(triggered_path_length_list_index, 1);
                        }

                        // Parcours de chaque clé (indice de la longueur de chaque segment) dans le dictionnaire des longueurs de segment
                        for (let triggered_path_length_key in element.triggered_path_length_dict) {

                            // Si la valeur associée à la clé correspond bien à la longueur du segment concerné
                            // (pas besoin de break car chaque longueur de segment est toujours différente et unique dans la liste des longueurs de segment de cet élément)
                            if (element.triggered_path_length_dict[triggered_path_length_key] === triggered_path_length) {

                                // On récupère l'indice de la longueur du segment concerné grâce à la clé du dictionnaire
                                sub_element_index = parseInt(triggered_path_length_key);
                            }
                        }
                    }
                }



                // Si l'indice du sous-élément de cet élément animé est un entier
                if (Number.isInteger(sub_element_index)) {

                    // Si la liste des informations du sous-élément de cet élément animé concerné existe
                    if (element.sub_elements_info_list[sub_element_index]["value"]) {

                        // On récupère la liste des informations du sous-élément de cet élément animé concerné
                        const sub_element_info_list = element.sub_elements_info_list[sub_element_index]["value"];
                        // On récupère le sous-élément concerné de cet élément animé
                        const sub_element = sub_element_info_list[8];








                        function animate_sub_elements(time) {

                            if (!sub_element.animationStartedTime) sub_element.animationStartedTime = time;



                            const sub_elapsed = time - sub_element.animationStartedTime;

                            const sub_progress = Math.min(sub_elapsed / element_triggered_durations_list[sub_element_index], 1);
                                        
                            

                            const sub_element_background_image = sub_element_info_list[1][0];
                            const sub_element_width = sub_element_info_list[1][1];
                            const sub_element_height = sub_element_info_list[1][2];


                            const sub_element_time_between_trails = sub_element_info_list[2][0];
                            const sub_element_letParticlesRemainVisible = sub_element_info_list[2][1];
                            const sub_element_automatic_inclination_mode = sub_element_info_list[3];
                            const sub_element_alternate_mode_bool = sub_element_info_list[4];
                            const sub_element_ending_animation_trigger_progress_percentages_list = sub_element_info_list[5];
                            const sub_path = sub_element_info_list[9];
                            const sub_dx = sub_element_info_list[10];
                            const sub_dy = sub_element_info_list[11];

                            sub_path.style.top = `${sub_dy}px`;
                            sub_path.style.left = `${sub_dx}px`;



                            // Progrès (mode alterné si choisi)
                            const sub_element_sub_progress = Math.abs(sub_progress + sub_element.alternate_mode_switching_value);


                            const sub_translating_point = sub_path.getPointAtLength(sub_path.getTotalLength() * sub_element_sub_progress);
                            add_inclination_angle(sub_element_automatic_inclination_mode, sub_element, sub_path, sub_element_sub_progress, sub_translating_point, svg);
                            const sub_x = (sub_translating_point.x * svg.clientWidth) + sub_dx;
                            const sub_y = (sub_translating_point.y * svg.clientHeight) + sub_dy;

                            if (element_triggered_type_path_list[0] !== "point") {

                                sub_element.style.left = `${sub_x - (sub_element.getBoundingClientRect().width/2)}px`;
                                sub_element.style.top = `${sub_y - (sub_element.getBoundingClientRect().height/2)}px`;
                            }

                            const regex = /^url\(['"]\.\/Assets\/[^'"]+\.(png|jpg|jpeg|gif|webp)['"]\)$/;
                            if (regex.test(sub_element_background_image)) { 
                                
                                sub_element.style.backgroundImage = sub_element_background_image;
                                sub_element.style.backgroundSize = "contain";
                            }

                            sub_element.style.width = `${sub_element_width}px`;
                            sub_element.style.height = `${sub_element_height}px`;
                                

                            if (!sub_element.animationStarted) {

                                sub_element.animationStarted = true;
                                // Il commence invisible
                                // On lance son animation de début spécifique à son type d'élément animé (exemple : opacité 0 vers opacité 1 pour un translating_point, etc.)
                                sub_element.classList.add(element_type_beginning_animation_class);
                            }


                            if (sub_element.hasDrags) {

                                sub_element.hasDrags = false;

                                setTimeout(() => {

                                    if (sub_element.animationStarted && sub_element.classList.contains(element_type_beginning_animation_class) && sub_element_time_between_trails > 0) add_element_trails(sub_element, x, y, sub_element_letParticlesRemainVisible);

                                }, sub_element_time_between_trails);
                            }


                            if (!sub_element.isInReverseDirection && sub_element_sub_progress > sub_element_ending_animation_trigger_progress_percentages_list[0] && !sub_element.passing) {

                                sub_element.passing = true;
                                sub_element.classList.remove(element_type_beginning_animation_class);

                                void sub_element.offsetWidth;
 
                                sub_element.classList.add(element_type_ending_animation_class);
                            }


                            if (!sub_element.isInReverseDirection && sub_element_sub_progress < 1) {

                                raf_id_state.raf_id = requestAnimationFrame(animate_sub_elements);
                            }
                            else if (!sub_element.isInReverseDirection && sub_element_sub_progress === 1) {

                                setTimeout(() => {

                                    (sub_element_time_between_trails > 0) ? sub_element.hasDrags = true : sub_element.hasDrags = false;

                                    sub_element.classList.remove(element_type_ending_animation_class);
                                    sub_element.animationStarted = false;
                                    sub_element.passing = false;

                                    if (sub_element_alternate_mode_bool) {

                                        sub_element.alternate_mode_switching_value = -1;
                                        sub_element.isInReverseDirection = true;
                                    }

                                    // Réinitialise le timer pour repartir
                                    sub_element.animationStartedTime = null;

                                }, animated_elements_dict["pause_between_animations_list"][pause_between_animations_list_index]);
                            }


                            if (sub_element.isInReverseDirection && sub_element_sub_progress < sub_element_ending_animation_trigger_progress_percentages_list[1] && !sub_element.passing) {

                                sub_element.passing = true;
                                sub_element.classList.remove(element_type_beginning_animation_class);

                                void sub_element.offsetWidth;
                                // On lance son animation de fin spécifique à son type d'élément animé (exemple : opacité 0 vers opacité 1 pour un translating_point, etc.)
                                sub_element.classList.add(element_type_ending_animation_class);
                            }


                            if (sub_element.isInReverseDirection && sub_element_sub_progress > 0) {

                                raf_id_state.raf_id = requestAnimationFrame(animate_sub_elements);
                            }
                            else if (sub_element.isInReverseDirection && sub_element_sub_progress === 0) {

                                setTimeout(() => {

                                    (sub_element_time_between_trails > 0) ? sub_element.hasDrags = true : sub_element.hasDrags = false;
                                    
                                    sub_element.classList.remove(element_type_ending_animation_class);
                                    sub_element.animationStarted = false;
                                    sub_element.passing = false;

                                    sub_element.alternate_mode_switching_value = 0;
                                    sub_element.isInReverseDirection = false;

                                    sub_element.animationStartedTime = null;

                                }, animated_elements_dict["pause_between_animations_list"][pause_between_animations_list_index]);
                            }
                        }








                        raf_id_state.raf_id = requestAnimationFrame(animate_sub_elements);
                    }
                }
            }


            if (!element.isInReverseDirection && element_progress > ending_animation_trigger_progress_percentages_list[0] && !element.passing) {

                element.passing = true;
                element.classList.remove(element_type_beginning_animation_class);

                void element.offsetWidth;

                element.classList.add(element_type_ending_animation_class);
            }
            else if (element.isInReverseDirection && element_progress < ending_animation_trigger_progress_percentages_list[1] && !element.passing) {

                element.passing = true;
                element.classList.remove(element_type_beginning_animation_class);

                void element.offsetWidth;

                element.classList.add(element_type_ending_animation_class);
            }


            // Suite de la boucle
            global_i++;
            animate_elements();
        }








        animate_elements();


        if (global_progress < 1) {
            
            raf_id_state.raf_id = requestAnimationFrame(start_animation);
        }

        else {

            setTimeout(() => {

                // Réinitialisation des variables concernées pour chaque élément animé

                for (let i = 0 ; i < flatten_animated_elements_list.length ; ++i) {

                    const element = flatten_animated_elements_list[i]["value"][8];
                    const animated_element_type_key = flatten_animated_elements_list[i]["path"][0];
                    const element_time_between_trails = flatten_animated_elements_list[i]["value"][2][0];

                    (element_time_between_trails > 0) ? element.hasDrags = true : element.hasDrags = false;

                    element.classList.remove(animated_elements_dict[animated_element_type_key]["animation_class"][1]);
                    element.animationStarted = false;
                    element.passing = false;
                    element.triggered_path_length_list.length = 0;
                    element.triggered_path_length_list = [...element.triggered_path_length_list_save];

                    const element_alternate_mode_bool = flatten_animated_elements_list[i]["value"][4];

                    if (element_alternate_mode_bool) {

                        if (!element.isInReverseDirection) {

                            element.alternate_mode_switching_value = -1;
                            element.isInReverseDirection = true;
                        }
                        else {

                            element.alternate_mode_switching_value = 0;
                            element.isInReverseDirection = false;
                        }
                    }
                }



                animationStartTime = null;

                first_level_animation_speeds_list_index += 1;
                if (first_level_animation_speeds_list_index === animated_elements_dict["first_level_animation_speeds_list"].length) first_level_animation_speeds_list_index = 0;

                pause_between_animations_list_index += 1;
                if (pause_between_animations_list_index === animated_elements_dict["pause_between_animations_list"].length) pause_between_animations_list_index = 0;


                if (global_animation_repetition_number >= 0) {

                    global_animation_repetition_number -= 1;

                    if (global_animation_repetition_number === 0) {

                        if (!animated_elements_dict["preview_before_first_launch"]) {

                            // Observateur pour supprimer tous les éléments animés lorsque l'animation est finie dans le cas où des sous-éléments animés sont présents
                            delete_all_animated_elements_at_current_animation_ending(container, svg, animation_page_list, index_state, raf_id_state, hasAnimationPageSubElements);
                        }
                    }
                    else if (global_animation_repetition_number > 0) {

                        raf_id_state.raf_id = requestAnimationFrame(start_animation);
                    }
                }
                else if (global_animation_repetition_number === -1) {

                    raf_id_state.raf_id = requestAnimationFrame(start_animation);
                }

            }, animated_elements_dict["pause_between_animations_list"][pause_between_animations_list_index]);
        }
    }








    const type_path_dict = {

        "point" : "M 0 0",
        "cursor" : "m 237,210 c 6.13403,10.04346 9.17043,21.89425 13,33 12.46778,36.15656 -1.43854,-0.1648 15,36 2.2284,4.90247 3.59168,10.18336 6,15 3.60555,7.2111 7.81586,14.10848 12,21 1.48814,2.45105 3.71764,4.43528 5,7 0.44721,0.89443 -0.53,2.152 0,3 1.24922,1.99875 3.73457,3.01147 5,5 2.21263,3.477 2.29854,7.82732 6,11 1.47573,1.26491 3.62563,1.62563 5,3 1.65425,1.65425 6.00477,10.33969 8,13 1.57219,2.09626 3.37678,2.37678 4,3 0.2357,0.2357 -0.2357,0.7643 0,1 0.2357,0.2357 0.70186,-0.14907 1,0 2.49738,1.24869 5.05834,4.05834 7,6 3.94351,3.94351 4.48523,2.48523 5,3 0.2357,0.2357 -0.2357,0.7643 0,1 2.06903,2.06903 -0.0809,-3.16176 2,1 0.14907,0.29814 0.0808,1.32338 0,1 -0.41223,-1.64893 -0.66667,-3.33333 -1,-5",
        "context_menu" : "M 0 0",
        "wave" : "M 0 0 C 100 -100, 200 100, 300 0",
        "heart" : "M0 30 A20 20 0 0 1 40 30 A20 20 0 0 1 80 30 Q80 60 40 90 Q0 60 0 30 Z",
        "random" : "M 0 0 C 20 -30, 60 -30, 80 0 C 20 30, -20 60, -40 60 C -20 0, -60 -30, -40 -60 Z",
        "horizontal_line" : "M 0 0 H 50",
        "vertical_line" : "M 0 0 V 50",
        "flying-bird-trajectory-1" : "m 1.0,1.0 c 0.0,0.129 0.3005,0.1083 0.3236,0.0",
        "flying-bird-trajectory-2" : "m 1.0,1.0 c 0.3889,0.1087 0.0251,0.1292 0.0,0.0",
        "petal-trajectory" : "m 245.12,104.32 c 0,0 -10.88,49.28 11.52,37.76 0,0 -39.04,-35.2 11.52,32",
        "t-1" : "M 0.140625,0.2421875H 0.34765625"

    };

    let animated_elements_dict = get_object_copy(original_animated_elements_dict);

    const flatten_animated_elements_list = get_flatten_animated_elements_dict(animated_elements_dict);

    add_animated_elements_to_page(container, svg, flatten_animated_elements_list, animated_elements_dict["preview_before_first_launch"], true);

    let animationStartTime = null;

    let first_level_animation_speeds_list_index = 0;
    let pause_between_animations_list_index = 0;
    let global_animation_repetition_number = animated_elements_dict["global_animation_repetition_number"];

    setTimeout(() => {

        raf_id_state.raf_id = requestAnimationFrame(start_animation);
        
    }, animated_elements_dict["time_before_first_launch"]);

}
