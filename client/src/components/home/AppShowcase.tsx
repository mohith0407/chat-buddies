import { type FC } from "react";

const AppShowcase: FC = () => {
    return (
        <section className="py-24 bg-gray-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        See <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">ChatBuddies</span> in Action
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Experience seamless communication with our intuitive interface. 
                        Designed for speed, clarity, and ease of use.
                    </p>
                </div>

                {/* Dashboard Image Wrapper */}
                <div className="relative mx-auto max-w-5xl group">
                    {/* Decorative Backdrop Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700" />
                    
                    {/* Main Window Frame */}
                    <div className="relative rounded-2xl border border-gray-700 shadow-2xl overflow-hidden bg-gray-800">
                        {/* Browser Toolbar Mockup (Kept for aesthetics, but simplified) */}
                        <div className="h-10 bg-gray-900 border-b border-gray-700 flex items-center px-4 space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>

                        {/* Actual Image from Public Folder */}
                        <img 
                            src="/dashboard-layout.jpg" 
                            alt="ChatBuddies Dashboard Preview" 
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppShowcase;