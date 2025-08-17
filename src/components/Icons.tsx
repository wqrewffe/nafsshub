import React from 'react';

interface IconProps {
  className?: string;
}

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.9 4.8-4.8 1.9 4.8 1.9 1.9 4.8 1.9-4.8 4.8-1.9-4.8-1.9z"></path>
    <path d="M5 21v-4"></path><path d="M19 21v-4"></path>
    <path d="M3 15h4"></path><path d="M17 15h4"></path>
  </svg>
);

export const BulbIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
    <path d="M9 18h6"></path><path d="M10 22h4"></path>
  </svg>
);

export const TargetIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

export const LoaderIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

export const CardsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="12" x="3" y="9" rx="2" ry="2"></rect>
        <path d="M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
        <path d="M10 9V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
    </svg>
);

export const CalendarDaysIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <path d="M8 14h.01"></path>
        <path d="M12 14h.01"></path>
        <path d="M16 14h.01"></path>
        <path d="M8 18h.01"></path>
        <path d="M12 18h.01"></path>
        <path d="M16 18h.01"></path>
    </svg>
);

export const DocumentTextIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const QuestionMarkCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

export const AnalogyIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a7 7 0 0 0-7 7c0 3 2 5 2 7h10c0-2 2-4 2-7a7 7 0 0 0-7-7Z"></path>
    <path d="M12 17v5"></path><path d="M12 20h.01"></path>
    <path d="m15.2 12.8-3.2-3.2-3.2 3.2"></path>
  </svg>
);

export const SocraticIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7Z"></path>
    <path d="M12 12h.01"></path><path d="M10 9a2.001 2.001 0 1 1 2 2.001c0 1-2 1-2 2"></path>
  </svg>
);

export const ConceptMapIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

export const SummarizerIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4A2.5 2.5 0 0 1 6.5 2z"></path>
    <line x1="12" y1="8" x2="12" y2="12"></line><line x1="10" y1="10" x2="14" y2="10"></line>
  </svg>
);

export const CodeExplainerIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
    <line x1="12" y1="4" x2="10" y2="20"></line>
  </svg>
);

export const DebateIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3L6 9l-4 2.5 4 2.5L6 21l6-6 6 6-1.5-5.5L22 14l-4-2.5L16.5 6z"></path>
  </svg>
);

export const ResumeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
    <path d="M9 7h6"></path><path d="M9 11h6"></path><path d="M9 15h4"></path>
  </svg>
);

export const MentalModelIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 12.5c0 .38-.02.75-.06 1.12-.13 1.4-1.12 3.12-2.12 2.12-1.22-1.22-1.15-3.6.21-5.18.2-.23.42-.44.65-.63"></path>
    <path d="M4 12.5c0 .38.02.75.06 1.12.13 1.4 1.12 3.12 2.12 2.12 1.22-1.22 1.15-3.6-.21-5.18-.2-.23-.42-.44-.65-.63"></path>
    <path d="M12 13.67c0 1.57-.59 2.97-1.5 4.07-1.22 1.48-3.5 1.48-4.72 0-1.22-1.48-.59-3.85.83-5.26C7.9 11.2 9.77 10 12 10c2.23 0 4.1 1.2 5.39 2.48 1.42 1.41 2.05 3.78.83 5.26-1.22 1.48-3.5 1.48-4.72 0-.91-1.1-1.5-2.5-1.5-4.07Z"></path>
    <path d="M12 10V4"></path><path d="M12 4c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3Z"></path>
  </svg>
);

export const ReadingListIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
    <path d="M12 6v6l4 2"></path>
  </svg>
);

// --- 5 NEW MEDICAL ICONS ---

export const ClinicalCaseIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="M12 18v-6"></path><path d="M9 15h6"></path>
  </svg>
);

export const MnemonicIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a10 10 0 1 0 10 10c0-2.34-.84-4.5-2.28-6.19"></path>
    <path d="M13.5 6H13v3.5l2 2"></path><path d="M8 17a2 2 0 1 0-4 0v1h4v-1a2 2 0 1 0-4 0"></path>
    <path d="M8 12a2 2 0 1 0-4 0v1h4v-1a2 2 0 1 0-4 0"></path>
    <path d="M12 17a2 2 0 1 0-4 0v1h4v-1a2 2 0 1 0-4 0"></path>
  </svg>
);

