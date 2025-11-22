import React, { useState } from 'react';
import { INITIAL_RUBRIC_DATA } from './constants';
import Sidebar from './components/Sidebar';
import AssessmentForm from './components/AssessmentForm';
import HistoryView from './components/HistoryView';
import { Menu } from 'lucide-react';
import { SavedAssessment } from './types';

const App: React.FC = () => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'assessment' | 'history'>('assessment');
  const [selectedAssessment, setSelectedAssessment] = useState<SavedAssessment | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSelectSheet = (index: number) => {
    setActiveSheetIndex(index);
    setCurrentView('assessment');
    setSelectedAssessment(null);
  };

  const handleViewChange = (view: 'assessment' | 'history') => {
    setCurrentView(view);
    if (view === 'history') {
      setSelectedAssessment(null);
    }
  };

  const handleSelectAssessment = (assessment: SavedAssessment) => {
    setSelectedAssessment(assessment);
    setCurrentView('assessment');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        sheets={INITIAL_RUBRIC_DATA.sheets}
        activeSheetIndex={activeSheetIndex}
        onSelectSheet={handleSelectSheet}
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-4 lg:hidden flex items-center gap-4">
          <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg">
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <span className="font-semibold text-slate-800">RubricAI Assessor</span>
        </header>

        <div className="flex-1 overflow-y-auto">
          {currentView === 'history' ? (
            <HistoryView onSelectAssessment={handleSelectAssessment} />
          ) : (
            <AssessmentForm 
              // If we have a selected assessment, we don't pass the sheet, 
              // or we pass the sheet but tell the form to ignore it if initialAssessment exists
              sheet={selectedAssessment ? undefined : INITIAL_RUBRIC_DATA.sheets[activeSheetIndex]} 
              initialAssessment={selectedAssessment}
              onBack={() => handleViewChange('history')}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;