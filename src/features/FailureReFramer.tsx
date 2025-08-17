import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { reframeFailure } from '../../services/geminiService';
import { FailureReframing, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { FailureReframeIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "failure-re-framer";

const FailureReFramer: React.FC = () => {
    const [description, setDescription] = useState('');
    const [reframing, setReframing] = useState<FailureReframing | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<FailureReframing> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || isLoading) return;
        setIsLoading(true);
        setError(null);
        setReframing(null);
        try {
            const result = await reframeFailure(description);
            setReframing(result);
            if (currentUser) {
              const historyItem = { input: description, output: result };
              const savedItem = await addHistory<FailureReframing>(currentUser.uid, featureId, historyItem);
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

    const renderReframing = (data: FailureReframing) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-green-300">From Setback to Stepping Stone</h3>
          <div>
              <h4 className="font-semibold text-slate-200">Lessons Learned:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                  {data.lessonsLearned.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
          </div>
          <div>
              <h4 className="font-semibold text-slate-200">Actionable Next Steps:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                  {data.actionableSteps.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <FailureReframeIcon className="w-8 h-8 text-green-400" />
                    <h2 className="text-2xl font-bold">Failure Re-framer</h2>
                </div>
                <p className="text-slate-400 mb-4">Describe a setback to turn it into a lesson.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., I bombed my presentation..." rows={3} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-green-600 hover:bg-gradient-to-r from-green-500 to-emerald-500 shadow-md hover:shadow-lg hover:shadow-green-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-full" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Re-frame It'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {reframing && (
                    <div className="mt-6 animate-fade-in-up">
                      {renderReframing(reframing)}
                    </div>
                )}
            </DashboardCard>
            
            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderReframing(item.output)}
                onUseHistoryItem={(input) => setDescription(input)}
              />
            )}
        </div>
    );
};

export default FailureReFramer;
