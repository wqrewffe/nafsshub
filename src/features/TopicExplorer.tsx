import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { exploreTopic } from '../../services/geminiService';
import { TopicExploration, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { BulbIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "topic-explorer";

const TopicExplorer: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [exploration, setExploration] = useState<TopicExploration | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<TopicExploration> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setExploration(null);
        try {
            const result = await exploreTopic(topic);
            setExploration(result);
            if (currentUser) {
              const historyItem = { input: topic, output: result };
              const savedItem = await addHistory<TopicExploration>(currentUser.uid, featureId, historyItem);
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

    const renderExploration = (data: TopicExploration) => (
      <div className="space-y-4">
          <h3 className="text-xl font-semibold text-cyan-300">{data.topicName}</h3>
          <p className="text-slate-300">{data.simpleExplanation}</p>
          <div>
              <h4 className="font-semibold text-slate-200">Key Concepts:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                  {data.keyConcepts.map((concept, index) => <li key={index}>{concept}</li>)}
              </ul>
          </div>
          <div>
              <h4 className="font-semibold text-slate-200">Related Topics:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                  {data.relatedTopics.map((related, index) => (
                      <span key={index} className="bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1 rounded-full">{related}</span>
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
                    <BulbIcon className="w-8 h-8 text-cyan-300" />
                    <h2 className="text-2xl font-bold">Topic Explorer</h2>
                </div>
                <p className="text-slate-400 mb-4">Enter a topic you want to understand better.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Quantum Computing" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-cyan-600 hover:bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md hover:shadow-lg hover:shadow-cyan-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Explore'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {exploration && (
                    <div className="mt-6 animate-fade-in-up">
                      {renderExploration(exploration)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderExploration(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default TopicExplorer;
