import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getResumeKeywords } from '../../services/geminiService';
import { ResumeKeywords, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { ResumeIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "resume-keywords-extractor";

const ResumeKeywordsExtractor: React.FC = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [keywords, setKeywords] = useState<ResumeKeywords | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<ResumeKeywords> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobDescription || isLoading) return;
        setIsLoading(true);
        setError(null);
        setKeywords(null);
        try {
            const result = await getResumeKeywords(jobDescription);
            setKeywords(result);
            if (currentUser) {
              const historyItem = { input: jobDescription, output: result };
              const savedItem = await addHistory<ResumeKeywords>(currentUser.uid, featureId, historyItem);
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

    const renderKeywords = (data: ResumeKeywords) => (
      <div className="space-y-4">
          <h3 className="text-xl font-semibold text-emerald-300">Keywords for {data.jobTitle}</h3>
          <div>
              <h4 className="font-bold text-slate-200">Hard Skills:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                  {data.hardSkills.map((skill, i) => (
                      <span key={`hard-${i}`} className="bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                  ))}
              </div>
          </div>
          <div>
              <h4 className="font-bold text-slate-200">Soft Skills:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                  {data.softSkills.map((skill, i) => (
                      <span key={`soft-${i}`} className="bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
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
                    <ResumeIcon className="w-8 h-8 text-emerald-400" />
                    <h2 className="text-2xl font-bold">Resume Keywords</h2>
                </div>
                <p className="text-slate-400 mb-4">Extract keywords from a job description.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste job description here..." rows={5} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-emerald-600 hover:bg-gradient-to-r from-emerald-500 to-green-500 shadow-md hover:shadow-lg hover:shadow-emerald-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-full" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Extract'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {keywords && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderKeywords(keywords)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderKeywords(item.output)}
                onUseHistoryItem={(input) => setJobDescription(input)}
              />
            )}
        </div>
    );
};

export default ResumeKeywordsExtractor;
