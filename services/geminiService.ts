import { GoogleGenAI, Type } from "@google/genai";
import { type LearningMaterial, type Exercise } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: 'A concise overview of what was found in the notes.' },
    level: { type: Type.STRING, description: 'The approximate CEFR level (e.g., A1, A2, B1, etc.).' },
    exercises: {
      type: Type.ARRAY,
      description: 'A list of practice exercises.',
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: 'Type of exercise (e.g., "Fill-in-the-blank", "Multiple-choice").' },
          question: { type: Type.STRING, description: 'The question or sentence with a blank.' },
          options: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Options for multiple-choice questions (can be empty).' },
          answer: { type: Type.STRING, description: 'The correct answer for the exercise.' },
        },
        required: ['type', 'question', 'answer']
      }
    },
    studyGuide: {
      type: Type.OBJECT,
      description: 'A short explanation of the rules or vocabulary.',
      properties: {
        title: { type: Type.STRING, description: 'The title of the study guide topic.' },
        points: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of key points or rules with examples.' }
      },
      required: ['title', 'points']
    },
    practiceTask: {
      type: Type.OBJECT,
      description: 'An open-ended activity for the learner.',
      properties: {
        title: { type: Type.STRING, description: 'The title of the practice task.' },
        description: { type: Type.STRING, description: 'Instructions for the practice task.' }
      },
      required: ['title', 'description']
    }
  },
  required: ['summary', 'level', 'exercises', 'studyGuide', 'practiceTask']
};


export const generateLearningMaterials = async (images: { mimeType: string; data: string }[]): Promise<LearningMaterial> => {
  const prompt = `You are an expert French language learning assistant and image-to-text analyzer. Your goal is to help users study French by transforming their handwritten or scanned notes (from the provided images) into structured learning materials.

Follow these steps:
1.  **Analyze and Extract:** Accurately extract the French text from the images. Ignore irrelevant elements like sketches or borders.
2.  **Identify Topics:** Identify the main linguistic topics (e.g., grammar, vocabulary, conjugation).
3.  **Estimate Level:** Determine the approximate CEFR level (A1–C2) of the extracted text.
4.  **Generate Materials:** Create personalized learning materials based on the extracted content.
5.  **Format Output:** Respond ONLY with a single, valid JSON object that adheres to the provided schema. Do not add any text, explanations, or markdown formatting before or after the JSON object.

The user's notes are in the following images:`;

  const imageParts = images.map(image => ({
    inlineData: {
      mimeType: image.mimeType,
      data: image.data,
    },
  }));
  
  const contents = {
      parts: [
          { text: prompt },
          ...imageParts
      ]
  };

  const response = await ai.models.generateContent({
    model: model,
    contents: contents,
    config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
    }
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as LearningMaterial;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonText);
    throw new Error("The model returned an invalid JSON format.");
  }
};


const quizSchema = {
    type: Type.ARRAY,
    description: 'A list of multiple-choice quiz questions.',
    items: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: 'Should always be "Multiple-choice".' },
        question: { type: Type.STRING, description: 'The quiz question.' },
        options: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'An array of 4 possible answers.' },
        answer: { type: Type.STRING, description: 'The correct answer, which must be one of the options.' },
      },
      required: ['type', 'question', 'options', 'answer']
    }
  };
  
  export const generateQuiz = async (images: { mimeType: string; data: string }[], questionCount: number, language: string): Promise<Exercise[]> => {
    const prompt = `You are a quiz generator for a French language learning app. Your task is to create a multiple-choice quiz based on the provided images of a student's French notes.

**Instructions:**
1.  **Analyze the notes:** Understand the key concepts (vocabulary, grammar, etc.) from the French notes in the images.
2.  **Generate Quiz:** Create exactly ${questionCount} multiple-choice questions that test these concepts.
3.  **Language Requirement (CRITICAL):**
    - The 'question' field MUST be in **${language}**.
    - All strings within the 'options' array MUST be in **French**.
    - The 'answer' field MUST be in **French** and must exactly match one of the French options.
4.  **Format:** For each question, provide 4 distinct options and a single correct answer. The 'type' for each question must be 'Multiple-choice'.
5.  **Output:** Respond ONLY with a single, valid JSON array of objects that adheres to the provided schema. Do not add any text, explanations, or markdown formatting before or after the JSON.`;
  
    const imageParts = images.map(image => ({
      inlineData: {
        mimeType: image.mimeType,
        data: image.data,
      },
    }));
    
    const contents = {
        parts: [
            { text: prompt },
            ...imageParts
        ]
    };
  
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
          responseMimeType: "application/json",
          responseSchema: quizSchema
      }
    });
  
    const jsonText = response.text.trim();
    try {
      const quiz = JSON.parse(jsonText) as Exercise[];
      if (!Array.isArray(quiz) || quiz.length === 0) {
        throw new Error("Model returned an empty or invalid quiz array.");
      }
      return quiz;
    } catch (e) {
      console.error("Failed to parse JSON response for quiz:", jsonText, e);
      throw new Error("The model returned an invalid JSON format for the quiz.");
    }
  };