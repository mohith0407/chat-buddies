import { useState } from 'react';
import { Send, ExternalLink, ChevronDown, MessageSquare } from 'lucide-react';
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title:string) => {
    setOpenSection(openSection === title ? null : title);
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Download", href: "#download" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Blog", href: "#blog" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Privacy Policy", href: "#privacy" },
      ]
    }
  ];

  return (
    <footer className="bg-gray-950 border-t border-gray-900 pt-20 pb-10 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-8">
            <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold text-white">ChatBuddies</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-base mb-6 max-w-sm">
                The last team chat you will ever need. Secure, fast, and built for modern teams to collaborate effectively.
            </p>
            <div className="flex space-x-4">
                {[FaXTwitter, FaGithub, FaLinkedin, FaFacebook].map((Icon, idx) => (
                    <a key={idx} href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                        <Icon size={18} />
                    </a>
                ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1 border-b border-gray-900 lg:border-none pb-4 lg:pb-0">
              <button 
                onClick={() => toggleSection(section.title)}
                className="w-full flex justify-between items-center lg:cursor-default lg:block"
              >
                <h4 className="text-lg font-bold text-white mb-0 lg:mb-6">{section.title}</h4>
                <ChevronDown className={`lg:hidden text-gray-500 transition-transform ${openSection === section.title ? 'rotate-180' : ''}`} size={20} />
              </button>

              <ul className={`mt-4 space-y-3 ${openSection === section.title ? 'block' : 'hidden'} lg:block`}>
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-500 hover:text-blue-400 transition-colors text-base block py-1">
                        {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600">
          <p>&copy; {new Date().getFullYear()} ChatBuddies Inc. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-gray-400">Privacy</a>
             <a href="#" className="hover:text-gray-400">Terms</a>
             <a href="#" className="hover:text-gray-400">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;