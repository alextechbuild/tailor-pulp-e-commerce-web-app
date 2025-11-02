
// ----------------------------------------------- Gestion du zoom sur l'image par l'utilisateur sur la carte (Loupe)




// Gérer l'apparition de la loupe à l'entrée de la souris

const manage_mouse_enter_lens = (lens) => {

    if (window.getComputedStyle(lens).display === "none") lens.style.display = "block";
}




// Gérer la disparition de la loupe à l'entrée de la souris

const manage_mouse_leave_lens = (lens, miwtc_raf_id, canMovedToNextFrameMiwtc) => {

    if (window.getComputedStyle(lens).display === "block") lens.style.display = "none";

    // Si l'utilisateur reste toujours sur la même page sans swipe avec le zoom actif et que la souris quitte l'image, la RAF est annulée pour optimiser les performances
    if (miwtc_raf_id.obj) cancelAnimationFrame(miwtc_raf_id.obj);

    // Réinitialisation du flag du mouvement de loupe
    canMovedToNextFrameMiwtc.obj = true;
}




// Gérer la loupe lorsque la souris est au-dessus de l'image

const manage_mouse_move_lens = (e, mmml_arg_refs) => {

    // Coordonnées du curseur de souris relatives à l'image
    const mouse_pos_x = e.clientX - mmml_arg_refs.img_card.getBoundingClientRect().left;
    const mouse_pos_y = e.clientY - mmml_arg_refs.img_card.getBoundingClientRect().top;

    // Dimensions spécifiques de la loupe (pour gérer transformations CSS, etc.)
    const lens_width = mmml_arg_refs.lens.getBoundingClientRect().width;
    const lens_height = mmml_arg_refs.lens.getBoundingClientRect().height;

    // Dimensions spécifiques de l'image de la carte (pour gérer transformations CSS, etc.)
    const img_card_width = mmml_arg_refs.img_card.getBoundingClientRect().width;
    const img_card_height = mmml_arg_refs.img_card.getBoundingClientRect().height;

    // top (y) left (x) de la loupe
    let lens_x = mouse_pos_x - (lens_width / 2);
    let lens_y = mouse_pos_y - (lens_height / 2);

    // Domaine de définition de la loupe
    if (lens_x < 0) lens_x = 0;
    if (lens_x > img_card_width - lens_width) lens_x = img_card_width - lens_width;
    if (lens_y < 0) lens_y = 0;
    if (lens_y > img_card_height - lens_height) lens_y = img_card_height - lens_height;

    // Mise à jour des coordonnées
    mmml_arg_refs.lens.style.top = `${lens_y}px`;
    mmml_arg_refs.lens.style.left = `${lens_x}px`;

    mmml_arg_refs.img_lens.style.top = `${-(lens_y) * 3}px`;
    mmml_arg_refs.img_lens.style.left = `${-(lens_x) * 3}px`;
}




// Gérer l'activation / désactivation du zoom (Zoom Button)

export const manage_zoom_button = (isZoomEnabled) => {

    (!isZoomEnabled.obj) ? isZoomEnabled.obj = true : isZoomEnabled.obj = false;
}




// Gérer l'affichage du bouton Zoom suivant le format (Smartphone Tablette ou PC)

export const manage_zoom_button_display = (e, zoom_button) => {

    if (e.matches) {

        if (window.getComputedStyle(zoom_button).display === "flex") zoom_button.style.display = "none";
    }
    else {

        if (window.getComputedStyle(zoom_button).display === "none") zoom_button.style.display = "flex";
    }
}








// ----------------------------------------------- Gestion de chaque miniature depuis le défilé principal et dans la carte




// Gérer le chargement ou le déchargement de la miniature à restorer dans le défilé principal en fonction de son emplacement dans la zone visible du défilé principal

const manage_img_to_restored_loading_or_unloading = (img_wrapper_to_restored, global_imgs_wrapper, img_to_restored, empty_img) => {

    // Si cette miniature est dans la zone visible du défilé principal
    if (img_wrapper_to_restored.getBoundingClientRect().top < global_imgs_wrapper.getBoundingClientRect().bottom && img_wrapper_to_restored.getBoundingClientRect().bottom > 0) {

        // On charge l'image
        img_to_restored.src = img_to_restored.dataset.src;
    }
    // Si cette miniature est en dehors de la zone visible du défilé principal
    else {

        // On décharge l'image. On considère qu'un déchargement d'image est un remplacement de l'image originale par une image transparente de 1 pixel de longueur
        // (pour prévenir le remplacement de src par "null" par certains navigateurs Web et ainsi assurer la compatibilité avec les navigateurs Web)
        img_to_restored.src = empty_img;
    }
}




// Gérer la suppression de la miniature actuelle de carte (aperçu) dans le défilé principal

const manage_img_wrapper_temporary_deletion = (img_wrapper, global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history) => {

    // Si la miniature actuelle a bien un parent
    if (img_wrapper.parentElement) {

        // Identifier le parent de la miniature actuelle (colonne 1 ou 2)
        const closest_parent = img_wrapper.closest("." + img_wrapper.parentElement.className);
        const img_wrapper_sibling = img_wrapper.nextSibling;

        // Si la colonne concernée contient bien la miniature actuelle
        if (closest_parent.contains(img_wrapper)) {

            // Si c'est la toute première fois ou si l'utilisateur a fermé la carte (pas d'historique)
            if (previous_deleted_img_wrapper_info_history.length === 0) {

                // Si la minia actuelle a bien une image (URL correspondante et image chargée)
                if (img_wrapper.querySelector("img")) {

                    // On extrait l'image de la minia actuelle
                    const img = img_wrapper.querySelector("img");
                    // On charge l'image de la minia actuelle quelle que soit son emplacement dans le défilé principal pour qu'elle puisse toujours être utilisée complètement dans la carte
                    // On charge également toutes ses informations pour qu'on puisse les réutiliser dans ProductPage
                    img.src = img.dataset.src;
                }

                // On ajoute les infos de la minia actuelle dans l'historique des infos (minia actuelle + nom str colonne 1 ou 2 + sibling = 3 infos)
                previous_deleted_img_wrapper_info_history.push([img_wrapper, closest_parent, img_wrapper_sibling]);

                // On supprime la minia actuelle pour transférer les infos dans la carte
                closest_parent.removeChild(img_wrapper);
            }
            else {

                // S'il y a bien un historique (toujours de longueur 1 car on stocke toujours 1 liste = celle de la minia précédente qui a été retirée du défilé principal)
                if (previous_deleted_img_wrapper_info_history.length === 1) {

                    const previous_deleted_img_wrapper_info_list = previous_deleted_img_wrapper_info_history[0];

                    // Si l'historique des infos contient bien 3 informations (minia précédente + nom str colonne 1 ou 2 + sibling)
                    if (previous_deleted_img_wrapper_info_list.length === 3) {

                        // On récupère les infos de la minia précédente dans l'historique
                        const [img_wrapper_to_restored, parent, sibling] = previous_deleted_img_wrapper_info_list;

                        // On restore l'affichage de la minia précédente dans le défilé principal
                        parent.insertBefore(img_wrapper_to_restored, sibling);

                        // Si la minia précédente a bien une image (URL correspondante et image chargée)
                        if (img_wrapper_to_restored.querySelector("img")) {

                            // On extrait l'image de la minia précédente
                            const img_to_restored = img_wrapper_to_restored.querySelector("img");

                            // On gère le chargement ou le déchargement de la minia à restorer dans le défilé principal en fonction de son emplacement dans la zone visible du défilé principal
                            manage_img_to_restored_loading_or_unloading(img_wrapper_to_restored, global_imgs_wrapper, img_to_restored, empty_img);
                        }

                        // On réinitialise l'historique
                        previous_deleted_img_wrapper_info_history.length = 0;

                        // Si la minia actuelle a bien une image (URL correspondante et image chargée)
                        if (img_wrapper.querySelector("img")) {

                            // On extrait l'image de la minia actuelle
                            const img = img_wrapper.querySelector("img");
                            // On charge l'image de la minia actuelle quelle que soit son emplacement dans le défilé principal pour qu'elle puisse toujours être utilisée complètement dans la carte
                            img.src = img.dataset.src;
                        }

                        // On ajoute les infos de la minia actuelle dans l'historique des infos (minia + nom str colonne 1 ou 2 + sibling = 3 infos)
                        previous_deleted_img_wrapper_info_history.push([img_wrapper, closest_parent, img_wrapper_sibling]);
                        
                        // On supprime la minia actuelle pour transférer les infos dans la carte
                        closest_parent.removeChild(img_wrapper);
                    }
                }
            }
        }
    }
}




