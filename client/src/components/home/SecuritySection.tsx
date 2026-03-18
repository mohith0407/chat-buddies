import { type FC } from "react";
import { Lock, Server, Fingerprint, Shield } from "lucide-react";

const SecuritySection: FC = () => {
    return (
        <section id="security" className="py-24 bg-gray-900 relative overflow-hidden scroll-mt-20">
            {/* Background Accent */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-extrabold text-white mb-6">
                            Enterprise-grade <br />
                            <span className="text-blue-500">Security</span>
                        </h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            Your conversations are your business. We employ industry-leading encryption and strict data privacy standards so you can chat with complete peace of mind.
                        </p>
                        
                        <div className="space-y-6">
                            {[
                                { icon: Lock, title: "End-to-End Encryption", text: "Keys are generated on your device. We can't read your messages." },
                                { icon: Server, title: "Data Residency", text: "Choose exactly where your team's data is stored globally." },
                                { icon: Fingerprint, title: "SSO & 2FA", text: "Secure access with single sign-on and two-factor authentication." },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                                        <item.icon className="text-blue-400 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{item.title}</h4>
                                        <p className="text-gray-400">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl" />
                        <div className="relative z-10 text-center py-12">
                            <Shield size={80} className="mx-auto text-blue-500 mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2">SOC 2 Type II Certified</h3>
                            <p className="text-gray-400">Audited annually by independent third-party security experts.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SecuritySection;