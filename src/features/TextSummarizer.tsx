import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { summarizeText } from '../../services/geminiService';
import { DashboardCard } from '../components/DashboardCard';
import { SummarizerIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';
import { HistoryItem } from '../../types';

const featureId = "text-summarizer";

const TextSummarizer: React.FC = () => {
    const [textToSummarize, setTextToSummarize] = useState('');
    const [summary, setSummary] = useState<{ summary: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<{ summary: string }> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!textToSummarize || isLoading) return;
        setIsLoading(true);
        setError(null);
        setSummary(null);
        try {
            const result = await summarizeText(textToSummarize);
            setSummary(result);
            if (currentUser) {
              const historyItem = { input: textToSummarize, output: result };
              const savedItem = await addHistory<{ summary: string }>(currentUser.uid, featureId, historyItem);
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

    const renderSummary = (data: { summary: string }) => (
      <div>
          <h3 className="text-xl font-semibold text-rose-300">Summary</h3>
          <p className="text-slate-300">{data.summary}</p>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <SummarizerIcon className="w-8 h-8 text-rose-400" />
                    <h2 className="text-2xl font-bold">Text Summarizer</h2>
                </div>
                <p className="text-slate-400 mb-4">Paste text to get a concise summary.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <textarea value={textToSummarize} onChange={(e) => setTextToSummarize(e.target.value)} placeholder="Paste your text here..." rows={5} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-rose-600 hover:bg-gradient-to-r from-rose-500 to-pink-500 shadow-md hover:shadow-lg hover:shadow-rose-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-full" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Summarize'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {summary && (
                    <div className="mt-6 space-y-3 animate-fade-in-up">
                        {renderSummary(summary)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderSummary(item.output)}
                onUseHistoryItem={(input) => setTextToSummarize(input)}
              />
            )}
        </div>
    );
};

export default TextSummarizer;
