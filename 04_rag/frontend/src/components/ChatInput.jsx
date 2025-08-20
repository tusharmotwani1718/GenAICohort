import React, { useState } from "react";
import { Send } from "lucide-react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    onSend(input);
    setInput("");
  };

  return (
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
          disabled={!input.trim()}
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;