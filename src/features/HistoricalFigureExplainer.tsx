import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { explainHistoricalFigure } from '../../services/geminiService';
import { HistoricalFigure, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { HistoricalFigureIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "historical-figure-explainer";

const HistoricalFigureExplainer: React.FC = () => {
    const [name, setName] = useState('');
    const [figure, setFigure] = useState<HistoricalFigure | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<HistoricalFigure> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || isLoading) return;
        setIsLoading(true);
        setError(null);
        setFigure(null);
        try {
            const result = await explainHistoricalFigure(name);
            setFigure(result);
            if (currentUser) {
                const historyItem = { input: name, output: result };
                const savedItem = await addHistory<HistoricalFigure>(currentUser.uid, featureId, historyItem);
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
    
    const renderFigure = (data: HistoricalFigure) => (
      <div className="space-y-4">
          <h3 className="text-xl font-semibold text-amber-300">{data.name} <span className="text-sm text-slate-400 font-normal">({data.lifespan})</span></h3>
          <p className="text-slate-300">{data.summary}</p>
          <div>
              <h4 className="font-semibold text-slate-200">Key Accomplishments:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                  {data.keyAccomplishments.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
          </div>
          <p><strong className="font-semibold text-slate-200">Significance:</strong> {data.historicalSignificance}</p>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <HistoricalFigureIcon className="w-8 h-8 text-amber-500" />
                    <h2 className="text-2xl font-bold">Historical Figure</h2>
                </div>
                <p className="text-slate-400 mb-4">Get a quick bio on an important historical figure.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Marie Curie" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-amber-600 hover:bg-gradient-to-r from-amber-500 to-orange-500 shadow-md hover:shadow-lg hover:shadow-amber-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Explain'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {figure && (
                    <div className="mt-6 animate-fade-in-up">
                      {renderFigure(figure)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderFigure(item.output)}
                onUseHistoryItem={(input) => setName(input)}
              />
            )}
        </div>
    );
};

export default HistoricalFigureExplainer;
