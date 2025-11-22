import React from 'react';
import { ParsedCriterion } from '../types';
import { CheckCircle2, Circle, Trash2, Plus } from 'lucide-react';

interface ScoreGridProps {
  criteria: ParsedCriterion[];
  scores: Record<string, number>;
  onScoreChange: (criterionId: string, score: number) => void;
  readOnly?: boolean;
  isEditing?: boolean;
  onCriterionUpdate?: (criterion: ParsedCriterion) => void;
  onCriterionDelete?: (id: string) => void;
  onAddCriterion?: () => void;
}

const ScoreGrid: React.FC<ScoreGridProps> = ({ 
  criteria, 
  scores, 
  onScoreChange, 
  readOnly = false,
  isEditing = false,
  onCriterionUpdate,
  onCriterionDelete,
  onAddCriterion
}) => {
  
  const handleTextChange = (criterion: ParsedCriterion, field: 'label' | 'levelDesc', value: string, levelIndex?: number) => {
    if (!onCriterionUpdate) return;
    
    const updatedCriterion = { ...criterion };
    
    if (field === 'label') {
      updatedCriterion.label = value;
    } else if (field === 'levelDesc' && typeof levelIndex === 'number') {
      const newLevels = [...updatedCriterion.levels];
      newLevels[levelIndex] = { ...newLevels[levelIndex], description: value };
      updatedCriterion.levels = newLevels;
    }
    
    onCriterionUpdate(updatedCriterion);
  };

  return (
    <div className="space-y-6">
      {criteria.map((criterion) => (
        <div key={criterion.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm group/card">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
            {isEditing ? (
              <input
                type="text"
                value={criterion.label}
                onChange={(e) => handleTextChange(criterion, 'label', e.target.value)}
                className="font-semibold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 w-full md:w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Criterion Name"
              />
            ) : (
              <h3 className="font-semibold text-slate-800">{criterion.label}</h3>
            )}
            
            {isEditing && onCriterionDelete && (
              <button 
                onClick={() => onCriterionDelete(criterion.id)}
                className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                title="Delete Criterion"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {criterion.levels.map((level, idx) => {
              const isSelected = scores[criterion.id] === level.score;
              return (
                <div
                  key={level.score}
                  onClick={() => !readOnly && !isEditing && onScoreChange(criterion.id, level.score)}
                  className={`
                    relative p-4 transition-all duration-200 group
                    ${!isEditing && !readOnly ? 'cursor-pointer' : ''}
                    ${isSelected && !isEditing ? 'bg-blue-50' : isEditing ? 'bg-white' : 'hover:bg-slate-50'}
                    ${readOnly ? 'cursor-default' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`
                      text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full
                      ${isSelected && !isEditing ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'}
                    `}>
                      {level.label}
                    </span>
                    {!isEditing && (
                      isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                      )
                    )}
                  </div>
                  
                  {isEditing ? (
                    <textarea
                      value={level.description}
                      onChange={(e) => handleTextChange(criterion, 'levelDesc', e.target.value, idx)}
                      rows={4}
                      className="w-full text-sm text-slate-600 border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  ) : (
                    <p className={`text-sm leading-relaxed ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                      {level.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {isEditing && onAddCriterion && (
        <button
          onClick={onAddCriterion}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Criterion
        </button>
      )}
    </div>
  );
};

export default ScoreGrid;