// Gérer l'ajout des sections de texte à la carte

const manage_text_section_adding = (img_wrapper_to_restored, h1_list, h2_list, h3_list, h4_list, p_list, text_card_wrapper) => {

    // Gérer l'association des sections de texte

    const manage_text_section_matching = (text_type_list, element, text_card_wrapper) => {

        let i = 0;

        if (text_type_list) {

            if (text_type_list instanceof NodeList && text_type_list.length > 0) {

                while (i < text_type_list.length) {

                    const text_type = text_type_list[i];

                    if (text_type === element) {
                        
                        text_card_wrapper.appendChild(text_type.cloneNode(true));
                        i = text_type_list.length;
                    }
                    else {

                        i++;
                    }
                }
            }
        }
    }



    
    // On reconstitue l'ordre d'apparition des sections de texte par groupe de type de texte
    Array.from(img_wrapper_to_restored.children).forEach((el, _) => {

        if (el.tagName.toLowerCase() === "h1") {

            manage_text_section_matching(h1_list, el, text_card_wrapper);
        }
        else if (el.tagName.toLowerCase() === "h2") {

            manage_text_section_matching(h2_list, el, text_card_wrapper);
        }
        else if (el.tagName.toLowerCase() === "h3") {

            manage_text_section_matching(h3_list, el, text_card_wrapper);
        }
        else if (el.tagName.toLowerCase() === "h4") {

            manage_text_section_matching(h4_list, el, text_card_wrapper);
        }
        else if (el.tagName.toLowerCase() === "p") {

            manage_text_section_matching(p_list, el, text_card_wrapper);
        }
    });
}




// Gérer la carte actuelle de la minia