export const DrugInteractionIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v4"></path><path d="M12 22v-4"></path>
    <path d="M12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"></path>
    <path d="M20.4 16.4a3 3 0 1 1-5.7-2.9 3 3 0 0 1 5.7 2.9Z"></path>
    <path d="M3.6 16.4a3 3 0 1 0 5.7-2.9 3 3 0 0 0-5.7 2.9Z"></path>
  </svg>
);

export const MedicalTermIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.4 2.2c-1.5.8-2.3 2.5-1.9 4.2.4 2 2.2 3.2 4 2.9 1.8-.3 3-1.9 2.9-3.7-.1-1.7-1.3-3.2-2.8-4-1.5-.8-3.4-.6-4.2.4z"></path>
    <path d="M14 12c-2.5 0-4.5 2-4.5 4.5V18c0 .8.7 1.5 1.5 1.5h6c.8 0 1.5-.7 1.5-1.5v-1.5c0-2.5-2-4.5-4.5-4.5z"></path>
    <path d="M3 10.3c.1-.1.2-.2.3-.3 2.5-2.5 6.6-2.5 9.2 0 .1.1.2.2.3.3"></path>
    <path d="M11 20.2c.2-.1.3-.2.4-.4 1.8-2 1.8-5 0-7-.1-.1-.2-.2-.4-.4"></path>
  </svg>
);

export const EthicalDilemmaIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v18"></path><path d="M3.6 7.2h16.8"></path>
    <path d="M3.6 12h16.8"></path><path d="M3.6 16.8h16.8"></path>
    <path d="M19.2 3l-7.2 9-7.2-9"></path>
  </svg>
);


// --- 5 NEW HIGH SCHOOL ICONS ---

export const VocabularyIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    <path d="M13.5 8H10l-1 4 1 4h3.5"></path>
    <path d="m10 12 h3"></path>
  </svg>
);

export const HistoricalFigureIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a4 4 0 0 0-4 4c0 3 4 9 4 9s4-6 4-9a4 4 0 0 0-4-4Z"></path>
    <path d="M8 12c0 2.2 1.8 4 4 4s4-1.8 4-4"></path>
    <path d="M6 20h12"></path>
    <path d="M10 20v-4h4v4"></path>
  </svg>
);

export const LiteraryDeviceIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 15s2-2 4-2 4 2 4 2-2 2-4 2-4-2-4-2Z"></path>
    <path d="M18 19V5a2 2 0 0 0-2-2H8"></path>
    <path d="M18 19h2a2 2 0 0 0 2-2V7"></path>
  </svg>
);

export const ScienceLabIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5.5 21h13"></path>
    <path d="M7 21a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2"></path>
    <path d="M7 5V3"></path><path d="M17 5V3"></path>
    <path d="M12 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
    <path d="M12 11V8"></path>
  </svg>
);

export const CollegeEssayIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22v-6"></path><path d="M12 8V2"></path>
    <path d="M12 16a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3Z"></path>
    <path d="M18 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"></path>
    <path d="M6 8H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"></path>
  </svg>
);


// --- 10 NEW UNIQUE ICONS ---

export const RootCauseIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    <line x1="11" y1="8" x2="11" y2="14"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
    <path d="m11 14-2 3h6l-2-3"></path>
  </svg>
);

export const ConnectionWeaverIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6" cy="6" r="3"></circle>
    <circle cx="18" cy="18" r="3"></circle>
    <path d="M9 9c-3 3-3 8 0 11s8 3 11 0"></path>
    <path d="M15 15c3-3 3-8 0-11s-8-3-11 0"></path>
  </svg>
);

export const LearningStyleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 4a8 8 0 1 1-5.66 14.34"></path>
    <path d="M9.1 9a3 3 0 0 1 5.8 0"></path>
    <path d="M12 18H7.49a2 2 0 0 0-1.78 1.14"></path>
    <path d="M15.5 13.5c1.5 0 2.5 1.5 2.5 3s-1 3-2.5 3"></path>
  </svg>
);

export const ArgumentAnalysisIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v18"></path><path d="M3 12h18"></path>
    <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
    <path d="M18 18a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
    <path d="M6 6a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path>
  </svg>
);

