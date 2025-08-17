import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { analyzeArgument } from '../../services/geminiService';
import { ArgumentAnalysis, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { ArgumentAnalysisIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "argument-deconstructor";

const ArgumentDeconstructor: React.FC = () => {
    const [argumentText, setArgumentText] = useState('');
    const [analysis, setAnalysis] = useState<ArgumentAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<ArgumentAnalysis> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!argumentText || isLoading) return;
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await analyzeArgument(argumentText);
            setAnalysis(result);
            if (currentUser) {
              const historyItem = { input: argumentText, output: result };
              const savedItem = await addHistory<ArgumentAnalysis>(currentUser.uid, featureId, historyItem);
              setNewHistoryItem(savedItem);
              trackToolUsage(currentUser.uid, featureId).catch(console.error);
            }
        } catch (err) {
            console.error("API call failed:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderAnalysis = (data: ArgumentAnalysis) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-rose-300">Argument Analysis</h3>
          <p><strong className="font-semibold text-slate-200">Main Claim:</strong> {data.mainClaim}</p>
          <div>
              <h4 className="font-semibold text-slate-200">Potential Fallacies:</h4>
              {data.potentialFallacies.length > 0 ? (
                  <div className="space-y-2 mt-1">
                      {data.potentialFallacies.map((fallacy, i) => (
                          <div key={i} className="p-2 bg-slate-700/50 rounded-md text-sm">
                              <p className="font-bold text-slate-200">{fallacy.fallacy}</p>
                              <p className="italic text-slate-300">{fallacy.explanation}</p>
                          </div>
                      ))}
                  </div>
              ) : <p className="text-slate-400 text-sm">No obvious fallacies detected.</p>}
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <ArgumentAnalysisIcon className="w-8 h-8 text-rose-400" />
                    <h2 className="text-2xl font-bold">Argument Deconstructor</h2>
                </div>
                <p className="text-slate-400 mb-4">Paste an argument to analyze its structure and flaws.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <textarea value={argumentText} onChange={(e) => setArgumentText(e.target.value)} placeholder="Paste an op-ed or argument here..." rows={4} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-rose-600 hover:bg-gradient-to-r from-rose-500 to-pink-500 shadow-md hover:shadow-lg hover:shadow-rose-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-full" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Deconstruct'}
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
                onUseHistoryItem={(input) => setArgumentText(input)}
              />
            )}
        </div>
    );
};

export default ArgumentDeconstructor;
