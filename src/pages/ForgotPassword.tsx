import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardCard } from '../components/DashboardCard';
import { LoaderIcon } from '../components/Icons';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Check your inbox for further instructions.');
    } catch (err: any) {
      let friendlyMessage = 'Failed to reset password.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        friendlyMessage = 'No account found with that email address.';
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <DashboardCard>
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">Reset Password</h2>
        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{error}</p>}
        {message && <p className="bg-green-500/20 text-green-300 p-3 rounded-md mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-all"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center h-10">
            {loading ? <LoaderIcon className="w-6 h-6" /> : 'Reset Password'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">Back to Login</Link>
          </p>
        </div>
      </DashboardCard>
    </div>
  );
};

export default ForgotPassword;