// ----------------------------------------------- CSS

import "./AboutPage.css";

// ----------------------------------------------- External media

import tb_main_img from "../../assets/ToolBar/Main.jpg";
import tb_accessories_img from "../../assets/ToolBar/Accessories.jpg";
import tb_clothes_img from "../../assets/ToolBar/Clothes.jpg";
import tb_collections_img from "../../assets/ToolBar/Collections.jpg";

import ecofriendly_img from "../../assets/AboutPage/ecofriendly.png";
import highquality_img from "../../assets/AboutPage/highquality.png";

import design from "../../assets/AboutPage/design.jpg";
import packaging from "../../assets/AboutPage/packaging.jpg";

import member1 from "../../assets/AboutPage/member1.png";
import member2 from "../../assets/AboutPage/member2.png";
import member3 from "../../assets/AboutPage/member3.png";
import member4 from "../../assets/AboutPage/member4.png";
import member5 from "../../assets/AboutPage/member5.png";

// ----------------------------------------------- React

import { useEffect, useRef } from "react";

// ----------------------------------------------- Components

import ToolBar from "../../components/ToolBar/ToolBar.jsx"

import VerticalScrollingWrapperGallery from "../../components/VerticalScrollingWrapperGallery/VerticalScrollingWrapperGallery.jsx";
import AnimationWrapper from "../../components/AnimationWrapper/AnimationWrapper.jsx";

import Footer from "../../components/Footer/Footer.jsx";

// ----------------------------------------------- Global Utils

import { animate_letters } from "../../utils/AnimateWordsUtils.js";

// ----------------------------------------------- Animation

import { homepage_animation_page_1 } from "../../utils/AnimationWrapper/AnimationPages/HomePageAnimation/HomePageAnimationPage1.js";
import { homepage_animation_page_2 } from "../../utils/AnimationWrapper/AnimationPages/HomePageAnimation/HomePageAnimationPage2.js";
import { homepage_animation_page_3 } from "../../utils/AnimationWrapper/AnimationPages/HomePageAnimation/HomePageAnimationPage3.js";




