import {type FC } from "react";
import { MessageSquare, Download } from "lucide-react";


const HeroSection: FC = () => {
    return (
        <section className="pt-32 pb-24 lg:pt-40 lg:pb-32 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">

                {/* Text */}
                <div className="lg:col-span-6 xl:col-span-7 text-center lg:text-left mb-12">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-400 bg-blue-900/50 rounded-full mb-4 ring-2 ring-blue-500/50">
                        The Future of Connection is Here
                    </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                        Secure, <span className="text-blue-500">Real-Time</span> Messaging for Everyone.
                    </h1>

                    <p className="text-lg text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
                        Connect instantly with friends and colleagues globally. Beautiful, private, and fast.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <a
                            href="#download"
                            className="px-8 py-3 text-lg bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-xl shadow-blue-600/50 flex items-center justify-center"
                        >
                            <Download size={20} className="mr-2" />
                            Download App
                        </a>

                        <a
                            href="#features"
                            className="px-8 py-3 text-lg text-blue-400 border border-blue-500 rounded-xl hover:bg-gray-800 transition"
                        >
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Mockup */}
                <div className="lg:col-span-6 xl:col-span-5 flex justify-center">
                    <div className="w-full max-w-md p-6 bg-gray-800 rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] border border-gray-700">
                        <div className="h-64 sm:h-80 bg-gray-900 rounded-xl flex items-center justify-center border-4 border-blue-600/50">
                            <MessageSquare size={64} className="text-blue-600 opacity-20" />
                        </div>
                        <p className="mt-4 text-center text-gray-500 italic">"Clean, responsive, and incredibly fast."</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default HeroSection;
