import { type FC } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection: FC = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gray-900 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    
                    {/* Left: Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                            Have your <br className="hidden lg:block" />
                            <span className="text-blue-500">best chat</span> ever.
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Fast, easy & unlimited team chat. Connect instantly with friends and colleagues globally in a secure environment.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                            <Link
                                to="/auth?mode=login"
                                className="px-8 py-4 text-lg font-semibold bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/auth?mode=register"
                                className="px-8 py-4 text-lg font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
                            >
                                Sign Up Free 
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Social Proof / Trust Indicators */}
                        <div className="flex items-center justify-center lg:justify-start gap-6 text-gray-500 text-sm font-medium">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="text-blue-500 w-5 h-5" /> Free for ever
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="text-blue-500 w-5 h-5" /> With Secured authentication
                            </span>
                        </div>
                    </div>

                    {/* Right: Dynamic Image Grid (Refencing cp1.png style) */}
                    <div className="relative hidden lg:block h-[600px]">
                         {/* Decorative Dots Pattern */}
                        <div className="absolute top-0 right-0 grid grid-cols-6 gap-2 opacity-30">
                            {[...Array(24)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            ))}
                        </div>

                        {/* Main Portrait */}
                        <div className="absolute top-10 right-10 w-64 h-80 bg-gray-800 rounded-[2rem] overflow-hidden border-4 border-gray-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
                            <img 
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" 
                                alt="User Portrait" 
                                className="w-full h-full object-cover"
                            />
                            {/* Floating Badge */}
                            <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur-md p-3 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <p className="text-xs text-white font-medium">"Best chat app ever!"</p>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Image (Offset) */}
                        <div className="absolute bottom-20 left-10 w-60 h-72 bg-gray-800 rounded-[2rem] overflow-hidden border-4 border-gray-800 shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-500 z-10">
                            <img 
                                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" 
                                alt="Happy User" 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Floating Chat Bubble Element */}
                        <div className="absolute top-1/2 left-0 bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-xl animate-bounce duration-[3000ms]">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">JD</div>
                                <div>
                                    <div className="h-2 w-24 bg-gray-600 rounded mb-1.5"></div>
                                    <div className="h-2 w-16 bg-gray-600 rounded"></div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;