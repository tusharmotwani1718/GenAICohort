import { createContext, useContext } from "react";


export const FileContext = createContext({
    contentType: "text", // rawText or File
    isFileUploaded: false,
    fileName: null,
    uploadFile: () => {},
})


// Provide the context:
export const FileProvider = FileContext.Provider;

// custom hook/function to use the context:
export default function useFile() {
    return useContext(FileContext);
}