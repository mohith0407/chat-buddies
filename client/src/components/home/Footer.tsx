import  { useState } from 'react';
import { Send, ExternalLink, ChevronDown } from 'lucide-react';
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  // State to track which section is open on mobile
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (title) => {
    setOpenSection(openSection === title ? null : title);
  };

  // Data structure for cleaner code
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Integrations", href: "#integrations" },
        { name: "Download", href: "#download", icon: <ExternalLink size={12} /> },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Blog", href: "#blog" },
        { name: "Partners", href: "#partners" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Cookie Policy", href: "#cookies" },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-12 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-8 lg:gap-8 mb-12">

          {/* DYNAMIC SECTIONS (Collapsible on Mobile, Grid on Desktop) */}
          {footerSections.map((section) => (
            <div key={section.title} className="border-b border-gray-800 lg:border-none pb-4 lg:pb-0">
              {/* Header / Button */}
              <button 
                onClick={() => toggleSection(section.title)}
                className="w-full flex justify-between items-center lg:cursor-default lg:block group"
              >
                <h4 className="text-lg font-bold text-white tracking-wide text-left">
                  {section.title}
                </h4>
                {/* Chevron only visible on mobile */}
                <ChevronDown 
                  className={`lg:hidden text-gray-500 transition-transform duration-200 ${
                    openSection === section.title ? 'rotate-180' : ''
                  }`} 
                  size={20} 
                />
              </button>

              {/* Links List - Hidden on mobile unless open, always visible on Desktop */}
              <div className={`
                mt-4 flex-col space-y-3 
                ${openSection === section.title ? 'flex' : 'hidden'} 
                lg:flex
              `}>
                {section.links.map((link) => (
                  <a 
                    key={link.name}
                    href={link.href} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 w-fit flex items-center gap-1"
                  >
                    {link.name}
                    {link.icon && link.icon}
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* NEWSLETTER SECTION (Always visible) */}
          <div className="space-y-4 pt-4 lg:pt-0">
            <h4 className="text-lg font-bold text-white tracking-wide">Stay Updated</h4>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <div className="flex flex-col gap-3">
              <div className="relative max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                />
                <button className="absolute right-2 top-2 text-blue-400 hover:text-blue-300 p-1 hover:bg-gray-700 rounded transition-colors">
                  <Send size={18} />
                </button>
              </div>
              <p className="text-gray-500 text-xs">
                Contact: <a href="mailto:support@chatbuddies.com" className="text-blue-400 hover:underline">support@chatbuddies.com</a>
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-800 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} ChatBuddies Inc. All rights reserved.
          </p>

          <div className="flex space-x-6">
            {[
              { icon: FaXTwitter, href: "https://x.com/HMohithraj", color: "hover:text-blue-400" },
              { icon: FaGithub, href: "https://github.com/mohith0407", color: "hover:text-white" },
              { icon: FaLinkedin, href: "https://www.linkedin.com/in/mohith-hanumanthkar-0407raj", color: "hover:text-blue-600" },
              { icon: FaFacebook, href: "#facebook", color: "hover:text-blue-500" }
            ].map((social, index) => (
               <a 
                 key={index}
                 href={social.href} 
                 className={`text-gray-400 ${social.color} transition-transform duration-200 hover:-translate-y-1`}
               >
                 <social.icon size={20} />
               </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;