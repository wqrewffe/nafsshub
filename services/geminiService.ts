import { GoogleGenAI, Type } from "@google/genai";
import { 
    TopicExploration, SmartGoal, Flashcard, WeeklyPlan, EssayOutline, QuizQuestion, 
    Analogy, ProbingQuestion, ConceptMap, CodeExplanation, DebatePoints, ResumeKeywords, 
    MentalModel, ReadingList, HistoricalContext, ClinicalCase, Mnemonic, DrugInteraction,
    DeconstructedTerm, EthicalDilemma, VocabularyWord, HistoricalFigure, LiteraryDeviceAnalysis,
    LabReportHelper, CollegeEssayIdeas, RootCauseAnalysis, InterdisciplinaryConnection, LearningStyle,
    ArgumentAnalysis, StudyAmbience, FailureReframing, KnowledgeGaps, EthicalGuidance,
    CreativeMetaphor, FutureSelfNarrative
} from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const callApi = async (contents: string, responseSchema: any) => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
            responseMimeType: 'application/json',
            responseSchema,
        }
    });
    return JSON.parse(response.text);
}

export async function getDailyAffirmation(): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Generate a short, powerful, and encouraging affirmation for a student focused on learning and personal growth. Make it a single sentence.',
    config: {
        temperature: 0.9,
        maxOutputTokens: 50,
        thinkingConfig: { thinkingBudget: 25 },
    }
  });
  return response.text.trim().replace(/"/g, '');
}


const topicSchema = {
  type: Type.OBJECT,
  properties: {
    topicName: { type: Type.STRING },
    simpleExplanation: { 
      type: Type.STRING,
      description: "A simple, one-paragraph explanation of the topic suitable for a beginner."
    },
    keyConcepts: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "A list of 3-5 key concepts or terms related to the topic."
    },
    relatedTopics: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "A list of 3-5 related topics for further exploration."
    }
  },
  required: ['topicName', 'simpleExplanation', 'keyConcepts', 'relatedTopics']
};

export async function exploreTopic(topic: string): Promise<TopicExploration> {
  return await callApi(`Please provide a breakdown of the following topic for a student: "${topic}"`, topicSchema);
}


const goalSchema = {
    type: Type.OBJECT,
    properties: {
        refinedGoal: {
            type: Type.STRING,
            description: "The user's goal, rewritten as a single, clear S.M.A.R.T. goal sentence."
        },
        specific: {
            type: Type.STRING,
            description: "Explanation of how the refined goal is Specific."
        },
        measurable: {
            type: Type.STRING,
            description: "Explanation of how the refined goal is Measurable."
        },
        achievable: {
            type: Type.STRING,
            description: "Explanation of how the refined goal is Achievable."
        },
        relevant: {
            type: Type.STRING,
            description: "Explanation of how the refined goal is Relevant."
        },
        timeBound: {
            type: Type.STRING,
            description: "Explanation of how the refined goal is Time-bound."
        }
    },
    required: ['refinedGoal', 'specific', 'measurable', 'achievable', 'relevant', 'timeBound']
};

export async function refineGoal(goal: string): Promise<SmartGoal> {
    return await callApi(`A student's goal is: "${goal}". Please convert this into a S.M.A.R.T. (Specific, Measurable, Achievable, Relevant, Time-bound) goal and provide a breakdown of each component.`, goalSchema);
}


const flashcardSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The 'front' of the flashcard, posing a question or term."
      },
      answer: {
        type: Type.STRING,
        description: "The 'back' of the flashcard, providing the answer or definition."
      }
    },
    required: ['question', 'answer']
  }
};

export async function generateFlashcards(topic: string): Promise<Flashcard[]> {
    return await callApi(`Generate a set of 5-8 flashcards for the topic: "${topic}". Each flashcard should have a question and a concise answer.`, flashcardSchema);
}

const weeklyPlanSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            day: {
                type: Type.STRING,
                description: "The day of the week (e.g., Monday)."
            },
            tasks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of specific study tasks or goals for that day."
            }
        },
        required: ['day', 'tasks']
    }
};

