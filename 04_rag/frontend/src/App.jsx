import React, { useState } from "react";
import ChatBox from './components/ChatBox';
import ChatInput from './components/ChatInput';
import FileUpload from './components/FileUpload';

function App() {
  



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      {/* Warm Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-orange-900/20"></div>
        {/* safer: use inline style for complex data-URI */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative h-screen flex flex-col lg:flex-row">
        {/* Left Panel - Context Upload */}
        <div className="w-full lg:w-1/2 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-600/50">
          <div className="h-full max-h-96 lg:max-h-none">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  {/* Chai Cup Icon */}
                  <div className="relative">
                    <div className="w-6 h-6 bg-white/90 rounded-full"></div>
                    <div className="absolute top-1 left-1 w-4 h-4 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full"></div>
                    <div className="absolute -right-1 top-1 w-2 h-3 border-2 border-white/90 rounded-r-full bg-transparent"></div>
                  </div>
                </div>
                {/* Steam animation */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-px">
                    <div className="w-px h-3 bg-gradient-to-t from-amber-400/60 to-transparent animate-pulse"></div>
                    <div
                      className="w-px h-2 bg-gradient-to-t from-orange-400/50 to-transparent animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-px h-3 bg-gradient-to-t from-amber-400/40 to-transparent animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                  ChaiBook LLM
                </h1>
                <p className="text-gray-400 text-sm">AI-powered document brewing</p>
              </div>
            </div>

            <FileUpload />
          </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="w-full lg:w-1/2 flex flex-col h-full lg:h-screen">
          {/* Chat Area */}
          <div className="flex-1 p-4 lg:p-6 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <ChatBox />
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );

}

export default App;