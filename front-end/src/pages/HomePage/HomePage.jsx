// ----------------------------------------------- CSS

import "./HomePage.css";

// ----------------------------------------------- External media

import tb_main_img from "../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../assets/ToolBar/Collections.jpg";

import sw_img1 from "../../assets/HomePage/Model1.jpg";
import sw_img2 from "../../assets/HomePage/Model2.jpg";
import sw_img3 from "../../assets/HomePage/Model3.jpg";

import hswg_img1 from "../../assets/HomePage/Model1.jpg";
import hswg_img2 from "../../assets/HomePage/Model2.jpg";
import hswg_img3 from "../../assets/HomePage/Model3.jpg";
import hswg_img4 from "../../assets/HomePage/Model4.jpg";
import hswg_img5 from "../../assets/HomePage/Model5.png";
import hswg_img6 from "../../assets/HomePage/Model6.jpg";
import hswg_img7 from "../../assets/HomePage/Model7.jpg";
import hswg_img8 from "../../assets/HomePage/Model8.jpg";

// ----------------------------------------------- React

import { useEffect, useRef } from "react";

// ----------------------------------------------- Components

import ToolBar from "../../components/ToolBar/ToolBar.jsx"

import VerticalScrollingWrapperFollowerParallax from "../../components/VerticalScrollingWrapperFollowerParallax/VerticalScrollingWrapperFollowerParallax.jsx";
import Banner from "../../components/Banner/Banner.jsx";
import SlidesWrapper from "../../components/SlidesWrapper/SlidesWrapper.jsx";
import ScrollingBanner from "../../components/ScrollingBanner/ScrollingBanner.jsx";
import WrapperDetails from "../../components/WrapperDetails/WrapperDetails.jsx";
import WrapperAccessoriesDiscovery from "../../components/WrapperAccessoriesDiscovery/WrapperAccessoriesDiscovery.jsx";
import WrapperClothesDiscovery from "../../components/WrapperClothesDiscovery/WrapperClothesDiscovery.jsx";
import HorizontalScrollingWrapperGallery from "../../components/HorizontalScrollingWrapperGallery/HorizontalScrollingWrapperGallery.jsx";
import ReviewsWrapper from "../../components/ReviewsWrapper/ReviewsWrapper.jsx";
import AnimationWrapper from "../../components/AnimationWrapper/AnimationWrapper.jsx";

import Footer from "../../components/Footer/Footer.jsx";

// ----------------------------------------------- Animation

import { homepage_animation_page_1 } from "../../utils/AnimationWrapper/AnimationPages/HomePageAnimation/HomePageAnimationPage1.js";
import { homepage_animation_page_2 } from "../../utils/AnimationWrapper/AnimationPages/HomePageAnimation/HomePageAnimationPage2.js";
import { homepage_animation_page_3 } from "../../utils/AnimationWrapper/AnimationPages/HomePageAnimation/HomePageAnimationPage3.js";




function HomePage() {




    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];


    const maincontent = useRef(null);


    const vswfp_trigger_height_percentage = 0.2;

    const sw_imgs_list = [sw_img1, sw_img2, sw_img3];

    const hswg_elements_list = [

        [hswg_img1, "Solar Glow", "Embrace the warmth of the sun with our tangerine-colored overshirt. Lightweight and vibrant, it brightens up your summer days and turns heads wherever you go."], 
        [hswg_img2, "Fire Sunset", "Our long orange jackets are inspired by evenings by the sea. A style that is both soothing and radiant."],
        [hswg_img3, "Amber Breeze", "Wrap yourself in softness with our orange-colored shawl, designed to combine comfort and elegance. The perfect companion for any season, it warms you up as much as it brightens your style."], 
        [hswg_img4, "Urban Flame", "An orange coat with a flawless drape to assert your presence, even on gray days. Elegance has never had so much character."], 
        [hswg_img5, "Streetwear Energy", "This bright orange hoodie combines urban comfort with bold style. With its modern cut and vibrant energy, it transforms every outing into an authentic moment."], 
        [hswg_img6, "Soft Radiance", "A soft orange suit that combines elegance and boldness. Ideal for a confident look at the office or a chic evening out."], 
        [hswg_img7, "Orange Blossom", "Our orange quilted winter coat envelops you in softness while remaining ultra-stylish. Perfect for facing the cold with radiance and comfort."], 
        [hswg_img8, "Daily Radiance", "Add a touch of energy to your look with these bright orange pants. Comfortable and modern, they can be worn to the office or around town for a bold style."],
    ];
    const hswg_trigger_height_percentage = 0.5;
    const hswg_offset = 500;

    const aw_trigger_height_percentage = 0.4;

    const homepage_animation_page_list = [homepage_animation_page_1, homepage_animation_page_2, homepage_animation_page_3];




    useEffect(() => {


        const timeout_id = {obj : null};
        const r_maincontent = maincontent.current;


        if (r_maincontent) {

            const homepage_scrolling_position = parseInt(sessionStorage.getItem("homepage_scrolling_position")) || null;

            if (homepage_scrolling_position !== null) r_maincontent.scrollTo(0, parseInt(homepage_scrolling_position, 10));


            const maincontent_scroll_handler = () => {

                if (homepage_scrolling_position) {

                    if (r_maincontent.scrollTop.toString() !== homepage_scrolling_position) {

                        timeout_id.obj = setTimeout(() => {

                            sessionStorage.setItem("homepage_scrolling_position", r_maincontent.scrollTop.toString());

                        }, 1000);
                    }
                }
                else {

                    sessionStorage.setItem("homepage_scrolling_position", r_maincontent.scrollTop.toString());
                }
            };

            r_maincontent.addEventListener("scroll", maincontent_scroll_handler);


            return () => {

                if (timeout_id.obj) clearTimeout(timeout_id.obj);

                r_maincontent.removeEventListener("scroll", maincontent_scroll_handler);
            }
        }

    }, []);

    


    return (

        <div 
        className="homepage">

            <div 
            className="homepage-wrapper">

                <ToolBar
                images={tb_imgs_list}/>


                <div 
                ref={maincontent} 
                className="maincontent">

                    <VerticalScrollingWrapperFollowerParallax 
                    trigger_height_percentage={vswfp_trigger_height_percentage} 
                    maincontent={maincontent}/>

                    <Banner/>

                    <SlidesWrapper
                    images={sw_imgs_list}/>

                    <ScrollingBanner/>

                    <WrapperDetails/>

                    <WrapperAccessoriesDiscovery/>

                    <WrapperClothesDiscovery/>

                    <HorizontalScrollingWrapperGallery 
                    elements_list={hswg_elements_list} 
                    trigger_height_percentage={hswg_trigger_height_percentage} 
                    maincontent={maincontent} 
                    offset={hswg_offset}/>

                    <ReviewsWrapper/>

                    <h5 className="homepage-animation-section"> Our Process In Animation </h5>

                    <AnimationWrapper
                    trigger_height_percentage={aw_trigger_height_percentage} 
                    maincontent={maincontent}
                    animation_page_list={homepage_animation_page_list}/>

                </div>


                <Footer/>
                
            </div>

        </div>
    );
}

export default HomePage;