const manage_img_wrapper_temporary_card = (
    previous_deleted_img_wrapper_info_history, global_img_card_wrapper, img_card_wrapper, lens, text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, 
    hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs, img_wrapper_handler_list
) => {

    // A cet instant dans le code, la future image de la carte est toujours chargée, car cette image correspond à l'image de la miniature à restorer, qui a déjà été chargée (depuis miwtd)


    // Si le conteneur des images de la carte contient l'image de la carte précédente récupérée avec sessionStorage, alors on l'enlève pour pouvoir afficher
    // uniquement la carte actuelle. Cela permet de ne pas avoir plusieurs images de plusieurs cartes précédentes récupérées avec sessionStorage si l'utilisateur
    // back, forward, ou refresh la page Web actuelle
    if (img_card_wrapper.firstElementChild.tagName.toLowerCase() === "img") {
        
        // On retire l'image de la carte précédente récupérée avec sessionStorage. On considère qu'une telle image est toujours en première position
        img_card_wrapper.removeChild(img_card_wrapper.firstElementChild);
    }


    // Si l'image de la carte avait bien été chargée au premier rendu ou changement de format, on met à jour son opacité pour qu'elle puisse être visible dans la carte
    if (img_card_wrapper.style.opacity === "0") img_card_wrapper.style.opacity = "1";

    // Dans le cas où l'utilisateur arrive à swipe tout en restant sur l'image avec le zoom actif, la RAF est annulée pour optimiser les performances
    if (miwtc_raf_id.obj) cancelAnimationFrame(miwtc_raf_id.obj);

    // S'il y a bien un historique (toujours de longueur 1 car on stocke toujours 1 liste = celle de la minia précédente qui a été retirée du défilé principal)
    if (previous_deleted_img_wrapper_info_history.length === 1) {

        const previous_deleted_img_wrapper_info_list = previous_deleted_img_wrapper_info_history[0];

        // Si l'historique des infos contient bien 3 informations (minia précédente + nom str colonne 1 ou 2 + sibling)
        if (previous_deleted_img_wrapper_info_list.length === 3) {

            // On récupère les infos de la minia précédente dans l'historique
            const [img_wrapper_to_restored, parent, sibling] = previous_deleted_img_wrapper_info_list;

            let img_card = null;
            let img_lens = null;

            // Si cette minia a bien une image (URL correspondante et image chargée)
            if (img_wrapper_to_restored.querySelector("img")) {

                // On copie l'image et le texte de cette minia en profondeur (true) pour que lorsqu'on supprimera la carte, on puisse remettre l'image et le texte dans le défilé principal
                img_card = img_wrapper_to_restored.querySelector("img").cloneNode(true);
                img_lens = img_wrapper_to_restored.querySelector("img").cloneNode(true);
            }

            // On extrait le texte de cette minia (une ou plusieurs sections de texte)
            const h1_list = img_wrapper_to_restored?.querySelectorAll("h1");
            const h2_list = img_wrapper_to_restored?.querySelectorAll("h2");
            const h3_list = img_wrapper_to_restored?.querySelectorAll("h3");
            const h4_list = img_wrapper_to_restored?.querySelectorAll("h4");
            const p_list = img_wrapper_to_restored?.querySelectorAll("p");


            // Si la carte n'a jamais été affichée pour la première fois, on l'affiche et on l'initialise avec l'image et le texte
            if (window.getComputedStyle(global_img_card_wrapper).display === "none") {

                global_img_card_wrapper.style.display = "flex";

                // On récupère les sections de la carte pour y insérer l'image et le texte de cette minia
                // On considère que lorsqu'une image n'a pas été chargée au premier rendu ou changement de format, l'utilisateur peut toujours accéder à la carte 
                // avec le texte uniquement
                // On modifie l'opacité de l'image spécifiquement pour pouvoir continuer à mettre à jour le contenu de la carte selon le mode Preview, 
                // le swipe utilisateur ou la fermeture de carte
                (img_card) ? img_card_wrapper.append(img_card) : img_card_wrapper.style.opacity = "0";
                if (img_lens) lens.appendChild(img_lens);

                // On ajoute les différentes sections de texte à la carte si elles sont trouvées
                manage_text_section_adding(img_wrapper_to_restored, h1_list, h2_list, h3_list, h4_list, p_list, text_card_wrapper);
            }
            // Si ce n'est pas la toute première fois que la carte est affichée
            else {

                // Le changement de hauteur intermédiaire de la carte dépend uniquement du mode Preview (isPreviewModeEnabled)

                // On part du principe la carte se replie complètement (Fold Button) uniquement lorsqu'elle est à 100% de hauteur
                // La carte ne se replie pas complètement lorsque le mode Preview est activé


                // Si on ne vérifiait pas que l'utilisateur avait swipé l'image depuis la carte (hasTouchedScreen ignoré), alors en fonction de l'état du mode 
                // Preview, la carte aurait pu soit être pliée à 50% (si mode Preview activé) soit être pliée ou 10% (si mode Preview désactivé) de hauteur

                // Concrètement, cela voudrait dire dans le cas où l'utilisateur devrait cliquer une fois dans le vide sur Fold Button pour pouvoir afficher 
                // Unfold Button pour ensuite déplier et replier correctement la carte

                // Ainsi, vérifier que hasTouchedScreen est bien à false dans la condition permet de :
                // - Faire en sorte que si l'utilisateur swipe l'image depuis la carte à 100% de hauteur, la carte reste toujours à 100% de hauteur
                // - Faire en sorte que si l'utilisateur swipe l'image depuis la carte quelle que soit sa hauteur, sa hauteur est conservée


                // Même principe appliqué pour hasClickedOnPrevOrNext

                if (isPreviewModeEnabled.obj && !hasTouchedScreen.obj && !hasClickedOnPrevOrNext.obj) {

                    global_img_card_wrapper.style.maxHeight = "50%";
                    global_img_card_wrapper.style.minHeight = "50%";
                }
                else if (!isPreviewModeEnabled.obj && !hasTouchedScreen.obj && !hasClickedOnPrevOrNext.obj) {

                    global_img_card_wrapper.style.maxHeight = "10%";
                    global_img_card_wrapper.style.minHeight = "10%";
                }
                
                // A chaque swipe, on réinitialise
                if (hasTouchedScreen.obj) {

                    hasTouchedScreen.obj = false;
                }

                // A chaque clic Previous ou Next, on réinitialise
                if (hasClickedOnPrevOrNext.obj) {

                    hasClickedOnPrevOrNext.obj = false;
                }

                // On réinitialise les sections de la carte (vide) (pour prochaine initialisation)
                // Si l'image de la loupe existe
                if (lens.lastElementChild) lens.lastElementChild.remove();
                // Suppression des listeners sur l'image de la carte (pour la loupe)
                if (img_wrapper_handler_list.length > 0) {

                    img_wrapper_handler_list.forEach((el, index) => {

                        const [element, handler] = el;
                        let event = "";

                        if (index === 1) event = "mouseenter";
                        if (index === 2) event = "mouseleave";
                        if (index === 3) event = "mousemove";

                        element.removeEventListener(event, handler);
                    });

                    // Réinitialisation de la liste des handlers
                    img_wrapper_handler_list.length = 0;
                }
                // Si l'image de la carte avait bien été ajoutée en dernier (dans le cas où image chargée)
                if (img_card_wrapper.lastElementChild.tagName.toLowerCase() === "img") img_card_wrapper.lastElementChild.remove();
                // On réactualise la section texte de la carte
                text_card_wrapper.innerHTML = "";

                // On ajoute l'image et le texte dans les sections récupérées
                (img_card) ? img_card_wrapper.append(img_card) : img_card_wrapper.style.opacity = "0";
                if (img_lens) lens.appendChild(img_lens);
                
                // On ajoute les différentes sections de texte à la carte si elles sont trouvées
                manage_text_section_adding(img_wrapper_to_restored, h1_list, h2_list, h3_list, h4_list, p_list, text_card_wrapper);
            }

            // Si toutes les images concernées sont présentes
            if (img_card && img_lens) {

                // Ajout des handlers
                const mouse_enter_lens_handler = () => {

                    if (isZoomEnabled.obj) {

                        manage_mouse_enter_lens(lens);
                    }
                    else {

                        // Si l'utilisateur désactive le zoom, on annule la RAF pour optimiser les performances
                        if (miwtc_raf_id.obj) cancelAnimationFrame(miwtc_raf_id.obj);
                    }
                }
                const mouse_leave_lens_handler = () => {

                    if (isZoomEnabled.obj) {
                        
                        manage_mouse_leave_lens(lens, miwtc_raf_id, canMovedToNextFrameMiwtc);
                    }
                    else {

                        // Si l'utilisateur désactive le zoom, on annule la RAF pour optimiser les performances
                        if (miwtc_raf_id.obj) cancelAnimationFrame(miwtc_raf_id.obj);
                    }
                }
                const mouse_move_lens_handler = (e) => {

                    if (isZoomEnabled.obj) {

                        if (canMovedToNextFrameMiwtc.obj) {

                            // On stocke la RAF pour pouvoir l'annuler par la suite en fonction des interactions utilisateur
                            miwtc_raf_id.obj = requestAnimationFrame(() => {

                                manage_mouse_move_lens(e, mmml_arg_refs);

                                // Permet de s'assurer qu'un maximum de 1 RAF est exécutée par frame dans cette fonction
                                canMovedToNextFrameMiwtc.obj = true;
                            });
                            canMovedToNextFrameMiwtc.obj = false;
                        }
                    }
                    else {

                        // Si l'utilisateur désactive le zoom, on annule la RAF pour optimiser les performances
                        if (miwtc_raf_id.obj) cancelAnimationFrame(miwtc_raf_id.obj);
                    }
                }

                // Ajout des arguments pour mouse_move_lens_handler
                mmml_arg_refs.img_card = img_card;
                mmml_arg_refs.lens = lens;
                mmml_arg_refs.img_lens = img_lens;

                // Ajout des listeners sur l'image de la carte (pour la loupe)
                img_card_wrapper.addEventListener("mouseenter", mouse_enter_lens_handler);
                img_card_wrapper.addEventListener("mouseleave", mouse_leave_lens_handler);
                img_card_wrapper.addEventListener("mousemove", mouse_move_lens_handler);
                // Ajout des handlers spécifiques à l'image dans une liste pour pouvoir retirer les handlers de cette image à chaque swipe utilisateur
                img_wrapper_handler_list.push([img_card_wrapper, mouse_enter_lens_handler]);
                img_wrapper_handler_list.push([img_card_wrapper, mouse_leave_lens_handler]);
                img_wrapper_handler_list.push([img_card_wrapper, mouse_move_lens_handler]);
            }
        }
    }
}




