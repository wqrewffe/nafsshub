import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateDebatePoints } from '../../services/geminiService';
import { DebatePoints, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { DebateIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "debate-points-generator";

const DebatePointsGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [points, setPoints] = useState<DebatePoints | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<DebatePoints> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setPoints(null);
        try {
            const result = await generateDebatePoints(topic);
            setPoints(result);
            if (currentUser) {
              const historyItem = { input: topic, output: result };
              const savedItem = await addHistory<DebatePoints>(currentUser.uid, featureId, historyItem);
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

    const renderPoints = (data: DebatePoints) => (
      <div className="space-y-4">
          <h3 className="text-xl font-semibold text-amber-300">Motion: {data.motion}</h3>
          <div className="grid grid-cols-2 gap-4">
              <div>
                  <h4 className="font-bold text-green-400">Pros</h4>
                  <ul className="list-disc list-inside text-slate-300 mt-1 space-y-1">
                      {data.pros.map((pro, i) => <li key={`pro-${i}`}>{pro}</li>)}
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-red-400">Cons</h4>
                  <ul className="list-disc list-inside text-slate-300 mt-1 space-y-1">
                      {data.cons.map((con, i) => <li key={`con-${i}`}>{con}</li>)}
                  </ul>
              </div>
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <DebateIcon className="w-8 h-8 text-amber-400" />
                    <h2 className="text-2xl font-bold">Debate Points</h2>
                </div>
                <p className="text-slate-400 mb-4">Generate pro and con arguments for any topic.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Universal basic income" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-amber-600 hover:bg-gradient-to-r from-amber-500 to-orange-500 shadow-md hover:shadow-lg hover:shadow-amber-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Debate'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {points && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderPoints(points)}
                    </div>
                )}
            </DashboardCard>
            
            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderPoints(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default DebatePointsGenerator;
