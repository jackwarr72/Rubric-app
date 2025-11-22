
import React, { useState, useMemo, useEffect } from 'react';
import { Sheet, AssessmentState, ParsedRubric, ParsedCriterion, SavedAssessment } from '../types';
import { parseRubricSheet } from '../utils/rubricHelper';
import ScoreGrid from './ScoreGrid';
import { generateRubricFeedback } from '../services/geminiService';
import { saveAssessment } from '../services/storageService';
import { RefreshCw, Wand2, Printer, Save, Edit2, Check, X, Plus, ArrowLeft, UserCircle } from 'lucide-react';

interface AssessmentFormProps {
  sheet?: Sheet;
  initialAssessment?: SavedAssessment | null;
  onBack?: () => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ sheet, initialAssessment, onBack }) => {
  // We generate a default parsed rubric if sheet is provided, otherwise waiting for initialAssessment
  const defaultRubric: ParsedRubric = useMemo(() => 
    sheet ? parseRubricSheet(sheet) : { title: '', criteria: [] }, 
  [sheet]);

  const [rubric, setRubric] = useState<ParsedRubric>(defaultRubric);
  const [isEditingRubric, setIsEditingRubric] = useState(false);
  const [showSelfAssessment, setShowSelfAssessment] = useState(false);

  const [state, setState] = useState<AssessmentState>({
    studentName: '',
    date: new Date().toISOString().split('T')[0],
    task: '',
    scores: {},
    feedback: '',
    strengths: '',
    improvements: '',
    studentReflection: ''
  });

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Load data when sheet or initialAssessment changes
  useEffect(() => {
    if (initialAssessment) {
      // Loading from history
      setRubric(initialAssessment.rubric);
      setState({
        studentName: initialAssessment.studentName,
        date: initialAssessment.date,
        task: initialAssessment.task,
        scores: initialAssessment.scores,
        feedback: initialAssessment.feedback,
        strengths: initialAssessment.strengths,
        improvements: initialAssessment.improvements,
        studentReflection: initialAssessment.studentReflection || ''
      });
      if (initialAssessment.studentReflection) {
        setShowSelfAssessment(true);
      }
      setCurrentId(initialAssessment.id);
      setIsEditingRubric(false);
    } else if (sheet) {
      // Resetting to new sheet template
      setRubric(parseRubricSheet(sheet));
      setState({
        studentName: '',
        date: new Date().toISOString().split('T')[0],
        task: '',
        scores: {},
        feedback: '',
        strengths: '',
        improvements: '',
        studentReflection: ''
      });
      setShowSelfAssessment(false);
      setCurrentId(null);
      setIsEditingRubric(false);
    }
  }, [sheet, initialAssessment]);

  const handleScoreChange = (id: string, score: number) => {
    setState(prev => ({
      ...prev,
      scores: { ...prev.scores, [id]: score }
    }));
  };

  // --- Rubric Editing Handlers ---
  const handleRubricUpdate = (updatedCriterion: ParsedCriterion) => {
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria.map(c => c.id === updatedCriterion.id ? updatedCriterion : c)
    }));
  };

  const handleAddCriterion = () => {
    const newId = `custom_${Date.now()}`;
    const newCriterion: ParsedCriterion = {
      id: newId,
      label: "New Criterion",
      levels: [
        { score: 1, label: "Needs Work (1)", description: "Description for level 1..." },
        { score: 2, label: "Developing (2)", description: "Description for level 2..." },
        { score: 3, label: "Exceeds (3)", description: "Description for level 3..." }
      ]
    };
    setRubric(prev => ({ ...prev, criteria: [...prev.criteria, newCriterion] }));
  };

  const handleDeleteCriterion = (id: string) => {
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria.filter(c => c.id !== id)
    }));
    // Also remove score for this criterion
    const newScores = { ...state.scores };
    delete newScores[id];
    setState(prev => ({ ...prev, scores: newScores }));
  };
  // -------------------------------

  const calculateTotals = () => {
    // Filter scores to only include current rubric criteria IDs (in case rubric changed)
    const validScoreValues = rubric.criteria
      .map(c => state.scores[c.id] || 0)
      .filter(s => s > 0);
      
    const total = validScoreValues.reduce((a, b) => a + b, 0);
    const maxScore = rubric.criteria.length * 3; 
    const count = validScoreValues.length;
    const average = count > 0 ? (total / count).toFixed(1) : "0.0";
    
    return { total, maxScore, average };
  };

  const { total, maxScore, average } = calculateTotals();

  const handleGenerateAI = async () => {
    if (Object.keys(state.scores).length === 0) {
      setError("Please select at least one score before generating feedback.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateRubricFeedback(
        state.studentName,
        state.task,
        state.scores,
        rubric.criteria,
        state.feedback,
        showSelfAssessment ? state.studentReflection : undefined
      );
      
      setState(prev => ({
        ...prev,
        feedback: result.feedback,
        strengths: Array.isArray(result.strengths) ? result.strengths.join('\n') : result.strengths,
        improvements: Array.isArray(result.improvements) ? result.improvements.join('\n') : result.improvements
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAssessment = () => {
    if (!state.studentName) {
      setError("Please enter a student name to save.");
      return;
    }
    
    const id = currentId || crypto.randomUUID();
    const assessmentRecord: SavedAssessment = {
      id,
      timestamp: Date.now(),
      studentName: state.studentName,
      date: state.date,
      task: state.task,
      rubric: rubric, // Save the current state of the rubric
      scores: state.scores,
      feedback: state.feedback,
      strengths: state.strengths,
      improvements: state.improvements,
      totalScore: total,
      maxScore: maxScore,
      averageScore: average,
      studentReflection: showSelfAssessment ? state.studentReflection : undefined
    };

    saveAssessment(assessmentRecord);
    setCurrentId(id);
    setSaveMessage("Assessment saved successfully!");
    setError(null);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 print:p-0 print:max-w-none">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 print:shadow-none print:border-none">
        <div className="flex justify-between items-start mb-6 print:hidden">
            <div className="flex items-center gap-3">
              {initialAssessment && (
                 <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                 </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{rubric.title || 'Assessment'}</h1>
                <p className="text-slate-500 text-sm mt-1">
                   {initialAssessment ? 'Viewing Saved Assessment' : 'Fill out the assessment below.'}
                </p>
              </div>
            </div>
          
            <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => setShowSelfAssessment(!showSelfAssessment)}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors text-sm font-medium
                    ${showSelfAssessment ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                  `}
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">{showSelfAssessment ? 'Hide Self-Assessment' : 'Add Self-Assessment'}</span>
                  <span className="sm:hidden">Self</span>
                </button>

                {!isEditingRubric ? (
                  <button
                    onClick={() => setIsEditingRubric(true)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit Rubric</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingRubric(false)}
                    className="flex items-center gap-2 px-3 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    <span>Done</span>
                  </button>
                )}

                <button 
                  onClick={() => setState(prev => ({ ...prev, scores: {}, feedback: '', strengths: '', improvements: '', studentReflection: '' }))}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Reset Scores"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSaveAssessment}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{currentId ? 'Update' : 'Save'}</span>
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </button>
            </div>
        </div>

        {/* Print-only Header */}
        <div className="hidden print:block mb-4">
            <h1 className="text-2xl font-bold text-slate-900">{rubric.title}</h1>
        </div>

        {saveMessage && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                <CheckCircleIcon /> {saveMessage}
            </div>
        )}
        
        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
            <input 
              type="text" 
              value={state.studentName}
              onChange={(e) => setState({ ...state, studentName: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input 
              type="date" 
              value={state.date}
              onChange={(e) => setState({ ...state, date: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Task / Assignment</label>
            <input 
              type="text" 
              value={state.task}
              onChange={(e) => setState({ ...state, task: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g. Oral Presentation"
            />
          </div>
        </div>
      </div>

      {isEditingRubric && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-start gap-3">
              <Edit2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                  <p className="font-semibold">Editing Mode Active</p>
                  <p>You can rename criteria, update level descriptions, delete rows, or add new criteria. Changes will be saved when you save this assessment.</p>
              </div>
          </div>
      )}

      {/* Rubric Grid */}
      <ScoreGrid 
        criteria={rubric.criteria} 
        scores={state.scores} 
        onScoreChange={handleScoreChange}
        isEditing={isEditingRubric}
        onCriterionUpdate={handleRubricUpdate}
        onCriterionDelete={handleDeleteCriterion}
        onAddCriterion={handleAddCriterion}
      />

      {/* Score Summary */}
      <div className="mt-8 bg-slate-900 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center print:bg-white print:text-black print:border print:border-slate-900">
        <div>
            <h3 className="text-lg font-semibold">Total Score</h3>
            <p className="text-slate-400 text-sm print:text-slate-600">Calculated from selections above</p>
        </div>
        <div className="flex gap-8 mt-4 md:mt-0">
            <div className="text-center">
                <span className="block text-3xl font-bold">{total} <span className="text-slate-500 text-lg print:text-slate-600">/ {maxScore}</span></span>
                <span className="text-xs uppercase tracking-wider text-slate-400 print:text-slate-600">Points</span>
            </div>
            <div className="text-center pl-8 border-l border-slate-700 print:border-slate-300">
                <span className="block text-3xl font-bold">{average}</span>
                <span className="text-xs uppercase tracking-wider text-slate-400 print:text-slate-600">Average</span>
            </div>
        </div>
      </div>

      {/* Student Self Assessment Section */}
      {showSelfAssessment && (
         <div className="mt-8 bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 p-6 print:bg-white print:border-slate-200 break-inside-avoid">
             <div className="flex items-center gap-2 mb-3 text-indigo-900">
                <UserCircle className="w-6 h-6" />
                <h3 className="font-bold text-lg">Student Self-Assessment</h3>
             </div>
             <p className="text-sm text-indigo-700 mb-3 print:hidden">
                Have the student reflect on their own performance here.
             </p>
             <textarea
                rows={4}
                value={state.studentReflection}
                onChange={(e) => setState({ ...state, studentReflection: e.target.value })}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-y text-slate-700 bg-white"
                placeholder="I feel that I did well on... I could improve on..."
             />
         </div>
      )}

      {/* AI & Feedback Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 print:block print:space-y-6">
        
        {/* Controls */}
        <div className="lg:col-span-2 flex justify-end print:hidden">
            <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                    ${isGenerating 
                        ? 'bg-blue-100 text-blue-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]'
                    }
                `}
            >
                {isGenerating ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-current"></div>
                        Generating Feedback...
                    </>
                ) : (
                    <>
                        <Wand2 className="w-5 h-5" />
                        Generate AI Feedback
                    </>
                )}
            </button>
        </div>

        {/* Feedback Textareas */}
        <div className="space-y-6 lg:col-span-2">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 break-inside-avoid">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    Teacher Feedback
                    <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full print:hidden">AI Generated</span>
                </h3>
                <textarea
                    rows={6}
                    value={state.feedback}
                    onChange={(e) => setState({ ...state, feedback: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y text-slate-700"
                    placeholder="General feedback will appear here..."
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 break-inside-avoid">
                    <h3 className="font-semibold text-green-700 mb-3">Strengths</h3>
                    <textarea
                        rows={5}
                        value={state.strengths}
                        onChange={(e) => setState({ ...state, strengths: e.target.value })}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-y text-slate-700"
                        placeholder="Key strengths..."
                    />
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 break-inside-avoid">
                    <h3 className="font-semibold text-amber-700 mb-3">Areas for Improvement</h3>
                    <textarea
                        rows={5}
                        value={state.improvements}
                        onChange={(e) => setState({ ...state, improvements: e.target.value })}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-y text-slate-700"
                        placeholder="Actionable goals..."
                    />
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

// Simple Check Icon for success message
const CheckCircleIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default AssessmentForm;
