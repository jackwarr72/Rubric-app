import { RawRubricData } from './types';

export const INITIAL_RUBRIC_DATA: RawRubricData = {
  "file_name": "Language Assessment Rubric Template",
  "sheets": [
    {
      "name": "Speaking Rubric",
      "rows": [
        ["SPEAKING ASSESSMENT RUBRIC", "", "", ""],
        ["Student Name:", "", "Date:", ""],
        ["Task/Assignment:", "", "Proficiency Level:", ""],
        ["", "", "", ""],
        ["Criteria", "Needs Work (1)", "Developing (2)", "Exceeds Expectations (3)"],
        ["", "", "", ""],
        ["Grammar & Vocabulary", "Limited vocabulary; frequent grammatical errors that interfere with comprehension", "Uses basic vocabulary accurately; occasional grammatical errors do not significantly impede understanding", "Uses varied and appropriate vocabulary; demonstrates control of grammatical structures with few errors"],
        ["", "", "", ""],
        ["Discourse Management", "Produces disconnected utterances; struggles to organize ideas; responses are minimal or unclear", "Produces coherent sentences; attempts to organize ideas logically; mostly relevant and somewhat extended responses", "Produces extended, coherent discourse with logical organization; ideas flow smoothly and are relevant to the topic"],
        ["", "", "", ""],
        ["Pronunciation & Intonation", "Pronunciation significantly unclear; intonation and stress patterns are often incorrect and affect intelligibility", "Pronunciation is generally clear; occasional intonation/stress errors do not significantly affect understanding", "Pronunciation is clear and intelligible; appropriate word/sentence stress and intonation enhance communication"],
        ["", "", "", ""],
        ["Interactive Communication", "Does not initiate or respond appropriately; minimal effort to maintain interaction; relies heavily on teacher support", "Responds appropriately to questions; attempts to maintain conversation with some support; works with partner with moderate effort", "Initiates and responds appropriately; maintains conversation smoothly; actively engages partner and moves dialogue forward"],
        ["", "", "", ""],
        ["Fluency", "Frequent, long pauses and hesitations; numerous self-corrections disrupt conversational flow", "Some pauses and hesitations; occasional self-corrections; generally smooth delivery with minor interruptions", "Speaks smoothly with minimal pauses; uses transitions effectively; self-corrections are rare and do not disrupt flow"],
        ["", "", "", ""],
        ["Comprehension & Responsiveness", "Does not understand questions/instructions; responses are inaccurate or off-topic", "Understands most questions/instructions; responses are mostly accurate and on-topic with occasional confusion", "Clearly understands questions/instructions; responds accurately, appropriately, and stays on-topic consistently"],
        ["", "", "", ""],
        ["TOTAL SCORE", "", "", ""],
        ["Points Earned:", "/18", "Average:", ""],
        ["", "", "", ""],
        ["TEACHER FEEDBACK & NEXT STEPS", "", "", ""],
        ["Strengths:", "", "", ""],
        ["", "", "", ""],
        ["Areas for Improvement:", "", "", ""],
        ["", "", "", ""],
        ["Specific Actions/Goals:", "", "", ""]
      ]
    },
    {
      "name": "Quick Check Rubric",
      "rows": [
        ["QUICK CHECK RUBRIC - Daily Formative Assessment", "", "", ""],
        ["Class/Grade Level:", "", "Date:", ""],
        ["Activity/Task:", "", "", ""],
        ["", "", "", ""],
        ["Student Name", "1 - Needs Support", "2 - On Track", "3 - Advanced"],
        ["", "", "", ""],
        ["(Example: Jose)", "Struggles with pronunciation; hesitates frequently", "Pronounces most words clearly; speaks with some fluency", "Clear pronunciation; fluent delivery; natural pacing"],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["NOTES FOR INSTRUCTION", "", "", ""],
        ["Students Needing Support:", "", "", ""],
        ["", "", "", ""],
        ["Next Lesson Adjustment:", "", "", ""]
      ]
    }
  ]
};