import { type FC } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const BusinessFeature: FC = () => {
    return (
        <section className="py-24 bg-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left: Image (Office Vibe) */}
                    <div className="relative order-2 lg:order-1">
                        {/* Dot Pattern - Bottom Right */}
                        <div className="absolute -bottom-10 -right-10 grid grid-cols-6 gap-2 opacity-20 text-blue-500">
                             {[...Array(24)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-current rounded-full" />
                            ))}
                        </div>
                        
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                            <img 
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                                alt="Team Collaboration" 
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="order-1 lg:order-2">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                            Perfect Solution for <br />
                            <span className="text-blue-500">Small Businesses</span>
                        </h2>
                        
                        <p className="text-xl text-gray-400 mb-8 font-light">
                            Pricing plans that fit like a glove. Powerful features without the enterprise price tag.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                             <Link
                                to="/auth?mode=register"
                                className="px-8 py-3 text-lg font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/25 text-center"
                            >
                                Try it Free
                            </Link>
                            <Link
                                to="/features"
                                className="px-8 py-3 text-lg font-semibold text-white border border-gray-600 rounded-xl hover:bg-gray-800 transition text-center"
                            >
                                Get a Demo
                            </Link>
                        </div>

                        {/* Rating Component from Design */}
                        <div className="border-t border-gray-700 pt-8">
                            <div className="flex gap-1 text-yellow-500 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} fill="currentColor" size={24} />
                                ))}
                            </div>
                            <p className="text-gray-300">
                                <span className="font-bold text-white">5,200 businesses</span> use ChatBuddies 
                                <br />and they rate it as <span className="font-bold text-white">5-stars</span>.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BusinessFeature;