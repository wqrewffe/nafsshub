import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { identifyLiteraryDevices } from '../../services/geminiService';
import { LiteraryDeviceAnalysis, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { LiteraryDeviceIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "literary-devices-analyzer";

const LiteraryDevicesAnalyzer: React.FC = () => {
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState<LiteraryDeviceAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<LiteraryDeviceAnalysis> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text || isLoading) return;
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await identifyLiteraryDevices(text);
            setAnalysis(result);
            if (currentUser) {
              const historyItem = { input: text, output: result };
              const savedItem = await addHistory<LiteraryDeviceAnalysis>(currentUser.uid, featureId, historyItem);
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
    
    const renderAnalysis = (data: LiteraryDeviceAnalysis) => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-fuchsia-300">Analysis</h3>
            {data.devices.map((device, i) => (
                <div key={i}>
                    <h4 className="font-bold text-slate-100">{device.device}</h4>
                    <p className="text-slate-400 italic p-2 bg-slate-700/50 rounded-md my-1">"{device.quote}"</p>
                    <p className="text-slate-300 text-sm">{device.explanation}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <LiteraryDeviceIcon className="w-8 h-8 text-fuchsia-400" />
                    <h2 className="text-2xl font-bold">Literary Devices</h2>
                </div>
                <p className="text-slate-400 mb-4">Paste a short text to find literary devices.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g., Hope is the thing with feathers..." rows={4} className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-fuchsia-600 hover:bg-gradient-to-r from-fuchsia-500 to-pink-500 shadow-md hover:shadow-lg hover:shadow-fuchsia-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-full" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Analyze'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {analysis && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderAnalysis(analysis)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderAnalysis(item.output)}
                onUseHistoryItem={(input) => setText(input)}
              />
            )}
        </div>
    );
};

export default LiteraryDevicesAnalyzer;
