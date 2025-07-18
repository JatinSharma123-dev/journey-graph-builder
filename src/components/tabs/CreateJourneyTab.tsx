/**
 * Create Journey Tab Component
 * 
 * This component handles the initial creation of a journey.
 * It allows users to set the basic information like name and description.
 */

import React, { useState, useEffect } from 'react';
import { useJourney } from '../../context/JourneyContext';
import { FormField, Input, Textarea } from '../common/FormField';
import { Button } from '../common/Button';
import { CardHeader } from '../common/Card';

/**
 * Tab component for creating/editing journey basic information
 */
const CreateJourneyTab: React.FC = () => {
  const { journey, updateJourney } = useJourney();
  const [name, setName] = useState(journey.name);
  const [description, setDescription] = useState(journey.description);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync local state with journey context when journey changes
  useEffect(() => {
    setName(journey.name);
    setDescription(journey.description);
  }, [journey]);

  /**
   * Handles form submission and updates the journey
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update journey with new name and description
    updateJourney({ name, description });
    setIsSubmitted(true);
    
    // TODO: Make API call to create/update journey
    // The API will assign an ID to the journey
  };

  return (
    <div className="max-w-2xl">
      <CardHeader 
        title="Create Journey" 
        subtitle="Set up the basic information for your journey"
      />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Journey Name Field */}
        <FormField label="Journey Name" required>
          <Input
            value={name}
            onChange={setName}
            placeholder="Enter journey name"
          />
        </FormField>

        {/* Journey Description Field */}
        <FormField label="Description">
          <Textarea
            value={description}
            onChange={setDescription}
            rows={4}
            placeholder="Describe your journey..."
          />
        </FormField>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
        >
          {journey.name ? 'Update Journey' : 'Create Journey'}
        </Button>
      </form>

      {/* Success Message */}
      {journey.name && isSubmitted && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 font-medium">
            Journey {journey.name ? 'Updated' : 'Created'} Successfully!
          </p>
          <p className="text-green-700 text-sm mt-1">
            Your journey has been created with default Start and End nodes connected by a default edge. You can now proceed to add properties, custom nodes, and functions to your journey.
          </p>
          <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> The default edge between Start and End nodes will be automatically removed when you create your first custom edge from the Start node.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateJourneyTab;