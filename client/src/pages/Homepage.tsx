import {useEffect, type FC } from "react";
import Header from "../components/home/Header";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
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
        <div className="font-sans min-h-screen bg-gray-900 text-white pt-16">
            <Header />
            <main>
                <HeroSection />
                <FeaturesSection />
            </main>
            <Footer />
        </div>
    );
};

export default Homepage;