// Gestion

export const manage_img_wrapper_format = (
    img_wrapper, global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, global_img_card_wrapper, img_card_wrapper, lens, text_card_wrapper, 
    isPreviewModeEnabled, hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs, img_wrapper_handler_list
) => {

    manage_img_wrapper_temporary_deletion(img_wrapper, global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history);

    manage_img_wrapper_temporary_card(
        previous_deleted_img_wrapper_info_history, global_img_card_wrapper, img_card_wrapper, lens, text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, 
        hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs, img_wrapper_handler_list
    );
}








// ----------------------------------------------- Gestion du swipe de l'image par l'utilisateur sur la carte (Smartphone, Tablette)




// Gérer le touchstart (début du swipe) de l'utilisateur lors du swipe de l'image dans la carte

export const manage_img_card_wrapper_touchstart = (
    e, global_img_card_btn_wrapper, global_img_card_options_wrapper, text_card_wrapper, touchtype_event_delta_x1, touchtype_event_delta_y1
) => {

    // Si l'utilisateur ne swipe pas l'image depuis la section des boutons ou depuis la section des options, alors le point de début du swipe en X est calculé
    if (!global_img_card_btn_wrapper.contains(e.target) && !global_img_card_options_wrapper.contains(e.target) && !text_card_wrapper.contains(e.target)) { 
        
        // Si un seul doigt est bien posé sur l'image (on considère que le mouvement de swipe est effectué si et seulement si 1 seul doigt est posé sur l'écran)
        if (e.touches.length === 1) { 
            
            // Le point de début du swipe en X est calculé
            touchtype_event_delta_x1.obj = e.touches[0].clientX

            // On considère que le mouvement de swipe est horizontal (en X). Pour détecter les faux positifs ou négatifs, on capture une première valeur en Y
            touchtype_event_delta_y1.obj = e.touches[0].clientY
        }
        else {
            
            touchtype_event_delta_x1.obj = "not a swipe";
        }
    }
};




// Gérer le touchend (fin du swipe) de l'utilisateur lors du swipe de l'image dans la carte

export const manage_img_card_wrapper_touchend = (
    e, global_img_card_btn_wrapper, global_img_card_options_wrapper, touchtype_event_delta_x1, touchtype_event_delta_x2, deltaX, 
    touchtype_event_delta_y1, touchtype_event_delta_y2, global_index, img_wrappers_list, global_imgs_wrapper, empty_img, 
    previous_deleted_img_wrapper_info_history, global_img_card_wrapper, img_card_wrapper, lens, text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, 
    hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs, img_wrapper_handler_list
) => {

    // Si l'utilisateur a bien effectué un mouvement de swipe
    if (touchtype_event_delta_x1.obj !== "not a swipe") {

        // Si l'utilisateur ne swipe pas l'image depuis la section des boutons ou depuis la section des options
        if (!global_img_card_btn_wrapper.contains(e.target) && !global_img_card_options_wrapper.contains(e.target) && !text_card_wrapper.contains(e.target)) {

            // Le point de fin du swipe en X est calculé
            touchtype_event_delta_x2.obj = e.changedTouches[0].clientX;
            // On calcule le deta en X
            deltaX.obj = touchtype_event_delta_x1.obj - touchtype_event_delta_x2.obj;

            // On calcule le seuil en X (pour prévenir des faux positifs ou faux négatifs en horizontal)
            const threshold_x = Math.abs(deltaX.obj);
            // On capture une deuxième valeur en Y
            touchtype_event_delta_y2.obj = e.changedTouches[0].clientY;
            // On calcule également le seuil en Y (pour prévenir des faux positifs ou faux négatifs en vertical)
            const threshold_y = Math.abs(touchtype_event_delta_y1.obj - touchtype_event_delta_y2.obj);


            // Si le seuil est supérieur à 100 pixels, le swipe de l'utilisateur est confirmé
            if (threshold_x > 100 && threshold_y < 500) {

                // Si l'utilisateur swipe l'image de droite à gauche (delta positif), on passe à l'image suivante
                if (deltaX.obj > 0) {

                    (global_index.obj < img_wrappers_list.length - 1) ? global_index.obj++ : global_index.obj = 0;

                    // L'utilisateur a bien swipé l'image
                    hasTouchedScreen.obj = true;

                    // On met à jour la gestion de la miniature swipée pour afficher ses informations dans la carte
                    manage_img_wrapper_format(
                        img_wrappers_list[global_index.obj], global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, global_img_card_wrapper, 
                        img_card_wrapper, lens, text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, 
                        miwtc_raf_id, mmml_arg_refs, img_wrapper_handler_list
                    );
                }
                // Si l'utilisateur swipe l'image de gauche à droite (delta négatif), on passe à l'image précédente
                else {

                    (global_index.obj === 0) ? global_index.obj = img_wrappers_list.length - 1 : global_index.obj--;

                    // L'utilisateur a bien swipé l'image
                    hasTouchedScreen.obj = true;

                    // On met à jour la gestion de la miniature swipée pour afficher ses informations dans la carte
                    manage_img_wrapper_format(
                        img_wrappers_list[global_index.obj], global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, global_img_card_wrapper, 
                        img_card_wrapper, lens, text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, 
                        miwtc_raf_id, mmml_arg_refs, img_wrapper_handler_list
                    );
                }
            }
        }
    }
};








// ----------------------------------------------- Gestion du repliement (Fold) / dépliement (Unfold) complet de la carte




// Gérer le repliement complet (quand 100% de hauteur seulement) (Fold) de la carte

export const manage_fold_button = (fold_button, global_img_card_wrapper, unfold_button) => {

    // Si le bouton Unfold n'est pas affiché, on l'affiche (pour ensuite masquer Fold)
    if (window.getComputedStyle(unfold_button).display === "none") unfold_button.style.display = "flex";

    // si la carte est bien à 100% de hauteur, alors le repliement complet de la carte peut se faire
    if (window.getComputedStyle(global_img_card_wrapper).minHeight === "100%" && window.getComputedStyle(global_img_card_wrapper).maxHeight === "100%") {

        // On replie complètement la carte
        global_img_card_wrapper.style.maxHeight = "10%";
        global_img_card_wrapper.style.minHeight = "10%";

        // On masque l'affichage du bouton Fold
        if (window.getComputedStyle(fold_button).display === "flex") fold_button.style.display = "none";
    }
}




// Gérer le dépliement complet (Unfold) de la carte

export const manage_unfold_button = (unfold_button, global_img_card_wrapper, fold_button) => {

    // Si le bouton Fold n'est pas affiché, on l'affiche (pour ensuite masquer Unfold)
    if (window.getComputedStyle(fold_button).display === "none") fold_button.style.display = "flex";

    // Si la carte est repliée à 10% (mode Preview désactivé) ou 50% (mode Preview activé) de hauteur
    if ((window.getComputedStyle(global_img_card_wrapper).minHeight === "10%" && window.getComputedStyle(global_img_card_wrapper).maxHeight === "10%") 
    || (window.getComputedStyle(global_img_card_wrapper).minHeight === "50%" && window.getComputedStyle(global_img_card_wrapper).maxHeight === "50%")) {

        // On déplie complètement la carte
        global_img_card_wrapper.style.maxHeight = "100%";
        global_img_card_wrapper.style.minHeight = "100%";

        // On masque l'affichage du bouton Unfold
        if (window.getComputedStyle(unfold_button).display === "flex") unfold_button.style.display = "none";
    }
}








