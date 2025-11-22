import { type FC } from "react";
import { Link } from "react-router-dom";

const Footer: FC = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

                    {/* PRODUCT */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
                        <div className="space-y-2">
                            <a href="#features" className="text-gray-400 hover:text-blue-500">Features</a>
                            <a href="#pricing" className="text-gray-400 hover:text-blue-500">Pricing</a>
                            <a href="#download" className="text-gray-400 hover:text-blue-500">Download</a>
                        </div>
                    </div>

                    {/* COMPANY */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
                        <div className="space-y-2">
                            <Link to="/about" className="text-gray-400 hover:text-blue-500">About Us</Link>
                            <Link to="/careers" className="text-gray-400 hover:text-blue-500">Careers</Link>
                            <Link to="/blog" className="text-gray-400 hover:text-blue-500">Blog</Link>
                        </div>
                    </div>

                    {/* LEGAL */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
                        <div className="space-y-2">
                            <Link to="/privacy" className="text-gray-400 hover:text-blue-500">Privacy Policy</Link>
                            <Link to="/terms" className="text-gray-400 hover:text-blue-500">Terms of Service</Link>
                        </div>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                        <p className="text-gray-400">support@chatbuddies.com</p>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} ChatBuddies Inc.</p>

                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#twitter" className="text-gray-400 hover:text-blue-500">Twitter</a>
                        <a href="#github" className="text-gray-400 hover:text-blue-500">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer