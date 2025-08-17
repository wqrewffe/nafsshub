import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DashboardCard } from '../components/DashboardCard';
import { getDailyAffirmation } from '../../services/geminiService';
import { SparklesIcon, LoaderIcon, BulbIcon, TargetIcon } from '../components/Icons';
import { featureGroups } from '../featuresConfig';
import { useAuth } from '../../context/AuthContext';
import { getTopUserTools, getTopGlobalTools, getFeatureFlags, getBroadcastMessage } from '../../firebase/firestoreService';

const allFeatures = featureGroups.flatMap(group => group.features);
const featuresMap = new Map(allFeatures.map(feature => [feature.path, feature]));

const TopToolsList: React.FC<{
  title: string;
  tools: { id: string; count: number }[];
  isUserList?: boolean;
}> = ({ title, tools, isUserList = false }) => {
  if (tools.length === 0) {
    if (isUserList) {
      return (
        <DashboardCard>
          <h3 className="text-xl font-bold mb-4">{title}</h3>
          <p className="text-slate-400">Start using tools to see your most frequent ones here!</p>
        </DashboardCard>
      );
    }
    return null; // Don't show empty global list
  }

  return (
    <DashboardCard>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ol className="space-y-3">
        {tools.map((tool, index) => {
          const feature = featuresMap.get(tool.id);
          if (!feature) return null;
          return (
            <li key={tool.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <Link to={feature.path} className="block p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-lg font-bold text-slate-500">{index + 1}</span>
                    <feature.Icon className={`w-6 h-6 ${feature.iconColor} flex-shrink-0`} />
                    <span className="font-semibold text-slate-200 truncate">{feature.title}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-400 bg-slate-600/50 px-2 py-0.5 rounded-full flex-shrink-0">
                    {tool.count} uses
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </DashboardCard>
  );
};


const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <DashboardCard className="text-center">
        <div className="mx-auto bg-slate-700/80 backdrop-blur-sm border border-slate-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-cyan-300 mb-4">{number}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </DashboardCard>
);

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <DashboardCard>
        <div className="flex items-center gap-4 mb-2">
            {icon}
            <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-slate-400">{description}</p>
    </DashboardCard>
);

const Dashboard: React.FC = () => {
  const [affirmation, setAffirmation] = useState('');
  const [isAffirmationLoading, setIsAffirmationLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [topUserTools, setTopUserTools] = useState<{ id: string; count: number }[]>([]);
  const [topGlobalTools, setTopGlobalTools] = useState<{ id: string; count: number }[]>([]);
  const { currentUser } = useAuth();
  const [broadcast, setBroadcast] = useState<{ message: string; isActive: boolean } | null>(null);
  const [filteredFeatureGroups, setFilteredFeatureGroups] = useState(featureGroups);

  const fetchAffirmation = useCallback(async () => {
    if (!currentUser) {
        setIsAffirmationLoading(false);
        setAffirmation("Log in to discover your daily affirmation.");
        return;
    }
    setIsAffirmationLoading(true);
    try {
      const result = await getDailyAffirmation();
      setAffirmation(result);
    } catch (error) {
      console.error("Failed to get affirmation:", error);
      setAffirmation("Embrace every challenge as an opportunity for growth.");
    } finally {
      setIsAffirmationLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAffirmation();
    
    const fetchDashboardData = async () => {
      try {
        if (currentUser) {
          const userTools = await getTopUserTools(currentUser.uid);
          setTopUserTools(userTools);
        } else {
          setTopUserTools([]);
        }
        
        const [globalTools, flags, broadcastMsg] = await Promise.all([
          getTopGlobalTools(),
          getFeatureFlags(),
          getBroadcastMessage(),
        ]);

        setTopGlobalTools(globalTools);

        if (broadcastMsg?.isActive) {
          setBroadcast(broadcastMsg);
        }

        const newFilteredGroups = featureGroups.map(group => ({
          ...group,
          features: group.features.filter(feature => flags.get(feature.path) ?? true)
        })).filter(group => group.features.length > 0);

        setFilteredFeatureGroups(newFilteredGroups);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setFilteredFeatureGroups(featureGroups); // Fallback
      }
    };
    fetchDashboardData();

  }, [fetchAffirmation, currentUser]);


  const selectedGroup = filteredFeatureGroups.find(group => group.name === activeCategory);

  return (
    <div className="space-y-16">
      
      {broadcast?.isActive && (
          <section>
              <DashboardCard className="bg-cyan-900/50 border-cyan-700 text-center">
                  <h3 className="font-bold text-cyan-300 mb-2">Announcement</h3>
                  <p className="text-slate-200">{broadcast.message}</p>
              </DashboardCard>
          </section>
      )}

      <section>
        <DashboardCard className="bg-gradient-to-br from-slate-800/80 to-slate-900/50 text-center py-10 border-slate-700">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-fuchsia-400">
            Unlock Your Full Learning Potential
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Nafs Hub is a suite of intelligent tools designed to deepen your understanding, enhance creativity, and streamline your learning process. Move beyond simple answers and start building real knowledge.
          </p>
        </DashboardCard>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">How It Works: A Quick Guide</h2>
        <div className="grid md:grid-cols-3 gap-8">
            <StepCard number="1" title="Select a Tool" description="Browse specialized tools and select one that fits your learning task." />
            <StepCard number="2" title="Provide Input" description="Enter your topic, question, or problem into the simple interface." />
            <StepCard number="3" title="Get AI Insight" description="Receive structured, intelligent responses to help you learn and grow." />
        </div>
      </section>
      
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentUser && (
            <TopToolsList title="Your Top 5 Tools" tools={topUserTools} isUserList />
          )}
          <div className={!currentUser ? 'md:col-span-2' : ''}>
            <TopToolsList title="Trending Tools" tools={topGlobalTools} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Explore Our Tools</h2>
          <div className="min-h-[400px]">
            {!activeCategory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-fade-in-up">
                    <DashboardCard className="md:col-span-2">
                        <div className="flex items-center gap-4">
                        <SparklesIcon className="w-8 h-8 text-yellow-300"/>
                        <h2 className="text-2xl font-bold">Daily Affirmation</h2>
                        </div>
                        <div className="mt-4 text-xl text-slate-300 h-8 flex items-center">
                            {currentUser ? (
                                isAffirmationLoading ? <LoaderIcon className="w-6 h-6 text-slate-400" /> : `"${affirmation}"`
                            ) : (
                                <Link to="/login" className="text-slate-400 text-base hover:text-cyan-400 transition-colors">
                                    {affirmation}
                                </Link>
                            )}
                        </div>
                    </DashboardCard>
                    {filteredFeatureGroups.map(group => (
                        <div key={group.name} onClick={() => setActiveCategory(group.name)} className="cursor-pointer">
                          <DashboardCard className="h-full flex flex-col justify-center items-center text-center">
                                <group.Icon className={`w-12 h-12 mb-4 ${group.iconColor}`} />
                                <h3 className="text-2xl font-bold mb-2">{group.name}</h3>
                                <p className="text-slate-400">{group.description}</p>
                          </DashboardCard>
                        </div>
                    ))}
                    {!currentUser && (
                      <div className="md:col-span-2 mt-2 text-center">
                          <p className="text-slate-400">
                              You're browsing as a guest. <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300">Log in</Link> or <Link to="/signup" className="font-semibold text-cyan-400 hover:text-cyan-300">Sign up</Link> to use the tools.
                          </p>
                      </div>
                    )}
                </div>
            ) : (
                <div className="animate-fade-in-up">
                    <button onClick={() => setActiveCategory(null)} className="text-cyan-400 hover:text-cyan-300 transition-colors mb-6 inline-block">&larr; Back to Categories</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                        {selectedGroup?.features.map(({ path, title, description, Icon, iconColor, example, guide }) => (
                            <Link to={currentUser ? path : '/login'} key={path} className="block">
                                <DashboardCard className="h-full flex flex-col">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Icon className={`w-8 h-8 ${iconColor}`}/>
                                            <h2 className="text-2xl font-bold">{title}</h2>
                                        </div>
                                        <p className="text-slate-400">{description}</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2 text-xs">
                                        {guide && (
                                            <div className="flex items-start gap-2 text-slate-400">
                                                <BulbIcon className="w-4 h-4 text-yellow-300/80 mt-0.5 flex-shrink-0" />
                                                <p>
                                                    <span className="font-semibold text-slate-300">Guide:</span> {guide}
                                                </p>
                                            </div>
                                        )}
                                        {example && (
                                            <div className="flex items-start gap-2 text-slate-400/80">
                                                <SparklesIcon className="w-4 h-4 text-cyan-400/70 mt-0.5 flex-shrink-0" />
                                                <p className="italic">
                                                    <span className="font-semibold not-italic">e.g.,</span> "{example}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </DashboardCard>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Why Use Nafs Hub?</h2>
        <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard icon={<BulbIcon className="w-8 h-8 text-cyan-300"/>} title="Deepen Understanding" description="Go beyond surface-level facts with tools that explore root causes, map concepts, and ask Socratic questions." />
            <BenefitCard icon={<TargetIcon className="w-8 h-8 text-fuchsia-400"/>} title="Boost Productivity" description="Quickly outline essays, generate flashcards, plan your study week, and summarize long texts in seconds." />
            <BenefitCard icon={<SparklesIcon className="w-8 h-8 text-yellow-300"/>} title="Enhance Creativity" description="Weave connections between disparate topics, create powerful metaphors, and brainstorm unique ideas for any project." />
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
