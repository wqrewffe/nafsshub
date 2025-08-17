import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardCard } from '../components/DashboardCard';
import { AlertTriangleIcon } from '../components/Icons';

const NotFound: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto text-center mt-12 animate-fade-in-up">
      <DashboardCard>
        <AlertTriangleIcon className="w-24 h-24 mx-auto text-yellow-400/80 mb-6" />
        <h1 className="text-5xl font-extrabold text-white mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-300 mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          Oops! The page you're looking for seems to have vanished into the digital ether.
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 text-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
        >
          Return to Dashboard
        </Link>
      </DashboardCard>
    </div>
  );
};

export default NotFound;
