import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink, Github, Code, Briefcase, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project, Service, Testimonial } from '../lib/supabase';
import myimage from './Images/zeeshan.jpg';
const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, servicesResponse, testimonialsResponse] = await Promise.all([
          supabase
            .from('projects')
            .select('*')
            .eq('featured', true)
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('services')
            .select('*')
            .eq('featured', true)
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('testimonials')
            .select('*')
            .order('rating', { ascending: false })
            .limit(3),
        ]);
        
        setFeaturedProjects(projectsResponse.data || []);
        setFeaturedServices(servicesResponse.data || []);
        setTestimonials(testimonialsResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" className="text-primary-400 dark:text-primary-700"></path>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)"></rect>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <img 
             src={myimage} 
                alt="Profile" 
                className="w-40 h-40 rounded-full mx-auto mb-6 object-cover border-4 border-white dark:border-gray-800 shadow-lg"
              />
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Muhammad Zeeshan Tahir
              </h1>
              <p className="text-lg md:text-xl text-primary-600 dark:text-primary-400 font-medium">
                Full Stack Developer & UI/UX Designer
              </p>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              I create beautiful, functional digital experiences with a focus on performance and usability. Specializing in modern web technologies and responsive design.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/projects"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                View My Work
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-700 transition-colors shadow-sm hover:shadow-md"
              >
                Contact Me
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Featured Projects
            </h2>
            <Link 
              to="/projects" 
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center"
            >
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse h-80 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.length > 0 ? (
                featuredProjects.map((project) => (
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
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.slice(0, 3).map((tech, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies && project.technologies.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-16">
                  <Code size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="font-display text-xl font-medium text-gray-900 dark:text-white mb-2">
                    No projects yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Projects will appear here once they've been added.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Services
            </h2>
            <Link 
              to="/services" 
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center"
            >
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.length > 0 ? (
                featuredServices.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center mb-4">
                      <span dangerouslySetInnerHTML={{ __html: service.icon }} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {service.description}
                    </p>
                    {service.price && (
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Starting at ${service.price}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-16">
                  <Briefcase size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="font-display text-xl font-medium text-gray-900 dark:text-white mb-2">
                    No services yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Services will appear here once they've been added.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Clients Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Feedback from clients I've had the pleasure of working with on various projects.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={`${
                            i < testimonial.rating 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                      "{testimonial.review}"
                    </p>
                    <div className="flex items-center">
                      {testimonial.image_url ? (
                        <img 
                          src={testimonial.image_url} 
                          alt={testimonial.client_name} 
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full mr-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                          {testimonial.client_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {testimonial.client_name}
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row sm:items-center">
                          <span>{testimonial.client_company}</span>
                          <span className="hidden sm:inline mx-2">•</span>
                          <span>{testimonial.project_type}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-16">
                  <Star size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="font-display text-xl font-medium text-gray-900 dark:text-white mb-2">
                    No testimonials yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Client testimonials will appear here once they've been added.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-600 dark:bg-primary-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-6">
              Ready to start your project?
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              Let's discuss your ideas and bring them to life with beautiful design and solid development.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-primary-600 font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;