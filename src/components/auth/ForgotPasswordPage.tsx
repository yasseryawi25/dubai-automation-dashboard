import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    const result = await resetPassword(email);
    setLoading(false);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to send reset email');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-gold to-primary-blue flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            Check Your Email
          </h1>
          <p className="text-neutral-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-neutral-500 mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-gold hover:bg-primary-gold-dark"
            >
              Back to Sign In
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="inline-flex items-center justify-center w-full py-3 px-4 border border-neutral-300 rounded-lg shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-gold to-primary-blue flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-gold rounded-full mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            Reset Your Password
          </h1>
          <p className="text-neutral-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                placeholder="you@company.com"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-gold hover:bg-primary-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-primary-gold hover:text-primary-gold-dark font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;