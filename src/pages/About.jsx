import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Briefcase, Award, Users, TrendingUp } from 'lucide-react';
import portfolioData from '../data/portfolio.json';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { name, role, comments, imageUrl, experience, projects, client, interests } =
    portfolioData.about;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Briefcase, label: 'Experience', value: experience },
    { icon: Award, label: 'Projects', value: projects },
    { icon: Users, label: 'Clients', value: client },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Page Title */}
        <div
          className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-5xl font-bold mb-4">
            About <span className="text-blue-400">Me</span>
          </h1>
          <div className="w-20 h-1 bg-blue-400 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Image */}
            <div
              className={`transition-all duration-1000 delay-200 transform ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <img
                  src={imageUrl}
                  alt={name}
                  className="relative rounded-2xl w-full h-auto object-cover shadow-2xl"
                />
              </div>
            </div>

            {/* Info */}
            <div
              className={`transition-all duration-1000 delay-300 transform ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              <h2 className="text-3xl font-bold mb-4">{name}</h2>
              <h3 className="text-xl text-blue-400 mb-6">{role}</h3>
              <p className="text-gray-400 leading-relaxed mb-8">{comments}</p>

              {/* Interests */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-400" />
                  Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <Badge
                      key={index}
                      className="bg-slate-800 hover:bg-blue-500/20 text-gray-300 border border-slate-700 hover:border-blue-500 px-4 py-2 transition-all duration-300"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className={`bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-500 delay-${(
                    index + 4
                  ) * 100} transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  } hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="text-blue-400" size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                    <p className="text-gray-400">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;