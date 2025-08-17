import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './src/components/Layout';
import Dashboard from './src/pages/Dashboard';
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';
import PrivateRoute from './src/components/PrivateRoute';
import ForgotPassword from './src/pages/ForgotPassword';
import NotFound from './src/pages/NotFound';

import FiveWhysExplorer from './src/features/FiveWhysExplorer';
import ConnectionWeaver from './src/features/ConnectionWeaver';
import FailureReFramer from './src/features/FailureReFramer';
import ArgumentDeconstructor from './src/features/ArgumentDeconstructor';
import LearningStyleDiagnostician from './src/features/LearningStyleDiagnostician';
import KnowledgeGapSpotter from './src/features/KnowledgeGapSpotter';
import MetaphorCreator from './src/features/MetaphorCreator';
import FutureSelfVisualizer from './src/features/FutureSelfVisualizer';
import StudyAmbienceGenerator from './src/features/StudyAmbienceGenerator';
import EthicalCompass from './src/features/EthicalCompass';
import VocabBuilder from './src/features/VocabBuilder';
import HistoricalFigureExplainer from './src/features/HistoricalFigureExplainer';
import LiteraryDevicesAnalyzer from './src/features/LiteraryDevicesAnalyzer';
import LabReportHelper from './src/features/LabReportHelper';
import CollegeEssayIdeasGenerator from './src/features/CollegeEssayIdeasGenerator';
import ClinicalCaseSimulator from './src/features/ClinicalCaseSimulator';
import MnemonicGenerator from './src/features/MnemonicGenerator';
import DrugInteractionChecker from './src/features/DrugInteractionChecker';
import MedicalTermDeconstructor from './src/features/MedicalTermDeconstructor';
import EthicalDilemmaExplorer from './src/features/EthicalDilemmaExplorer';
import TopicExplorer from './src/features/TopicExplorer';
import SmartGoalRefiner from './src/features/SmartGoalRefiner';
import FlashcardGenerator from './src/features/FlashcardGenerator';
import WeeklyStudyPlanner from './src/features/WeeklyStudyPlanner';
import EssayOutliner from './src/features/EssayOutliner';
import PracticeQuiz from './src/features/PracticeQuiz';
import AnalogyGenerator from './src/features/AnalogyGenerator';
import SocraticQuestioner from './src/features/SocraticQuestioner';
import TextSummarizer from './src/features/TextSummarizer';
import CodeExplainer from './src/features/CodeExplainer';
import DebatePointsGenerator from './src/features/DebatePointsGenerator';
import ResumeKeywordsExtractor from './src/features/ResumeKeywordsExtractor';
import MentalModelsExplainer from './src/features/MentalModelsExplainer';
import HistoricalContext from './src/features/HistoricalContext';
import ReadingListGenerator from './src/features/ReadingListGenerator';
import ConceptMapper from './src/features/ConceptMapper';
import AdminDashboard from './src/pages/AdminDashboard';
import AdminRoute from './src/components/AdminRoute';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="five-whys-explorer" element={<FiveWhysExplorer />} />
            <Route path="connection-weaver" element={<ConnectionWeaver />} />
            <Route path="failure-re-framer" element={<FailureReFramer />} />
            <Route path="argument-deconstructor" element={<ArgumentDeconstructor />} />
            <Route path="learning-style-diagnostician" element={<LearningStyleDiagnostician />} />
            <Route path="knowledge-gap-spotter" element={<KnowledgeGapSpotter />} />
            <Route path="metaphor-creator" element={<MetaphorCreator />} />
            <Route path="future-self-visualizer" element={<FutureSelfVisualizer />} />
            <Route path="study-ambience-generator" element={<StudyAmbienceGenerator />} />
            <Route path="ethical-compass" element={<EthicalCompass />} />
            <Route path="vocab-builder" element={<VocabBuilder />} />
            <Route path="historical-figure-explainer" element={<HistoricalFigureExplainer />} />
            <Route path="literary-devices-analyzer" element={<LiteraryDevicesAnalyzer />} />
            <Route path="lab-report-helper" element={<LabReportHelper />} />
            <Route path="college-essay-ideas-generator" element={<CollegeEssayIdeasGenerator />} />
            <Route path="clinical-case-simulator" element={<ClinicalCaseSimulator />} />
            <Route path="mnemonic-generator" element={<MnemonicGenerator />} />
            <Route path="drug-interaction-checker" element={<DrugInteractionChecker />} />
            <Route path="medical-term-deconstructor" element={<MedicalTermDeconstructor />} />
            <Route path="ethical-dilemma-explorer" element={<EthicalDilemmaExplorer />} />
            <Route path="topic-explorer" element={<TopicExplorer />} />
            <Route path="smart-goal-refiner" element={<SmartGoalRefiner />} />
            <Route path="flashcard-generator" element={<FlashcardGenerator />} />
            <Route path="weekly-study-planner" element={<WeeklyStudyPlanner />} />
            <Route path="essay-outliner" element={<EssayOutliner />} />
            <Route path="practice-quiz" element={<PracticeQuiz />} />
            <Route path="analogy-generator" element={<AnalogyGenerator />} />
            <Route path="socratic-questioner" element={<SocraticQuestioner />} />
            <Route path="text-summarizer" element={<TextSummarizer />} />
            <Route path="code-explainer" element={<CodeExplainer />} />
            <Route path="debate-points-generator" element={<DebatePointsGenerator />} />
            <Route path="resume-keywords-extractor" element={<ResumeKeywordsExtractor />} />
            <Route path="mental-models-explainer" element={<MentalModelsExplainer />} />
            <Route path="historical-context" element={<HistoricalContext />} />
            <Route path="reading-list-generator" element={<ReadingListGenerator />} />
            <Route path="concept-mapper" element={<ConceptMapper />} />
          </Route>
          
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
          
          {/* Catch-all route for 404 Not Found pages */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;