export async function createWeeklyPlan(goals: string): Promise<WeeklyPlan[]> {
    return await callApi(`A student has the following goals for the week: "${goals}". Create a 7-day study plan (Monday to Sunday) to help them achieve these goals, breaking down tasks for each day.`, weeklyPlanSchema);
}


const essayOutlineSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A suitable title for the essay."
        },
        introduction: {
            type: Type.STRING,
            description: "A brief introduction paragraph, including a thesis statement."
        },
        bodyParagraphs: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of main points, where each string represents the topic sentence or main idea for a body paragraph."
        },
        conclusion: {
            type: Type.STRING,
            description: "A brief concluding paragraph summarizing the main points and restating the thesis."
        }
    },
    required: ['title', 'introduction', 'bodyParagraphs', 'conclusion']
};

export async function createEssayOutline(topic: string): Promise<EssayOutline> {
    return await callApi(`Generate a standard 5-paragraph essay outline for the following topic: "${topic}".`, essayOutlineSchema);
}


const quizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: {
                type: Type.STRING,
                description: "The multiple-choice question."
            },
            options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "An array of 4 possible answers."
            },
            correctAnswer: {
                type: Type.STRING,
                description: "The correct answer from the options list."
            }
        },
        required: ['question', 'options', 'correctAnswer']
    }
};

export async function generateQuiz(topic: string): Promise<QuizQuestion[]> {
    return await callApi(`Generate a 5-question multiple-choice quiz on the topic: "${topic}". For each question, provide 4 options and specify the correct answer. Ensure the correct answer is one of the provided options.`, quizSchema);
}

// --- 10 NEW SERVICE FUNCTIONS ---

const analogySchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        analogy: { type: Type.STRING, description: "A simple, creative analogy." },
        explanation: { type: Type.STRING, description: "A brief explanation of how the analogy works." }
    },
    required: ['topic', 'analogy', 'explanation']
};
export async function generateAnalogy(topic: string): Promise<Analogy> {
    return await callApi(`Generate a simple analogy to explain the topic: "${topic}". Also provide a brief explanation of how the analogy connects to the topic.`, analogySchema);
}

const probingQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        question: { type: Type.STRING, description: "An insightful, open-ended question to provoke deeper thought." }
    },
    required: ['topic', 'question']
};
export async function generateProbingQuestion(topic: string): Promise<ProbingQuestion> {
    return await callApi(`Ask a probing, Socratic-style question about the following topic or statement to encourage deeper understanding: "${topic}"`, probingQuestionSchema);
}

const conceptMapSchema = {
    type: Type.OBJECT,
    properties: {
        centralConcept: { type: Type.STRING },
        mainBranches: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    topic: { type: Type.STRING },
                    subPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['topic', 'subPoints']
            }
        }
    },
    required: ['centralConcept', 'mainBranches']
};
export async function createConceptMap(topic: string): Promise<ConceptMap> {
    return await callApi(`Create a concept map for the topic: "${topic}". Identify the central concept, 3-4 main branches, and 2-3 sub-points for each branch.`, conceptMapSchema);
}

const summarySchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A concise summary of the provided text." }
    },
    required: ['summary']
};
export async function summarizeText(text: string): Promise<{ summary: string }> {
    return await callApi(`Summarize the following text in a clear and concise paragraph:\n\n---\n${text}\n---`, summarySchema);
}

const codeExplanationSchema = {
    type: Type.OBJECT,
    properties: {
        language: { type: Type.STRING, description: "The detected programming language." },
        explanation: { type: Type.STRING, description: "A high-level explanation of what the code does." },
        breakdown: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    part: { type: Type.STRING, description: "The specific line or block of code." },
                    description: { type: Type.STRING, description: "An explanation of that specific part." }
                },
                required: ['part', 'description']
            }
        }
    },
    required: ['language', 'explanation', 'breakdown']
};
export async function explainCode(code: string): Promise<CodeExplanation> {
    return await callApi(`Explain the following code snippet. Identify the language, provide a high-level summary, and then break down key lines or blocks:\n\n\`\`\`\n${code}\n\`\`\``, codeExplanationSchema);
}

