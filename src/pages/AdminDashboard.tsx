import React, { useState, useEffect, useCallback } from 'react';
import { DashboardCard } from '../components/DashboardCard';
import { LoaderIcon } from '../components/Icons';
import {
    getAdminStats,
    getAllGlobalTools,
    getFeatureFlags,
    setFeatureFlag,
    getBroadcastMessage,
    setBroadcastMessage as setFirestoreBroadcastMessage,
} from '../../firebase/firestoreService';
import { featureGroups } from '../featuresConfig';

const allFeatures = featureGroups.flatMap(group => group.features);
const featuresMap = new Map(allFeatures.map(feature => [feature.path, feature]));

interface AdminStats {
  totalInvocations: number;
  uniqueToolsCount: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [allTools, setAllTools] = useState<{ id: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [featureFlags, setFeatureFlags] = useState<Map<string, boolean>>(new Map());
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcastActive, setIsBroadcastActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const allFeaturesList = featureGroups.flatMap(g => g.features);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [adminStats, tools, flags, broadcast] = await Promise.all([
            getAdminStats(),
            getAllGlobalTools(),
            getFeatureFlags(),
            getBroadcastMessage(),
        ]);
        setStats(adminStats);
        setAllTools(tools);
        setFeatureFlags(flags);
        if (broadcast) {
            setBroadcastMessage(broadcast.message);
            setIsBroadcastActive(broadcast.isActive);
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFlagToggle = useCallback(async (featureId: string, isEnabled: boolean) => {
    const originalFlags = new Map(featureFlags);
    setFeatureFlags(prev => new Map(prev).set(featureId, isEnabled));
    try {
        await setFeatureFlag(featureId, isEnabled);
    } catch (error) {
        console.error('Failed to update feature flag', error);
        alert('Error updating flag. Please check console and try again.');
        setFeatureFlags(originalFlags); // Revert on error
    }
  }, [featureFlags]);

  const handleSaveBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        await setFirestoreBroadcastMessage({ message: broadcastMessage, isActive: isBroadcastActive });
    } catch (error) {
        console.error('Failed to save broadcast message', error);
        alert('Error saving broadcast message. Please check console and try again.');
    } finally {
        setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderIcon className="w-12 h-12 text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">Admin Dashboard</h2>
      
      <section className="grid md:grid-cols-2 gap-8">
        <DashboardCard>
            <h3 className="text-xl font-bold mb-2">Total Tool Invocations</h3>
            <p className="text-4xl font-extrabold text-cyan-400">{stats?.totalInvocations ?? '0'}</p>
        </DashboardCard>
        <DashboardCard>
            <h3 className="text-xl font-bold mb-2">Unique Tools Used</h3>
            <p className="text-4xl font-extrabold text-fuchsia-400">{stats?.uniqueToolsCount ?? '0'}</p>
        </DashboardCard>
      </section>
      
      <section className="grid md:grid-cols-2 gap-8">
        <DashboardCard>
            <h3 className="text-xl font-bold mb-4">Broadcast Message</h3>
            <form onSubmit={handleSaveBroadcast} className="space-y-4">
                <textarea
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter a site-wide message..."
                    rows={3}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-all"
                />
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="broadcast-active"
                        checked={isBroadcastActive}
                        onChange={(e) => setIsBroadcastActive(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <label htmlFor="broadcast-active" className="text-slate-300">Activate Broadcast</label>
                </div>
                <button type="submit" disabled={isSaving} className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center h-10">
                    {isSaving ? <LoaderIcon className="w-6 h-6" /> : 'Save Message'}
                </button>
            </form>
        </DashboardCard>
        
        <DashboardCard>
            <h3 className="text-xl font-bold mb-4">Feature Flags</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {allFeaturesList.map(feature => (
                    <div key={feature.path} className="flex justify-between items-center p-2 bg-slate-700/50 rounded-md">
                        <span className="text-slate-300">{feature.title}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={featureFlags.get(feature.path) ?? true} // Default to enabled
                                onChange={(e) => handleFlagToggle(feature.path, e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        </DashboardCard>
      </section>

      <section>
        <DashboardCard>
          <h3 className="text-xl font-bold mb-4">Global Tool Usage</h3>
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-800/80 backdrop-blur-sm">
                <tr className="border-b border-slate-700">
                  <th className="p-3">Tool Name</th>
                  <th className="p-3 text-right">Usage Count</th>
                </tr>
              </thead>
              <tbody>
                {allTools.map((tool) => {
                  const feature = featuresMap.get(tool.id);
                  if (!feature) return null;
                  return (
                    <tr key={tool.id} className="border-b border-slate-800 hover:bg-slate-700/50">
                      <td className="p-3 flex items-center gap-3">
                        <feature.Icon className={`w-5 h-5 ${feature.iconColor} flex-shrink-0`} />
                        <span className="font-semibold text-slate-200">{feature.title}</span>
                      </td>
                      <td className="p-3 text-right font-mono text-cyan-300">{tool.count}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </section>

      <section>
        <DashboardCard>
            <h3 className="text-xl font-bold mb-2">User Management</h3>
            <p className="text-slate-400">
                User management features (like listing all users, disabling accounts, etc.) require backend functionality with the Firebase Admin SDK and are not available in this client-side implementation for security reasons.
            </p>
        </DashboardCard>
      </section>
    </div>
  );
};

export default AdminDashboard;