import { useState, type FC } from "react";
import { MessageSquare, Menu, X} from "lucide-react";
import { Link } from "react-router-dom";
import { useChatState } from "../../context/ChatProvider";

const NAV_LINKS = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Security", href: "#security" },
];

const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useChatState();
    return (
        <header className="fixed top-0 left-0 w-full z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link
                        to="/"
                        className="flex items-center text-white text-2xl font-bold transition hover:text-blue-500"
                    >
                        <MessageSquare className="w-6 h-6 mr-2 text-blue-500" />
                        ChatBuddies
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex space-x-6">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-300 hover:text-blue-400 font-medium transition duration-150 p-2 rounded-lg"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {user ? (
                            <Link
                                to="/chats"
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-600/50"
                            >
                                Go to Chats
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/auth?mode=login"
                                    className="text-gray-300 hover:text-blue-400 font-medium transition p-2"
                                >
                                    Log In
                                </Link>

                                <Link
                                    to="/auth?mode=register"
                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-600/50"
                                >
                                    Get Started Free
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-white hover:bg-gray-800 rounded-lg transition"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`lg:hidden transition-all duration-300 ${isMenuOpen ? "max-h-96 opacity-100 py-2" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-start">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition duration-150 w-full"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    {user ? (
                        <Link
                            to="/chats"
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-600/50"
                        >
                            Go to Chats
                        </Link>) :
                        (
                            <>
                                <Link
                                    to="/auth?mode=login"
                                    className="text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium w-full"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Log In
                                </Link>

                                <Link
                                    to="/auth?mode=register"
                                    className="w-full text-center mt-2 px-3 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started Free
                                </Link>
                            </>
                        )}
                </div>
            </div>
        </header>
    );
};
export default Header;