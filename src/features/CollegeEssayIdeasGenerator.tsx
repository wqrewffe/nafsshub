import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { brainstormCollegeEssay } from '../../services/geminiService';
import { CollegeEssayIdeas, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { CollegeEssayIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "college-essay-ideas-generator";

const CollegeEssayIdeasGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [ideas, setIdeas] = useState<CollegeEssayIdeas | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<CollegeEssayIdeas> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt || isLoading) return;
        setIsLoading(true);
        setError(null);
        setIdeas(null);
        try {
            const result = await brainstormCollegeEssay(prompt);
            setIdeas(result);
            if (currentUser) {
              const historyItem = { input: prompt, output: result };
              const savedItem = await addHistory<CollegeEssayIdeas>(currentUser.uid, featureId, historyItem);
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
    
    const renderIdeas = (data: CollegeEssayIdeas) => (
      <div className="space-y-4">
          <h3 className="text-xl font-semibold text-indigo-300">Essay Brainstorm</h3>
          <p><strong className="font-semibold text-slate-200">Opening Hook Idea:</strong> {data.openingHookSuggestion}</p>
          <div>
              <h4 className="font-semibold text-slate-200">Potential Themes:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                  {data.themes.map((theme, i) => (
                      <span key={i} className="bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1 rounded-full">{theme}</span>
                  ))}
              </div>
          </div>
          <div>
              <h4 className="font-semibold text-slate-200">Personal Story Angles:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                  {data.storyIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
              </ul>
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <CollegeEssayIcon className="w-8 h-8 text-indigo-400" />
                    <h2 className="text-2xl font-bold">College Essay Ideas</h2>
                </div>
                <p className="text-slate-400 mb-4">Brainstorm ideas for an application essay.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Paste a common app prompt here..." rows={4} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-indigo-600 hover:bg-gradient-to-r from-indigo-500 to-violet-500 shadow-md hover:shadow-lg hover:shadow-indigo-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-full" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Brainstorm'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {ideas && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderIdeas(ideas)}
                    </div>
                )}
            </DashboardCard>
            
            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderIdeas(item.output)}
                onUseHistoryItem={(input) => setPrompt(input)}
              />
            )}
        </div>
    );
};

export default CollegeEssayIdeasGenerator;
