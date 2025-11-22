import React from 'react';
import { FileSpreadsheet, LayoutDashboard, History } from 'lucide-react';
import { Sheet } from '../types';

interface SidebarProps {
  sheets: Sheet[];
  activeSheetIndex: number;
  onSelectSheet: (index: number) => void;
  isOpen: boolean;
  toggle: () => void;
  currentView: 'assessment' | 'history';
  onViewChange: (view: 'assessment' | 'history') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sheets, 
  activeSheetIndex, 
  onSelectSheet, 
  isOpen, 
  toggle,
  currentView,
  onViewChange
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-slate-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">RubricAI</span>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          
          {/* Main Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Menu
            </h3>
            <button
              onClick={() => {
                onViewChange('history');
                if (window.innerWidth < 1024) toggle();
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${currentView === 'history'
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <History className={`w-4 h-4 ${currentView === 'history' ? 'text-blue-600' : 'text-slate-400'}`} />
              Student History
            </button>
          </div>

          {/* Templates Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              New Assessment Templates
            </h3>
            <div className="space-y-1">
              {sheets.map((sheet, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSelectSheet(index);
                    if (window.innerWidth < 1024) toggle();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                    ${activeSheetIndex === index && currentView === 'assessment'
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <FileSpreadsheet className={`w-4 h-4 shrink-0 ${activeSheetIndex === index && currentView === 'assessment' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="truncate">{sheet.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg">
             <p className="text-xs text-slate-500 text-center">
               Powered by Google Gemini
             </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;