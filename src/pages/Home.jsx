import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import portfolioData from '../data/portfolio.json';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { name, role, comments, socialLinks } = portfolioData.home;
  const { resumeDownloadUrl } = portfolioData;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Content */}
          <div
            className={`transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
                Welcome to my portfolio
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Hi, I'm{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {name}
              </span>
            </h1>

            <h2 className="text-2xl md:text-4xl text-gray-300 mb-8 font-light">
              {role}
            </h2>

            <p className="text-lg text-gray-400 mb-12 max-w-2xl leading-relaxed">
              {comments}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-16">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
                >
                  Get In Touch
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <a href={resumeDownloadUrl} download="Ciril_Arockiaraj_Resume.pdf">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-600 text-white hover:bg-slate-800 px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Download className="mr-2" size={20} />
                  Download Resume
                </Button>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-blue-500 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </div>
  );
};

export default Home;