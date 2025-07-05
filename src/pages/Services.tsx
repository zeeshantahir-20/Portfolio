import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Service } from '../lib/supabase';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  return (
    <div className="py-32 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Services
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Professional services tailored to your needs, focused on delivering quality results.
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse h-72 bg-white dark:bg-gray-800 rounded-lg shadow-md"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow h-full flex flex-col"
                >
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center mb-6">
                    <span dangerouslySetInnerHTML={{ __html: service.icon }} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 flex-grow mb-6">
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
    </div>
  );
};

export default Services;