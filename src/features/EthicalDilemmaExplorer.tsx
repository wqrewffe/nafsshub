import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { exploreEthicalDilemma } from '../../services/geminiService';
import { EthicalDilemma, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { EthicalDilemmaIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "ethical-dilemma-explorer";

const EthicalDilemmaExplorer: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [dilemma, setDilemma] = useState<EthicalDilemma | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<EthicalDilemma> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setDilemma(null);
        try {
            const result = await exploreEthicalDilemma(topic);
            setDilemma(result);
             if (currentUser) {
              const historyItem = { input: topic, output: result };
              const savedItem = await addHistory<EthicalDilemma>(currentUser.uid, featureId, historyItem);
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
    
    const renderDilemma = (data: EthicalDilemma) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-violet-300">Scenario</h3>
          <p className="text-slate-300 p-3 bg-slate-700/50 rounded-lg">{data.scenario}</p>
          <div>
              <h4 className="font-bold text-slate-200 mb-2">Ethical Considerations:</h4>
              <div className="space-y-2">
                  {data.ethicalPrinciples.map((item, i) => (
                      <div key={i}>
                          <p className="font-semibold text-slate-200 capitalize">{item.principle}:</p>
                          <p className="text-slate-300 text-sm">{item.argument}</p>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <EthicalDilemmaIcon className="w-8 h-8 text-violet-400" />
                    <h2 className="text-2xl font-bold">Ethical Dilemmas</h2>
                </div>
                <p className="text-slate-400 mb-4">Explore the ethics of a clinical scenario.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Patient refusing treatment" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-violet-600 hover:bg-gradient-to-r from-violet-500 to-purple-500 shadow-md hover:shadow-lg hover:shadow-violet-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Explore'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {dilemma && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderDilemma(dilemma)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderDilemma(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default EthicalDilemmaExplorer;
