import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardCard } from '../components/DashboardCard';
import { LoaderIcon } from '../components/Icons';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase/config';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signup, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    setError('');
    setLoading(true);
    try {
      await signup(email, password);
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        await logout(); // Log out to force login after verification
        setSignupSuccess(true); // Show success message
      } else {
        throw new Error("Could not find user to send verification email.");
      }
    } catch (err: any) {
      let message = 'Failed to create an account.';
      switch (err.code) {
          case 'auth/email-already-in-use':
              message = 'An account with this email already exists.';
              break;
          case 'auth/weak-password':
              message = 'Password is too weak. It should be at least 6 characters.';
              break;
          case 'auth/invalid-email':
              message = 'The email address is not valid.';
              break;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <DashboardCard>
        {signupSuccess ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-slate-100">Account Created!</h2>
            <p className="bg-green-500/20 text-green-300 p-3 rounded-md mb-4">
              A verification link has been sent to your email address. Please verify your account before logging in.
            </p>
            <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">Sign Up</h2>
            {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{error}</p>}
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
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-all"
                />
              </div>
               <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-400 mb-1">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-all"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center h-10">
                {loading ? <LoaderIcon className="w-6 h-6" /> : 'Sign Up'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Already have an account? <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">Log In</Link>
              </p>
            </div>
          </>
        )}
      </DashboardCard>
    </div>
  );
};

export default Signup;