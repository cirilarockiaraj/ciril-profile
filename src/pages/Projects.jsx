import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { FolderGit2, ExternalLink } from 'lucide-react';
import portfolioData from '../data/portfolio.json';

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const projects = portfolioData?.resume?.projects || [];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-5xl font-bold mb-4">
            Featured <span className="text-blue-400">Projects</span>
          </h1>
          <div className="w-20 h-1 bg-blue-400 mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A selection of work highlighting problem solving, craftsmanship, and impact.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <Card
              key={`${project.name}-${idx}`}
              className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 h-full"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FolderGit2 className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-100">{project.name}</CardTitle>
                    <p className="text-xs text-gray-400 mt-1">{project.client}</p>
                  </div>
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer">
                    <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                      <ExternalLink size={18} />
                    </Button>
                  </a>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2">
                    {String(project.technologies)
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((tech) => (
                        <Badge key={tech} className="bg-slate-800 text-gray-200 border border-slate-700">
                          {tech}
                        </Badge>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;


