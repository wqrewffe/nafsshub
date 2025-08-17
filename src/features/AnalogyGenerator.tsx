import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateAnalogy } from '../../services/geminiService';
import { Analogy, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { AnalogyIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "analogy-generator";

const AnalogyGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [analogy, setAnalogy] = useState<Analogy | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<Analogy> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setAnalogy(null);
        try {
            const result = await generateAnalogy(topic);
            setAnalogy(result);
            if (currentUser) {
              const historyItem = { input: topic, output: result };
              const savedItem = await addHistory<Analogy>(currentUser.uid, featureId, historyItem);
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

    const renderAnalogy = (data: Analogy) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-lime-300">{data.topic} is like...</h3>
          <p className="text-2xl font-bold text-slate-100">...{data.analogy}</p>
          <p className="text-slate-300">{data.explanation}</p>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <AnalogyIcon className="w-8 h-8 text-lime-400" />
                    <h2 className="text-2xl font-bold">Analogy Generator</h2>
                </div>
                <p className="text-slate-400 mb-4">Explain a complex topic with a simple analogy.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Photosynthesis" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-lime-400 focus:border-lime-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-lime-600 hover:bg-gradient-to-r from-lime-500 to-green-500 shadow-md hover:shadow-lg hover:shadow-lime-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Explain'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {analogy && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderAnalogy(analogy)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderAnalogy(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default AnalogyGenerator;
