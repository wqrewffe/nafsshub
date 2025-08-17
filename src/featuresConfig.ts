import { 
  SparklesIcon, BulbIcon, TargetIcon, LoaderIcon, CardsIcon, CalendarDaysIcon, DocumentTextIcon, QuestionMarkCircleIcon,
  AnalogyIcon, SocraticIcon, ConceptMapIcon, SummarizerIcon, CodeExplainerIcon, DebateIcon, ResumeIcon, MentalModelIcon, ReadingListIcon, HistoryIcon,
  ClinicalCaseIcon, MnemonicIcon, DrugInteractionIcon, MedicalTermIcon, EthicalDilemmaIcon,
  VocabularyIcon, HistoricalFigureIcon, LiteraryDeviceIcon, ScienceLabIcon, CollegeEssayIcon,
  RootCauseIcon, ConnectionWeaverIcon, LearningStyleIcon, ArgumentAnalysisIcon, StudyAmbienceIcon, FailureReframeIcon, KnowledgeGapIcon, EthicalCompassIcon, MetaphorCreatorIcon, FutureSelfIcon,
  BrainCircuitIcon, HeartPulseIcon, GraduationCapIcon, BookOpenIcon
} from './components/Icons';

const uniqueFeatures = [
    { path: 'five-whys-explorer', title: 'The Five Whys Explorer', description: 'State a problem to uncover its root cause.', Icon: RootCauseIcon, iconColor: 'text-yellow-400', example: 'I keep procrastinating on my essay.', guide: 'Start with a specific problem. Avoid broad statements for a clearer analysis.' },
    { path: 'connection-weaver', title: 'Connection Weaver', description: 'Find the surprising link between two topics.', Icon: ConnectionWeaverIcon, iconColor: 'text-sky-400', example: 'Connect "Jazz Music" and "Quantum Physics".', guide: 'Try connecting a concrete concept with an abstract one for surprising insights.' },
    { path: 'failure-re-framer', title: 'Failure Re-framer', description: 'Describe a setback to turn it into a lesson.', Icon: FailureReframeIcon, iconColor: 'text-green-400', example: 'I failed my midterm exam.', guide: 'Be honest about the situation. The more detail you provide, the better the reframe.' },
    { path: 'argument-deconstructor', title: 'Argument Deconstructor', description: 'Paste an argument to analyze its structure and flaws.', Icon: ArgumentAnalysisIcon, iconColor: 'text-rose-400', example: 'Paste an opinion piece about climate change.', guide: 'Paste the full argument, including any introductory or concluding remarks.' },
    { path: 'learning-style-diagnostician', title: 'Learning Style Diagnostician', description: 'Describe how you study to find your style.', Icon: LearningStyleIcon, iconColor: 'text-violet-400', example: 'I learn best by doing, not just reading.', guide: "Describe *how* you prefer to learn, not just *what* you learn (e.g., 'I remember things I see')." },
    { path: 'knowledge-gap-spotter', title: 'Knowledge Gap Spotter', description: "Enter a topic to find what you don't know.", Icon: KnowledgeGapIcon, iconColor: 'text-orange-400', example: 'The process of cellular respiration.', guide: 'Use this before you start studying a new topic to guide your learning.' },
    { path: 'metaphor-creator', title: 'Metaphor Creator', description: 'Enter a concept to generate creative metaphors.', Icon: MetaphorCreatorIcon, iconColor: 'text-fuchsia-400', example: 'The concept of "entropy".', guide: "Works best with abstract concepts that are hard to grasp (e.g., 'infinity', 'love', 'data')." },
    { path: 'future-self-visualizer', title: 'Future Self Visualizer', description: 'Describe a long-term goal for a motivational story.', Icon: FutureSelfIcon, iconColor: 'text-indigo-400', example: 'Become a published author.', guide: 'Focus on a single, major life goal to get a powerful and focused narrative.' },
    { path: 'study-ambience-generator', title: 'Study Ambience Generator', description: 'Describe your ideal study vibe for inspiration.', Icon: StudyAmbienceIcon, iconColor: 'text-amber-400', example: 'A quiet library with rain sounds.', guide: "Use descriptive, sensory words (e.g., 'cozy', 'rainy', 'quiet', 'warm') to set the mood." },
    { path: 'ethical-compass', title: 'Ethical Compass for AI', description: 'Check if your AI use follows academic integrity.', Icon: EthicalCompassIcon, iconColor: 'text-teal-400', example: 'Using an AI to write my history essay.', guide: "Clearly state your intended action and the context (e.g., 'using AI to write an essay for a graded assignment')." },
];

