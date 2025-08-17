import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getEthicalGuidance } from '../../services/geminiService';
import { EthicalGuidance, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { EthicalCompassIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "ethical-compass";

const EthicalCompass: React.FC = () => {
    const [aiUse, setAiUse] = useState('');
    const [guidance, setGuidance] = useState<EthicalGuidance | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<EthicalGuidance> | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiUse || isLoading) return;
        setIsLoading(true);
        setError(null);
        setGuidance(null);
        try {
            const result = await getEthicalGuidance(aiUse);
            setGuidance(result);
            if (currentUser) {
              const historyItem = { input: aiUse, output: result };
              const savedItem = await addHistory<EthicalGuidance>(currentUser.uid, featureId, historyItem);
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

    const renderGuidance = (data: EthicalGuidance) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-teal-300">Recommendation: <span className="font-extrabold">{data.recommendation}</span></h3>
          <p className="text-slate-300">{data.guidance}</p>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <EthicalCompassIcon className="w-8 h-8 text-teal-400" />
                    <h2 className="text-2xl font-bold">Ethical Compass for AI</h2>
                </div>
                <p className="text-slate-400 mb-4">Check if your AI use follows academic integrity.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <textarea value={aiUse} onChange={(e) => setAiUse(e.target.value)} placeholder="e.g., Using AI to summarize sources for my paper..." rows={2} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-teal-600 hover:bg-gradient-to-r from-teal-500 to-cyan-500 shadow-md hover:shadow-lg hover:shadow-teal-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-full" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Get Guidance'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {guidance && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderGuidance(guidance)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderGuidance(item.output)}
                onUseHistoryItem={(input) => setAiUse(input)}
              />
            )}
        </div>
    );
};

export default EthicalCompass;
