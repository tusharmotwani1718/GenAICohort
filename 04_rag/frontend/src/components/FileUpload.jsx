import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, FileText, BookOpen } from "lucide-react";
import axios from "axios";
import useFile from "../../context-api/FileContext/FileContext.js";
import { useEffect } from "react";


function FileUpload() {
  const [mode, setMode] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [textName, setTextName] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [urlName, setUrlName] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const selectedFile = watch("document");

  const { uploadFile } = useFile();

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setTextInput("");
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setButtonLoading(true);
      if (mode === "text") {

        const response = await axios.post(`${import.meta.env.VITE_API_UPLOAD_TEXT}`, {
          text: textInput,
          textName: textName
        })


        uploadFile(textName); // upload the context.

        alert("text uploaded successfully");

      }

      else if (mode === "url") {
        const response = await axios.post(`${import.meta.env.VITE_API_UPLOAD_URL}`, {
          url: urlInput,
          urlName
        })


        uploadFile(urlName); // upload the context.

        alert("url uploaded successfully");
      }

      else {
        const file = data.document[0];
        const formData = new FormData();
        formData.append("file", file);
        // console.log(file);

        const response = await axios.post(`${import.meta.env.VITE_API_UPLOAD_FILES}`, formData, {
          // headers: {
          //   'Content-Type': 'application/json'
          // }
        })

        uploadFile(data.document[0].name); // upload the context.

        alert("file uploaded successfully");

        // console.log("File upload response:", response.data);

      }
    } catch (error) {
      console.error("Error: ", error);
    }
    finally{
      setButtonLoading(false);
    }
  };

  // useEffect(() => {
  //   // console.log("filename:" , fileName)
  // }, [fileName])

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-600/50 rounded-3xl p-6 h-full flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-100">Add Context</h2>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-gray-700/60 rounded-xl p-1 mb-6 border border-gray-600/30">
        <button
          onClick={() => handleModeChange("text")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${mode === "text"
            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
            : "text-gray-300 hover:text-white hover:bg-gray-600/30"
            }`}
        >
          <FileText className="w-4 h-4" />
          Text
        </button>
        <button
          onClick={() => handleModeChange("url")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${mode === "url"
            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
            : "text-gray-300 hover:text-white hover:bg-gray-600/30"
            }`}
        >
          URL
        </button>
        <button
          onClick={() => handleModeChange("file")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${mode === "file"
            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
            : "text-gray-300 hover:text-white hover:bg-gray-600/30"
            }`}
        >
          <Upload className="w-4 h-4" />
          File
        </button>
      </div>


      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex-1 mb-6">
          {mode !== "file" ? (
            mode === "text" ? (
              <textarea
                className="w-full h-full bg-gray-700/40 border border-gray-600/40 text-white rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400/50 placeholder-gray-400 text-sm backdrop-blur-sm shadow-inner"
                placeholder="Paste your text content here to brew better AI responses..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            ) : (
              <input
                type="url"
                className="w-full h-full bg-gray-700/40 border border-gray-600/40 text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400/50 placeholder-gray-400 text-sm backdrop-blur-sm shadow-inner"
                placeholder="Paste your URL here to brew better AI responses..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            )
          ) : (
            <div className="h-full relative">
              <input
                type="file"
                id="fileInput"
                accept=".pdf,.csv,.ppt"
                {...register("document", {
                  required: "Please select a file",
                  validate: {
                    fileType: (files) =>
                      files && ["application/pdf", "text/csv", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]
                        .includes(files[0]?.type) || "Only PDF, CSV, or PPT allowed",
                  },
                })}
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-600/60 rounded-2xl p-6 text-gray-300 hover:border-amber-400/60 hover:text-amber-300 transition-all duration-300 cursor-pointer bg-gray-700/30 backdrop-blur-sm group"
              >
                <div className="w-16 h-16 bg-gray-600/50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors duration-300">
                  <Upload className="w-8 h-8 group-hover:text-amber-400 transition-colors" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-medium">Click to upload file</p>
                  <p className="text-xs text-gray-400">PDF, CSV, PPT only</p>
                </div>
                {selectedFile?.length > 0 && (
                  <div className="mt-4 text-sm text-amber-400 font-medium truncate max-w-48">
                    {selectedFile[0].name}
                  </div>
                )}
                {errors.document && (
                  <p className="mt-2 text-xs text-red-400">{errors.document.message}</p>
                )}
              </label>
            </div>
          )}
        </div>


        {/* Text Name */}
        {
          mode == "text" && (
            <>

              <input type="text" name="textName" className="bg-gray-700/40 border border-gray-600/40 text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400/50 placeholder-gray-400 text-sm backdrop-blur-sm shadow-inner my-4"
                placeholder="Give your text a name"
                value={textName}
                onChange={(e) => setTextName(e.target.value)}
                required
              />
            </>

          )
        }

        {/* url name */}
        {
          mode == "url" && (
            <>

              <input type="text" name="urlName" className="bg-gray-700/40 border border-gray-600/40 text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400/50 placeholder-gray-400 text-sm backdrop-blur-sm shadow-inner my-4"
                placeholder="Give your URL a name"
                value={urlName}
                onChange={(e) => setUrlName(e.target.value)}
                required
              />
            </>
          )
        }





        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            (mode === "text" && !textInput.trim()) ||
            (mode === "file" && !selectedFile)
          }
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === "text" || mode === "url" ? `${buttonLoading ? "Brewing..." : "Brew Context"}` : `${buttonLoading ? "Uploading..." : "Upload File"}`}
        </button>
      </form>
    </div >
  );
}

export default FileUpload;
