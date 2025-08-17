import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { explainMentalModel } from '../../services/geminiService';
import { MentalModel, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { MentalModelIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "mental-models-explainer";
const mentalModels = ["First-Principles Thinking", "Second-Order Thinking", "Inversion", "Occam's Razor", "Hanlon's Razor", "Circle of Competence"];

const MentalModelsExplainer: React.FC = () => {
    const [selectedModel, setSelectedModel] = useState(mentalModels[0]);
    const [model, setModel] = useState<MentalModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<MentalModel> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedModel || isLoading) return;
        setIsLoading(true);
        setError(null);
        setModel(null);
        try {
            const result = await explainMentalModel(selectedModel);
            setModel(result);
            if (currentUser) {
              const historyItem = { input: selectedModel, output: result };
              const savedItem = await addHistory<MentalModel>(currentUser.uid, featureId, historyItem);
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

    const renderModel = (data: MentalModel) => (
      <div className="space-y-3">
          <h3 className="text-xl font-semibold text-violet-300">{data.name}</h3>
          <p className="text-slate-300">{data.description}</p>
          <div>
              <h4 className="font-bold text-slate-200">Example:</h4>
              <p className="text-slate-300 italic p-2 bg-slate-700/50 rounded-md mt-1">{data.example}</p>
          </div>
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <MentalModelIcon className="w-8 h-8 text-violet-400" />
                    <h2 className="text-2xl font-bold">Mental Models</h2>
                </div>
                <p className="text-slate-400 mb-4">Learn powerful frameworks for thinking.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:outline-none transition-all" disabled={isLoading}>
                            {mentalModels.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <button type="submit" className="bg-violet-600 hover:bg-gradient-to-r from-violet-500 to-purple-500 shadow-md hover:shadow-lg hover:shadow-violet-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Explain'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {model && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderModel(model)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderModel(item.output)}
                onUseHistoryItem={(input) => setSelectedModel(input)}
              />
            )}
        </div>
    );
};

export default MentalModelsExplainer;
