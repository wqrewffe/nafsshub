import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createMetaphors } from '../../services/geminiService';
import { CreativeMetaphor, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { MetaphorCreatorIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "metaphor-creator";

const MetaphorCreator: React.FC = () => {
    const [concept, setConcept] = useState('');
    const [metaphors, setMetaphors] = useState<CreativeMetaphor | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<CreativeMetaphor> | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!concept || isLoading) return;
        setIsLoading(true);
        setError(null);
        setMetaphors(null);
        try {
            const result = await createMetaphors(concept);
            setMetaphors(result);
            if (currentUser) {
              const historyItem = { input: concept, output: result };
              const savedItem = await addHistory<CreativeMetaphor>(currentUser.uid, featureId, historyItem);
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
    
    const renderMetaphors = (data: CreativeMetaphor) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-fuchsia-300">Metaphors for {data.concept}</h3>
          <div className="space-y-3">
              {data.metaphors.map((item, i) => (
                  <div key={i} className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="font-bold text-slate-100">"{item.metaphor}"</p>
                      <p className="text-sm text-slate-300 mt-1">{item.explanation}</p>
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
                    <MetaphorCreatorIcon className="w-8 h-8 text-fuchsia-400" />
                    <h2 className="text-2xl font-bold">Metaphor Creator</h2>
                </div>
                <p className="text-slate-400 mb-4">Enter a concept to generate creative metaphors.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="e.g., Justice, Memory" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-fuchsia-600 hover:bg-gradient-to-r from-fuchsia-500 to-pink-500 shadow-md hover:shadow-lg hover:shadow-fuchsia-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Create'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {metaphors && (
                    <div className="mt-6 animate-fade-in-up">
                      {renderMetaphors(metaphors)}
                    </div>
                )}
            </DashboardCard>
            
            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderMetaphors(item.output)}
                onUseHistoryItem={(input) => setConcept(input)}
              />
            )}
        </div>
    );
};

export default MetaphorCreator;