// ----------------------------------------------- Gestion du mode Preview (aperçu) de la carte




// Gérer le mode Preview de la carte

export const manage_preview_mode_button = (global_img_card_wrapper, img_card_wrapper, media_query_format, isPreviewModeEnabled, unfold_button, fold_button) => {

    // Si la carte est affichée
    if (window.getComputedStyle(global_img_card_wrapper).display === "flex") {

        // Si le mode Preview était déjà désactivé, on active le mode Preview
        if (!isPreviewModeEnabled.obj) {

            // On active le mode Preview
            isPreviewModeEnabled.obj = true;
            // Affichage à 50% (aperçu) pour laisser une marge à l'utilisateur pour continuer de défiler en même temps
            global_img_card_wrapper.style.maxHeight = "50%";
            global_img_card_wrapper.style.minHeight = "50%";

            // Affichage de l'image de la carte à  50% de hauteur (Smartphone Tablette + PC)
            img_card_wrapper.style.height = "50%";

            // Quand le mode Preview est activé, l'utilisateur ne peut pas replier (Fold) complètement le bouton (car aperçu)
            if (window.getComputedStyle(fold_button).display === "flex") fold_button.style.display = "none";
            if (window.getComputedStyle(unfold_button).display === "none") unfold_button.style.display = "flex";
        }
        // Si le mode Preview était déjà activé, on désactive le mode Preview
        else {

            // on désactive le mode Preview
            isPreviewModeEnabled.obj = false;
            // On considère que la désactivation du mode Preview équivaut à un repliement complet (Fold)
            global_img_card_wrapper.style.maxHeight = "10%";
            global_img_card_wrapper.style.minHeight = "10%";

            // Si le format est Smartphone Tablette, affichage de l'image de la carte à 100%, si le format est PC affichage de l'image de la carte à 65%
            (media_query_format.matches) ? img_card_wrapper.style.height = "100%" : img_card_wrapper.style.height = "65%";

            // Quand le mode Preview est désactivé, l'utilisateur peut simplement déplier (Unfold) car la désactivation équivaut à un repliement complet (Fold)
            if (window.getComputedStyle(fold_button).display === "flex") fold_button.style.display = "none";
            if (window.getComputedStyle(unfold_button).display === "none") unfold_button.style.display = "flex";
        }
    }
}




// Gérer l'affichage de la carte suivant le format Smartphone Tablette ou PC quand le mode Preview est désactivé au moment du resize

export const manage_preview_mode_resize = (global_img_card_wrapper, img_card_wrapper, media_query_format, isPreviewModeEnabled) => {

    // Si la carte est affichée
    if (window.getComputedStyle(global_img_card_wrapper).display === "flex") {

        // Si le mode Preview est désactivé
        if (!isPreviewModeEnabled.obj) {

            // Si le format est Smartphone Tablette, affichage de l'image de la carte à 100%, si le format est PC affichage de l'image de la carte à 65%
            (media_query_format.matches) ? img_card_wrapper.style.height = "100%" : img_card_wrapper.style.height = "65%";
        }
    }
}








// ----------------------------------------------- Gestion de la barre de recherche (recherche générale)




// Gérer l'obtention de la première occurrence

const get_first_search_occurrence = (imported_texts_list, searched_word, h_list, isCaseSensitiveEnabled) => {


    const sorted_imported_texts_list_by_first_h = imported_texts_list.map((el, index) => {

        if (el && Array.isArray(el) && el.length > 0
        && el[0] && Array.isArray(el[0]) && el[0].length === 2) {

            return [index, 0, ...el[0]];
        }
        else {

            return null;
        }

    }).filter((el, _) => {
        
        return (el !== null)

    }).filter(([index_el, index_sub_el, text_type, text_content], _) => {

        return (h_list.includes(text_type));

    })


    if (sorted_imported_texts_list_by_first_h.length > 0) {

        let common_lowercase_words_counter_list = [];

        sorted_imported_texts_list_by_first_h.forEach(([index_el, index_sub_el, text_type, text_content], _) => {

            let common_lowercase_words_counter = 0;

            text_content.toLowerCase().split(" ").forEach((text_content_splitted_word, _) => {

                searched_word.toLowerCase().split(" ").forEach((searched_word_splitted_word, _) => {

                    if (text_content_splitted_word === searched_word_splitted_word) {

                        common_lowercase_words_counter += 1;
                    }
                });
            });

            common_lowercase_words_counter_list = [...common_lowercase_words_counter_list, common_lowercase_words_counter];
        });

        if (common_lowercase_words_counter_list.length > 0) {

            const common_lowercase_words_counter_list_max = Math.max(...common_lowercase_words_counter_list);

            const common_lowercase_words_index_list = common_lowercase_words_counter_list.map((common_lowercase_words_counter, index) => {

                if (common_lowercase_words_counter === common_lowercase_words_counter_list_max) {

                    return index;
                }
                else {

                    return null;
                }

            }).filter((defined_value, _) => {

                return (defined_value !== null);
            });

            if (common_lowercase_words_index_list.length > 0) {

                if (isCaseSensitiveEnabled && common_lowercase_words_index_list.length > 1) {

                    let case_sentitive_common_words_counter_list = [];

                    common_lowercase_words_index_list.forEach((common_lowercase_word_index, _) => {

                        const [index_el, index_sub_el, text_type, text_content] = sorted_imported_texts_list_by_first_h[common_lowercase_word_index];

                        let case_sentitive_common_words_counter = 0;

                        text_content.split(" ").forEach((text_content_splitted_word, _) => {

                            searched_word.split(" ").forEach((searched_word_splitted_word, _) => {

                                if (text_content_splitted_word === searched_word_splitted_word) {

                                    case_sentitive_common_words_counter += 1;
                                }
                            });
                        });

                        case_sentitive_common_words_counter_list = [...case_sentitive_common_words_counter_list, case_sentitive_common_words_counter];
                    });

                    if (case_sentitive_common_words_counter_list.length > 0) {

                        const case_sentitive_common_words_counter_list_max = Math.max(...case_sentitive_common_words_counter_list);

                        const case_sentitive_common_words_index_list = case_sentitive_common_words_counter_list.map((case_sentitive_common_words_counter, index) => {

                            if (case_sentitive_common_words_counter === case_sentitive_common_words_counter_list_max) {

                                return index;
                            }
                            else {

                                return null;
                            }

                        }).filter((defined_value, _) => {

                            return (defined_value !== null);
                        });

                        if (case_sentitive_common_words_index_list.length > 0) {

                            const index = case_sentitive_common_words_index_list[0];

                            return sorted_imported_texts_list_by_first_h[index];
                        }
                        else {

                            return null;
                        }
                    }
                    else {

                        return null;
                    }
                }
                else {

                    const index = common_lowercase_words_index_list[0];

                    return sorted_imported_texts_list_by_first_h[index];
                }
            }
            else {

                return null;
            }
        }
        else {

            return null;
        }
    }
    else {

        return null;
    }
}




