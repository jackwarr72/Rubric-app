import { SavedAssessment } from '../types';

const STORAGE_KEY = 'rubricai_assessments_v1';

export const saveAssessment = (assessment: SavedAssessment): void => {
  const existing = getAssessments();
  // Remove existing if ID matches (update), then add to top
  const filtered = existing.filter(a => a.id !== assessment.id);
  const updated = [assessment, ...filtered];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getAssessments = (): SavedAssessment[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse assessments", e);
    return [];
  }
};

export const deleteAssessment = (id: string): void => {
  const existing = getAssessments();
  const updated = existing.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getAssessmentById = (id: string): SavedAssessment | undefined => {
  return getAssessments().find(a => a.id === id);
};