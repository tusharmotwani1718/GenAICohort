import React, { useState } from "react";
import FileUpload from './components/FileUpload';
import ChatBox from './components/ChatBox';
import ChatInput from './components/ChatInput';
// You may import an SVG for the chai cup or use an emoji ☕ as a placeholder.

function App() {
  // If you handle messages/responds via props, pass state to ChatBox and ChatInput as before
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    setMessages([...messages, { sender: 'user', text }]);
    // Example: Call your backend for a response and append it after
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-950 to-zinc-900 flex text-white font-sans">
      {/* Left: Upload panel */}
      <div className="w-full max-w-md xl:max-w-lg 2xl:max-w-xl h-screen flex flex-col border-r border-gray-800 px-8 py-10 bg-gray-900/80 backdrop-blur-xl shadow-lg relative">
        {/* App Branding */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg">
            {/* Replace with SVG or emoji */}
            <span className="text-3xl">☕</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-orange-400 tracking-tight leading-tight">ChaiBook <span className="text-white">LLM</span></h1>
            <span className="text-xs uppercase tracking-wider text-orange-200 opacity-80 font-semibold">AI-powered document brewing</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col h-0 min-h-0 overflow-y-auto">
          <FileUpload />
        </div>
        {/* Fine-print or version at bottom */}
        <div className="pt-8 text-xs text-gray-500 font-semibold text-center">
          © {new Date().getFullYear()} ChaiBookLLM
        </div>
      </div>

      {/* Right: Chat column */}
      <div className="flex-1 h-screen flex flex-col relative bg-gradient-to-br from-gray-950 via-gray-900/60 to-gray-950/70">
        {/* Chat Panel */}
        <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col justify-end">
          <ChatBox messages={messages} />
        </div>
      </div>
    </div>
  );
}

export default App;
