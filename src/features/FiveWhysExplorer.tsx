import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { exploreRootCause } from '../../services/geminiService';
import { RootCauseAnalysis, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { RootCauseIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "five-whys-explorer";

const FiveWhysExplorer: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [analysis, setAnalysis] = useState<RootCauseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<RootCauseAnalysis> | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || isLoading) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await exploreRootCause(problem);
      setAnalysis(result);
      if (currentUser) {
        const historyItem = { input: problem, output: result };
        const savedItem = await addHistory<RootCauseAnalysis>(currentUser.uid, featureId, historyItem);
        setNewHistoryItem(savedItem);
        trackToolUsage(currentUser.uid, featureId).catch(console.error);
      }
    } catch (error) {
      console.error("API call failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnalysis = (data: RootCauseAnalysis) => (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold text-yellow-300">Root Cause Analysis</h3>
      <p className="text-slate-300 italic p-3 bg-slate-700/50 rounded-lg">Problem: "{data.problemStatement}"</p>
      <div className="space-y-2 border-l-2 border-slate-600 pl-4">
          {data.analysis.map((item, i) => (
              <div key={i}>
                  <p className="font-semibold text-slate-200">Why {i+1}?</p>
                  <p className="text-slate-300">{item.reason}</p>
              </div>
          ))}
      </div>
        <p className="text-slate-100 font-semibold p-3 bg-yellow-600/20 border border-yellow-500 rounded-lg">Root Cause: {data.rootCause}</p>
    </div>
  );

  return (
    <div>
      <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
      <DashboardCard>
        <div className="flex items-center gap-4 mb-4">
          <RootCauseIcon className="w-8 h-8 text-yellow-400"/>
          <h2 className="text-2xl font-bold">The Five Whys Explorer</h2>
        </div>
        <p className="text-slate-400 mb-4">State a problem to uncover its root cause.</p>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input type="text" value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="e.g., I keep procrastinating on my essay" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-all" disabled={isLoading}/>
            <button type="submit" className="bg-yellow-600 hover:bg-gradient-to-r from-yellow-500 to-amber-500 shadow-md hover:shadow-lg hover:shadow-yellow-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
              {isLoading ? <LoaderIcon className="w-5 h-5"/> : 'Dig Deeper'}
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-red-400">{error}</p>}
        {analysis && (
          <div className="mt-6 animate-fade-in-up">
            {renderAnalysis(analysis)}
          </div>
        )}
      </DashboardCard>

      {currentUser && (
        <HistoryDisplay
            featureId={featureId}
            newHistoryItem={newHistoryItem}
            renderItem={(item) => renderAnalysis(item.output)}
            onUseHistoryItem={(input) => setProblem(input)}
        />
      )}
    </div>
  );
};

export default FiveWhysExplorer;
