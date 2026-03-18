import { type FC } from "react";
import { Rocket, Shield, Zap, Globe, Users, Layout } from "lucide-react";

const FeaturesSection: FC = () => {
    const features = [
        { icon: Rocket, title: "Blazing Fast", description: "Built on modern edge infrastructure for zero-latency messaging." },
        { icon: Shield, title: "Bank-Grade Security", description: "End-to-end encryption ensures your team's data stays private." },
        { icon: Zap, title: "Instant Sync", description: "Pick up exactly where you left off across all your devices." },
        { icon: Globe, title: "Global CDN", description: "Lightning-fast file sharing no matter where your team is located." },
        { icon: Users, title: "Unlimited Channels", description: "Organize conversations by topic, project, or department." },
        { icon: Layout, title: "Intuitive UI", description: "A clutter-free interface that your team will actually love using." },
    ];

    return (
        <section id="features" className="py-24 bg-gray-950 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-extrabold text-white mb-4">
                        Powerful <span className="text-blue-500">Features</span>
                    </h2>
                    <p className="text-gray-400 text-lg">Everything you need to manage your team's communication, without the clutter.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, idx) => (
                        <div
                            key={idx}
                            className="p-8 bg-gray-900 rounded-2xl border border-gray-800 hover:border-blue-500/50 hover:bg-gray-800/80 transition-all group"
                        >
                            <div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <f.icon size={28} className="text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;