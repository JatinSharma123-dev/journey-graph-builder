/**
 * Add Journey Flow Component
 * 
 * This is the main container for the journey creation/editing flow.
 * It manages the tab navigation and provides the overall layout for the journey builder.
 */

import React, { useState } from 'react';
import { ArrowLeft, Save, Power, Check } from 'lucide-react';
import { JourneyProvider, useJourney } from '../context/JourneyContext';
import { Journey } from '../types/journey';
import { Button } from './common/Button';

// Import all tab components
import CreateJourneyTab from './tabs/CreateJourneyTab';
import PropertiesTab from './tabs/PropertiesTab';
import NodesTab from './tabs/NodesTab';
import FunctionsTab from './tabs/FunctionsTab';
import NodeFunctionMappingTab from './tabs/NodeFunctionMappingTab';
import EdgesTab from './tabs/EdgesTab';
import PreviewTab from './tabs/PreviewTab';

interface AddJourneyFlowProps {
  onBack: () => void;
  initialJourney?: Journey;
  isPreviewOnly?: boolean;
}

/**
 * Configuration for all available tabs in the journey builder
 */
const tabs = [
  { id: 'create', label: 'Create Journey', component: CreateJourneyTab },
  { id: 'properties', label: 'Properties', component: PropertiesTab },
  { id: 'nodes', label: 'Nodes', component: NodesTab },
  { id: 'functions', label: 'Functions', component: FunctionsTab },
  { id: 'mapping', label: 'Node-Function Mapping', component: NodeFunctionMappingTab },
  { id: 'edges', label: 'Edges', component: EdgesTab },
  { id: 'preview', label: 'Preview', component: PreviewTab }
];

/**
 * Inner component that has access to journey context
 */
const AddJourneyFlowContent: React.FC<{ onBack: () => void; isPreviewOnly?: boolean }> = ({ onBack, isPreviewOnly = false }) => {
  // Start at preview tab if preview-only, otherwise start at first tab
  const [activeTab, setActiveTab] = useState(isPreviewOnly ? 6 : 0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const { journey, saveJourney, activateJourney } = useJourney();

  /**
   * Navigates to the next tab
   */
  const handleNext = () => {
    if (!isPreviewOnly && activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  /**
   * Navigates to the previous tab
   */
  const handlePrevious = () => {
    if (!isPreviewOnly && activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  /**
   * Skips the current tab and moves to the next one
   */
  const handleSkip = () => {
    if (!isPreviewOnly && activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  /**
   * Saves the journey and shows feedback
   */
  const handleSave = () => {
    setSaveStatus('saving');
    
    // TODO: Replace with API call
    saveJourney();
    setSaveStatus('saved');
    
    // Reset status after showing success message
    setTimeout(() => setSaveStatus('idle'), 2000);
    
    // Navigate back to home page
    setTimeout(() => onBack(), 2500);
  };

  /**
   * Toggles the journey's active state
   */
  const handleToggleActive = () => {
    activateJourney();
  };

  // Get the currently active tab component
  const ActiveComponent = tabs[activeTab].component;

  /**
   * Renders the tab navigation
   */
  const renderTabNavigation = () => (
    <nav className="flex space-x-8 px-6">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => !isPreviewOnly && setActiveTab(index)}
          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            index === activeTab
              ? 'border-blue-500 text-blue-600'
              : isPreviewOnly 
                ? 'border-transparent text-gray-300 cursor-not-allowed'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          disabled={isPreviewOnly && index !== 6}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );

  /**
   * Renders the header with title and action buttons
   */
  const renderHeader = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              title="Back to home"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {journey.name || 'New Journey'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {!isPreviewOnly && (
              <>
                <Button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  variant={saveStatus === 'saved' ? 'success' : 'primary'}
                  icon={saveStatus === 'saved' ? Check : Save}
                >
                  {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Save Journey'}
                </Button>
                
                <Button
                  onClick={handleToggleActive}
                  variant={journey.isActive ? 'warning' : 'secondary'}
                  icon={Power}
                >
                  {journey.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renders the bottom navigation buttons
   */
  const renderBottomNavigation = () => {
    if (isPreviewOnly) return null;

    return (
      <div className="border-t px-6 py-4 flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={activeTab === 0}
          variant="secondary"
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {activeTab < tabs.length - 1 && (
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip
            </button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={activeTab === tabs.length - 1}
            variant="primary"
          >
            {activeTab === tabs.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {renderHeader()}

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b">
            {renderTabNavigation()}
          </div>

          {/* Active Tab Content */}
          <div className="p-6">
            <ActiveComponent />
          </div>

          {/* Bottom Navigation */}
          {renderBottomNavigation()}
        </div>
      </div>
    </div>
  );
};

/**
 * Main AddJourneyFlow component that provides the journey context
 */
const AddJourneyFlow: React.FC<AddJourneyFlowProps> = ({ onBack, initialJourney, isPreviewOnly }) => {
  return (
    <JourneyProvider initialJourney={initialJourney}>
      <AddJourneyFlowContent onBack={onBack} isPreviewOnly={isPreviewOnly} />
    </JourneyProvider>
  );
};

export default AddJourneyFlow;