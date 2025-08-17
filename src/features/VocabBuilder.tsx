import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { buildVocabulary } from '../../services/geminiService';
import { VocabularyWord, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { VocabularyIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "vocab-builder";

const VocabBuilder: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [vocabularyWord, setVocabularyWord] = useState<VocabularyWord | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<VocabularyWord> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setVocabularyWord(null);
        try {
            const result = await buildVocabulary(topic);
            setVocabularyWord(result);
            if (currentUser) {
              const historyItem = { input: topic, output: result };
              const savedItem = await addHistory<VocabularyWord>(currentUser.uid, featureId, historyItem);
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

    const renderWord = (data: VocabularyWord) => (
      <div className="space-y-3">
          <h3 className="text-2xl font-bold text-blue-300 capitalize">{data.word}</h3>
          <p className="text-slate-300 font-semibold">{data.definition}</p>
          <p className="text-slate-400 italic p-2 bg-slate-700/50 rounded-md">"{data.exampleSentence}"</p>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <VocabularyIcon className="w-8 h-8 text-blue-400" />
                    <h2 className="text-2xl font-bold">SAT/ACT Vocab Builder</h2>
                </div>
                <p className="text-slate-400 mb-4">Get a new word. Try a topic like 'science' or 'literature'.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., ambitious" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-blue-600 hover:bg-gradient-to-r from-blue-500 to-sky-500 shadow-md hover:shadow-lg hover:shadow-blue-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Get Word'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {vocabularyWord && (
                    <div className="mt-6 animate-fade-in-up">
                      {renderWord(vocabularyWord)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderWord(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default VocabBuilder;
