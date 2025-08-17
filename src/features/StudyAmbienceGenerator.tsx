import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateStudyAmbience } from '../../services/geminiService';
import { StudyAmbience, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { StudyAmbienceIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "study-ambience-generator";

const StudyAmbienceGenerator: React.FC = () => {
    const [description, setDescription] = useState('');
    const [ambience, setAmbience] = useState<StudyAmbience | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<StudyAmbience> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || isLoading) return;
        setIsLoading(true);
        setError(null);
        setAmbience(null);
        try {
            const result = await generateStudyAmbience(description);
            setAmbience(result);
            if (currentUser) {
              const historyItem = { input: description, output: result };
              const savedItem = await addHistory<StudyAmbience>(currentUser.uid, featureId, historyItem);
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

    const renderAmbience = (data: StudyAmbience) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-amber-300">{data.title}</h3>
          <p className="text-slate-300 italic">{data.description}</p>
          <div>
              <h4 className="font-semibold text-slate-200">Sound Keywords:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                  {data.soundKeywords.map((keyword, i) => (
                      <span key={i} className="bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1 rounded-full">{keyword}</span>
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
                    <StudyAmbienceIcon className="w-8 h-8 text-amber-400" />
                    <h2 className="text-2xl font-bold">Study Ambience Generator</h2>
                </div>
                <p className="text-slate-400 mb-4">Describe your ideal study vibe for inspiration.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., A cozy, rainy coffee shop..." rows={2} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-amber-600 hover:bg-gradient-to-r from-amber-500 to-orange-500 shadow-md hover:shadow-lg hover:shadow-amber-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-full" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Generate Vibe'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {ambience && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderAmbience(ambience)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderAmbience(item.output)}
                onUseHistoryItem={(input) => setDescription(input)}
              />
            )}
        </div>
    );
};

export default StudyAmbienceGenerator;
