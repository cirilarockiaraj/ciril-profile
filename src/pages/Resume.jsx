import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Briefcase, GraduationCap, Calendar, Download, Badge, User, File } from 'lucide-react';
import portfolioData from '../data/portfolio.json';
import { Avatar } from '@/components/ui/avatar';

const Resume = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { experience, education, projects } = portfolioData.resume;
  const { resumeDownloadUrl } = portfolioData;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Page Title */}
        <div
          className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-5xl font-bold mb-4">
            My <span className="text-blue-400">Resume</span>
          </h1>
          <div className="w-20 h-1 bg-blue-400 mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            My professional journey, education, and work experience
          </p>

          {/* Download Button */}
          <a href={resumeDownloadUrl} download="Ciril_Arockiaraj_Resume.pdf">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
            >
              <Download className="mr-2" size={20} />
              Download Resume PDF
            </Button>
          </a>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Experience Section */}
          <div
            className={`mb-16 transition-all duration-1000 delay-200 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Briefcase className="text-blue-400" size={24} />
              </div>
              <h2 className="text-3xl font-bold">Work Experience</h2>
            </div>

            <div className="space-y-6">
              {experience.map((exp, index) => (
                <Card
                  key={index}
                  className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group"
                >
                  <CardHeader>
                    <CardTitle className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <span className="text-2xl text-white group-hover:text-blue-400 transition-colors">
                        {exp.role}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={16} />
                        {exp.duration}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">
                      {exp.company}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {exp.comments}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div
            className={`mb-16 transition-all duration-1000 delay-200 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <File className="text-blue-400" size={24} />
              </div>
              <h2 className="text-3xl font-bold">Projects</h2>
            </div>

            <div className="space-y-6">
              {projects.map((pro, index) => (
                <Card
                  key={index}
                  className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group"
                >
                  <CardHeader>
                    <CardTitle className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <span className="text-2xl text-white group-hover:text-blue-400 transition-colors">
                        {pro.name}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-gray-400">
                        <User size={16} />
                        {pro.client}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">
                      {pro.technologies}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {pro.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div
            className={`transition-all duration-1000 delay-400 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <GraduationCap className="text-blue-400" size={24} />
              </div>
              <h2 className="text-3xl font-bold">Education</h2>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card
                  key={index}
                  className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group"
                >
                  <CardHeader>
                    <CardTitle className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <span className="text-2xl text-white group-hover:text-blue-400 transition-colors">
                        {edu.degree}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={16} />
                        {edu.year}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">
                      {edu.institution}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {edu.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;