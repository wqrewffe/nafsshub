import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { simulateClinicalCase } from '../../services/geminiService';
import { ClinicalCase, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { ClinicalCaseIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "clinical-case-simulator";

const ClinicalCaseSimulator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [clinicalCase, setClinicalCase] = useState<ClinicalCase | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<ClinicalCase> | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setClinicalCase(null);
        try {
            const result = await simulateClinicalCase(topic);
            setClinicalCase(result);
            if (currentUser) {
              const historyItem = { input: topic, output: result };
              const savedItem = await addHistory<ClinicalCase>(currentUser.uid, featureId, historyItem);
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

    const renderCase = (data: ClinicalCase) => (
      <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-300">Patient Vignette</h3>
          <p className="text-slate-300 p-3 bg-slate-700/50 rounded-lg">{data.vignette}</p>
          <div>
              <h4 className="font-semibold text-slate-200">Differential Diagnosis:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                  {data.differentialDiagnosis.map((dx, i) => <li key={i}>{dx}</li>)}
              </ul>
          </div>
          <div>
              <h4 className="font-semibold text-slate-200">Recommended Workup:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                  {data.workup.map((test, i) => <li key={i}>{test}</li>)}
              </ul>
          </div>
          <div>
              <h4 className="font-semibold text-slate-200">Management Plan:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                  {data.management.map((plan, i) => <li key={i}>{plan}</li>)}
              </ul>
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <ClinicalCaseIcon className="w-8 h-8 text-red-400" />
                    <h2 className="text-2xl font-bold">Clinical Case Simulator</h2>
                </div>
                <p className="text-slate-400 mb-4">Practice your clinical reasoning. Enter a condition.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Myocardial Infarction" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-400 focus:border-red-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-red-600 hover:bg-gradient-to-r from-red-500 to-rose-500 shadow-md hover:shadow-lg hover:shadow-red-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Simulate'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {clinicalCase && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderCase(clinicalCase)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderCase(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default ClinicalCaseSimulator;
