import {type FC } from "react";
import { Rocket, Shield, Zap} from "lucide-react";

const FeaturesSection: FC = () => {
    const features = [
        { icon: Rocket, title: "Blazing Fast", description: "Instant delivery with smooth performance." },
        { icon: Shield, title: "End-to-End Encryption", description: "Privacy-first secure messaging." },
        { icon: Zap, title: "Intuitive Design", description: "Beautiful UI designed for speed & clarity." },
    ];

    return (
        <section id="features" className="py-20 bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">
                    Key <span className="text-blue-500">Features</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="p-8 bg-gray-900 rounded-xl border border-gray-700 hover:border-blue-600 transition"
                        >
                            <f.icon size={48} className="text-blue-500 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                            <p className="text-gray-400">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default FeaturesSection