'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

export default function VerifyEmailPage() {
  const { user, resendEmailVerification } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error, resend
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token === 'verification-token') {
      // Simulate email verification success
      setStatus('success');
      setMessage('Your email has been verified successfully!');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } else {
      setStatus('error');
      setMessage('Invalid verification link. Please try again.');
    }
  }, [searchParams, router]);

  const handleResendVerification = async () => {
    try {
      setStatus('loading');
      await resendEmailVerification();
      setStatus('success');
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setStatus('error');
      setMessage('Failed to send verification email. Please try again.');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <FaSpinner className="animate-spin text-blue-500" size={48} />;
      case 'success':
        return <FaCheckCircle className="text-green-500" size={48} />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" size={48} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verification
          </h1>
          
          <p className={`mb-6 ${getStatusColor()}`}>
            {message}
          </p>

          {status === 'error' && (
            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
              >
                Resend Verification Email
              </button>
              
              <button
                onClick={() => router.push('/login')}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {status === 'loading' && (
            <p className="text-sm text-gray-500">
              Verifying your email...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