const debatePointsSchema = {
    type: Type.OBJECT,
    properties: {
        motion: { type: Type.STRING, description: "The debate motion being discussed." },
        pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 arguments for the motion." },
        cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 arguments against the motion." }
    },
    required: ['motion', 'pros', 'cons']
};
export async function generateDebatePoints(topic: string): Promise<DebatePoints> {
    return await callApi(`Generate a list of pro and con arguments for the debate topic: "${topic}".`, debatePointsSchema);
}

const resumeKeywordsSchema = {
    type: Type.OBJECT,
    properties: {
        jobTitle: { type: Type.STRING },
        hardSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of technical skills, tools, and technologies." },
        softSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of interpersonal and professional skills." }
    },
    required: ['jobTitle', 'hardSkills', 'softSkills']
};
export async function getResumeKeywords(jobDescription: string): Promise<ResumeKeywords> {
    return await callApi(`Analyze the following job description and extract the most important hard skills and soft skills to include on a resume. Also, identify the job title.\n\n---\n${jobDescription}\n---`, resumeKeywordsSchema);
}

const mentalModelSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING, description: "A clear explanation of the mental model." },
        example: { type: Type.STRING, description: "A practical example of how to apply it." }
    },
    required: ['name', 'description', 'example']
};
export async function explainMentalModel(modelName: string): Promise<MentalModel> {
    return await callApi(`Explain the mental model: "${modelName}". Describe what it is and provide a simple, real-world example of its application.`, mentalModelSchema);
}

const readingListSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        books: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    author: { type: Type.STRING },
                    reason: { type: Type.STRING, description: "A brief reason why this book is a good recommendation." }
                },
                required: ['title', 'author', 'reason']
            }
        }
    },
    required: ['topic', 'books']
};
export async function createReadingList(interests: string): Promise<ReadingList> {
    return await callApi(`Generate a curated reading list of 3-5 books based on the following interests: "${interests}". For each book, provide the title, author, and a short sentence on why it's a good fit.`, readingListSchema);
}

const historicalContextSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        summary: { type: Type.STRING, description: "A summary of the historical context." },
        keyFigures: { type: Type.ARRAY, items: { type: Type.STRING } },
        timeline: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    date: { type: Type.STRING },
                    event: { type: Type.STRING }
                },
                required: ['date', 'event']
            }
        }
    },
    required: ['topic', 'summary', 'keyFigures', 'timeline']
};
export async function getHistoricalContext(topic: string): Promise<HistoricalContext> {
    return await callApi(`Provide historical context for the following topic: "${topic}". Include a brief summary, a list of key figures, and a short timeline of major events.`, historicalContextSchema);
}

// --- 5 NEW MEDICAL SERVICE FUNCTIONS ---

const clinicalCaseSchema = {
    type: Type.OBJECT,
    properties: {
        vignette: { type: Type.STRING, description: "A realistic clinical vignette about the condition, including patient history, symptoms, and vital signs." },
        differentialDiagnosis: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 likely differential diagnoses." },
        workup: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of initial diagnostic tests or procedures to order." },
        management: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key initial management steps." }
    },
    required: ['vignette', 'differentialDiagnosis', 'workup', 'management']
};
export async function simulateClinicalCase(condition: string): Promise<ClinicalCase> {
    return await callApi(`Generate a clinical case simulation for a medical student about "${condition}". Provide a patient vignette, 3-5 differential diagnoses, a recommended initial workup, and a basic management plan.`, clinicalCaseSchema);
}

const mnemonicSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        mnemonic: { type: Type.STRING, description: "A creative and memorable mnemonic." },
        explanation: { type: Type.STRING, description: "An explanation of what each part of the mnemonic stands for." }
    },
    required: ['topic', 'mnemonic', 'explanation']
};
export async function generateMnemonic(topic: string): Promise<Mnemonic> {
    return await callApi(`Generate a clever mnemonic for the medical topic: "${topic}".`, mnemonicSchema);
}