export const StudyAmbienceIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8a4 4 0 0 1 4 4H8a4 4 0 0 1 4-4Z"></path>
    <path d="M8 12v5a4 4 0 0 0 8 0v-5"></path>
    <path d="M12 22v-2"></path>
    <path d="M4.2 12.8C2.9 14.9 4.9 18 7 18h10c2.1 0 4.1-3.1 2.8-5.2"></path>
  </svg>
);

export const FailureReframeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v6"></path><path d="m9 6 3-3 3 3"></path>
    <path d="M12 18a6 6 0 0 0 6-6h-2a4 4 0 0 1-4 4V8a4 4 0 0 1 4-4h2a6 6 0 0 0-6-6"></path>
    <path d="M12 18a6 6 0 0 1-6-6h2a4 4 0 0 0 4 4v4a4 4 0 0 0-4-4H6a6 6 0 0 1 6 6"></path>
  </svg>
);

export const KnowledgeGapIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 12H6"></path><path d="M12 18V6"></path>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
    <path d="M12 12v.01"></path><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" opacity="0.3"></path>
  </svg>
);

export const EthicalCompassIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m12 15-2-2 4-4 2 2-4 4z"></path>
  </svg>
);

export const MetaphorCreatorIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15.25 2.75a4 4 0 0 0-4.5 4.5v1.5h4.5a2.5 2.5 0 0 1 0 5h-10"></path>
    <path d="M8.75 15.25a4 4 0 0 0 4.5 4.5v-1.5h-4.5a2.5 2.5 0 0 1 0-5h10"></path>
  </svg>
);

export const FutureSelfIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path>
    <path d="M22 12h-4"></path><path d="M6 12H2"></path>
    <path d="M12 6V2"></path><path d="M12 22v-4"></path>
    <path d="m19.07 4.93-3.11 3.11"></path>
    <path d="M8.04 15.96 4.93 19.07"></path>
    <path d="m19.07 19.07-3.11-3.11"></path>
    <path d="m8.04 8.04-3.11-3.11"></path>
  </svg>
);

// --- NEW CATEGORY ICONS ---

export const BrainCircuitIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5v.5a4.5 4.5 0 0 0-4.5 4.5v2a4.5 4.5 0 0 0 4.5 4.5h.5a4.5 4.5 0 0 0 4.5 4.5h2a4.5 4.5 0 0 0 4.5-4.5v-.5a4.5 4.5 0 0 0 4.5-4.5v-2a4.5 4.5 0 0 0-4.5-4.5h-.5A4.5 4.5 0 0 0 12 2Z"></path>
        <path d="M12 8a4 4 0 1 0 0-4 4 4 0 0 0 0 4Z"></path>
    </svg>
);

export const HeartPulseIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        <path d="M3.22 12H9.5l.7-1.5L11.5 12h5.8"></path>
    </svg>
);

export const GraduationCapIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
    </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" className={className}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.828 6.17C34.556 2.368 29.632 0 24 0C10.745 0 0 10.745 0 24s10.745 24 24 24s24-10.745 24-24c0-1.341-.128-2.64-.359-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691c-1.645 3.328-2.606 7.108-2.606 11.137C3.7 30.041 5.4 33.621 7.7 36.57c2.3 2.949 5.5 5.22 9.1 6.615l-6.2-6.2z"></path>
        <path fill="#4CAF50" d="M24 48c5.632 0 10.556-1.856 14.172-4.962l-6.2-6.2c-2.019 1.342-4.462 2.162-7.172 2.162c-4.402 0-8.24-2.19-10.4-5.45l-6.5 6.5C7.4 43.1 15.2 48 24 48z"></path>
        <path fill="#1976D2" d="M43.611 20.083L48 20V24c0 13.255-10.745 24-24 24c-8.8 0-16.6-4.9-20.9-12.2l6.5-6.5c2.16 3.26 5.998 5.45 10.4 5.45c2.71 0 5.153-.82 7.172-2.162l6.2 6.2C33.1 46.1 28.6 48 24 48c-1.3 0-2.5-.06-3.7-.19l-6.1-6.1C10.7 34.9 8.1 29.8 8.1 24c0-4.029.96-7.809 2.6-11.137L6.3 14.691z"></path>
    </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);