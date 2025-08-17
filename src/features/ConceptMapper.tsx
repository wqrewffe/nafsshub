import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createConceptMap } from '../../services/geminiService';
import { ConceptMap, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { ConceptMapIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "concept-mapper";

const ConceptMapper: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [conceptMap, setConceptMap] = useState<ConceptMap | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<ConceptMap> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setConceptMap(null);
        try {
            const result = await createConceptMap(topic);
            setConceptMap(result);
            if (currentUser) {
              const historyItem = { input: topic, output: result };
              const savedItem = await addHistory<ConceptMap>(currentUser.uid, featureId, historyItem);
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

    const renderMap = (data: ConceptMap) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-sky-300">{data.centralConcept}</h3>
          <ul className="list-disc list-inside text-slate-300 space-y-2">
              {data.mainBranches.map((branch, i) => (
                  <li key={i}><span className="font-semibold text-slate-100">{branch.topic}</span>
                      <ul className="list-[circle] list-inside ml-4 text-slate-400">
                          {branch.subPoints.map((point, j) => <li key={j}>{point}</li>)}
                      </ul>
                  </li>
              ))}
          </ul>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <ConceptMapIcon className="w-8 h-8 text-sky-400" />
                    <h2 className="text-2xl font-bold">Concept Mapper</h2>
                </div>
                <p className="text-slate-400 mb-4">Visually map out the connections in a topic.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Machine Learning" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-sky-600 hover:bg-gradient-to-r from-sky-500 to-blue-500 shadow-md hover:shadow-lg hover:shadow-sky-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Map'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {conceptMap && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderMap(conceptMap)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderMap(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default ConceptMapper;
