// ----------------------------------------------- React

import { useState, createContext, useContext } from "react";




const twoFAContext = createContext(null);




function TwoFAContextProvider({children}) {


    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [mailPasswordTo2FAConfirm, setMailPasswordTo2FAConfirm] = useState(null);
    const [isInTwoFAPage, setIsInTwoFAPage] = useState(null);


    return (

        <twoFAContext.Provider
        value={{
            is2FAEnabled, setIs2FAEnabled,
            mailPasswordTo2FAConfirm, setMailPasswordTo2FAConfirm,
            isInTwoFAPage, setIsInTwoFAPage
        }}>

            {children}

        </twoFAContext.Provider>
    );
}

export default TwoFAContextProvider;

export const useTwoFAContext = () => (useContext(twoFAContext));
