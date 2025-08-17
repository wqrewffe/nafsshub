import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';

const Layout: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white selection:bg-cyan-300 selection:text-cyan-900">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-400 opacity-20 blur-[100px]"></div></div>
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12 relative">
          <div className="absolute top-0 right-0 flex items-center gap-4">
            {currentUser ? (
              <>
                <span className="text-slate-400 text-sm hidden sm:inline">{currentUser.email}</span>
                 {currentUser.email === 'nafisabdullah424@gmail.com' && (
                  <Link to="/admin" className="px-4 py-2 text-sm font-semibold text-yellow-300 bg-slate-800/60 border border-slate-700 rounded-lg hover:bg-slate-700/80 transition-colors">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={logout} 
                  className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-800/60 border border-slate-700 rounded-lg hover:bg-slate-700/80 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-800/60 border border-slate-700 rounded-lg hover:bg-slate-700/80 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="pt-14 sm:pt-0">
            <Link to="/" className="inline-flex flex-col items-center group transition-transform duration-300 hover:scale-105">
              <Logo className="mb-2 h-16 w-16" />
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                Nafs Hub
              </h1>
            </Link>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Your personal AI companion for mindful learning and growth.
            </p>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
