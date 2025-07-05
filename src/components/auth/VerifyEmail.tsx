import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get parameters from URL
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const next = searchParams.get('next') || '/admin/login';

        if (token_hash && type === 'email_change') {
          // This handles the case when a user is changing their email
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          });
          
          if (error) {
            setStatus('error');
            setMessage(error.message || 'Failed to verify email');
          } else {
            setStatus('success');
            setMessage('Email verified successfully!');
            setTimeout(() => navigate(next), 3000);
          }
        } else if (token_hash && type === 'signup') {
          // This handles new user signups
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          });
          
          if (error) {
            setStatus('error');
            setMessage(error.message || 'Failed to verify email');
          } else {
            setStatus('success');
            setMessage('Email verified successfully! You can now log in.');
            setTimeout(() => navigate(next), 3000);
          }
        } else {
          setStatus('error');
          setMessage('Invalid verification link');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'An error occurred');
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4 ${
              status === 'loading' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
              status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 
              'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              {status === 'loading' ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-current"></div>
              ) : status === 'success' ? (
                <Check size={24} />
              ) : (
                <AlertTriangle size={24} />
              )}
            </div>
            
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              {status === 'loading' ? 'Verifying Email' : 
               status === 'success' ? 'Email Verified' : 
               'Verification Failed'}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              {message}
            </p>
          </div>
          
          {status !== 'loading' && (
            <div className="text-center">
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                {status === 'success' ? 'Go to Login' : 'Try Again'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail; 