import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getHistory, deleteHistoryItem } from '../firebase/firestoreService';
import { HistoryItem } from '../../types';
import { LoaderIcon } from './Icons';
import { Timestamp } from 'firebase/firestore';

interface HistoryDisplayProps<T> {
  featureId: string;
  renderItem: (item: HistoryItem<T>) => React.ReactNode;
  onUseHistoryItem: (input: any) => void;
  newHistoryItem: HistoryItem<T> | null;
}

const HistoryDisplay = <T,>({ featureId, renderItem, onUseHistoryItem, newHistoryItem }: HistoryDisplayProps<T>) => {
  const [history, setHistory] = useState<HistoryItem<T>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchHistory = useCallback(async () => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const items = await getHistory<T>(currentUser.uid, featureId);
      setHistory(items);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Could not load history.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, featureId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  
  useEffect(() => {
    if (newHistoryItem) {
      setHistory(prev => [newHistoryItem, ...prev]);
      // Automatically expand the new item
      setExpandedItemId(newHistoryItem.id);
    }
  }, [newHistoryItem]);

  const handleDelete = async (itemId: string) => {
    if (!currentUser) return;
    try {
      await deleteHistoryItem(currentUser.uid, featureId, itemId);
      setHistory(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Failed to delete history item:", err);
      // Optionally show an error to the user
    }
  };

  const handleToggleExpand = (itemId: string) => {
    setExpandedItemId(prevId => (prevId === itemId ? null : itemId));
  };

  const formatTimestamp = (timestamp: { seconds: number, nanoseconds: number }) => {
    if (!timestamp) return 'Just now';
    const date = new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
    return date.toLocaleString();
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-24"><LoaderIcon /></div>;
  }

  if (error) {
    return <p className="mt-4 text-red-400">{error}</p>;
  }
  
  if (history.length === 0) {
      return (
          <div className="mt-8 text-center text-slate-500">
              <p>Your generation history for this tool will appear here.</p>
          </div>
      )
  }

  return (
    <div className="mt-10">
        <h3 className="text-2xl font-bold text-center mb-6 text-slate-300">History</h3>
        <div className="space-y-4">
            {history.map(item => {
              const isExpanded = expandedItemId === item.id;
              return (
                <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-lg transition-all duration-300">
                    <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => handleToggleExpand(item.id)}>
                        <div className="flex items-center gap-4 flex-1 overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs text-slate-500">{formatTimestamp(item.timestamp)}</p>
                                <p className="text-slate-300 truncate">
                                    <span className="font-semibold text-slate-300">Input: </span>
                                    {typeof item.input === 'object' && item.input !== null ? JSON.stringify(item.input) : String(item.input)}
                                </p>
                            </div>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => onUseHistoryItem(item.input)} className="text-slate-400 hover:text-cyan-400 transition-colors p-1" title="Use this input">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M21 21v-5h-5"></path></svg>
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-400 transition-colors p-1" title="Delete item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="p-4 border-t border-slate-700">
                                <div className="p-4 bg-slate-900/50 rounded-md">
                                    {renderItem(item)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              );
            })}
        </div>
    </div>
  );
};

export default HistoryDisplay;