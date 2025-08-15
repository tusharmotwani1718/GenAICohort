import React from 'react'
import { MessageCircle, ArrowRight, Code, GraduationCap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';


function Personas() {

    const navigate = useNavigate();


    return (
        <div className='bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white min-h-screen'>
            {/* Header */}
            <div className='bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-4 py-8 sm:px-6'>
                <div className='max-w-6xl mx-auto text-center'>
                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4'>
                        Choose Your AI Mentor
                    </h1>
                    <p className='text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto'>
                        Chat with AI personas powered by the knowledge of industry experts
                    </p>
                </div>
            </div>

            {/* Personas Selection */}
            <div className='px-4 py-12 sm:px-6'>
                <div className='max-w-6xl mx-auto'>
                    <div className='grid md:grid-cols-2 gap-8 lg:gap-12'>

                        {/* Hitesh Choudhary Card */}
                        <div className='group relative overflow-hidden bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10'>
                            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                            <div className='relative z-10'>
                                {/* Avatar and Status */}
                                <div className='flex items-center gap-6 mb-6'>
                                    <div className='relative'>
                                        <img
                                            src="../../images/hitesh.jpeg"
                                            alt="Hitesh Choudhary"
                                            className='w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3 border-blue-500/30 group-hover:border-blue-500/60 transition-colors duration-300'
                                        />
                                        <div className='absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-3 border-gray-800 rounded-full flex items-center justify-center'>
                                            <div className='w-3 h-3 bg-green-400 rounded-full animate-pulse'></div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className='text-2xl sm:text-3xl font-bold text-white mb-2'>
                                            Hitesh Choudhary
                                        </h2>
                                        <div className='flex items-center gap-2 text-green-400 mb-2'>
                                            <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                                            <span className='text-sm font-medium'>Online</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile */}
                                <div className='mb-6'>
                                    <p className='text-gray-300 text-base sm:text-lg mb-4'>
                                        YouTuber | Founder, Chai aur Code | Coder | Entrepreneur
                                    </p>

                                    <div className='flex items-center gap-3 mb-4'>
                                        <Code className='w-5 h-5 text-blue-400' />
                                        <span className='text-gray-400 text-sm'>Specializes in Web Development & Programming</span>
                                    </div>
                                </div>

                                {/* Topics */}
                                <div className='mb-8'>
                                    <h3 className='text-lg font-semibold text-white mb-3'>Ask about:</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {['JavaScript', 'React', 'Node.js', 'Web Development', 'Programming Career', 'Tech Entrepreneurship'].map((topic) => (
                                            <span key={topic} className='px-3 py-1.5 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30'>
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group-hover:shadow-lg group-hover:shadow-blue-500/25'
                                    onClick={() => navigate('/hitesh')}

                                >
                                    <MessageCircle className='w-5 h-5' />
                                    Start Chat with Hitesh
                                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
                                </button>
                            </div>
                        </div>

                        {/* Piyush Garg Card */}
                        <div className='group relative overflow-hidden bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10'>
                            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                            <div className='relative z-10'>
                                {/* Avatar and Status */}
                                <div className='flex items-center gap-6 mb-6'>
                                    <div className='relative'>
                                        <img
                                            src="../../images/piyush.jpeg"
                                            alt="Piyush Garg"
                                            className='w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3 border-purple-500/30 group-hover:border-purple-500/60 transition-colors duration-300'
                                        />
                                        <div className='absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-3 border-gray-800 rounded-full flex items-center justify-center'>
                                            <div className='w-3 h-3 bg-green-400 rounded-full animate-pulse'></div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className='text-2xl sm:text-3xl font-bold text-white mb-2'>
                                            Piyush Garg
                                        </h2>
                                        <div className='flex items-center gap-2 text-green-400 mb-2'>
                                            <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                                            <span className='text-sm font-medium'>Online</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile */}
                                <div className='mb-6'>
                                    <p className='text-gray-300 text-base sm:text-lg mb-4'>
                                        Building Teachyst - Platform for educators and creators | YouTuber | Educator
                                    </p>

                                    <div className='flex items-center gap-3 mb-4'>
                                        <GraduationCap className='w-5 h-5 text-purple-400' />
                                        <span className='text-gray-400 text-sm'>Specializes in Education Technology & Content Creation</span>
                                    </div>
                                </div>

                                {/* Topics */}
                                <div className='mb-8'>
                                    <h3 className='text-lg font-semibold text-white mb-3'>Ask about:</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {['EdTech', 'Content Creation', 'Teaching', 'Entrepreneurship', 'Platform Building', 'Creator Economy'].map((topic) => (
                                            <span key={topic} className='px-3 py-1.5 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30'>
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Button */}

                                <button className='w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group-hover:shadow-lg group-hover:shadow-purple-500/25'

                                    onClick={() => navigate('/piyush')}
                                        >

                                        <MessageCircle className='w-5 h-5' />
                                Start Chat with Piyush
                                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer Info */}
                <div className='text-center mt-16'>
                    <div className='bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6 max-w-2xl mx-auto'>
                        <h3 className='text-xl font-semibold text-white mb-3'>How it works</h3>
                        <p className='text-gray-400 text-sm sm:text-base'>
                            These AI personas are trained on the knowledge and expertise of real industry professionals.
                            Choose your mentor and start learning from their years of experience in an interactive chat format.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div >
  )
}

export default Personas