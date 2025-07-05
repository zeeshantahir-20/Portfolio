import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Plus, Edit, Trash2, Check, X, ExternalLink, Github, Star, Image, Save
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import type { Project } from '../../lib/supabase';

interface ProjectFormData {
  title: string;
  description: string;
  technologies: string;
  image_url: string;
  live_url: string;
  github_url: string;
  featured: boolean;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm<ProjectFormData>();
  
  useEffect(() => {
    fetchProjects();
    
    // Check if URL has action=new parameter to open the creation form
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'new') {
      openCreateModal();
    }
  }, [location]);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };
  
  const openCreateModal = () => {
    setCurrentProject(null);
    reset({
      title: '',
      description: '',
      technologies: '',
      image_url: '',
      live_url: '',
      github_url: '',
      featured: false
    });
    setIsModalOpen(true);
    
    // Update URL without full navigation
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('action', 'new');
    window.history.pushState({ path: newUrl.toString() }, '', newUrl.toString());
  };
  
  const openEditModal = (project: Project) => {
    setCurrentProject(project);
    setValue('title', project.title);
    setValue('description', project.description);
    setValue('technologies', project.technologies?.join(', ') || '');
    setValue('image_url', project.image_url);
    setValue('live_url', project.live_url || '');
    setValue('github_url', project.github_url || '');
    setValue('featured', project.featured);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    // Remove action from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('action');
    window.history.pushState({ path: newUrl.toString() }, '', newUrl.toString());
  };
  
  const openDeleteModal = (project: Project) => {
    setCurrentProject(project);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  
  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSubmitting(true);
      
      // Convert comma-separated technologies to array
      const technologiesArray = data.technologies.split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);
      
      if (currentProject) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            title: data.title,
            description: data.description,
            technologies: technologiesArray,
            image_url: data.image_url,
            live_url: data.live_url || null,
            github_url: data.github_url || null,
            featured: data.featured
          })
          .eq('id', currentProject.id);
          
        if (error) throw error;
        
        toast.success('Project updated successfully');
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([{
            title: data.title,
            description: data.description,
            technologies: technologiesArray,
            image_url: data.image_url,
            live_url: data.live_url || null,
            github_url: data.github_url || null,
            featured: data.featured
          }]);
          
        if (error) throw error;
        
        toast.success('Project created successfully');
      }
      
      // Refresh projects and close modal
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteProject = async () => {
    if (!currentProject) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', currentProject.id);
        
      if (error) throw error;
      
      toast.success('Project deleted successfully');
      fetchProjects();
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleFeatured = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ featured: !project.featured })
        .eq('id', project.id);
        
      if (error) throw error;
      
      toast.success(`Project ${!project.featured ? 'featured' : 'unfeatured'} successfully`);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Projects
        </h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add Project
        </button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-24 bg-white dark:bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          {projects.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col\" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Project
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Technologies
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Featured
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                src={project.image_url} 
                                alt={project.title} 
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {project.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                {project.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {project.technologies?.slice(0, 3).map((tech, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies && project.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleFeatured(project)}
                            className={`p-1 rounded-md ${
                              project.featured 
                                ? 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30' 
                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            title={project.featured ? 'Remove from featured' : 'Add to featured'}
                          >
                            <Star size={20} className={project.featured ? 'fill-yellow-500' : ''} />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(project)}
                              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md"
                              title="Edit project"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(project)}
                              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"
                              title="Delete project"
                            >
                              <Trash2 size={18} />
                            </button>
                            {project.live_url && (
                              <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md"
                                title="View live site"
                              >
                                <ExternalLink size={18} />
                              </a>
                            )}
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                title="View source code"
                              >
                                <Github size={18} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Image size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="font-display text-xl font-medium text-gray-900 dark:text-white mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by adding your first project showcase.
              </p>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md inline-flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add Project
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  {currentProject ? 'Edit Project' : 'Create New Project'}
                </h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label 
                      htmlFor="title" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Project Title*
                    </label>
                    <input
                      id="title"
                      type="text"
                      className={`w-full px-3 py-2 rounded-md border ${
                        errors.title 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="E.g., E-commerce Website"
                      {...register('title', { required: 'Title is required' })}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="description" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Description*
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      className={`w-full px-3 py-2 rounded-md border ${
                        errors.description 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none`}
                      placeholder="Describe your project..."
                      {...register('description', { required: 'Description is required' })}
                    ></textarea>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="technologies" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Technologies*
                    </label>
                    <input
                      id="technologies"
                      type="text"
                      className={`w-full px-3 py-2 rounded-md border ${
                        errors.technologies 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="React, Node.js, Tailwind CSS (comma separated)"
                      {...register('technologies', { required: 'Technologies are required' })}
                    />
                    {errors.technologies && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.technologies.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="image_url" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Project Image URL*
                    </label>
                    <input
                      id="image_url"
                      type="text"
                      className={`w-full px-3 py-2 rounded-md border ${
                        errors.image_url 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="https://example.com/image.jpg"
                      {...register('image_url', { required: 'Image URL is required' })}
                    />
                    {errors.image_url && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.image_url.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="live_url" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Live URL (optional)
                    </label>
                    <input
                      id="live_url"
                      type="text"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://example.com"
                      {...register('live_url')}
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="github_url" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      GitHub URL (optional)
                    </label>
                    <input
                      id="github_url"
                      type="text"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://github.com/username/project"
                      {...register('github_url')}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="featured"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      {...register('featured')}
                    />
                    <label 
                      htmlFor="featured" 
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Feature this project on the homepage
                    </label>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors shadow-sm hover:shadow-md flex items-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeDeleteModal}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mx-auto mb-4">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
                  Delete Project
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Are you sure you want to delete "{currentProject?.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteProject}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors shadow-sm hover:shadow-md flex items-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;