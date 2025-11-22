import React, { useEffect, useState } from 'react';
import { SavedAssessment } from '../types';
import { getAssessments, deleteAssessment } from '../services/storageService';
import { Trash2, ExternalLink, Calendar, User, FileText } from 'lucide-react';

interface HistoryViewProps {
  onSelectAssessment: (assessment: SavedAssessment) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onSelectAssessment }) => {
  const [assessments, setAssessments] = useState<SavedAssessment[]>([]);

  useEffect(() => {
    setAssessments(getAssessments());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      deleteAssessment(id);
      setAssessments(getAssessments());
    }
  };

  if (assessments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <FileText className="w-16 h-16 mb-4 opacity-20" />
        <h2 className="text-xl font-semibold text-slate-500">No assessments saved yet</h2>
        <p>Complete an assessment and save it to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Progress History</h1>
          <p className="text-slate-500 mt-1">View and manage past assessments.</p>
        </div>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {assessments.length} Records
        </div>
      </div>

      <div className="grid gap-4">
        {assessments.map((assessment) => (
          <div 
            key={assessment.id}
            onClick={() => onSelectAssessment(assessment)}
            className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <h3 className="font-bold text-lg text-slate-800">{assessment.studentName || 'Unnamed Student'}</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {assessment.date}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600">
                    {assessment.task || 'No Task'}
                  </span>
                  <span className="bg-blue-50 px-2 py-0.5 rounded text-xs font-medium text-blue-700">
                    {assessment.rubric.title}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      {assessment.totalScore} <span className="text-sm text-slate-400 font-normal">/ {assessment.maxScore}</span>
                    </div>
                    <div className="text-xs text-slate-500">Average: {assessment.averageScore}</div>
                 </div>
                 
                 <div className="flex gap-2 pl-4 border-l border-slate-100">
                    <button 
                      onClick={(e) => handleDelete(e, assessment.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="p-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;