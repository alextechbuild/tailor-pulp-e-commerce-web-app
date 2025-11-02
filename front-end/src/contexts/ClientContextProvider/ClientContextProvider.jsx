// ----------------------------------------------- React

import { useState, createContext, useContext } from "react";




const clientContext = createContext(null);




function ClientContextProvider({children}) {


    const [token, setToken] = useState(null);
    const [clientFirstName, setClientFirstName] = useState(null);
    const [shoppingCart, setShoppingCart] = useState(null);
    const [isClientSubscribedToNewsletter, setIsClientSubscribedToNewsletter] = useState(null);


    return (

        <clientContext.Provider
        value={{
            token, setToken,
            clientFirstName, setClientFirstName,
            shoppingCart, setShoppingCart,
            isClientSubscribedToNewsletter, setIsClientSubscribedToNewsletter
        }}>

            {children}

        </clientContext.Provider>
    );
}

export default ClientContextProvider;

export const useClientContext = () => (useContext(clientContext));
