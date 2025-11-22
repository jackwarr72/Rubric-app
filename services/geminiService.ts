
import { GoogleGenAI } from "@google/genai";
import { ParsedCriterion } from '../types';

// Helper to check API key presence
const hasApiKey = () => !!process.env.API_KEY;

export const generateRubricFeedback = async (
  studentName: string,
  task: string,
  scores: Record<string, number>,
  rubricCriteria: ParsedCriterion[],
  additionalNotes?: string,
  studentReflection?: string
): Promise<{ feedback: string; strengths: string; improvements: string }> => {
  if (!hasApiKey()) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct a prompt based on scores
  const scoreDetails = rubricCriteria
    .filter((c) => scores[c.id])
    .map((c) => {
      const score = scores[c.id];
      const levelDescription = c.levels.find((l) => l.score === score)?.description || "Unknown";
      const levelLabel = c.levels.find((l) => l.score === score)?.label || score;
      return `- ${c.label}: Level ${score} (${levelLabel}) - Context: ${levelDescription}`;
    })
    .join("\n");

  const prompt = `
    You are an expert educational assistant. 
    Write constructive, encouraging, and specific feedback for a student named "${studentName || 'Student'}" 
    who completed the task: "${task || 'Assignment'}".
    
    Here is the rubric assessment data:
    ${scoreDetails}

    ${studentReflection ? `Student's Own Self-Assessment/Reflection:\n"${studentReflection}"\nPlease acknowledge their self-reflection in your feedback if relevant.` : ''}

    Additional Teacher Notes: ${additionalNotes || "None"}

    Please provide the response in JSON format with the following keys:
    - "feedback": A cohesive paragraph addressing the student directly (2nd person), summarizing their performance.
    - "strengths": A bulleted list of 2-3 key strengths.
    - "improvements": A bulleted list of 2-3 specific actionable steps for improvement.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("Failed to generate feedback. Please try again.");
  }
};
