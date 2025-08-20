import { useState, useCallback } from "react";
import { FileProvider as Provider } from "./FileContext.js";



export default function FileContextWrapper({ children }) {
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [fileName, setFileName] = useState(null);
    

    // upload file:
    const uploadFile = useCallback((fileName = null) => {
       setIsFileUploaded(true);
       setFileName(fileName);
    })

   

    return (
        <Provider value={{ isFileUploaded, fileName, uploadFile }}>
            {children}
        </Provider>
    )
}


