import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { checkDrugInteraction } from '../../services/geminiService';
import { DrugInteraction, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { DrugInteractionIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "drug-interaction-checker";

const DrugInteractionChecker: React.FC = () => {
    const [drugNames, setDrugNames] = useState('');
    const [interaction, setInteraction] = useState<DrugInteraction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<DrugInteraction> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!drugNames || isLoading) return;
        setIsLoading(true);
        setError(null);
        setInteraction(null);
        try {
            const result = await checkDrugInteraction(drugNames);
            setInteraction(result);
            if (currentUser) {
              const historyItem = { input: drugNames, output: result };
              const savedItem = await addHistory<DrugInteraction>(currentUser.uid, featureId, historyItem);
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
    
    const renderInteraction = (data: DrugInteraction) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-amber-300">Interaction: <span className="text-slate-200">{data.drugs.join(' + ')}</span></h3>
          <p><strong className="font-semibold text-slate-200">Type:</strong> {data.interactionType}</p>
          <p><strong className="font-semibold text-slate-200">Mechanism:</strong> {data.mechanism}</p>
          <p><strong className="font-semibold text-slate-200">Clinical Significance:</strong> {data.clinicalSignificance}</p>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <DrugInteractionIcon className="w-8 h-8 text-amber-400" />
                    <h2 className="text-2xl font-bold">Drug Interaction</h2>
                </div>
                <p className="text-slate-400 mb-4">Check interactions between drugs (comma-separated).</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={drugNames} onChange={(e) => setDrugNames(e.target.value)} placeholder="e.g., Warfarin, Aspirin" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-amber-600 hover:bg-gradient-to-r from-amber-500 to-orange-500 shadow-md hover:shadow-lg hover:shadow-amber-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Check'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {interaction && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderInteraction(interaction)}
                    </div>
                )}
            </DashboardCard>
            
            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderInteraction(item.output)}
                onUseHistoryItem={(input) => setDrugNames(input)}
              />
            )}
        </div>
    );
};

export default DrugInteractionChecker;
