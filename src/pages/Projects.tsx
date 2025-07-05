import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Code } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project } from '../lib/supabase';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setProjects(data || []);
        setFilteredProjects(data || []);
        
        // Extract unique technologies
        const allTechs = data?.flatMap(project => project.technologies || []) || [];
        const uniqueTechs = [...new Set(allTechs)];
        setTechnologies(uniqueTechs);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  useEffect(() => {
    if (selectedTech === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter(project => 
          project.technologies?.includes(selectedTech)
        )
      );
    }
  }, [selectedTech, projects]);
  
  return (
    <div className="py-32 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            My Projects
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A collection of my latest work, showcasing my skills in design and development.
          </p>
        </div>
        
        {/* Technology Filter */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex space-x-2 min-w-max">
            <button
              onClick={() => setSelectedTech('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTech === 'All'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {technologies.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTech === tech
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse h-80 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex space-x-3">
                        {project.live_url && (
                          <a 
                            href={project.live_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-white/90 rounded-full text-gray-900 hover:bg-white transition-colors"
                            aria-label="Live demo"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                        {project.github_url && (
                          <a 
                            href={project.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-white/90 rounded-full text-gray-900 hover:bg-white transition-colors"
                            aria-label="GitHub repository"
                          >
                            <Github size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <Code size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="font-display text-xl font-medium text-gray-900 dark:text-white mb-2">
                  {projects.length === 0 ? 'No projects yet' : 'No projects match the selected filter'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {projects.length === 0 
                    ? 'Projects will appear here once they\'ve been added.' 
                    : 'Try selecting a different technology filter.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;