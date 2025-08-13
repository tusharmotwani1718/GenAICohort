import { useState, useRef, useEffect } from 'react';
import { FaCopy, FaBolt, FaStar, FaArrowRight, FaCheckCircle, FaUndo } from 'react-icons/fa';
import generateToken from '../functions/generateToken';
import decodeToken from '../functions/decodeToken';


function Tokenizee() {
  const [value, setValue] = useState("");
  const [token, setToken] = useState(null);
  const [decodeInput, setDecodeInput] = useState("");
  const [decodedResult, setDecodedResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const handleGenerate = async (input) => {
    if (!input.trim()) return;
    setIsGenerating(true);


    const tokensArray = generateToken(input);
    const response = tokensArray.join(",");
    // console.log("response")
    setToken(response);
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    if (token) {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDecodeInput = () => {
    if (!decodeInput.trim()) return;
    const tokenArray = decodeInput
      .split(",")
    const decodedText = decodeToken(tokenArray);
    setDecodedResult(decodedText);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12">
          
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
              Encode and decode your text
            </p>
          </div>

          {/* Encode Section */}
          <div className="space-y-4 mb-8">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter your text..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-all duration-300 text-lg"
              disabled={isGenerating}
            />

            <button
              onClick={() => handleGenerate(value)}
              disabled={isGenerating || !value.trim()}
              className="w-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              {isGenerating ? "Generating..." : <>Generate Tokens <FaArrowRight /></>}
            </button>

            {token && (
              <div className="bg-black/20 rounded-2xl p-6 space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-teal-400 font-semibold">Tokens:</h3>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-xl hover:bg-white/20"
                  >
                    {copied ? <FaCheckCircle className="text-green-400" /> : <FaCopy />} 
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="font-mono text-sm whitespace-pre-wrap break-all">{token}</pre>
              </div>
            )}
          </div>

          {/* Decode Section */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Paste tokens to decode..."
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 text-lg"
            />

            <button
              onClick={handleDecodeInput}
              disabled={!decodeInput.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              Decode Tokens <FaUndo />
            </button>

            {decodedResult && (
              <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
                <h3 className="text-purple-400 font-semibold mb-2">Decoded Text:</h3>
                <p className="text-lg">{decodedResult}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tokenizee;
