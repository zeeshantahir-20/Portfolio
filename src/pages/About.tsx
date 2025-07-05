import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { WorkExperience } from '../lib/supabase';
import myimage from './Images/zeeshan.jpg';
import resume from './Images/zeeshan.pdf';

const About = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from('work_experiences')
          .select('*')
          .order('start_date', { ascending: false });
          
        if (error) throw error;
        
        setExperiences(data || []);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperiences();
  }, []);
  
  // Format date to 'MMM YYYY'
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML/CSS'] },
    { category: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'RESTful APIs', 'GraphQL'] },
    { category: 'Design', items: ['Figma', 'Adobe XD', 'UI/UX Design', 'Responsive Design'] },
    { category: 'Other', items: ['Git', 'Docker', 'AWS', 'Testing', 'CI/CD', 'Performance Optimization'] },
  ];
  
  return (
    <div className="py-32 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        {/* About Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="md:w-1/3">
              <img 
                 src={myimage} 
                alt="Profile" 
                className="w-64 h-64 rounded-xl object-cover shadow-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                About Me
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                I'm Muhammad Zeeshan, a passionate Full Stack Developer and UI/UX Designer with over 5 years of experience creating beautiful, functional digital experiences. I specialize in modern web technologies, responsive design, and user-centered interfaces.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                My approach combines technical expertise with creative problem-solving, delivering solutions that are not only visually appealing but also performant and accessible. I'm committed to continuous learning and staying at the forefront of industry trends.
              </p>
              <a 
               href={resume} 
  download="Muhammad_Zeeshan_Resume.pdf"
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <Download size={18} className="mr-2" />
                Download Resume
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skillGroup, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Work Experience
          </h2>
          
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {experiences.length > 0 ? (
                experiences.map((exp, index) => (
                  <div 
                    key={exp.id} 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-primary-600 dark:border-primary-500"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                          {exp.job_title}
                        </h3>
                        <p className="text-primary-600 dark:text-primary-400 font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0 text-gray-600 dark:text-gray-400">
                        <Calendar size={16} className="mr-2" />
                        <span>
                          {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {exp.description}
                    </p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Key Achievements:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.tools_used && exp.tools_used.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.tools_used.map((tool, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="font-display text-xl font-medium text-gray-900 dark:text-white mb-2">
                    No experience entries yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Work experience will appear here once it's been added.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default About;