// Gérer le bouton pour confirmer la recherche

export const manage_research_button = (
    global_index, img_wrappers_list, global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, global_img_card_wrapper, img_card_wrapper, 
    lens, text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs, 
    img_wrapper_handler_list, imported_texts_list, searched_word, h_list, isCaseSensitiveEnabled
) => {

    const first_searched_occurrence = get_first_search_occurrence(imported_texts_list, searched_word, h_list, isCaseSensitiveEnabled);

    if (first_searched_occurrence && Array.isArray(first_searched_occurrence) && first_searched_occurrence.length > 0) {

        const [index_el, index_sub_el, text_type, text_content] = first_searched_occurrence;

        if (index_el < img_wrappers_list.length - 1) {
            
            global_index.obj = index_el;
        
            hasClickedOnPrevOrNext.obj = true;

            manage_img_wrapper_format(
                img_wrappers_list[global_index.obj], global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, global_img_card_wrapper, img_card_wrapper, 
                lens, text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs,
                img_wrapper_handler_list
            );
        }
    }
}








// ----------------------------------------------- Gestion de la fermeture de la carte (Close)




// Gérer bouton fermeture carte (Close)

export const manage_close_button = (
    global_img_card_wrapper, unfold_button, fold_button, previous_deleted_img_wrapper_info_history, global_imgs_wrapper, empty_img
) => {

    // Si la carte est bien affichée
    if (window.getComputedStyle(global_img_card_wrapper).display === "flex") {

        // Le Close Button met la carte à 0%
        global_img_card_wrapper.style.maxHeight = "0%";
        global_img_card_wrapper.style.minHeight = "0%";

        // Quand l'utilisateur ferme la carte, il pourra la replier par la suite si la carte est réinitialisée suivant le mode Preview
        if (window.getComputedStyle(fold_button).display === "flex") fold_button.style.display = "none";
        if (window.getComputedStyle(unfold_button).display === "none") unfold_button.style.display = "flex";


        // S'il y a bien un historique (toujours de longueur 1 car on stocke toujours 1 liste = celle de la minia précédente qui a été retirée du défilé principal)
        if (previous_deleted_img_wrapper_info_history.length === 1) {

            const previous_deleted_img_wrapper_info_list = previous_deleted_img_wrapper_info_history[0];

            // Si l'historique des infos contient bien 3 informations (minia précédente + nom str colonne 1 ou 2 + sibling)
            if (previous_deleted_img_wrapper_info_list.length === 3) {

                // On récupère les infos de la minia précédente dans l'historique
                const [img_wrapper_to_restored, parent, sibling] = previous_deleted_img_wrapper_info_list;

                // On restore l'affichage de la minia précédente dans le défilé principal
                parent.insertBefore(img_wrapper_to_restored, sibling);

                if (img_wrapper_to_restored.querySelector("img")) {

                    // On extrait l'image de la minia précédente
                    const img_to_restored = img_wrapper_to_restored.querySelector("img");

                    // On gère le chargement ou le déchargement de la minia à restorer dans le défilé principal en fonction de son emplacement dans la zone visible du défilé principal
                    manage_img_to_restored_loading_or_unloading(img_wrapper_to_restored, global_imgs_wrapper, img_to_restored, empty_img);
                }

                // On réinitialise l'historique
                previous_deleted_img_wrapper_info_history.length = 0;
            }
        }
    }
}








// ----------------------------------------------- Gestion de la sauvegarde de l'image de la carte




// Gérer bouton sauvegarde de l'image de la carte (save)

export const manage_save_button = (img_wrappers_list, global_index) => {

    if (img_wrappers_list[global_index.obj]) {

        // On récupère la minia actuelle (contenant image + texte) grâce à l'index global stocké avec sessionStorage
        const current_img_wrapper = img_wrappers_list[global_index.obj];

        if (current_img_wrapper.querySelector("img")) {

            const img_to_save = current_img_wrapper.querySelector("img").cloneNode(true);
            const link = document.createElement("a");
            link.href = img_to_save.src;
            link.download = "image.png";
            link.click();
        }
    }
}








// ----------------------------------------------- Gestion du swipe de l'image par l'utilisateur sur la carte (PC)




// Gérer le bouton pour passer à l'image précédente

export const manage_previous_button = (
    global_index, img_wrappers_list, global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, global_img_card_wrapper, img_card_wrapper, 
    lens, text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs, 
    img_wrapper_handler_list
) => {

    (global_index.obj === 0) ? global_index.obj = img_wrappers_list.length - 1 : global_index.obj--;

    hasClickedOnPrevOrNext.obj = true;

    manage_img_wrapper_format(
        img_wrappers_list[global_index.obj], global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, global_img_card_wrapper, img_card_wrapper, 
        lens, text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs,
        img_wrapper_handler_list
    );
}




// Gérer le bouton pour passer à l'image suivante

export const manage_next_button = (
    global_index, img_wrappers_list, global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, global_img_card_wrapper, img_card_wrapper, 
    lens, text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs, 
    img_wrapper_handler_list
) => {

    (global_index.obj < img_wrappers_list.length - 1) ? global_index.obj++ : global_index.obj = 0;

    hasClickedOnPrevOrNext.obj = true;

    manage_img_wrapper_format(
        img_wrappers_list[global_index.obj], global_imgs_wrapper, empty_img, previous_deleted_img_wrapper_info_history, global_img_card_wrapper, img_card_wrapper, 
        lens, text_card_wrapper, isPreviewModeEnabled, hasTouchedScreen, hasClickedOnPrevOrNext, isZoomEnabled, canMovedToNextFrameMiwtc, miwtc_raf_id, mmml_arg_refs,
        img_wrapper_handler_list
    );
}








// ----------------------------------------------- Gestion de l'extraction des informations produit de la minia actuelle




// Gérer l'extraction des informations produit de la minia actuelle (see_product)

