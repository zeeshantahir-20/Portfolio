import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Save, User as UserIcon, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface ProfileFormData {
  fullName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<{ fullName: string } | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'password'>('profile');
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch,
    formState: { errors } 
  } = useForm<ProfileFormData>();
  
  const newPassword = watch('newPassword');
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        // Get profile data from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (data) {
          setProfileData({ fullName: data.full_name || '' });
          reset({ fullName: data.full_name || '', email: user.email || '' });
        } else {
          // Create a profile if it doesn't exist
          await supabase.from('profiles').insert({
            id: user.id,
            full_name: '',
            updated_at: new Date()
          });
          
          setProfileData({ fullName: '' });
          reset({ fullName: '', email: user.email || '' });
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
      }
    };
    
    fetchProfile();
  }, [user, reset]);
  
  const updateProfile = async (data: ProfileFormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          updated_at: new Date()
        })
        .eq('id', user.id);
      
      if (profileError) {
        throw profileError;
      }
      
      setProfileData({ fullName: data.fullName });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const updatePassword = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      // First verify the current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: data.currentPassword
      });
      
      if (signInError) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (passwordError) {
        throw passwordError;
      }
      
      // Clear password fields
      reset({
        fullName: profileData?.fullName || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password updated successfully');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = (data: ProfileFormData) => {
    if (activeSection === 'profile') {
      updateProfile(data);
    } else {
      updatePassword(data);
    }
  };
  
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Profile Settings
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-6 py-4 font-medium ${
              activeSection === 'profile'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveSection('profile')}
          >
            <div className="flex items-center">
              <UserIcon size={18} className="mr-2" />
              Profile Information
            </div>
          </button>
          
          <button
            className={`px-6 py-4 font-medium ${
              activeSection === 'password'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveSection('password')}
          >
            <div className="flex items-center">
              <Lock size={18} className="mr-2" />
              Change Password
            </div>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {activeSection === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <label 
                    htmlFor="fullName" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.fullName 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Your full name"
                    {...register('fullName')}
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
                      disabled
                      {...register('email')}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
            
            {activeSection === 'password' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <label 
                    htmlFor="currentPassword" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.currentPassword 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="••••••••"
                    {...register('currentPassword', { 
                      required: 'Current password is required'
                    })}
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label 
                    htmlFor="newPassword" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.newPassword 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="••••••••"
                    {...register('newPassword', { 
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label 
                    htmlFor="confirmPassword" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.confirmPassword 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="••••••••"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your new password',
                      validate: value => 
                        value === newPassword || 'The passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900 mt-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Important security notice
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
                        <p>
                          After changing your password, you'll remain signed in on this device,
                          but will be signed out from any other devices you're logged into.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings; 