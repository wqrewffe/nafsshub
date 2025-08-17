import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { refineGoal } from '../../services/geminiService';
import { SmartGoal, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { TargetIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "smart-goal-refiner";

const SmartGoalRefiner: React.FC = () => {
    const [goal, setGoal] = useState('');
    const [smartGoal, setSmartGoal] = useState<SmartGoal | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<SmartGoal> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal || isLoading) return;
        setIsLoading(true);
        setError(null);
        setSmartGoal(null);
        try {
            const result = await refineGoal(goal);
            setSmartGoal(result);
            if (currentUser) {
              const historyItem = { input: goal, output: result };
              const savedItem = await addHistory<SmartGoal>(currentUser.uid, featureId, historyItem);
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

    const renderGoal = (data: SmartGoal) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-fuchsia-300">Your Refined Goal</h3>
          <p><strong className="font-semibold text-slate-200">Goal:</strong> {data.refinedGoal}</p>
          <div className="space-y-2">
              <p><strong className="font-semibold text-slate-200">S:</strong> {data.specific}</p>
              <p><strong className="font-semibold text-slate-200">M:</strong> {data.measurable}</p>
              <p><strong className="font-semibold text-slate-200">A:</strong> {data.achievable}</p>
              <p><strong className="font-semibold text-slate-200">R:</strong> {data.relevant}</p>
              <p><strong className="font-semibold text-slate-200">T:</strong> {data.timeBound}</p>
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <TargetIcon className="w-8 h-8 text-fuchsia-400" />
                    <h2 className="text-2xl font-bold">S.M.A.R.T. Goal Refiner</h2>
                </div>
                <p className="text-slate-400 mb-4">Turn your ambitions into actionable plans.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Get better at math" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-fuchsia-600 hover:bg-gradient-to-r from-fuchsia-500 to-pink-500 shadow-md hover:shadow-lg hover:shadow-fuchsia-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Refine'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {smartGoal && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderGoal(smartGoal)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderGoal(item.output)}
                onUseHistoryItem={(input) => setGoal(input)}
              />
            )}
        </div>
    );
};

export default SmartGoalRefiner;
