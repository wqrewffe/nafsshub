import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateProbingQuestion } from '../../services/geminiService';
import { ProbingQuestion, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { SocraticIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "socratic-questioner";

const SocraticQuestioner: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [question, setQuestion] = useState<ProbingQuestion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<ProbingQuestion> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setQuestion(null);
        try {
            const result = await generateProbingQuestion(topic);
            setQuestion(result);
             if (currentUser) {
              const historyItem = { input: topic, output: result };
              const savedItem = await addHistory<ProbingQuestion>(currentUser.uid, featureId, historyItem);
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
    
    const renderQuestion = (data: ProbingQuestion) => (
        <p className="text-lg text-slate-300">{data.question}</p>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <SocraticIcon className="w-8 h-8 text-teal-400" />
                    <h2 className="text-2xl font-bold">Socratic Questioner</h2>
                </div>
                <p className="text-slate-400 mb-4">Deepen your understanding with probing questions.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The nature of consciousness" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-teal-600 hover:bg-gradient-to-r from-teal-500 to-cyan-500 shadow-md hover:shadow-lg hover:shadow-teal-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Ask'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {question && (
                    <div className="mt-6 space-y-3 animate-fade-in-up">
                        {renderQuestion(question)}
                        <button onClick={handleSubmit} className="w-full text-sm bg-slate-700 hover:bg-slate-600 font-bold py-2 px-4 rounded-md transition-colors" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5 mx-auto" /> : 'Ask another question'}
                        </button>
                    </div>
                )}
            </DashboardCard>
            
            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderQuestion(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default SocraticQuestioner;
