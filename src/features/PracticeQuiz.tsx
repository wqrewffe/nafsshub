import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateQuiz } from '../../services/geminiService';
import { QuizQuestion, HistoryItem } from '../../types';
import { DashboardCard } from '../components/DashboardCard';
import { QuestionMarkCircleIcon, LoaderIcon } from '../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { addHistory, trackToolUsage } from '../firebase/firestoreService';
import HistoryDisplay from '../components/HistoryDisplay';

const featureId = "practice-quiz";

const PracticeQuiz: React.FC = () => {
    const [quizTopic, setQuizTopic] = useState('');
    const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [quizScore, setQuizScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const { currentUser } = useAuth();
    const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem<QuizQuestion[]> | null>(null);

    const handleQuizAnswer = (option: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(option);
        if (quiz && option === quiz[currentQuestionIndex].correctAnswer) {
            setQuizScore(prev => prev + 1);
        }
    };
    
    const handleNextQuestion = () => {
        if (quiz && currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            setQuizFinished(true);
        }
    };
    
    const startQuiz = async (topic: string) => {
        if (!topic || isLoading) return;
        setIsLoading(true);
        setError(null);
        setQuiz(null);
        setQuizScore(0);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setQuizFinished(false);
        try {
            const result = await generateQuiz(topic);
            setQuiz(result);
            if (currentUser) {
              const historyItem = { input: topic, output: result };
              const savedItem = await addHistory<QuizQuestion[]>(currentUser.uid, featureId, historyItem);
              setNewHistoryItem(savedItem);
              trackToolUsage(currentUser.uid, featureId).catch(console.error);
            }
        } catch (err) {
            console.error("API call failed:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const renderQuiz = (data: QuizQuestion[]) => (
        <div>
            {data.map((q, i) => (
                <div key={i} className="mb-2 p-2 border-b border-slate-700">
                    <p className="font-semibold">{i+1}. {q.question}</p>
                    <p className="text-sm text-green-400">Correct Answer: {q.correctAnswer}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Dashboard</Link>
            <DashboardCard>
                <div className="flex items-center gap-4 mb-4">
                    <QuestionMarkCircleIcon className="w-8 h-8 text-indigo-400" />
                    <h2 className="text-2xl font-bold">Practice Quiz</h2>
                </div>
                <p className="text-slate-400 mb-4">Generate a quiz to test your knowledge.</p>
                <form onSubmit={(e) => { e.preventDefault(); startQuiz(quizTopic); }}>
                    <div className="flex gap-2">
                        <input type="text" value={quizTopic} onChange={(e) => setQuizTopic(e.target.value)} placeholder="e.g., World War II" className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all" disabled={isLoading} />
                        <button type="submit" className="bg-indigo-600 hover:bg-gradient-to-r from-indigo-500 to-violet-500 shadow-md hover:shadow-lg hover:shadow-indigo-500/20 disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center w-28" disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="w-5 h-5" /> : 'Start'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-400">{error}</p>}
                {quiz && !quizFinished && (
                    <div className="mt-6 animate-fade-in-up">
                        <p className="text-slate-400 mb-2">Question {currentQuestionIndex + 1} of {quiz.length}</p>
                        <h3 className="text-lg font-semibold mb-4">{quiz[currentQuestionIndex].question}</h3>
                        <div className="space-y-2">
                            {quiz[currentQuestionIndex].options.map(option => {
                                const isCorrect = option === quiz[currentQuestionIndex].correctAnswer;
                                const isSelected = option === selectedAnswer;
                                let buttonClass = 'bg-slate-700 hover:bg-slate-600';
                                let ringClass = '';
                                if (selectedAnswer) {
                                    if (isCorrect) {
                                        buttonClass = 'bg-green-600/80';
                                        ringClass = 'ring-2 ring-green-400';
                                    }
                                    else if (isSelected) {
                                        buttonClass = 'bg-red-600/80';
                                        ringClass = 'ring-2 ring-red-400';
                                    }
                                    else buttonClass = 'bg-slate-700/50 opacity-50';
                                }
                                return (
                                    <button key={option} onClick={() => handleQuizAnswer(option)} disabled={!!selectedAnswer} className={`w-full text-left p-3 rounded-md transition-all ${buttonClass} ${ringClass}`}>{option}</button>
                                )
                            })}
                        </div>
                        {selectedAnswer && <button onClick={handleNextQuestion} className="mt-4 w-full bg-indigo-500 hover:bg-indigo-400 font-bold py-2 px-4 rounded-md">Next</button>}
                    </div>
                )}
                {quizFinished && quiz && quiz.length > 0 && (
                    <div className="mt-6 text-center animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-indigo-300">Quiz Complete!</h3>
                        <p className="text-xl mt-2">You scored {quizScore} out of {quiz.length}</p>
                        <button onClick={() => startQuiz(quizTopic)} className="mt-4 bg-indigo-500 hover:bg-indigo-400 font-bold py-2 px-4 rounded-md">Take Another Quiz</button>
                    </div>
                )}
            </DashboardCard>

            {currentUser && (
              <HistoryDisplay
                featureId={featureId}
                newHistoryItem={newHistoryItem}
                renderItem={(item) => renderQuiz(item.output)}
                onUseHistoryItem={(input) => setQuizTopic(input)}
              />
            )}
        </div>
    );
};

export default PracticeQuiz;