function AboutPage() {


    const tb_imgs_list = [tb_main_img, tb_accessories_img, tb_clothes_img, tb_collections_img];

    const vswg_img_list = [packaging, design];
    const trigger_height_percentage = 0.5;
    const offset = [150];
    const about_page_maincontent_offset = 200;

    const about_page_maincontent = useRef(null);

    const p_list = useRef([]);


    const aw_trigger_height_percentage = 0.4;
    
    const aboutpage_animation_page_list = [homepage_animation_page_1, homepage_animation_page_2, homepage_animation_page_3];




    useEffect(() => {

        if (p_list.current && Array.isArray(p_list.current) && p_list.current.length > 0) {

            for (let i = 0 ; i < p_list.current.length ; i ++) {

                animate_letters(p_list.current[i], 0.5);
            }
        }

    }, []);
    


    
    return (

        <div 
        className="about-page">

            <div 
            className="about-page-wrapper">

                <ToolBar
                images={tb_imgs_list}/>


                <div 
                ref={about_page_maincontent} 
                className="about-page-maincontent">

                    <div 
                    className="about-page-maincontent-strip">
                        <h4 className="h4-1"> <p ref={(el) => (p_list.current[0] = el)}> Tailor'Pulp </p> </h4>
                        <h4 className="h4-2"> <p ref={(el) => (p_list.current[1] = el)}> - About Us - </p> </h4>
                    </div>

                    <div 
                    className="about-page-maincontent-wrapper">

                        <div 
                        className="about-page-maincontent-wrapper-story">

                            <h5> Tailor Pulp : The Creative Pulp of Fashion </h5>
                            <p> Tailor Pulp is a company offering a unique perspective on fashion. Born from the ambition of its founder, the brand's mission is to reimagine the DORfic style and adapt it to the values of slow fashion. For us, colour is not a choice, but a conviction: orange is the symbol of energy, a fruit whose pulp inspires vitality. Like this sweetness that awakens the senses, each of the brand's creations invites us to consume differently — with boldness, awareness and vibrancy. </p>
                        </div>

                        <div 
                        className="about-page-maincontent-wrapper-products">
                            
                            <div 
                            className="about-page-maincontent-wrapper-product">
                                <img src={ecofriendly_img} alt="Eco-friendly image"/>
                                <h5> <span className="local-bold"> Eco-friendly </span> Clothing </h5>
                            </div>
                            <div 
                            className="about-page-maincontent-wrapper-product">
                                <img src={highquality_img} alt="High-quality image"/>
                                <h5> <span className="local-bold"> High-quality </span> Textiles </h5>
                            </div>

                        </div>

                        <VerticalScrollingWrapperGallery 
                        images={vswg_img_list} 
                        trigger_height_percentage={trigger_height_percentage} 
                        maincontent={about_page_maincontent} 
                        offset={offset}
                        maincontent_offset={about_page_maincontent_offset}/>

                        <div 
                        className="about-page-maincontent-wrapper-members">

                            <h5> Our Team </h5>

                            <div 
                            className="about-page-maincontent-wrapper-members-imgs-wrapper">

                                <div 
                                className="about-page-maincontent-wrapper-members-imgs-wrapper-img">
                                    <img src={member1} alt='member1'/>
                                    <h5> Alex M. </h5>
                                    <h5> Founder & Creative Director </h5>
                                    <p> 
                                        He oversees the collections, defines the artistic vision and ensures that each creation embodies the brand's bold 
                                        and “pulpy” spirit 
                                    </p>
                                </div>
                                <div 
                                className="about-page-maincontent-wrapper-members-imgs-wrapper-img">
                                    <img src={member2} alt='member2'/>
                                    <h5> Camille L. </h5>
                                    <h5> Communications & Brand Manager </h5>
                                    <p> 
                                        She orchestrates communication campaigns, visual storytelling and brand consistency on social media.
                                    </p>
                                </div>
                                <div 
                                className="about-page-maincontent-wrapper-members-imgs-wrapper-img">
                                    <img src={member3} alt='member3'/>
                                    <h5> Lucia B. </h5>
                                    <h5> Innovation & Materials Manager </h5>
                                    <p> 
                                        She researches innovative and sustainable fibres, designs prototypes and tests natural dyeing processes that give the brand 
                                        its vibrant signature.
                                    </p>
                                </div>
                                <div 
                                className="about-page-maincontent-wrapper-members-imgs-wrapper-img">
                                    <img src={member4} alt='member4'/>
                                    <h5> Sarah J. </h5>
                                    <h5> Workshop Manager & Senior Seamstress </h5>
                                    <p> 
                                        She manages the workshop, trains young artisans and ensures the impeccable quality of the pieces produced.
                                    </p>
                                </div>
                                <div 
                                className="about-page-maincontent-wrapper-members-imgs-wrapper-img">
                                    <img src={member5} alt='member5'/>
                                    <h5> Zara E. </h5>
                                    <h5> Sustainable Development Manager </h5>
                                    <p> 
                                        He oversees environmental strategy, material traceability and partnerships with players in the circular economy.
                                    </p>
                                </div>

                            </div>

                        </div>

                        <div 
                        className="about-page-maincontent-wrapper-animation">

                            <h5 className="homepage-animation-section"> Our Process In Animation </h5>

                            <AnimationWrapper
                            trigger_height_percentage={aw_trigger_height_percentage} 
                            maincontent={about_page_maincontent}
                            animation_page_list={aboutpage_animation_page_list}/>
                            
                        </div>

                    </div>

                </div>


                <Footer/>

            </div>

            <div className="about-page-strip-1-overlay"></div>
            <div className="about-page-strip-2-overlay"></div>
            <div className="about-page-strip-3-overlay"></div>
            <div className="about-page-strip-4-overlay"></div>

        </div>
    );
}

export default AboutPage;
