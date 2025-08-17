export interface TopicExploration {
  topicName: string;
  simpleExplanation: string;
  keyConcepts: string[];
  relatedTopics: string[];
}

export interface SmartGoal {
    refinedGoal: string;
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface WeeklyPlan {
  day: string;
  tasks: string[];
}

export interface EssayOutline {
  title: string;
  introduction: string;
  bodyParagraphs: string[];
  conclusion: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// --- 10 NEW FEATURE TYPES ---

export interface Analogy {
  topic: string;
  analogy: string;
  explanation: string;
}

export interface ProbingQuestion {
  topic: string;
  question: string;
}

export interface ConceptMap {
  centralConcept: string;
  mainBranches: {
    topic: string;
    subPoints: string[];
  }[];
}

export interface CodeExplanation {
  language: string;
  explanation: string;
  breakdown: {
    part: string;
    description: string;
  }[];
}

export interface DebatePoints {
  motion: string;
  pros: string[];
  cons: string[];
}

export interface ResumeKeywords {
  jobTitle: string;
  hardSkills: string[];
  softSkills: string[];
}

export interface MentalModel {
  name: string;
  description: string;
  example: string;
}

export interface Reading {
  title: string;
  author: string;
  reason: string;
}

export interface ReadingList {
  topic: string;
  books: Reading[];
}

export interface HistoricalContext {
    topic: string;
    summary: string;
    keyFigures: string[];
    timeline: {
        date: string;
        event: string;
    }[];
}

// --- 5 NEW MEDICAL STUDENT FEATURE TYPES ---

export interface ClinicalCase {
  vignette: string;
  differentialDiagnosis: string[];
  workup: string[];
  management: string[];
}

export interface Mnemonic {
  topic: string;
  mnemonic: string;
  explanation: string;
}

export interface DrugInteraction {
  drugs: string[];
  interactionType: string;
  mechanism: string;
  clinicalSignificance: string;
}

export interface DeconstructedTerm {
  term: string;
  definition: string;
  breakdown: {
    part: string;
    meaning: string;
    type: 'prefix' | 'root' | 'suffix';
  }[];
}

export interface EthicalDilemma {
  scenario: string;
  ethicalPrinciples: {
    principle: 'Autonomy' | 'Beneficence' | 'Non-maleficence' | 'Justice';
    argument: string;
  }[];
}

// --- 5 NEW HIGH SCHOOL STUDENT FEATURE TYPES ---

export interface VocabularyWord {
  word: string;
  definition: string;
  exampleSentence: string;
}

export interface HistoricalFigure {
  name: string;
  lifespan: string;
  summary: string;
  keyAccomplishments: string[];
  historicalSignificance: string;
}

export interface LiteraryDeviceAnalysis {
  passage: string;
  devices: {
    device: string;
    explanation: string;
    quote: string;
  }[];
}

export interface LabReportHelper {
    title: string;
    hypothesis: string;
    method: string[];
    variables: {
        independent: string;
        dependent: string;
        controlled: string;
    };
}

export interface CollegeEssayIdeas {
    prompt: string;
    themes: string[];
    storyIdeas: string[];
    openingHookSuggestion: string;
}

// --- 10 NEW UNIQUE FEATURE TYPES ---

export interface RootCauseAnalysis {
  problemStatement: string;
  analysis: {
    why: string;
    reason: string;
  }[];
  rootCause: string;
}

export interface InterdisciplinaryConnection {
  topicA: string;
  topicB: string;
  connectionNarrative: string;
  keyBridgingConcepts: string[];
}

export interface LearningStyle {
  dominantStyle: 'Visual' | 'Auditory' | 'Reading/Writing' | 'Kinesthetic';
  explanation: string;
  recommendedStrategies: string[];
}

export interface ArgumentAnalysis {
  mainClaim: string;
  supportingEvidence: string[];
  underlyingAssumptions: string[];
  potentialFallacies: {
    fallacy: string;
    explanation: string;
  }[];
}

export interface StudyAmbience {
    title: string;
    description: string;
    soundKeywords: string[];
}

export interface FailureReframing {
  situation: string;
  lessonsLearned: string[];
  actionableSteps: string[];
}

export interface KnowledgeGaps {
    topic: string;
    probingQuestions: string[];
}

export interface EthicalGuidance {
  proposedUse: string;
  guidance: string;
  potentialPitfalls: string[];
  recommendation: 'Ethical' | 'Use with Caution' | 'Unethical';
}

export interface CreativeMetaphor {
  concept: string;
  metaphors: {
    metaphor: string;
    explanation: string;
  }[];
}

export interface FutureSelfNarrative {
  goal: string;
  narrative: string;
}

// --- HISTORY TYPE ---

export interface HistoryItem<T> {
  id: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  input: any; // Can be a string or an object for complex inputs
  output: T;
}
