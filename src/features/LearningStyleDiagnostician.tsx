import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { diagnoseLearningStyle } from '../../services/geminiService';
import { LearningStyle, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { LearningStyleIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "learning-style-diagnostician";

const LearningStyleDiagnostician: React.FC = () => {
    const [description, setDescription] = useState('');
    const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<LearningStyle> | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || isLoading) return;
        setIsLoading(true);
        setError(null);
        setLearningStyle(null);
        try {
            const result = await diagnoseLearningStyle(description);
            setLearningStyle(result);
            if (currentUser) {
                const historyItem = { input: description, output: result };
                const savedItem = await addHistory<LearningStyle>(currentUser.uid, featureId, historyItem);
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

    const renderLearningStyle = (data: LearningStyle) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-violet-300">Your Style: <span className="font-extrabold">{data.dominantStyle}</span></h3>
          <p className="text-slate-300 text-sm">{data.explanation}</p>
          <div>
              <h4 className="font-semibold text-slate-200">Recommended Strategies:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                  {data.recommendedStrategies.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <LearningStyleIcon className="w-8 h-8 text-violet-400" />
                    <h2 className="text-2xl font-bold">Learning Style Diagnostician</h2>
                </div>
                <p className="text-slate-400 mb-4">Describe how you study to find your style.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., I like watching videos and drawing diagrams..." rows={3} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-violet-600 hover:bg-gradient-to-r from-violet-500 to-purple-500 shadow-md hover:shadow-lg hover:shadow-violet-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-full" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Diagnose'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {learningStyle && (
                    <div className="mt-6 animate-fade-in-up">
                      {renderLearningStyle(learningStyle)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
                <HistoryDisplay
                    featureId={featureId}
                    newHistoryItem={newHistoryItem}
                    renderItem={(item) => renderLearningStyle(item.output)}
                    onUseHistoryItem={(input) => setDescription(input)}
                />
            )}
        </div>
    );
};

export default LearningStyleDiagnostician;
