import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createWeeklyPlan } from '../../services/geminiService';
import { WeeklyPlan, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { CalendarDaysIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "weekly-study-planner";

const WeeklyStudyPlanner: React.FC = () => {
    const [goal, setGoal] = useState('');
    const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<WeeklyPlan[]> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal || isLoading) return;
        setIsLoading(true);
        setError(null);
        setWeeklyPlan(null);
        try {
            const result = await createWeeklyPlan(goal);
            setWeeklyPlan(result);
            if (currentUser) {
              const historyItem = { input: goal, output: result };
              const savedItem = await addHistory<WeeklyPlan[]>(currentUser.uid, featureId, historyItem);
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
    
    const renderPlan = (data: WeeklyPlan[]) => (
      <div className="space-y-4">
          {data.map(dayPlan => (
              <div key={dayPlan.day}>
                  <h3 className="font-semibold text-green-300">{dayPlan.day}</h3>
                  <ul className="list-disc list-inside text-slate-300">
                      {dayPlan.tasks.map((task, i) => <li key={i}>{task}</li>)}
                  </ul>
              </div>
          ))}
      </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <CalendarDaysIcon className="w-8 h-8 text-green-400" />
                    <h2 className="text-2xl font-bold">Weekly Study Planner</h2>
                </div>
                <p className="text-slate-400 mb-4">List your subjects or goals for this week.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Math exam, History paper" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-green-600 hover:bg-gradient-to-r from-green-500 to-emerald-500 shadow-md hover:shadow-lg hover:shadow-green-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Plan'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {weeklyPlan && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderPlan(weeklyPlan)}
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderPlan(item.output)}
                onUseHistoryItem={(input) => setGoal(input)}
              />
            )}
        </div>
    );
};

export default WeeklyStudyPlanner;
