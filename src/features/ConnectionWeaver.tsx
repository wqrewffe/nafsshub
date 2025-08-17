import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { weaveConnections } from '../../services/geminiService';
import { InterdisciplinaryConnection, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { ConnectionWeaverIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "connection-weaver";

const ConnectionWeaver: React.FC = () => {
    const [topicA, setTopicA] = useState('');
    const [topicB, setTopicB] = useState('');
    const [connection, setConnection] = useState<InterdisciplinaryConnection | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<InterdisciplinaryConnection> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topicA || !topicB || isLoading) return;
        setIsLoading(true);
        setError(null);
        setConnection(null);
        try {
            const input = { topicA, topicB };
            const result = await weaveConnections(input);
            setConnection(result);
            if (currentUser) {
              const historyItem = { input, output: result };
              const savedItem = await addHistory<InterdisciplinaryConnection>(currentUser.uid, featureId, historyItem);
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

    const renderConnection = (data: InterdisciplinaryConnection) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-sky-300">Connecting "{data.topicA}" and "{data.topicB}"</h3>
          <p className="text-slate-300">{data.connectionNarrative}</p>
          <div>
              <h4 className="font-semibold text-slate-200">Bridging Concepts:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                  {data.keyBridgingConcepts.map((concept, index) => (
                      <span key={index} className="bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1 rounded-full">{concept}</span>
                  ))}
              </div>
          </div>
      </div>
    );

    const handleUseHistory = (input: { topicA: string, topicB: string }) => {
      setTopicA(input.topicA);
      setTopicB(input.topicB);
    };

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <ConnectionWeaverIcon className="w-8 h-8 text-sky-400" />
                    <h2 className="text-2xl font-bold">Connection Weaver</h2>
                </div>
                <p className="text-slate-400 mb-4">Find the surprising link between two topics.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2 items-center mb-2">
                        <input type="text" value={topicA} onChange={(e) => setTopicA(e.target.value)} placeholder="Topic A: Impressionism" className="w-1/2 bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 focus:outline-none transition-all" disabled={isLoading} />
                        <span className="text-slate-400">+</span>
                        <input type="text" value={topicB} onChange={(e) => setTopicB(e.target.value)} placeholder="Topic B: Quantum Physics" className="w-1/2 bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 focus:outline-none transition-all" disabled={isLoading} />
                    </div>
                    <button type="submit" className="bg-sky-600 hover:bg-gradient-to-r from-sky-500 to-blue-500 shadow-md hover:shadow-lg hover:shadow-sky-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-full" disabled={isLoading || !topicA || !topicB}>
                        {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Weave Connection'}
                    </button>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {connection && (
                    <div className="mt-6 animate-fade-in-up">
                      {renderConnection(connection)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
                <HistoryDisplay
                    featureId={featureId}
                    newHistoryItem={newHistoryItem}
                    renderItem={(item) => renderConnection(item.output)}
                    onUseHistoryItem={handleUseHistory}
                />
            )}
        </div>
    );
};

export default ConnectionWeaver;