const highSchoolFeatures = [
    { path: 'vocab-builder', title: 'SAT/ACT Vocab Builder', description: "Get a new word. Try a topic like 'science' or 'literature'.", Icon: VocabularyIcon, iconColor: 'text-blue-400', example: 'A word related to "philosophy".', guide: "Provide a context or theme (e.g., 'words about government') to get relevant vocabulary." },
    { path: 'historical-figure-explainer', title: 'Historical Figure', description: 'Get a quick bio on an important historical figure.', Icon: HistoricalFigureIcon, iconColor: 'text-amber-500', example: 'Cleopatra', guide: "Enter just the name for best results. No need for titles like 'King' or 'President'." },
    { path: 'literary-devices-analyzer', title: 'Literary Devices', description: 'Paste a short text to find literary devices.', Icon: LiteraryDeviceIcon, iconColor: 'text-fuchsia-400', example: 'Paste a poem by Emily Dickinson.', guide: 'Best with shorter passages like a poem or a single paragraph of prose.' },
    { path: 'lab-report-helper', title: 'Lab Report Helper', description: 'Outline a lab report for a science experiment.', Icon: ScienceLabIcon, iconColor: 'text-emerald-400', example: 'Photosynthesis in spinach leaves.', guide: "Clearly state the core scientific question you're investigating (e.g., 'How does salt affect the boiling point of water?')." },
    { path: 'college-essay-ideas-generator', title: 'College Essay Ideas', description: 'Brainstorm ideas for an application essay.', Icon: CollegeEssayIcon, iconColor: 'text-indigo-400', example: 'Describe a time you faced a challenge.', guide: 'Paste the exact essay prompt from the application for the most relevant ideas.' },
];

const medicalStudentFeatures = [
    { path: 'clinical-case-simulator', title: 'Clinical Case Simulator', description: 'Practice your clinical reasoning. Enter a condition.', Icon: ClinicalCaseIcon, iconColor: 'text-red-400', example: 'A patient with symptoms of appendicitis.', guide: 'Enter a specific condition or disease to generate a focused case.' },
    { path: 'mnemonic-generator', title: 'Mnemonic Generator', description: 'Create a mnemonic for any medical topic.', Icon: MnemonicIcon, iconColor: 'text-cyan-400', example: 'The bones of the wrist.', guide: 'Use it for lists of terms you need to memorize, like anatomical parts or drug classes.' },
    { path: 'drug-interaction-checker', title: 'Drug Interaction', description: 'Check interactions between drugs (comma-separated).', Icon: DrugInteractionIcon, iconColor: 'text-amber-400', example: 'Warfarin and Ibuprofen', guide: 'Enter two or more drug names, separated by commas. Use generic names for best results.' },
    { path: 'medical-term-deconstructor', title: 'Term Deconstructor', description: 'Break down any complex medical term.', Icon: MedicalTermIcon, iconColor: 'text-lime-400', example: 'Otorhinolaryngology', guide: 'Enter one complex term at a time. Spelling is important!' },
    { path: 'ethical-dilemma-explorer', title: 'Ethical Dilemmas', description: 'Explore the ethics of a clinical scenario.', Icon: EthicalDilemmaIcon, iconColor: 'text-violet-400', example: 'A family refusing a life-saving transfusion.', guide: "Describe a clinical situation with an ethical conflict (e.g., 'patient autonomy vs. beneficence')." },
];

