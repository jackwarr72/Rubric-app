
export interface RawRubricData {
  file_name: string;
  sheets: Sheet[];
}

export interface Sheet {
  name: string;
  rows: string[][];
}

export interface ParsedCriterion {
  id: string;
  label: string;
  levels: {
    score: number;
    description: string;
    label: string; // e.g. "Needs Work (1)"
  }[];
}

export interface ParsedRubric {
  title: string;
  criteria: ParsedCriterion[];
}

export interface AssessmentState {
  studentName: string;
  date: string;
  task: string;
  scores: Record<string, number>; // criterionId -> score
  feedback: string;
  strengths: string;
  improvements: string;
  studentReflection: string;
}

export interface SavedAssessment {
  id: string;
  timestamp: number;
  studentName: string;
  date: string;
  task: string;
  rubric: ParsedRubric; // Snapshot of the rubric used
  scores: Record<string, number>;
  feedback: string;
  strengths: string;
  improvements: string;
  totalScore: number;
  maxScore: number;
  averageScore: string;
  studentReflection?: string;
}
