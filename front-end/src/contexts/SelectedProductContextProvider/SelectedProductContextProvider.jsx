// ----------------------------------------------- React

import { createContext, useContext, useState } from "react";




const selectedProductContext = createContext(null);




function SelectedProductContextProvider({children}) {

    const [selectedProduct, setSelectedProduct] = useState(null);

    return (

        <selectedProductContext.Provider 
        value={{
            selectedProduct, setSelectedProduct
        }}>

            {children}
            
        </selectedProductContext.Provider>
    );
}

export default SelectedProductContextProvider;

export const useSelectedProductContext = () => (useContext(selectedProductContext));