export const extract_card_product_information = (img_wrappers_list, global_index) => {


    // Gérer l'association et le transfert des sections de texte

    const manage_text_section_transfer_and_matching = (text_type_list, element, result) => {

        let i = 0;
        let list_to_transfer = [];

        if (text_type_list) {

            if (text_type_list instanceof NodeList && text_type_list.length > 0) {

                while (i < text_type_list.length) {

                    const text_type = text_type_list[i];

                    if (text_type === element) {
                        
                        list_to_transfer.push(text_type.cloneNode(true));
                        i = text_type_list.length;
                    }
                    else {

                        i++;
                    }
                }
            }
        }

        if (list_to_transfer.length > 0) result.push(list_to_transfer);
    }




    let result = [];

    if (img_wrappers_list[global_index.obj]) {

        // On récupère la minia actuelle grâce à l'index global stocké avec sessionStorage
        const current_img_wrapper = img_wrappers_list[global_index.obj];

        // On extrait l'image de la minia actuelle
        if (current_img_wrapper.querySelector("img")) {

            const img_to_transfer = current_img_wrapper.querySelector("img").cloneNode(true);
            result.push(img_to_transfer);
        }


        // On extrait le texte de la minia actuelle (une ou plusieurs sections de texte)
        const h1_list = current_img_wrapper?.querySelectorAll("h1");
        const h2_list = current_img_wrapper?.querySelectorAll("h2");
        const h3_list = current_img_wrapper?.querySelectorAll("h3");
        const h4_list = current_img_wrapper?.querySelectorAll("h4");
        const p_list = current_img_wrapper?.querySelectorAll("p");


        // On reconstitue l'ordre d'apparition des sections de texte par groupe de type de texte. Chaque groupe a sa propre liste
        Array.from(current_img_wrapper.children).forEach((el, _) => {

            if (el.tagName.toLowerCase() === "h1") {

                manage_text_section_transfer_and_matching(h1_list, el, result);
            }
            else if (el.tagName.toLowerCase() === "h2") {

                manage_text_section_transfer_and_matching(h2_list, el, result);
            }
            else if (el.tagName.toLowerCase() === "h3") {

                manage_text_section_transfer_and_matching(h3_list, el, result);
            }
            else if (el.tagName.toLowerCase() === "h4") {

                manage_text_section_transfer_and_matching(h4_list, el, result);
            }
            else if (el.tagName.toLowerCase() === "p") {

                manage_text_section_transfer_and_matching(p_list, el, result);
            }
        });
    }

    return result;
}








// ----------------------------------------------- Gestion du chargement / rechargement d'images suivant le scroll utilisateur dans le défilé principal




// Obtenir une liste statique de toutes les images de miniature la toute première fois dans le défilé principal

const get_imgs_wrappers_imgs_list = (img_wrappers_collection, imgs_wrappers_imgs_list) => {

    // Créer un HTMLCollection de toutes les img à l'intérieur des div "coucou"
    for (let i = 0; i < img_wrappers_collection.length; i++) {

        const img = img_wrappers_collection[i].getElementsByTagName("img");
        if (img.length > 0) imgs_wrappers_imgs_list.push(img[0]);
    }
}




// Vérifier si toutes les images des miniatures dans le défilé principal ont bien été chargées pour la toute première fois

const check_imgs_wrappers_imgs_all_loaded = (
    img_wrappers_imgs_loaded_count, imgs_wrappers_imgs_list, global_imgs_wrapper, global_imgs_wrapper_scrollable_fixed_height
) => {

    // Si toutes les images des miniatures dans le défilé principal ont bien été chargées pour la toute première fois (URL correspondantes)
    if (img_wrappers_imgs_loaded_count.obj === imgs_wrappers_imgs_list.length) {

        // Permet aux images des miniatures du défilé principal d'être à leurs tailles originales dès le premier rendu.
        // Sinon l'utilisateur devrait scroller ou recharger la page pour que les dimensions originales des images soient stockées dans un premier cache
        window.dispatchEvent(new Event("resize"));

        // Permet de fixer une limite scrollable fixe qui changera uniquement lors du changement de format. On fixe un epsilon à -50
        global_imgs_wrapper_scrollable_fixed_height.obj = (global_imgs_wrapper.scrollHeight - global_imgs_wrapper.clientHeight) - 50;
    }
}




// Gérer le chargement des images des miniatures dans le défilé principal pour la toute première fois

const manage_img_wrapper_img_first_loading = (
    img_wrappers_imgs_loaded_count, img_wrapper, imgs_wrappers_imgs_list, global_imgs_wrapper, global_imgs_wrapper_scrollable_fixed_height
) => {

    // Lorsque l'image a complètement été chargée, on incrémente le compteur global des images concernées
    img_wrappers_imgs_loaded_count.obj++;

    // On enregistre les dimensions de la miniature concernée pour toujours garder une même taille, même si son image est déchargée. Cela permet de :
    // 
    // - Faire en sorte que le conteneur flex contenant toutes les miniatures ne recalcule jamais l'ordre et le scroll pour chaque miniature à chaque scroll
    // utilisateur, car chacune d'elles (flex-item) garde toujours une même largeur et une même hauteur (et donc la disposition ne change jamais)
    // - Libérer de la mémoire en déchargeant toutes les images des miniatures hors zone visible
    img_wrapper.style.width = `${img_wrapper.getBoundingClientRect().width}px`;
    img_wrapper.style.height = `${img_wrapper.getBoundingClientRect().height}px`;

    // On vérifie si toutes les images des miniatures dans le défilé principal ont bien été chargées pour la toute première fois
    check_imgs_wrappers_imgs_all_loaded(
        img_wrappers_imgs_loaded_count, imgs_wrappers_imgs_list, global_imgs_wrapper, global_imgs_wrapper_scrollable_fixed_height
    );
}




// Gérer le chargement et rechargement des images des miniatures dans le défilé principal

