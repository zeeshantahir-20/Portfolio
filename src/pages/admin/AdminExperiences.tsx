import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Plus, Pencil, Trash2, Save, X, Calendar, Briefcase, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface WorkExperienceFormData {
  id?: string;
  job_title: string;
  company: string;
  start_date: string;
  end_date?: string;
  description: string;
  key_achievements: string;
  tools_used: string;
  is_current: boolean;
}

const AdminExperiences = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<WorkExperienceFormData>();
  
  const isCurrent = watch('is_current');
  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const action = query.get('action');
    
    if (action === 'new') {
      setFormMode('create');
      reset({
        job_title: '',
        company: '',
        start_date: '',
        end_date: '',
        description: '',
        key_achievements: '',
        tools_used: '',
        is_current: false
      });
    }
  }, [location, reset]);
  
  useEffect(() => {
    fetchExperiences();
  }, []);
  
  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('work_experiences')
        .select('*')
        .order('start_date', { ascending: false });
        
      if (error) throw error;
      
      setExperiences(data || []);
    } catch (error: any) {
      console.error('Error fetching experiences:', error);
      toast.error('Failed to fetch work experiences');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = async (data: WorkExperienceFormData) => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      // Convert multi-line strings to arrays
      const keyAchievements = data.key_achievements
        ? data.key_achievements.split('\n').filter(item => item.trim() !== '')
        : [];
        
      const toolsUsed = data.tools_used
        ? data.tools_used.split(',').map(item => item.trim())
        : [];
      
      const { error } = await supabase.from('work_experiences').insert({
        user_id: user.id,
        job_title: data.job_title,
        company: data.company,
        start_date: data.start_date,
        end_date: data.is_current ? null : data.end_date,
        description: data.description,
        key_achievements: keyAchievements,
        tools_used: toolsUsed,
        is_current: data.is_current
      });
      
      if (error) throw error;
      
      toast.success('Work experience added successfully');
      setFormMode(null);
      navigate('/admin/experiences');
      await fetchExperiences();
    } catch (error: any) {
      console.error('Error creating experience:', error);
      toast.error(error.message || 'Failed to add work experience');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEdit = async (data: WorkExperienceFormData) => {
    if (!user || !data.id) return;
    
    setSubmitting(true);
    try {
      // Convert multi-line strings to arrays
      const keyAchievements = data.key_achievements
        ? data.key_achievements.split('\n').filter(item => item.trim() !== '')
        : [];
        
      const toolsUsed = data.tools_used
        ? data.tools_used.split(',').map(item => item.trim())
        : [];
      
      const { error } = await supabase
        .from('work_experiences')
        .update({
          job_title: data.job_title,
          company: data.company,
          start_date: data.start_date,
          end_date: data.is_current ? null : data.end_date,
          description: data.description,
          key_achievements: keyAchievements,
          tools_used: toolsUsed,
          is_current: data.is_current,
          updated_at: new Date()
        })
        .eq('id', data.id);
      
      if (error) throw error;
      
      toast.success('Work experience updated successfully');
      setFormMode(null);
      setSelectedExperience(null);
      await fetchExperiences();
    } catch (error: any) {
      console.error('Error updating experience:', error);
      toast.error(error.message || 'Failed to update work experience');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this work experience?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('work_experiences')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Work experience deleted successfully');
      await fetchExperiences();
    } catch (error: any) {
      console.error('Error deleting experience:', error);
      toast.error(error.message || 'Failed to delete work experience');
    }
  };
  
  const startEditMode = (experience: any) => {
    setFormMode('edit');
    setSelectedExperience(experience.id);
    
    // Format arrays to string for form
    const keyAchievements = Array.isArray(experience.key_achievements)
      ? experience.key_achievements.join('\n')
      : '';
      
    const toolsUsed = Array.isArray(experience.tools_used)
      ? experience.tools_used.join(', ')
      : '';
    
    reset({
      id: experience.id,
      job_title: experience.job_title,
      company: experience.company,
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      description: experience.description,
      key_achievements: keyAchievements,
      tools_used: toolsUsed,
      is_current: experience.is_current
    });
  };
  
  const cancelForm = () => {
    setFormMode(null);
    setSelectedExperience(null);
    
    // If this was triggered from URL param, clear it
    if (location.search) {
      navigate('/admin/experiences');
    }
  };
  
  const onSubmit = (data: WorkExperienceFormData) => {
    if (formMode === 'create') {
      handleCreate(data);
    } else {
      handleEdit(data);
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Work Experience
        </h1>
        
        {!formMode && (
          <button
            onClick={() => navigate('/admin/experiences?action=new')}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-md"
          >
            <Plus size={18} className="mr-2" />
            Add Experience
          </button>
        )}
      </div>
      
      {formMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
              {formMode === 'create' ? 'Add New Work Experience' : 'Edit Work Experience'}
            </h2>
            <button
              onClick={cancelForm}
              className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formMode === 'edit' && (
              <input type="hidden" {...register('id')} />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="job_title" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Job Title *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Briefcase size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="job_title"
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.job_title 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="e.g., Frontend Developer"
                    {...register('job_title', { required: 'Job title is required' })}
                  />
                </div>
                {errors.job_title && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {errors.job_title.message}
                  </p>
                )}
              </div>
              
              <div>
                <label 
                  htmlFor="company" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Company *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Building size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="company"
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.company 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="e.g., Google"
                    {...register('company', { required: 'Company is required' })}
                  />
                </div>
                {errors.company && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {errors.company.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="start_date" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Start Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="start_date"
                    type="date"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.start_date 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    {...register('start_date', { required: 'Start date is required' })}
                  />
                </div>
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {errors.start_date.message}
                  </p>
                )}
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="end_date" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    End Date {!isCurrent && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex items-center">
                    <input
                      id="is_current"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      {...register('is_current')}
                    />
                    <label 
                      htmlFor="is_current" 
                      className="ml-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      I currently work here
                    </label>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="end_date"
                    type="date"
                    disabled={isCurrent}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.end_date 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isCurrent ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    {...register('end_date', { 
                      required: !isCurrent ? 'End date is required' : false 
                    })}
                  />
                </div>
                {errors.end_date && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {errors.end_date.message}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.description 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="Describe your responsibilities and scope..."
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="key_achievements" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Key Achievements (Optional)
                </label>
                <textarea
                  id="key_achievements"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter each achievement on a new line..."
                  {...register('key_achievements')}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter each achievement on a new line
                </p>
              </div>
              
              <div>
                <label 
                  htmlFor="tools_used" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Tools Used (Optional)
                </label>
                <textarea
                  id="tools_used"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., React, Figma, TypeScript..."
                  {...register('tools_used')}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Separate tools with commas
                </p>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={cancelForm}
                className="mr-4 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Experience
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {!formMode && (
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            </div>
          ) : experiences.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No work experiences found.
              </p>
              <button
                onClick={() => navigate('/admin/experiences?action=new')}
                className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-md"
              >
                <Plus size={18} className="mr-2" />
                Add Your First Experience
              </button>
            </div>
          ) : (
            experiences.map((experience) => (
              <div 
                key={experience.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                      {experience.job_title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                      {experience.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                      {format(parseISO(experience.start_date), 'MMM yyyy')} — {experience.is_current 
                        ? 'Present' 
                        : (experience.end_date 
                            ? format(parseISO(experience.end_date), 'MMM yyyy')
                            : 'Present'
                          )
                      }
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditMode(experience)}
                      className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(experience.id)}
                      className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {experience.description}
                </p>
                
                {experience.key_achievements && experience.key_achievements.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Key Achievements
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 pl-2 space-y-1">
                      {experience.key_achievements.map((achievement: string, index: number) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {experience.tools_used && experience.tools_used.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Tools Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {experience.tools_used.map((tool: string, index: number) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-sm rounded-full"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminExperiences; 