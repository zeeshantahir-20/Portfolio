import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Plus, Edit, Trash2, X, Star, Save
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import type { Testimonial } from '../../lib/supabase';

interface TestimonialFormData {
  client_name: string;
  client_company: string;
  project_type: string;
  review: string;
  rating: string;
  image_url: string;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm<TestimonialFormData>();
  
  useEffect(() => {
    fetchTestimonials();
    
    // Check if URL has action=new parameter to open the creation form
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'new') {
      openCreateModal();
    }
  }, [location]);
  
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };
  
  const openCreateModal = () => {
    setCurrentTestimonial(null);
    reset({
      client_name: '',
      client_company: '',
      project_type: '',
      review: '',
      rating: '5',
      image_url: ''
    });
    setIsModalOpen(true);
    
    // Update URL without full navigation
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('action', 'new');
    window.history.pushState({ path: newUrl.toString() }, '', newUrl.toString());
  };
  
  const openEditModal = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setValue('client_name', testimonial.client_name);
    setValue('client_company', testimonial.client_company);
    setValue('project_type', testimonial.project_type);
    setValue('review', testimonial.review);
    setValue('rating', testimonial.rating.toString());
    setValue('image_url', testimonial.image_url || '');
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    // Remove action from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('action');
    window.history.pushState({ path: newUrl.toString() }, '', newUrl.toString());
  };
  
  const openDeleteModal = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  
  const onSubmit = async (data: TestimonialFormData) => {
    try {
      setIsSubmitting(true);
      
      const testimonialData = {
        client_name: data.client_name,
        client_company: data.client_company,
        project_type: data.project_type,
        review: data.review,
        rating: parseInt(data.rating),
        image_url: data.image_url || null
      };
      
      if (currentTestimonial) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', currentTestimonial.id);
          
        if (error) throw error;
        
        toast.success('Testimonial updated successfully');
      } else {
        // Create new testimonial
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData]);
          
        if (error) throw error;
        
        toast.success('Testimonial created successfully');
      }
      
      // Refresh testimonials and close modal
      fetchTestimonials();
      closeModal();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteTestimonial = async () => {
    if (!currentTestimonial) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', currentTestimonial.id);
        
      if (error) throw error;
      
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Testimonials
        </h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add Testimonial
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
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      {testimonial.image_url ? (
                        <img 
                          src={testimonial.image_url} 
                          alt={testimonial.client_name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xl font-medium">
                          {testimonial.client_name.charAt(0)}
                        </div>
                      )}
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {testimonial.client_name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.client_company}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(testimonial)}
                        className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md"
                        title="Edit testimonial"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(testimonial)}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"
                        title="Delete testimonial"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 mb-3">
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
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3 italic">
                    "{testimonial.review}"
                  </p>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Project: {testimonial.project_type}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Star size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="font-display text-xl font-medium text-gray-900 dark:text-white mb-2">
                No testimonials yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by adding your first client testimonial.
              </p>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md inline-flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add Testimonial
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  {currentTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
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
                      htmlFor="client_name" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Client Name*
                    </label>
                    <input
                      id="client_name"
                      type="text"
                      className={`w-full px-3 py-2 rounded-md border ${
                        errors.client_name 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="John Smith"
                      {...register('client_name', { required: 'Client name is required' })}
                    />
                    {errors.client_name && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.client_name.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="client_company" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Company/Organization*
                    </label>
                    <input
                      id="client_company"
                      type="text"
                      className={`w-full px-3 py-2 rounded-md border ${
                        errors.client_company 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Acme Inc."
                      {...register('client_company', { required: 'Company name is required' })}
                    />
                    {errors.client_company && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.client_company.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="project_type" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Project Type*
                    </label>
                    <input
                      id="project_type"
                      type="text"
                      className={`w-full px-3 py-2 rounded-md border ${
                        errors.project_type 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="Website Redesign"
                      {...register('project_type', { required: 'Project type is required' })}
                    />
                    {errors.project_type && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.project_type.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="review" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Review*
                    </label>
                    <textarea
                      id="review"
                      rows={4}
                      className={`w-full px-3 py-2 rounded-md border ${
                        errors.review 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none`}
                      placeholder="Write the client's review..."
                      {...register('review', { required: 'Review is required' })}
                    ></textarea>
                    {errors.review && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.review.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="rating" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Rating*
                    </label>
                    <select
                      id="rating"
                      className={`w-full px-3 py-2 rounded-md border ${
                        errors.rating 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      {...register('rating', { required: 'Rating is required' })}
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                    {errors.rating && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.rating.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="image_url" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Client Photo URL (optional)
                    </label>
                    <input
                      id="image_url"
                      type="text"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://example.com/photo.jpg"
                      {...register('image_url')}
                    />
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
                        Save Testimonial
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
                  Delete Testimonial
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Are you sure you want to delete this testimonial from {currentTestimonial?.client_name}? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteTestimonial}
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

export default AdminTestimonials;