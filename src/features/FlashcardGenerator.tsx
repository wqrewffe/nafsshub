import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateFlashcards } from '../../services/geminiService';
import { Flashcard, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { CardsIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "flashcard-generator";

const FlashcardGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [flippedCards, setFlippedCards] = useState<boolean[]>([]);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<Flashcard[]> | null>(null);

    useEffect(() => {
        if (flashcards) {
            setFlippedCards(new Array(flashcards.length).fill(false));
        }
    }, [flashcards]);

    const handleFlipCard = (index: number) => {
        setFlippedCards(prev => {
            const newFlipped = [...prev];
            newFlipped[index] = !newFlipped[index];
            return newFlipped;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setFlashcards(null);

        try {
            const result = await generateFlashcards(topic);
            setFlashcards(result);
            if (currentUser) {
                const historyItem = { input: topic, output: result };
                const savedItem = await addHistory<Flashcard[]>(currentUser.uid, featureId, historyItem);
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

    const renderFlashcards = (data: Flashcard[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((card, index) => (
                <div key={index} className="h-40 [perspective:1000px]">
                    <div className="flipper-card relative w-full h-full cursor-pointer [transform-style:preserve-3d]">
                        <div className="flipper-front absolute w-full h-full bg-slate-700 rounded-lg p-4 flex items-center justify-center text-center"> {card.question} </div>
                        <div className="flipper-back absolute w-full h-full bg-gradient-to-br from-blue-700 to-slate-800 rounded-lg p-4 flex items-center justify-center text-center [transform:rotateY(180deg)]"> {card.answer} </div>
                    </div>
                </div>
            ))}
        </div>
    );
    
    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <CardsIcon className="w-8 h-8 text-blue-400" />
                    <h2 className="text-2xl font-bold">Flashcard Generator</h2>
                </div>
                <p className="text-slate-400 mb-4">Enter a topic to create a set of flashcards.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The Krebs Cycle" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-blue-600 hover:bg-gradient-to-r from-blue-500 to-sky-500 shadow-md hover:shadow-lg hover:shadow-blue-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Create'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {flashcards && flashcards.length > 0 && (
                    <div className="mt-6 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {flashcards.map((card, index) => (
                                <div key={index} className="h-40 [perspective:1000px]" onClick={() => handleFlipCard(index)}>
                                    <div className={`flipper-card relative w-full h-full cursor-pointer ${flippedCards[index] ? '[transform:rotateY(180deg)]' : ''}`}>
                                        <div className="flipper-front absolute w-full h-full bg-slate-700 rounded-lg p-4 flex items-center justify-center text-center"> {card.question} </div>
                                        <div className="flipper-back absolute w-full h-full bg-gradient-to-br from-blue-700 to-slate-800 rounded-lg p-4 flex items-center justify-center text-center [transform:rotateY(180deg)]"> {card.answer} </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DashboardCard>
            
            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderFlashcards(item.output)}
                onUseHistoryItem={(input) => setTopic(input)}
              />
            )}
        </div>
    );
};

export default FlashcardGenerator;
