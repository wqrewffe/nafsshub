import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { explainCode } from '../../services/geminiService';
import { CodeExplanation, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { CodeExplainerIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "code-explainer";

const CodeExplainer: React.FC = () => {
    const [code, setCode] = useState('');
    const [explanation, setExplanation] = useState<CodeExplanation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<CodeExplanation> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || isLoading) return;
        setIsLoading(true);
        setError(null);
        setExplanation(null);
        try {
            const result = await explainCode(code);
            setExplanation(result);
            if (currentUser) {
              const historyItem = { input: code, output: result };
              const savedItem = await addHistory<CodeExplanation>(currentUser.uid, featureId, historyItem);
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

    const renderExplanation = (data: CodeExplanation) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-300">Code Breakdown ({data.language})</h3>
          <p className="text-slate-300 italic">{data.explanation}</p>
          <div className="space-y-2">
              {data.breakdown.map((item, i) => (
                  <div key={i} className="p-2 bg-slate-700/50 rounded-md">
                      <p className="font-mono text-xs text-cyan-300">{item.part}</p>
                      <p className="text-sm text-slate-300">{item.description}</p>
                  </div>
              ))}
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <CodeExplainerIcon className="w-8 h-8 text-slate-400" />
                    <h2 className="text-2xl font-bold">Code Explainer</h2>
                </div>
                <p className="text-slate-400 mb-4">Get a plain English explanation of any code.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your code here..." rows={5} className="font-mono text-sm w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-slate-600 hover:bg-gradient-to-r from-slate-500 to-gray-500 shadow-md hover:shadow-lg hover:shadow-slate-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-full" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Explain Code'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {explanation && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderExplanation(explanation)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderExplanation(item.output)}
                onUseHistoryItem={(input) => setCode(input)}
              />
            )}
        </div>
    );
};

export default CodeExplainer;
