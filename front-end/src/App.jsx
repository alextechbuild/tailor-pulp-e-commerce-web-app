// ----------------------------------------------- Environment variables

const back_end_url = import.meta.env.VITE_BACKEND_URL;

// ----------------------------------------------- Environment variables

const google_oauth_client_id = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

// ----------------------------------------------- CSS

import './App.css';

// ----------------------------------------------- React

import { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from "react-router-dom";

// ----------------------------------------------- Librairies externes

import { GoogleOAuthProvider } from "@react-oauth/google";

// ----------------------------------------------- Bannière Cookies

import CookieBanner from './components/CookieBanner/CookieBanner.jsx';

// ----------------------------------------------- Pages

import HomePage from './pages/HomePage/HomePage.jsx';
import AboutPage from './pages/AboutPage/AboutPage.jsx';
import ContactPage from './pages/ContactPage/ContactPage.jsx';
import LoggingPage from './pages/LoggingPage/LoggingPage.jsx';
import TwoFAPage from './pages/TwoFAPage/TwoFAPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage.jsx';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage.jsx';
import EditPage from './pages/EditPage/EditPage.jsx';

// ----------------------------------------------- Shop Pages

import JewelleryPage from './pages/Shop/Accessories/JewelleryPage/JewelleryPage.jsx';
import WinterPage from './pages/Shop/Accessories/WinterPage/WinterPage.jsx';
import GardenPage from './pages/Shop/Accessories/GardenPage/GardenPage.jsx';

import HatsPage from './pages/Shop/Clothes/HatsPage/HatsPage.jsx';
import TopsPage from './pages/Shop/Clothes/TopsPage/TopsPage.jsx';
import BottomsPage from './pages/Shop/Clothes/BottomsPage/BottomsPage.jsx';

import WinterCollectionPage from './pages/Shop/Exclusive Collections/WinterCollectionPage/WinterCollectionPage.jsx';
import SummerCollectionPage from './pages/Shop/Exclusive Collections/SummerCollectionPage/SummerCollectionPage.jsx';

import ProductPage from './pages/ProductPage/ProductPage.jsx';




import PrivacyPolicy from './components/Footer/PrivacyPolicy/PrivacyPolicy.jsx';
import ShippingPolicies from './components/Footer/ShippingPolicies/ShippingPolicies.jsx';
import RefundPolicy from './components/Footer/RefundPolicy/RefundPolicy.jsx';
import TermsOfSale from './components/Footer/TermsOfSale/TermsOfSale.jsx';
import LegalNotices from './components/Footer/LegalNotices/LegalNotices.jsx';

import SuccessPage from './pages/Payment/SuccessPage/SuccessPage.jsx';
import CancelPage from './pages/Payment/CancelPage/CancelPage.jsx';

import TestPage from './pages/TestPage/TestPage.jsx';

// ----------------------------------------------- Contexts

import ClientContextProvider from './contexts/ClientContextProvider/ClientContextProvider.jsx';
import SelectedProductContextProvider from './contexts/SelectedProductContextProvider/SelectedProductContextProvider.jsx';
import TwoFAContextProvider from './contexts/TwoFAContextProvider/TwoFAContextProvider.jsx';




function App() {
  

  const [JewelleryPageImgs, setJewelleryPageImgs] = useState(() => {

    const stored = sessionStorage.getItem("JewelleryPageImgs");
    return stored ? JSON.parse(stored) : null;
  });

  const [WinterPageImgs, setWinterPageImgs] = useState(() => {

    const stored = sessionStorage.getItem("WinterPageImgs");
    return stored ? JSON.parse(stored) : null;
  });

  const [GardenPageImgs, setGardenPageImgs] = useState(() => {

    const stored = sessionStorage.getItem("GardenPageImgs");
    return stored ? JSON.parse(stored) : null;
  });

  const [HatsPageImgs, setHatsPageImgs] = useState(() => {

    const stored = sessionStorage.getItem("HatsPageImgs");
    return stored ? JSON.parse(stored) : null;
  });

  const [TopsPageImgs, setTopsPageImgs] = useState(() => {

    const stored = sessionStorage.getItem("TopsPageImgs");
    return stored ? JSON.parse(stored) : null;
  });

  const [BottomsPageImgs, setBottomsPageImgs] = useState(() => {

    const stored = sessionStorage.getItem("BottomsPageImgs");
    return stored ? JSON.parse(stored) : null;
  });

  const [WinterCollectionPageImgs, setWinterCollectionPageImgs] = useState(() => {

    const stored = sessionStorage.getItem("WinterCollectionPageImgs");
    return stored ? JSON.parse(stored) : null;
  });

  const [SummerCollectionPageImgs, setSummerCollectionPageImgs] = useState(() => {

    const stored = sessionStorage.getItem("SummerCollectionPageImgs");
    return stored ? JSON.parse(stored) : null;
  });




  useEffect(() => {

    // Pour vérifier si l'application se lance pour la première fois dans la session
    let isFirstLaunch = JSON.parse(sessionStorage.getItem("isFirstLaunch") || true);

    // On souhaite charger les images une seule fois dans la session : au démarrage de l'application seulement, pas si l'utilisateur refresh
    if (isFirstLaunch) {

      async function load_categories_imgs(category, setter, name) {

        try {

          const back_end_response = await fetch(`${back_end_url}/firstLoading/loadImgs?Category=${category}`, {

            method : "GET",
            headers : {

              "Content-type" : "application/json",
              "Accept" : "application/json"
            }
          });

          if (!back_end_response.ok) {

            throw new Error(`Jewellery Imgs loading : ${back_end_response.status}`);
          }

          const result = await back_end_response.json();

          if (result?.message) {

            setter(result.message)
            sessionStorage.setItem(name, JSON.stringify(result.message));
          }
        }
        catch(error) {

          throw new Error(`${error}`);
        }
      }

      isFirstLaunch = false;
      sessionStorage.setItem("isFirstLaunch", isFirstLaunch.toString());

      load_categories_imgs('Jewellery', setJewelleryPageImgs, "JewelleryPageImgs");
      load_categories_imgs('Winter', setWinterPageImgs, "WinterPageImgs");
      load_categories_imgs('Garden', setGardenPageImgs, "GardenPageImgs");
      load_categories_imgs('Hats', setHatsPageImgs, "HatsPageImgs");
      load_categories_imgs('Tops', setTopsPageImgs, "TopsPageImgs");
      load_categories_imgs('Bottoms', setBottomsPageImgs, "BottomsPageImgs");
      load_categories_imgs('2025SummerCollection', setSummerCollectionPageImgs, "SummerCollectionPageImgs");
      load_categories_imgs('2025WinterCollection', setWinterCollectionPageImgs, "WinterCollectionPageImgs");
    }

  }, []);




  return (

      <div
      className="app">

        <CookieBanner/>

        <GoogleOAuthProvider clientId={google_oauth_client_id}>

          <ClientContextProvider>
            <TwoFAContextProvider>


              <Routes>

                  <Route 
                  path="/" 
                  element={<HomePage/>}/>


                  <Route 
                  element={
                    <SelectedProductContextProvider>
                      <Outlet/>
                    </SelectedProductContextProvider>
                  }>

                    <Route 
                    path="/accessories-jewellery-page" 
                    element={<JewelleryPage VerticalScrollingBoardImgs={JewelleryPageImgs}/>}/>

                    <Route 
                    path="/accessories-winter-page" 
                    element={<WinterPage VerticalScrollingBoardImgs={WinterPageImgs}/>}/>

                    <Route 
                    path="/accessories-garden-page" 
                    element={<GardenPage VerticalScrollingBoardImgs={GardenPageImgs}/>}/>


                    <Route 
                    path="/clothes-hats-page" 
                    element={<HatsPage VerticalScrollingBoardImgs={HatsPageImgs}/>}/>

                    <Route 
                    path="/clothes-tops-page" 
                    element={<TopsPage VerticalScrollingBoardImgs={TopsPageImgs}/>}/>

                    <Route 
                    path="/clothes-bottoms-page" 
                    element={<BottomsPage VerticalScrollingBoardImgs={BottomsPageImgs}/>}/>


                    <Route 
                    path="/2025-winter-collection-page" 
                    element={<WinterCollectionPage VerticalScrollingBoardImgs={WinterCollectionPageImgs}/>}/>

                    <Route 
                    path="/2025-summer-collection-page" 
                    element={<SummerCollectionPage VerticalScrollingBoardImgs={SummerCollectionPageImgs}/>}/>




                    <Route 
                    path="/product-page" 
                    element={<ProductPage/>}/>

                  </Route>


                  <Route 
                  path="/about-page" 
                  element={<AboutPage/>}/>

                  <Route 
                  path="/contact-page" 
                  element={<ContactPage/>}/>
                  

                  <Route 
                  path="/logging-page" 
                  element={<LoggingPage/>}/>

                  <Route 
                  path="/twofa-page" 
                  element={<TwoFAPage/>}/>

                  <Route 
                  path="/reset-password-page" 
                  element={<ResetPasswordPage/>}/>

                  <Route 
                  path="/shopping-cart-page" 
                  element={<ShoppingCartPage/>}/>

                  <Route 
                  path="/edit-page" 
                  element={<EditPage/>}/>


                  <Route 
                  path="/privacy-policy" 
                  element={<PrivacyPolicy/>}/>

                  <Route 
                  path="/shipping-policies" 
                  element={<ShippingPolicies/>}/>

                  <Route 
                  path="/refund-policy" 
                  element={<RefundPolicy/>}/>

                  <Route 
                  path="/terms-of-sale" 
                  element={<TermsOfSale/>}/>

                  <Route 
                  path="/legal-notices" 
                  element={<LegalNotices/>}/>


                  <Route 
                  path="/success-page" 
                  element={<SuccessPage/>}/>

                  <Route 
                  path="/cancel-page" 
                  element={<CancelPage/>}/>

                  <Route 
                  path="/test-page" 
                  element={<TestPage/>}/>

              </Routes>

            </TwoFAContextProvider>
          </ClientContextProvider>

        </GoogleOAuthProvider>

      </div>
  );
}

export default App;
