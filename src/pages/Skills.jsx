import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import portfolioData from '../data/portfolio.json';

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progressValues, setProgressValues] = useState({});
  const { mainSkills, additionalSkills } = portfolioData.skills;

  useEffect(() => {
    setIsVisible(true);
    // Animate progress bars
    const timer = setTimeout(() => {
      const values = {};
      mainSkills.forEach((skill) => {
        values[skill.name] = skill.percentage;
      });
      setProgressValues(values);
    }, 300);
    return () => clearTimeout(timer);
  }, [mainSkills]);

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
            My <span className="text-blue-400">Skills</span>
          </h1>
          <div className="w-20 h-1 bg-blue-400 mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A showcase of my technical expertise and proficiency across various technologies
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Skills */}
          <div
            className={`mb-16 transition-all duration-1000 delay-200 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Core Skills</h2>
            <div className="grid gap-6">
              {mainSkills.map((skill, index) => (
                <Card
                  key={index}
                  className={`bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-500 delay-${(
                    index + 1
                  ) * 100} hover:shadow-lg hover:shadow-blue-500/20`}
                  style={{
                    transitionDelay: `${(index + 2) * 100}ms`,
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="text-xl text-white">{skill.name}</span>
                      <span className="text-blue-400 font-bold text-2xl">
                        {progressValues[skill.name] || 0}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800 mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out"
                        style={{ width: `${progressValues[skill.name] || 0}%` }}
                      />
                    </div>
                    <p className="text-gray-400 text-sm">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Skills */}
          <div
            className={`transition-all duration-1000 delay-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Additional Skills</h2>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-3 justify-center">
                  {additionalSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-slate-800 hover:bg-blue-500 text-gray-300 hover:text-white border border-slate-700 hover:border-blue-500 px-6 py-3 text-base transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;