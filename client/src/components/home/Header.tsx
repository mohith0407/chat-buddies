import { useState, type FC, useEffect } from "react";
import { MessageSquare, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useChatState } from "../../context/ChatProvider";

const NAV_LINKS = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Security", href: "#security" },
];

const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user } = useChatState();
    const location = useLocation();

    // Handle Scroll Effect for Navbar transparency
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header 
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled || isMenuOpen ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg" : "bg-transparent border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link
                        to="/"
                        className="flex items-center gap-2 group"
                    >
                        <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition">
                             <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">ChatBuddies</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        {user ? (
                            <Link
                                to="/chats"
                                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
                            >
                                Go to Chats
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/auth?mode=login"
                                    className="text-gray-300 hover:text-white font-medium transition px-4"
                                >
                                    Log In
                                </Link>

                                <Link
                                    to="/auth?mode=register"
                                    className="px-5 py-2.5 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-gray-300 hover:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`lg:hidden bg-gray-900 border-t border-gray-800 overflow-hidden transition-all duration-300 ${
                    isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-4 py-6 space-y-4">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="block text-lg font-medium text-gray-300 hover:text-blue-400"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        {user ? (
                            <Link
                                to="/chats"
                                className="w-full py-3 bg-blue-600 text-center text-white font-bold rounded-xl"
                            >
                                Go to Chats
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/auth?mode=login"
                                    className="w-full py-3 text-center text-gray-300 border border-gray-700 rounded-xl"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/auth?mode=register"
                                    className="w-full py-3 bg-blue-600 text-center text-white font-bold rounded-xl"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;