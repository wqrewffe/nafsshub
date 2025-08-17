import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { visualizeFutureSelf } from '../../services/geminiService';
import { FutureSelfNarrative, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { FutureSelfIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "future-self-visualizer";

const FutureSelfVisualizer: React.FC = () => {
    const [goal, setGoal] = useState('');
    const [futureSelf, setFutureSelf] = useState<FutureSelfNarrative | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<FutureSelfNarrative> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal || isLoading) return;
        setIsLoading(true);
        setError(null);
        setFutureSelf(null);
        try {
            const result = await visualizeFutureSelf(goal);
            setFutureSelf(result);
            if (currentUser) {
              const historyItem = { input: goal, output: result };
              const savedItem = await addHistory<FutureSelfNarrative>(currentUser.uid, featureId, historyItem);
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

    const renderNarrative = (data: FutureSelfNarrative) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-indigo-300">A Day in Your Future</h3>
          <p className="text-slate-300 whitespace-pre-wrap">{data.narrative}</p>
      </div>
    );
    
    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <FutureSelfIcon className="w-8 h-8 text-indigo-400" />
                    <h2 className="text-2xl font-bold">Future Self Visualizer</h2>
                </div>
                <p className="text-slate-400 mb-4">Describe a long-term goal for a motivational story.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Become a successful neurosurgeon" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-indigo-600 hover:bg-gradient-to-r from-indigo-500 to-violet-500 shadow-md hover:shadow-lg hover:shadow-indigo-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Visualize'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {futureSelf && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderNarrative(futureSelf)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
                <HistoryDisplay
                    featureId={featureId}
                    newHistoryItem={newHistoryItem}
                    renderItem={(item) => renderNarrative(item.output)}
                    onUseHistoryItem={(input) => setGoal(input)}
                />
            )}
        </div>
    );
};

export default FutureSelfVisualizer;
