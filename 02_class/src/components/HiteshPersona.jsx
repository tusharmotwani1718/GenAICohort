import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Bot } from 'lucide-react'

function HiteshPersona() {
    const [userText, setUserText] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [conversation, setConversation] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    const handleSendMessage = async () => {
        setSendingMessage(true);
        try {
            const newConversation = [...conversation, { role: "user", content: userText }];
            setConversation(newConversation);

            const res = await fetch('http://localhost:3001/api/persona/hitesh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatInputs: newConversation
                })
            });

            const data = await res.json();

            if (data.reply) {
                setConversation(prev => [...prev, { role: "assistant", content: data.reply }]);
            }
            setUserText('');
        } catch (error) {
            console.error(error);
        } finally {
            setSendingMessage(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (userText.trim()) {
                handleSendMessage();
            }
        }
    };

    return (
        <div className='bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white h-screen flex flex-col w-full'>
            {/* Header */}
            <div className='bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-4 py-6 sm:px-6'>
                <div className='max-w-4xl mx-auto'>
                    <div className='flex items-center justify-center gap-4 mb-4'>
                        <div className='relative'>
                            <img 
                                src="../../images/hitesh.jpeg" 
                                alt="Hitesh Choudhary" 
                                className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-gradient-to-r from-blue-400 to-purple-400'
                            />
                            <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-gray-800 rounded-full flex items-center justify-center'>
                                <div className='w-3 h-3 bg-green-400 rounded-full animate-pulse'></div>
                            </div>
                        </div>
                        <div className='text-left'>
                            <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent'>
                                Hitesh Choudhary
                            </h1>
                            <p className='text-gray-400 text-sm sm:text-base'>
                                YouTuber | Founder, Chai aur Code | Coder | Entrepreneur
                            </p>
                            <div className='flex items-center gap-2 mt-1'>
                                <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                                <span className='text-green-400 text-xs sm:text-sm'>Online</span>
                            </div>
                        </div>
                    </div>
                    <p className='text-gray-400 text-center text-sm sm:text-base'>
                        Chat with AI powered by Hitesh's knowledge
                    </p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className='flex-1 overflow-hidden'>
                <div className='h-full overflow-y-auto px-4 py-6 sm:px-6'>
                    <div className='max-w-4xl mx-auto space-y-6'>
                        {conversation.length === 0 && (
                            <div className='text-center text-gray-400 mt-20'>
                                <Bot className='w-16 h-16 mx-auto mb-4 text-gray-600' />
                                <p className='text-lg mb-2'>Start a conversation</p>
                                <p className='text-sm'>Ask anything about web development, coding, or tech!</p>
                            </div>
                        )}
                        
                        {conversation.map((message, index) => (
                            <div key={index} className={`flex gap-3 sm:gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                {message.role === "assistant" && (
                                    <div className='flex-shrink-0'>
                                        <div className='relative'>
                                            <img 
                                                src="../../images/hitesh.jpeg" 
                                                alt="Hitesh Choudhary" 
                                                className='w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover'
                                            />
                                            <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-gray-800 rounded-full'></div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${
                                    message.role === "user" 
                                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white" 
                                        : "bg-gray-800/80 text-gray-100"
                                } rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg backdrop-blur-sm border border-gray-700/30`}>
                                    <p className='text-sm sm:text-base leading-relaxed whitespace-pre-wrap'>
                                        {message.content}
                                    </p>
                                </div>
                                
                                {message.role === "user" && (
                                    <div className='flex-shrink-0'>
                                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
                                            <User className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {sendingMessage && (
                            <div className="flex gap-3 sm:gap-4 justify-start">
                                <div className='flex-shrink-0'>
                                    <div className='relative'>
                                        <img 
                                            src="../../images/hitesh.jpeg" 
                                            alt="Hitesh Choudhary" 
                                            className='w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover'
                                        />
                                        <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-gray-800 rounded-full animate-pulse'></div>
                                    </div>
                                </div>
                                <div className="bg-gray-800/80 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg backdrop-blur-sm border border-gray-700/30">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className='bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 px-4 py-4 sm:px-6 sm:py-6'>
                <div className='max-w-4xl mx-auto'>
                    <div className='flex gap-3 sm:gap-4'>
                        <div className='flex-1 relative'>
                            <textarea
                                className='w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base'
                                placeholder='Type your message here...'
                                value={userText}
                                onChange={(e) => setUserText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                rows={1}
                                style={{
                                    minHeight: '50px',
                                    maxHeight: '120px',
                                }}
                            />
                        </div>
                        <button
                            className={`px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center min-w-[50px] ${
                                userText.trim() && !sendingMessage
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25' 
                                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!userText.trim() || sendingMessage}
                            onClick={handleSendMessage}
                        >
                            {sendingMessage ? (
                                <div className='w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin'></div>
                            ) : (
                                <Send className='w-4 h-4 sm:w-5 sm:h-5' />
                            )}
                        </button>
                    </div>
                    <p className='text-xs text-gray-500 mt-2 text-center'>
                        Press Enter to send, Shift+Enter for new line
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HiteshPersona;