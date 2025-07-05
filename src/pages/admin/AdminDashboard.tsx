import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, MessageSquare, Star, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    testimonials: 0,
    messages: 0,
    newMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get counts from all tables
        const [projectsResponse, servicesResponse, testimonialsResponse, messagesResponse, newMessagesResponse] = await Promise.all([
          supabase.from('projects').select('id', { count: 'exact' }),
          supabase.from('services').select('id', { count: 'exact' }),
          supabase.from('testimonials').select('id', { count: 'exact' }),
          supabase.from('contacts').select('id', { count: 'exact' }),
          supabase.from('contacts').select('id', { count: 'exact' }).eq('responded', false)
        ]);
        
        setStats({
          projects: projectsResponse.count || 0,
          services: servicesResponse.count || 0,
          testimonials: testimonialsResponse.count || 0,
          messages: messagesResponse.count || 0,
          newMessages: newMessagesResponse.count || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const statCards = [
    {
      title: 'Projects',
      value: stats.projects,
      icon: <FolderKanban size={24} />,
      color: 'bg-blue-500 dark:bg-blue-600',
      link: '/admin/projects',
    },
    {
      title: 'Services',
      value: stats.services,
      icon: <Settings size={24} />,
      color: 'bg-green-500 dark:bg-green-600',
      link: '/admin/services',
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: <Star size={24} />,
      color: 'bg-yellow-500 dark:bg-yellow-600',
      link: '/admin/testimonials',
    },
    {
      title: 'Messages',
      value: stats.messages,
      badge: stats.newMessages > 0 ? stats.newMessages : null,
      icon: <MessageSquare size={24} />,
      color: 'bg-purple-500 dark:bg-purple-600',
      link: '/admin/contacts',
    },
  ];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <TrendingUp size={16} className="mr-1" />
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse h-32 bg-white dark:bg-gray-800 rounded-lg shadow-md"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {card.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {card.title}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg ${card.color} text-white flex items-center justify-center relative`}>
                  {card.icon}
                  {card.badge && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {card.badge}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/projects?action=new"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mr-3">
              <FolderKanban size={20} />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Add New Project
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Create a project showcase
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/services?action=new"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center mr-3">
              <Settings size={20} />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Add New Service
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Define a service offering
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/testimonials?action=new"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg flex items-center justify-center mr-3">
              <Star size={20} />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Add Testimonial
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Add a client review
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;