const drugInteractionSchema = {
    type: Type.OBJECT,
    properties: {
        drugs: { type: Type.ARRAY, items: { type: Type.STRING } },
        interactionType: { type: Type.STRING, description: "The type of interaction (e.g., Pharmacokinetic, Pharmacodynamic, Synergistic, Antagonistic)." },
        mechanism: { type: Type.STRING, description: "A clear, concise explanation of the interaction mechanism." },
        clinicalSignificance: { type: Type.STRING, description: "The potential clinical outcome or recommendation (e.g., increased risk of bleeding, requires dose adjustment)." }
    },
    required: ['drugs', 'interactionType', 'mechanism', 'clinicalSignificance']
};
export async function checkDrugInteraction(drugs: string): Promise<DrugInteraction> {
    return await callApi(`Analyze the potential drug interaction between the following drugs: ${drugs}. Describe the interaction type, mechanism, and clinical significance.`, drugInteractionSchema);
}

const medicalTermSchema = {
    type: Type.OBJECT,
    properties: {
        term: { type: Type.STRING },
        definition: { type: Type.STRING },
        breakdown: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    part: { type: Type.STRING },
                    meaning: { type: Type.STRING },
                    type: { type: Type.STRING, description: "e.g., prefix, root, suffix" }
                },
                required: ['part', 'meaning', 'type']
            }
        }
    },
    required: ['term', 'definition', 'breakdown']
};
export async function deconstructMedicalTerm(term: string): Promise<DeconstructedTerm> {
    return await callApi(`Deconstruct the medical term "${term}". Provide its definition and break it down into its constituent parts (prefix, root, suffix) with their meanings.`, medicalTermSchema);
}

const ethicalDilemmaSchema = {
    type: Type.OBJECT,
    properties: {
        scenario: { type: Type.STRING, description: "A summary of the ethical dilemma." },
        ethicalPrinciples: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    principle: { type: Type.STRING, description: "e.g., Autonomy, Beneficence, Non-maleficence, Justice" },
                    argument: { type: Type.STRING, description: "How this principle applies to the scenario." }
                },
                required: ['principle', 'argument']
            }
        }
    },
    required: ['scenario', 'ethicalPrinciples']
};
export async function exploreEthicalDilemma(topic: string): Promise<EthicalDilemma> {
    return await callApi(`Explore the medical ethics of the following scenario: "${topic}". Present the scenario and analyze it through the four pillars of medical ethics (Autonomy, Beneficence, Non-maleficence, Justice).`, ethicalDilemmaSchema);
}

// --- 5 NEW HIGH SCHOOL SERVICE FUNCTIONS ---

const vocabSchema = {
    type: Type.OBJECT,
    properties: {
        word: { type: Type.STRING },
        definition: { type: Type.STRING },
        exampleSentence: { type: Type.STRING }
    },
    required: ['word', 'definition', 'exampleSentence']
};
export async function buildVocabulary(topic: string): Promise<VocabularyWord> {
    return await callApi(`Generate an SAT/ACT-level vocabulary word related to the topic of "${topic}". Provide the word, its definition, and a clear example sentence.`, vocabSchema);
}

const historicalFigureSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        lifespan: { type: Type.STRING, description: "e.g., 1867-1934" },
        summary: { type: Type.STRING, description: "A brief, one-paragraph summary of their life and work." },
        keyAccomplishments: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 major accomplishments." },
        historicalSignificance: { type: Type.STRING, description: "A sentence on their lasting impact or significance." }
    },
    required: ['name', 'lifespan', 'summary', 'keyAccomplishments', 'historicalSignificance']
};
export async function explainHistoricalFigure(name: string): Promise<HistoricalFigure> {
    return await callApi(`Provide a profile of the historical figure: "${name}". Include their lifespan, a summary, key accomplishments, and historical significance for a high school student.`, historicalFigureSchema);
}

const literaryDeviceSchema = {
    type: Type.OBJECT,
    properties: {
        passage: { type: Type.STRING },
        devices: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    device: { type: Type.STRING, description: "The name of the literary device (e.g., Metaphor, Simile)." },
                    explanation: { type: Type.STRING, description: "A brief explanation of the device in context." },
                    quote: { type: Type.STRING, description: "The exact quote from the passage demonstrating the device." }
                },
                required: ['device', 'explanation', 'quote']
            }
        }
    },
    required: ['passage', 'devices']
};
export async function identifyLiteraryDevices(passage: string): Promise<LiteraryDeviceAnalysis> {
    return await callApi(`Analyze the following passage for literary devices. Identify 2-3 key devices, explain them, and provide the quote where each is found.\n\n---\n${passage}\n---`, literaryDeviceSchema);
}

const labReportSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        hypothesis: { type: Type.STRING, description: "A testable hypothesis in an 'If... then...' format." },
        method: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A numbered list of steps to conduct the experiment." },
        variables: {
            type: Type.OBJECT,
            properties: {
                independent: { type: Type.STRING, description: "The variable that is changed or manipulated." },
                dependent: { type: Type.STRING, description: "The variable that is measured." },
                controlled: { type: Type.STRING, description: "Key variables that are kept constant." }
            },
            required: ['independent', 'dependent', 'controlled']
        }
    },
    required: ['title', 'hypothesis', 'method', 'variables']
};
export async function helpWithLabReport(topic: string): Promise<LabReportHelper> {
    return await callApi(`Help a high school student outline a science lab report about: "${topic}". Generate a suitable title, a testable hypothesis, a step-by-step method, and identify the independent, dependent, and controlled variables.`, labReportSchema);
}

const collegeEssaySchema = {
    type: Type.OBJECT,
    properties: {
        prompt: { type: Type.STRING },
        themes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 potential themes to explore." },
        storyIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3 personal story angles or anecdotes to consider." },
        openingHookSuggestion: { type: Type.STRING, description: "A creative and engaging opening sentence or question." }
    },
    required: ['prompt', 'themes', 'storyIdeas', 'openingHookSuggestion']
};
export async function brainstormCollegeEssay(prompt: string): Promise<CollegeEssayIdeas> {
    return await callApi(`Brainstorm ideas for a college application essay for a high school student based on the following prompt. Suggest potential themes, personal story ideas, and a compelling opening hook.\n\nPrompt: "${prompt}"`, collegeEssaySchema);
}


// --- 10 NEW UNIQUE SERVICE FUNCTIONS ---

const rootCauseSchema = {
    type: Type.OBJECT,
    properties: {
        problemStatement: { type: Type.STRING },
        analysis: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    why: { type: Type.STRING },
                    reason: { type: Type.STRING }
                },
                required: ['why', 'reason']
            }
        },
        rootCause: { type: Type.STRING }
    },
    required: ['problemStatement', 'analysis', 'rootCause']
};
export async function exploreRootCause(problem: string): Promise<RootCauseAnalysis> {
    return await callApi(`A student is facing this problem: "${problem}". Guide them through a "5 Whys" root cause analysis to uncover the fundamental issue. Frame each step clearly.`, rootCauseSchema);
}

const connectionWeaverSchema = {
    type: Type.OBJECT,
    properties: {
        topicA: { type: Type.STRING },
        topicB: { type: Type.STRING },
        connectionNarrative: { type: Type.STRING, description: "A creative and coherent narrative that connects the two topics." },
        keyBridgingConcepts: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['topicA', 'topicB', 'connectionNarrative', 'keyBridgingConcepts']
};
export async function weaveConnections(topics: { topicA: string, topicB: string }): Promise<InterdisciplinaryConnection> {
    return await callApi(`Find and explain a surprising or insightful connection between two seemingly unrelated topics: "${topics.topicA}" and "${topics.topicB}". Provide a narrative and list the key concepts that bridge them.`, connectionWeaverSchema);
}

const learningStyleSchema = {
    type: Type.OBJECT,
    properties: {
        dominantStyle: { type: Type.STRING, description: "The most likely learning style (Visual, Auditory, Reading/Writing, or Kinesthetic)." },
        explanation: { type: Type.STRING, description: "A brief explanation of this learning style." },
        recommendedStrategies: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['dominantStyle', 'explanation', 'recommendedStrategies']
};
export async function diagnoseLearningStyle(description: string): Promise<LearningStyle> {
    return await callApi(`Based on this student's description of how they like to learn, diagnose their dominant learning style (VARK model) and suggest 3-4 tailored study strategies. Description: "${description}"`, learningStyleSchema);
}

const argumentAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        mainClaim: { type: Type.STRING },
        supportingEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
        underlyingAssumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
        potentialFallacies: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    fallacy: { type: Type.STRING, description: "e.g., Straw Man, Ad Hominem" },
                    explanation: { type: Type.STRING }
                },
                required: ['fallacy', 'explanation']
            }
        }
    },
    required: ['mainClaim', 'supportingEvidence', 'underlyingAssumptions', 'potentialFallacies']
};
export async function analyzeArgument(text: string): Promise<ArgumentAnalysis> {
    return await callApi(`Analyze the following argumentative text. Identify the main claim, key supporting evidence, underlying assumptions, and any potential logical fallacies.\n\n---\n${text}\n---`, argumentAnalysisSchema);
}

const studyAmbienceSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A creative title for the ambience." },
        description: { type: Type.STRING, description: "A vivid, atmospheric description of the study environment." },
        soundKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords for finding matching ambient sounds (e.g., 'rain on window', 'quiet library chatter')." }
    },
    required: ['title', 'description', 'soundKeywords']
};
export async function generateStudyAmbience(description: string): Promise<StudyAmbience> {
    return await callApi(`A student wants to study in an environment with this vibe: "${description}". Generate a title, a vivid description of this imagined place, and keywords for finding ambient sounds.`, studyAmbienceSchema);
}

const failureReframeSchema = {
    type: Type.OBJECT,
    properties: {
        situation: { type: Type.STRING },
        lessonsLearned: { type: Type.ARRAY, items: { type: Type.STRING } },
        actionableSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['situation', 'lessonsLearned', 'actionableSteps']
};
export async function reframeFailure(description: string): Promise<FailureReframing> {
    return await callApi(`A student experienced this setback: "${description}". Re-frame this failure as a learning opportunity. Identify key lessons learned and suggest concrete, actionable steps for them to take next.`, failureReframeSchema);
}

const knowledgeGapsSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        probingQuestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 insightful questions to reveal knowledge gaps." }
    },
    required: ['topic', 'probingQuestions']
};
export async function spotKnowledgeGaps(topic: string): Promise<KnowledgeGaps> {
    return await callApi(`Generate a list of probing questions about the topic "${topic}" designed to help a student discover gaps in their knowledge they might not be aware of.`, knowledgeGapsSchema);
}

const ethicalGuidanceSchema = {
    type: Type.OBJECT,
    properties: {
        proposedUse: { type: Type.STRING },
        guidance: { type: Type.STRING, description: "A clear explanation of the ethical considerations." },
        potentialPitfalls: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendation: { type: Type.STRING, description: "A final recommendation: 'Ethical', 'Use with Caution', or 'Unethical'." }
    },
    required: ['proposedUse', 'guidance', 'potentialPitfalls', 'recommendation']
};
export async function getEthicalGuidance(description: string): Promise<EthicalGuidance> {
    return await callApi(`A student wants to use AI for the following purpose in their schoolwork: "${description}". Provide guidance on whether this is ethical from an academic integrity standpoint and give a final recommendation.`, ethicalGuidanceSchema);
}

const creativeMetaphorSchema = {
    type: Type.OBJECT,
    properties: {
        concept: { type: Type.STRING },
        metaphors: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    metaphor: { type: Type.STRING },
                    explanation: { type: Type.STRING, description: "A brief explanation of why the metaphor works." }
                },
                required: ['metaphor', 'explanation']
            }
        }
    },
    required: ['concept', 'metaphors']
};
export async function createMetaphors(concept: string): Promise<CreativeMetaphor> {
    return await callApi(`Generate 3-4 creative, original metaphors or similes for the abstract concept: "${concept}". For each, explain why it's effective.`, creativeMetaphorSchema);
}

const futureSelfSchema = {
    type: Type.OBJECT,
    properties: {
        goal: { type: Type.STRING },
        narrative: { type: Type.STRING, description: "A vivid, first-person 'day in the life' narrative of the future self." }
    },
    required: ['goal', 'narrative']
};
export async function visualizeFutureSelf(goal: string): Promise<FutureSelfNarrative> {
    return await callApi(`A student's long-term goal is to "${goal}". Write a short, motivating "day in the life" narrative from the perspective of their future self who has achieved this goal. Focus on sensory details and feelings of accomplishment.`, futureSelfSchema);
}