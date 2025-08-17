import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistoricalContext } from '../../services/geminiService';
import { HistoricalContext as HistoricalContextType, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { HistoryIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "historical-context";

const HistoricalContext: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [context, setContext] = useState<HistoricalContextType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<HistoricalContextType> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setContext(null);
        try {
            const result = await getHistoricalContext(topic);
            setContext(result);
            if (currentUser) {
              const historyItem = { input: topic, output: result };
              const savedItem = await addHistory<HistoricalContextType>(currentUser.uid, featureId, historyItem);
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
    
    const renderContext = (data: HistoricalContextType) => (
      <div className="space-y-4">
          <h3 className="text-xl font-semibold text-yellow-300">{data.topic}</h3>
          <p className="text-slate-300">{data.summary}</p>
          <div>
              <h4 className="font-semibold text-slate-200">Key Figures:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                  {data.keyFigures.map((figure, i) => (
                      <span key={i} className="bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1 rounded-full">{figure}</span>
                  ))}
              </div>
          </div>
          <div>
              <h4 className="font-semibold text-slate-200">Timeline:</h4>
              <ul className="mt-2 space-y-1 text-slate-300 border-l-2 border-slate-600 pl-4">
                  {data.timeline.map((item, i) => <li key={i}><strong className="text-slate-100">{item.date}:</strong> {item.event}</li>)}
              </ul>
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <HistoryIcon className="w-8 h-8 text-yellow-400" />
                    <h2 className="text-2xl font-bold">Historical Context</h2>
                </div>
                <p className="text-slate-400 mb-4">Understand the background of any event or topic.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The Space Race" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-yellow-600 hover:bg-gradient-to-r from-yellow-500 to-amber-500 shadow-md hover:shadow-lg hover:shadow-yellow-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Uncover'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {context && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderContext(context)}
                    </div>
                )}
            </DashboardCard>
            
            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderContext(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default HistoricalContext;
