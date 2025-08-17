import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deconstructMedicalTerm } from '../../services/geminiService';
import { DeconstructedTerm, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { MedicalTermIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "medical-term-deconstructor";

const MedicalTermDeconstructor: React.FC = () => {
    const [term, setTerm] = useState('');
    const [deconstructedTerm, setDeconstructedTerm] = useState<DeconstructedTerm | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<DeconstructedTerm> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!term || isLoading) return;
        setIsLoading(true);
        setError(null);
        setDeconstructedTerm(null);
        try {
            const result = await deconstructMedicalTerm(term);
            setDeconstructedTerm(result);
            if (currentUser) {
              const historyItem = { input: term, output: result };
              const savedItem = await addHistory<DeconstructedTerm>(currentUser.uid, featureId, historyItem);
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
    
    const renderTerm = (data: DeconstructedTerm) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-lime-300">{data.term}</h3>
          <p className="text-slate-300">{data.definition}</p>
          <div className="space-y-2">
              {data.breakdown.map((part, i) => (
                  <div key={i} className="p-2 bg-slate-700/50 rounded-md text-sm">
                      <span className="font-bold text-slate-200 capitalize">{part.type}: </span>
                      <span className="font-mono text-cyan-300">{part.part}</span> -
                      <span className="italic text-slate-300"> {part.meaning}</span>
                  </div>
              ))}
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <MedicalTermIcon className="w-8 h-8 text-lime-400" />
                    <h2 className="text-2xl font-bold">Term Deconstructor</h2>
                </div>
                <p className="text-slate-400 mb-4">Break down any complex medical term.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="e.g., Cholecystectomy" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-lime-400 focus:border-lime-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-lime-600 hover:bg-gradient-to-r from-lime-500 to-green-500 shadow-md hover:shadow-lg hover:shadow-lime-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Deconstruct'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {deconstructedTerm && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderTerm(deconstructedTerm)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderTerm(item.output)}
                onUseHistoryItem={(input) => setTerm(input)}
              />
            )}
        </div>
    );
};

export default MedicalTermDeconstructor;
