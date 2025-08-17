import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardCard } from '../components/DashboardCard';
import { LoaderIcon, GoogleIcon } from '../components/Icons';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear location state so message doesn't persist on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      let message = 'Failed to log in.';
      switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
              message = 'Invalid email or password.';
              break;
          case 'auth/too-many-requests':
              message = 'Too many login attempts. Please try again later.';
              break;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    setGoogleLoading(true);
    try {
        await signInWithGoogle();
        navigate('/');
    } catch (err: any) {
        setError('Failed to sign in with Google. Please try again.');
        console.error(err);
    } finally {
        setGoogleLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <DashboardCard>
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">Log In</h2>
        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{error}</p>}
        {message && <p className="bg-blue-500/20 text-blue-300 p-3 rounded-md mb-4 text-center">{message}</p>}
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
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Forgot Password?</Link>
          </div>
          <button type="submit" disabled={loading || googleLoading} className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center h-10">
            {loading ? <LoaderIcon className="w-6 h-6" /> : 'Log In'}
          </button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-800/60 backdrop-blur-sm px-2 text-slate-400">Or continue with</span>
          </div>
        </div>
        <div>
          <button onClick={handleGoogleSignIn} disabled={loading || googleLoading} className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center h-10 gap-2">
            {googleLoading ? <LoaderIcon className="w-6 h-6" /> : <><GoogleIcon className="w-5 h-5" /> Sign in with Google</>}
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Need an account? <Link to="/signup" className="font-medium text-cyan-400 hover:text-cyan-300">Sign Up</Link>
          </p>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Login;