import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createEssayOutline } from '../../services/geminiService';
import { EssayOutline, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { DocumentTextIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "essay-outliner";

const EssayOutliner: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [outline, setOutline] = useState<EssayOutline | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<EssayOutline> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setOutline(null);
        try {
            const result = await createEssayOutline(topic);
            setOutline(result);
            if (currentUser) {
              const historyItem = { input: topic, output: result };
              const savedItem = await addHistory<EssayOutline>(currentUser.uid, featureId, historyItem);
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

    const renderOutline = (data: EssayOutline) => (
      <div className="space-y-3 text-slate-300">
          <h3 className="text-xl font-semibold text-orange-300">{data.title}</h3>
          <div><strong className="font-semibold text-slate-200">Introduction:</strong> {data.introduction}</div>
          <div>
              <strong className="font-semibold text-slate-200">Body Paragraphs:</strong>
              <ul className="list-decimal list-inside ml-4">
                  {data.bodyParagraphs.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
          </div>
          <div><strong className="font-semibold text-slate-200">Conclusion:</strong> {data.conclusion}</div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <DocumentTextIcon className="w-8 h-8 text-orange-400" />
                    <h2 className="text-2xl font-bold">Essay Outliner</h2>
                </div>
                <p className="text-slate-400 mb-4">Enter an essay topic to generate an outline.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The impact of AI on society" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-orange-600 hover:bg-gradient-to-r from-orange-500 to-amber-500 shadow-md hover:shadow-lg hover:shadow-orange-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Outline'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {outline && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderOutline(outline)}
                    </div>
                )}
            </DashboardCard>
            
            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderOutline(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default EssayOutliner;
