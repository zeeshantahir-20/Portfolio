import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Plus, Edit, Trash2, Check, X, Star, Settings, Save
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import type { Service } from '../../lib/supabase';

interface ServiceFormData {
  name: string;
  description: string;
  icon: string;
  price: string;
  featured: boolean;
}

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm<ServiceFormData>();
  
  useEffect(() => {
    fetchServices();
    
    // Check if URL has action=new parameter to open the creation form
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'new') {
      openCreateModal();
    }
  }, [location]);
  
  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };
  
  const openCreateModal = () => {
    setCurrentService(null);
    reset({
      name: '',
      description: '',
      icon: '',
      price: '',
      featured: false
    });
    setIsModalOpen(true);
    
    // Update URL without full navigation
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('action', 'new');
    window.history.pushState({ path: newUrl.toString() }, '', newUrl.toString());
  };
  
  const openEditModal = (service: Service) => {
    setCurrentService(service);
    setValue('name', service.name);
    setValue('description', service.description);
    setValue('icon', service.icon);
    setValue('price', service.price?.toString() || '');
    setValue('featured', service.featured);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    // Remove action from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('action');
    window.history.pushState({ path: newUrl.toString() }, '', newUrl.toString());
  };
  
  const openDeleteModal = (service: Service) => {
    setCurrentService(service);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  
  const onSubmit = async (data: ServiceFormData) => {
    try {
      setIsSubmitting(true);
      
      const serviceData = {
        name: data.name,
        description: data.description,
        icon: data.icon,
        price: data.price ? parseFloat(data.price) : null,
        featured: data.featured
      };
      
      if (currentService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', currentService.id);
          
        if (error) throw error;
        
        toast.success('Service updated successfully');
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
          
        if (error) throw error;
        
        toast.success('Service created successfully');
      }
      
      // Refresh services and close modal
      fetchServices();
      closeModal();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteService = async () => {
    if (!currentService) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', currentService.id);
        
      if (error) throw error;
      
      toast.success('Service deleted successfully');
      fetchServices();
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleFeatured = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ featured: !service.featured })
        .eq('id', service.id);
        
      if (error) throw error;
      
      toast.success(`Service ${!service.featured ? 'featured' : 'unfeatured'} successfully`);
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Services
        </h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add Service
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
          {services.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col\" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
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
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center">
                              <span dangerouslySetInnerHTML={{ __html: service.icon }} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {service.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                {service.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {service.price ? (
                            <span className="text-sm text-gray-900 dark:text-white">
                              ${service.price}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Not set
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleFeatured(service)}
                            className={`p-1 rounded-md ${
                              service.featured 
                                ? 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30' 
                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            title={service.featured ? 'Remove from featured' : 'Add to featured'}
                          >
                            <Star size={20} className={service.featured ? 'fill-yellow-500' : ''} />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(service)}
                              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md"
                              title="Edit service"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(service)}
                              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"
                              title="Delete service"
                            >
                              <Trash2 size={18} />
                            </button>
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
              <Settings size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="font-display text-xl font-medium text-gray-900 dark:text-white mb-2">
                No services yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by adding your first service offering.
              </p>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md inline-flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add Service
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
                  {currentService ? 'Edit Service' : 'Create New Service'}
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
                      htmlFor="name" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Service Name*
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`w-full px-3 py-2 rounded-md border ${
                        errors.name 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="E.g., Web Development"
                      {...register('name', { required: 'Service name is required' })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.name.message}
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
                      placeholder="Describe your service..."
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
                      htmlFor="icon" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Icon HTML*
                    </label>
                    <input
                      id="icon"
                      type="text"
                      className={`w-full px-3 py-2 rounded-md border ${
                        errors.icon 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      placeholder="<svg>...</svg> or icon HTML"
                      {...register('icon', { required: 'Icon HTML is required' })}
                    />
                    {errors.icon && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {errors.icon.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="price" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Price (optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                      <input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full pl-7 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="99.99"
                        {...register('price')}
                      />
                    </div>
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
                      Feature this service on the homepage
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
                        Save Service
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
                  Delete Service
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Are you sure you want to delete "{currentService?.name}"? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteService}
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

export default AdminServices;