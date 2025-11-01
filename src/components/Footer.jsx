import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-gray-400 py-8 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>© {currentYear} Ciril Arockiaraj. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
            <span>by Ciril</span>
          </div>

          <div className="flex gap-6 text-sm">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;