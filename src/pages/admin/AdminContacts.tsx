import { useState, useEffect } from 'react';
import { Mail, Check, X, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import type { Contact } from '../../lib/supabase';

const AdminContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchContacts();
  }, []);
  
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };
  
  const openModal = (contact: Contact) => {
    setCurrentContact(contact);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentContact(null);
  };
  
  const markAsResponded = async (contact: Contact) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('contacts')
        .update({ responded: true })
        .eq('id', contact.id);
        
      if (error) throw error;
      
      toast.success('Message marked as responded');
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update message status');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Contact Messages
        </h1>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-24 bg-white dark:bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          {contacts.length > 0 ? (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div 
                  key={contact.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${
                    !contact.responded ? 'border-l-4 border-primary-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white mr-3">
                          {contact.name}
                        </h3>
                        {!contact.responded && (
                          <span className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {formatDate(contact.created_at)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={`mailto:${contact.email}`}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        title="Reply via email"
                      >
                        <Mail size={18} />
                      </a>
                      <button
                        onClick={() => openModal(contact)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                        title="View full message"
                      >
                        <ExternalLink size={18} />
                      </button>
                      {!contact.responded && (
                        <button
                          onClick={() => markAsResponded(contact)}
                          disabled={isSubmitting}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition-colors"
                          title="Mark as responded"
                        >
                          <Check size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                    {contact.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Mail size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="font-display text-xl font-medium text-gray-900 dark:text-white mb-2">
                No messages yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Contact messages will appear here when visitors send them.
              </p>
            </div>
          )}
        </>
      )}
      
      {/* View Message Modal */}
      {isModalOpen && currentContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  Message Details
                </h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      From
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {currentContact.name}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Email
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {currentContact.email}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Sent on
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(currentContact.created_at)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Message
                    </h4>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {currentContact.message}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${currentContact.email}`}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors shadow-sm hover:shadow-md inline-flex items-center"
                  >
                    <Mail size={18} className="mr-2" />
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;