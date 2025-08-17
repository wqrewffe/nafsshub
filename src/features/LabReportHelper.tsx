import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { helpWithLabReport } from '../../services/geminiService';
import { LabReportHelper as LabReportHelperType, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { ScienceLabIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "lab-report-helper";

const LabReportHelper: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [reportHelper, setReportHelper] = useState<LabReportHelperType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<LabReportHelperType> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setReportHelper(null);
        try {
            const result = await helpWithLabReport(topic);
            setReportHelper(result);
            if (currentUser) {
                const historyItem = { input: topic, output: result };
                const savedItem = await addHistory<LabReportHelperType>(currentUser.uid, featureId, historyItem);
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

    const renderReport = (data: LabReportHelperType) => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-300">{data.title}</h3>
            <p><strong className="font-semibold text-slate-200">Hypothesis:</strong> {data.hypothesis}</p>
            <div>
                <h4 className="font-semibold text-slate-200">Variables:</h4>
                <p className="text-sm"><strong className="text-slate-300">Independent:</strong> {data.variables.independent}</p>
                <p className="text-sm"><strong className="text-slate-300">Dependent:</strong> {data.variables.dependent}</p>
                <p className="text-sm"><strong className="text-slate-300">Controlled:</strong> {data.variables.controlled}</p>
            </div>
            <div>
                <h4 className="font-semibold text-slate-200">Method:</h4>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-slate-300">
                    {data.method.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
            </div>
        </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <ScienceLabIcon className="w-8 h-8 text-emerald-400" />
                    <h2 className="text-2xl font-bold">Lab Report Helper</h2>
                </div>
                <p className="text-slate-400 mb-4">Outline a lab report for a science experiment.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Effect of light on plant growth" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-emerald-600 hover:bg-gradient-to-r from-emerald-500 to-green-500 shadow-md hover:shadow-lg hover:shadow-emerald-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Outline'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {reportHelper && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderReport(reportHelper)}
                    </div>
                )}
            </DashboardCard>
            
            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderReport(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default LabReportHelper;
