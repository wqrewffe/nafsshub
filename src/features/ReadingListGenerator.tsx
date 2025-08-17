import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createReadingList } from '../../services/geminiService';
import { ReadingList, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { ReadingListIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "reading-list-generator";

const ReadingListGenerator: React.FC = () => {
    const [interests, setInterests] = useState('');
    const [readingList, setReadingList] = useState<ReadingList | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<ReadingList> | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!interests || isLoading) return;
        setIsLoading(true);
        setError(null);
        setReadingList(null);
        try {
            const result = await createReadingList(interests);
            setReadingList(result);
            if (currentUser) {
              const historyItem = { input: interests, output: result };
              const savedItem = await addHistory<ReadingList>(currentUser.uid, featureId, historyItem);
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
    
    const renderList = (data: ReadingList) => (
        <div className="space-y-3">
            <h3 className="text-xl font-semibold text-orange-300">Reading List for {data.topic}</h3>
            <div className="space-y-3">
                {data.books.map((book, i) => (
                    <div key={i} className="p-3 bg-slate-700/50 rounded-lg">
                        <p className="font-bold text-slate-100">{book.title}</p>
                        <p className="text-sm text-slate-400 mb-1">by {book.author}</p>
                        <p className="text-slate-300">{book.reason}</p>
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
                    <ReadingListIcon className="w-8 h-8 text-orange-400" />
                    <h2 className="text-2xl font-bold">Reading List</h2>
                </div>
                <p className="text-slate-400 mb-4">Get book recommendations on your interests.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g., Stoic philosophy, sci-fi" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-orange-600 hover:bg-gradient-to-r from-orange-500 to-amber-500 shadow-md hover:shadow-lg hover:shadow-orange-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Suggest'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {readingList && (
                    <div className="mt-6 animate-fade-in-up">
                        {renderList(readingList)}
                    </div>
                )}
            </DashboardCard>
            
            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderList(item.output)}
                onUseHistoryItem={(input) => setInterests(input)}
              />
            )}
        </div>
    );
};

export default ReadingListGenerator;
