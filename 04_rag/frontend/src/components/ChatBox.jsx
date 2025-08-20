import React, { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import useFile from "../../context-api/FileContext/FileContext.js";
import axios from "axios";

function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const { fileName } = useFile();

  const handleSend = async () => {
    try {
      if (input.trim() === "" || !fileName) return;

      // Add the user message to local state immediately
      const newUserMessage = { role: "user", content: input };
      setMessages((prev) => [...prev, newUserMessage]);

      // Call backend with existing + new user message
      const response = await axios.post(
        `${import.meta.env.VITE_API_CHAT}`,
        {
          fileName,
          userQuery: input,
          inputs: [...messages, newUserMessage],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success === true) {
        const message = response.data.message;

        // Add assistant's reply to chat
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: message },
        ]);
      }

      setInput("");
    } catch (error) {
      console.error("Chat error:", error);
    }
  };

  return (
    <>
      {fileName && <h2 className="mb-2">Current Context: {fileName}</h2>}

      <div className="flex flex-col gap-4 h-full">
        {messages.length === 0 ? (
          // Empty state
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-100">
                  Welcome to ChaiBook LLM
                </h3>
                <p className="text-gray-400 text-sm max-w-md">
                  Start brewing conversations by typing below. Upload documents
                  or text to provide rich context for better responses.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Messages
          <div className="flex-1 space-y-4 pb-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-orange-500/20"
                      : "bg-gray-800/70 text-gray-100 backdrop-blur-sm border border-gray-700/50"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 lg:p-6 border-t border-gray-600/50 bg-gray-900/60 backdrop-blur-sm">
        <div className="relative">
          <div className="flex items-center gap-3 bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-2 shadow-xl">
            <input
              type="text"
              className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-3 focus:outline-none text-sm"
              placeholder="Ask ChaiBook LLM anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || !fileName}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatBox;
