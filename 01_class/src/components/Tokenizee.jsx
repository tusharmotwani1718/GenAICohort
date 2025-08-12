import { useState, useRef, useEffect } from 'react';
import { FaCopy, FaBolt, FaStar, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import generateToken from '../functions/generateToken';


function Tokenizee() {
  const [value, setValue] = useState("");
  const [token, setToken] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const inputRef = useRef(null);

  const handleGenerate = async (input) => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setShowTokens(false);
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const tokens = generateToken(input);
    setToken(tokens.toString());
    setIsGenerating(false);
    setShowTokens(true);
  };

  const copyToClipboard = async () => {
    if (token) {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isGenerating) {
      handleGenerate(value);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/20 hover:shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-400 to-purple-500 rounded-2xl mb-4 shadow-lg">
                <FaBolt className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                Tokenizee
              </h1>
              <p className="text-gray-300 text-lg flex items-center justify-center gap-2">
                <FaStar className="w-5 h-5 text-teal-400" />
                Transform your text into intelligent tokens
              </p>
            </div>

            {/* Input Section */}
            <div className="space-y-4 mb-8">
              <div className="relative group">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Enter your text to tokenize..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-all duration-300 text-lg group-hover:border-white/20 focus:bg-white/10"
                  disabled={isGenerating}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400/20 to-purple-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              <button
                onClick={() => handleGenerate(value)}
                disabled={isGenerating || !value.trim()}
                className="w-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed group transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Tokens...
                  </>
                ) : (
                  <>
                    Generate Tokens
                    <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            {token && (
              <div className={`transition-all duration-500 transform ${showTokens ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-teal-400 flex items-center gap-2">
                      <FaStar className="w-5 h-5" />
                      Generated Tokens
                    </h3>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 text-sm font-medium border border-white/10 hover:border-white/20"
                    >
                      {copied ? (
                        <>
                          <FaCheckCircle className="w-4 h-4 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                    <pre className="font-mono text-sm text-gray-200 whitespace-pre-wrap break-all leading-relaxed">
                      {token}
                    </pre>
                  </div>

                  {/* Token Stats */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                      <span>Tokens: {token.split(' ').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Characters: {token.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span>Original: "{value}"</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              Made with <span className="text-red-400 animate-pulse">♥</span> for better tokenization
            </p>
          </div>
        </div>
      </div>

     
    </div>
  );
}

export default Tokenizee;