const generalStudentFeatures = [
    { path: 'topic-explorer', title: 'Topic Explorer', description: 'Enter a topic you want to understand better.', Icon: BulbIcon, iconColor: 'text-cyan-300', example: 'Black Holes', guide: "Start broad, then use the 'Related Topics' to dive deeper into specific areas." },
    { path: 'smart-goal-refiner', title: 'S.M.A.R.T. Goal Refiner', description: 'Turn your ambitions into actionable plans.', Icon: TargetIcon, iconColor: 'text-fuchsia-400', example: 'I want to learn Spanish.', guide: 'State your goal as you would normally say it. The AI will handle the structure.' },
    { path: 'flashcard-generator', title: 'Flashcard Generator', description: 'Enter a topic to create a set of flashcards.', Icon: CardsIcon, iconColor: 'text-blue-400', example: 'Capitals of European countries.', guide: 'Best for topics with clear terms and definitions, like history dates or vocabulary.' },
    { path: 'weekly-study-planner', title: 'Weekly Study Planner', description: 'List your subjects or goals for this week.', Icon: CalendarDaysIcon, iconColor: 'text-green-400', example: 'Prepare for finals in Biology and Chemistry.', guide: "List your main goals for the week, like 'Study for biology midterm, write English paper'." },
    { path: 'essay-outliner', title: 'Essay Outliner', description: 'Enter an essay topic to generate an outline.', Icon: DocumentTextIcon, iconColor: 'text-orange-400', example: 'The role of technology in modern education.', guide: 'Provide a clear and specific essay topic or thesis statement.' },
    { path: 'practice-quiz', title: 'Practice Quiz', description: 'Generate a quiz to test your knowledge.', Icon: QuestionMarkCircleIcon, iconColor: 'text-indigo-400', example: 'The American Civil War', guide: 'Enter a subject or chapter title to test your knowledge before an exam.' },
    { path: 'analogy-generator', title: 'Analogy Generator', description: 'Explain a complex topic with a simple analogy.', Icon: AnalogyIcon, iconColor: 'text-lime-400', example: 'How does a computer processor work?', guide: 'Use for complex scientific or philosophical concepts that are hard to visualize.' },
    { path: 'socratic-questioner', title: 'Socratic Questioner', description: 'Deepen your understanding with probing questions.', Icon: SocraticIcon, iconColor: 'text-teal-400', example: 'What is justice?', guide: 'Enter a statement or belief you hold to challenge your own assumptions.' },
    { path: 'text-summarizer', title: 'Text Summarizer', description: 'Paste text to get a concise summary.', Icon: SummarizerIcon, iconColor: 'text-rose-400', example: 'Paste a long news article.', guide: 'Paste the full text for the most accurate summary. Works best with articles or reports.' },
    { path: 'code-explainer', title: 'Code Explainer', description: 'Get a plain English explanation of any code.', Icon: CodeExplainerIcon, iconColor: 'text-slate-400', example: 'A Python script for sorting a list.', guide: 'Include comments if the original code has them; it helps the AI understand the intent.' },
    { path: 'debate-points-generator', title: 'Debate Points', description: 'Generate pro and con arguments for any topic.', Icon: DebateIcon, iconColor: 'text-amber-400', example: 'Should social media be regulated?', guide: "Phrase your topic as a debate motion, e.g., 'This house believes that...'" },
    { path: 'resume-keywords-extractor', title: 'Resume Keywords', description: 'Extract keywords from a job description.', Icon: ResumeIcon, iconColor: 'text-emerald-400', example: 'Paste a job description for a software engineer.', guide: "Copy and paste the entire 'responsibilities' or 'qualifications' section from a job posting." },
    { path: 'mental-models-explainer', title: 'Mental Models', description: 'Learn powerful frameworks for thinking.', Icon: MentalModelIcon, iconColor: 'text-violet-400', example: 'Explain "Occam\'s Razor".', guide: 'Select a model from the list. Use this tool to build a toolkit of thinking frameworks.' },
    { path: 'historical-context', title: 'Historical Context', description: 'Understand the background of any event or topic.', Icon: HistoryIcon, iconColor: 'text-yellow-400', example: 'The fall of the Roman Empire.', guide: 'Enter an event, person, or movement to understand the world around it.' },
    { path: 'reading-list-generator', title: 'Reading List', description: 'Get book recommendations on your interests.', Icon: ReadingListIcon, iconColor: 'text-orange-400', example: 'Books on ancient history and economics.', guide: "Combine a few interests or topics for more personalized recommendations (e.g., 'Roman history and leadership')." },
    { path: 'concept-mapper', title: 'Concept Mapper', description: 'Visually map out the connections in a topic.', Icon: ConceptMapIcon, iconColor: 'text-sky-400', example: 'The key components of a democracy.', guide: 'Ideal for breaking down large, complex topics into smaller, connected parts.' },
];

export const featureGroups = [
    { 
        name: 'Unique Cognitive Enhancers', 
        description: 'Tools to develop deeper thinking and creativity.', 
        Icon: BrainCircuitIcon, 
        iconColor: 'text-yellow-400',
        features: uniqueFeatures 
    },
    { 
        name: 'Medical Student Toolkit', 
        description: 'Specialized tools for students in the medical field.',
        Icon: HeartPulseIcon,
        iconColor: 'text-red-400',
        features: medicalStudentFeatures 
    },
    { 
        name: 'High School Essentials', 
        description: 'A focused toolkit for success in high school.',
        Icon: GraduationCapIcon,
        iconColor: 'text-blue-400',
        features: highSchoolFeatures 
    },
    { 
        name: 'General Student Tools', 
        description: 'A versatile toolkit for all types of learners.',
        Icon: BookOpenIcon,
        iconColor: 'text-green-400',
        features: generalStudentFeatures
    }
];