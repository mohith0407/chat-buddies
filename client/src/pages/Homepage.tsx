import { useEffect, type FC } from "react";
import Header from "../components/home/Header";
import HeroSection from "../components/home/HeroSection";
import AppShowcase from "../components/home/AppShowcase"; 
import BusinessFeature from "../components/home/BussinessFeature"; 
import Footer from "../components/home/Footer";
import { useChatState } from "../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import FeaturesSection from "../components/home/FeaturesSection";
import SecuritySection from "../components/home/SecuritySection";
import PricingSection from "../components/home/PricingSection";

const Homepage: FC = () => {
    const { user } = useChatState();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user) {
            navigate("/chats", { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className="font-sans min-h-screen bg-gray-900 text-white selection:bg-blue-500/30">
            <Header />
            <main>
                <HeroSection />
                <AppShowcase />
                <FeaturesSection />
                <BusinessFeature />
                <SecuritySection />
                <PricingSection />
            </main>
            <Footer />
        </div>
    );
};

export default Homepage;