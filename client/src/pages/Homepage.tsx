import { useEffect, type FC } from "react";
import Header from "../components/home/Header";
import HeroSection from "../components/home/HeroSection";
import AppShowcase from "../components/home/AppShowcase"; // New component
import BusinessFeature from "../components/home/BussinessFeature"; // New component
import Footer from "../components/home/Footer";
import { useChatState } from "../context/ChatProvider";
import { useNavigate } from "react-router-dom";

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
                <BusinessFeature />
                {/* Optional: If you still want the icon grid, 
                  you can include <FeaturesSection /> here or remove it 
                  if the new layout is sufficient. 
                  Based on the design, the BusinessFeature replaces the need for the generic grid.
                */}
            </main>
            <Footer />
        </div>
    );
};

export default Homepage;