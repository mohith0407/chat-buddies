import { type FC } from "react";

const AppShowcase: FC = () => {
    return (
        <section className="py-24 bg-gray-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Instant <span className="text-blue-500">Team Chats</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Experience seamless communication with our intuitive interface. 
                        Designed for speed, clarity, and ease of use, making your team collaboration 
                        smoother than ever before.
                    </p>
                </div>

                {/* Dashboard Placeholder / Window Frame */}
                <div className="relative mx-auto max-w-5xl">
                    {/* Decorative Backdrop Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] opacity-30 blur-2xl" />
                    
                    {/* Main Window Frame */}
                    <div className="relative bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                        {/* Browser Toolbar Mockup */}
                        <div className="h-12 bg-gray-900 border-b border-gray-700 flex items-center px-4 space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            {/* URL Bar Mockup */}
                            <div className="ml-4 flex-1 max-w-sm h-6 bg-gray-800 rounded-md border border-gray-700" />
                        </div>

                        {/* Content Area - Placeholder for Chat Screen */}
                        <div className="aspect-[16/10] bg-gray-800/50 flex flex-col items-center justify-center p-8 relative overflow-hidden group">
                            
                            {/* Placeholder Text */}
                            <div className="text-center z-10">
                                <h3 className="text-2xl font-semibold text-white mb-2">Register in Chat Buddies</h3>
                                <p className="text-gray-500">The chat interface will appear in this preview.</p>
                            </div>

                            {/* Abstract UI Skeletons to make it look active */}
                            <div className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-700 p-4 space-y-4 opacity-50">
                                <div className="h-8 w-3/4 bg-gray-700 rounded" />
                                <div className="space-y-2 pt-4">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-700" />
                                            <div className="h-4 w-24 bg-gray-700 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="absolute right-0 top-0 bottom-0 left-64 p-6 flex flex-col justify-end opacity-50">
                                <div className="self-end bg-blue-600/20 text-blue-200 px-4 py-2 rounded-2xl rounded-tr-none mb-2 max-w-md h-12 w-64" />
                                <div className="self-start bg-gray-700 px-4 py-2 rounded-2xl rounded-tl-none max-w-md h-12 w-48" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppShowcase;