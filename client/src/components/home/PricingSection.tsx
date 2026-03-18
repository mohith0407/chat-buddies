import { type FC } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection: FC = () => {
    const plans = [
        {
            name: "Starter",
            price: "$0",
            description: "Perfect for small teams getting started.",
            features: ["Up to 10 team members", "10,000 message history", "Basic integrations", "Community support"],
            popular: false
        },
        {
            name: "Pro",
            price: "$8",
            description: "Everything you need for growing businesses.",
            features: ["Unlimited team members", "Unlimited message history", "Advanced integrations", "Priority 24/7 support", "Screen sharing"],
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Advanced controls for large organizations.",
            features: ["Everything in Pro", "SAML-based SSO", "Data export & retention", "Dedicated success manager"],
            popular: false
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-gray-950 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-extrabold text-white mb-4">
                        Simple, transparent <span className="text-blue-500">Pricing</span>
                    </h2>
                    <p className="text-gray-400 text-lg">No hidden fees. Cancel anytime.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`relative p-8 rounded-3xl border ${plan.popular ? 'bg-gray-800 border-blue-500 shadow-2xl shadow-blue-900/20' : 'bg-gray-900 border-gray-800'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                                    MOST POPULAR
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <p className="text-gray-400 text-sm mb-6 h-10">{plan.description}</p>
                            <div className="mb-8">
                                <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                                {plan.price !== "Custom" && <span className="text-gray-400">/mo</span>}
                            </div>
                            
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/auth?mode=register"
                                className={`block w-full py-3 px-6 text-center rounded-xl font-bold transition-all ${
                                    plan.popular 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                                }`}
                            >
                                Get Started
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;