export const manage_imgs_wrappers_imgs_reloading = (
    e, img_wrappers_imgs_loaded_count, imgs_wrappers_imgs_list, img_wrappers_collection, global_imgs_wrapper, empty_img, global_imgs_wrapper_scrollable_fixed_height, 
    last_scroll, current_scroll, delta
) => {

    // Si les images des miniatures dans le défilé principal sont chargées pour la toute première fois (= chargement)
    if (!e?.type) {

        // On réinitialise le compteur global pour refaire à partir de zéro un premier chargement lors du changement de format par l'utilisateur
        img_wrappers_imgs_loaded_count.obj = 0;

        // On réinitialise la liste pour refaire à partir de zéro un premier chargement lors du changement de format par l'utilisateur
        imgs_wrappers_imgs_list.length = 0;

        // On génère la liste statique de toutes les images de miniature la toute première fois dans le défilé principal
        get_imgs_wrappers_imgs_list(img_wrappers_collection, imgs_wrappers_imgs_list);

        // Pour chaque miniature du défilé principal parcourue dynamiquement (permet d'accéder aux éléments en direct)
        Array.from(img_wrappers_collection).forEach((img_wrapper, _) => {

            // Cette condition est placée pour les nouveaux chargements uniquement (pas le premier chargement) lorsque le format changera. Cela permet de :
            // 
            // - Faire en sorte de prévenir les images qui ont été retirées lors du premier chargement
            if (img_wrapper.querySelector("img")) {

                // On extrait l'image de cette miniature
                const img = img_wrapper.querySelector("img");

                // Ajout du listener temporaire pour le premier chargement de l'image dans le cas où l'URL correspond (l'image est chargée)
                img.addEventListener("load", () => {

                    manage_img_wrapper_img_first_loading(
                        img_wrappers_imgs_loaded_count, img_wrapper, imgs_wrappers_imgs_list, global_imgs_wrapper, global_imgs_wrapper_scrollable_fixed_height
                    );

                }, {once : true});

                // Ajout du listener temporaire pour le premier chargement de l'image dans le cas où l'URL ne correspond pas (l'image n'est pas chargée)
                img.addEventListener("error", () => {

                    // L'URL de l'image ne correspond pas, on retire l'image de la miniature
                    if (img_wrapper.contains(img)) img_wrapper.removeChild(img);
                    // On met à jour la liste statique pour refléter toutes les images qui ont été correctement chargées
                    imgs_wrappers_imgs_list.splice(imgs_wrappers_imgs_list.indexOf(img), 1);

                    // On vérifie si toutes les images des miniatures dans le défilé principal ont bien été chargées pour la toute première fois
                    check_imgs_wrappers_imgs_all_loaded(
                        img_wrappers_imgs_loaded_count, imgs_wrappers_imgs_list, global_imgs_wrapper, global_imgs_wrapper_scrollable_fixed_height
                    );

                }, {once : true});

                // On charge l'image pour la toute première fois
                img.src = img.dataset.src;
            }
        });
    }
    // Si l'utilisateur scroll (molette souris, mouvement tactile, etc.) (= rechargement)
    else if (e.type === "scroll") {

        current_scroll.obj = global_imgs_wrapper.scrollTop;
        delta.obj = current_scroll.obj - last_scroll.obj;

        (delta.obj > 0) ? delta.obj = 1 : delta.obj = -1;

        last_scroll.obj = current_scroll.obj;

        // Si l'utilisateur ne scrolle pas aux limites scrollables du défilé principal

        // La variable globale "global_imgs_wrapper_scrollable_fixed_height" permet d'avoir une limite scrollable fixe qui change uniquement lors du changement de
        // format. Cette limite est fixe pendant toutes les interactions utilisateurs sur un même format, car cela permet de :
        // 
        // - Faire en sorte que chaque hauteur de miniature reste fixe et n'augmente pas indéfiniment si l'utilisateur scrolle indéfiniment vers le bas alors que
        // la limite scrollable venait d'être atteinte (ce qui est lié au CSS car max-height n'est pas défini pour chaque miniature puisqu'on souhaite conserver 
        // un ratio naturel pour chaque image)

        if (global_imgs_wrapper.scrollTop > 0 && Math.ceil(global_imgs_wrapper.scrollTop) < global_imgs_wrapper_scrollable_fixed_height.obj) {

            // Pour chaque miniature du défilé principal parcourue dynamiquement (permet d'accéder aux éléments en direct)
            Array.from(img_wrappers_collection).forEach((img_wrapper, _) => {

                // Si l'image de la miniature existe (image correctement chargée et URL correspondante)
                if (img_wrapper.querySelector("img")) {

                    // On extrait l'image
                    const img = img_wrapper.querySelector("img");

                    // Si la miniature est dans la zone visible du défilé principal
                    if ((delta.obj > 0 && (img_wrapper.getBoundingClientRect().top < global_imgs_wrapper.getBoundingClientRect().bottom))
                    || (delta.obj < 0 && (img_wrapper.getBoundingClientRect().bottom > 0))) {

                        // On charge l'image
                        img.src = img.dataset.src;
                    }
                    else {

                        // On décharge l'image. On considère qu'un déchargement d'image est un remplacement de l'image originale par une image transparente de 1 pixel de longueur
                        // (pour prévenir le remplacement de src par "null" par certains navigateurs Web et ainsi assurer la compatibilité avec les navigateurs Web)
                        img.src = empty_img;
                    }
                }
            });
        }
    }
}








/*

const global_imgs_btns_wrapper = document.querySelector(".vertical-scrolling-wrapper-board-img-wrapper");

const global_imgs_wrapper = global_imgs_btns_wrapper.querySelector(".vertical-scrolling-wrapper-board-img-wrapper-imgs");
const img_wrappers_list = global_imgs_wrapper.querySelectorAll(".vertical-scrolling-wrapper-board-img-wrapper-imgs-col-img");

const empty_img = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="; // N'est pas modifiée (passage par valeur donc sera copie)
let previous_deleted_img_wrapper_info_history = [];

const media_query_format = window.matchMedia("(min-width: 400px) and (max-width: 1000px)");
const media_query_device = window.matchMedia("(hover: none) and (pointer: coarse)");

const global_img_card_wrapper = global_imgs_btns_wrapper.querySelector(".vertical-scrolling-wrapper-board-img-wrapper-card");
const img_card_wrapper = global_img_card_wrapper.querySelector(".vertical-scrolling-wrapper-board-img-wrapper-card-img");
const lens = img_card_wrapper.querySelector('.vertical-scrolling-wrapper-board-img-wrapper-card-img-lens');
const text_card_wrapper = global_img_card_wrapper.querySelector(".vertical-scrolling-wrapper-board-img-wrapper-card-text");
let img_wrapper_handler_list = [];
const canMovedToNextFrameMiwtc = {obj : true};
const miwtc_raf_id = {obj : null}; // miwtc = manage_img_wrapper_temporary_deletion
const mmml_arg_refs = {img_card : null, lens : null, img_lens : null}; // mmml = manage_mouse_move_lens
const global_img_card_options_wrapper = global_imgs_btns_wrapper.querySelector(".vertical-scrolling-wrapper-board-img-wrapper-card-options");
const zoom_button = global_img_card_options_wrapper.querySelector(".vsw2ibwco-zoom");
const isZoomEnabled = {obj : false};


const touchtype_event_delta_x1 = {obj : 0};
const touchtype_event_delta_x2 = {obj : 0};
const deltaX = {obj : 0};
const touchtype_event_delta_y1 = {obj : 0};
const touchtype_event_delta_y2 = {obj : 0};
const deltaY = {obj : 0};
const global_index = {obj : 0};
const hasTouchedScreen = {obj : false};


const global_img_card_btn_wrapper = global_imgs_btns_wrapper.querySelector(".vertical-scrolling-wrapper-board-img-wrapper-card-btn");
const unfold_button = global_img_card_btn_wrapper.querySelector(".vsw2ibwcb-unfold");
const fold_button = global_img_card_btn_wrapper.querySelector(".vsw2ibwcb-fold");
const preview_mode_button = global_img_card_btn_wrapper.querySelector(".vsw2ibwcb-preview-mode");
const isPreviewModeEnabled = {obj : false};
const close_button = global_img_card_btn_wrapper.querySelector(".vsw2ibwcb-close");


const save_button = global_img_card_options_wrapper.querySelector(".vsw2ibwco-save");
const previous_button = global_img_card_options_wrapper.querySelector(".vsw2ibwco-previous");
const next_button = global_img_card_options_wrapper.querySelector(".vsw2ibwco-next");
const hasClickedOnPrevOrNext = {obj : false};


const img_wrappers_collection = global_imgs_wrapper.getElementsByClassName("vertical-scrolling-wrapper-board-img-wrapper-imgs-col-img");
const img_wrappers_imgs_loaded_count = {obj : 0};
let imgs_wrappers_imgs_list = [];
const global_imgs_wrapper_scrollable_fixed_height = {obj : 0};

*/
