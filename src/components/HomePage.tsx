/**
 * Home Page Component
 * 
 * Displays a list of all journeys with options to create, edit, or preview them.
 * This is the main landing page of the application.
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, Calendar, Clock } from 'lucide-react';
import { Journey } from '../types/journey';
import { loadJourneysFromStorage } from '../utils/storage';
import { Card, CardHeader } from './common/Card';
import { Button } from './common/Button';

interface HomePageProps {
  onEditJourney: (journey: Journey) => void;
  onPreviewJourney: (journey: Journey) => void;
  onCreateJourney: () => void;
}

/**
 * Home page component that shows all journeys and provides navigation
 */
const HomePage: React.FC<HomePageProps> = ({ onEditJourney, onPreviewJourney, onCreateJourney }) => {
  const [journeys, setJourneys] = useState<Journey[]>([]);

  // Load journeys from storage when component mounts
  useEffect(() => {
    const loadedJourneys = loadJourneysFromStorage();
    setJourneys(loadedJourneys);
  }, []);

  /**
   * Renders the statistics for a journey
   */
  const renderJourneyStats = (journey: Journey) => (
    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
      <div>
        <span className="text-gray-500">Nodes:</span>
        <span className="ml-2 font-medium">{journey.nodes.length}</span>
      </div>
      <div>
        <span className="text-gray-500">Functions:</span>
        <span className="ml-2 font-medium">{journey.functions.length}</span>
      </div>
      <div>
        <span className="text-gray-500">Edges:</span>
        <span className="ml-2 font-medium">{journey.edges.length}</span>
      </div>
      <div>
        <span className="text-gray-500">Properties:</span>
        <span className="ml-2 font-medium">{journey.properties.length}</span>
      </div>
    </div>
  );

  /**
   * Renders the action buttons for a journey
   */
  const renderJourneyActions = (journey: Journey) => (
    <div className="flex gap-2">
      <Button
        onClick={() => onEditJourney(journey)}
        variant="primary"
        size="sm"
        icon={Edit}
        className="flex-1"
      >
        Edit
      </Button>
      <Button
        onClick={() => onPreviewJourney(journey)}
        variant="secondary"
        size="sm"
        icon={Eye}
        className="flex-1"
      >
        Preview
      </Button>
    </div>
  );

  /**
   * Renders the empty state when no journeys exist
   */
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <Plus size={48} className="mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No journeys yet</h3>
      <p className="text-gray-600 mb-4">Create your first journey to get started</p>
      <Button onClick={onCreateJourney} variant="primary" icon={Plus}>
        Create Journey
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Journey Graph Builder</h1>
          <p className="text-gray-600">Create and manage your journey flows with visual graph builder</p>
        </div>


        {/* Journey Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeys.map((journey) => (
            <Card key={journey.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{journey.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{journey.description}</p>
                </div>
                {/* Status Badge */}
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  journey.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {journey.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Journey Dates */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(journey.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(journey.updatedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Journey Statistics */}
              {renderJourneyStats(journey)}

              {/* Action Buttons */}
              {renderJourneyActions(journey)}
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {journeys.length === 0 && renderEmptyState()}
      </div>
    </div>
  );
};

export default HomePage;