/**
 * Properties Tab Component
 * 
 * This component manages the properties that can be used throughout the journey.
 * Properties represent data fields that flow through the journey nodes.
 */

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { Property } from '../../types/journey';
import { PROPERTY_TYPES } from '../../constants';
import { FormField, Input, Select } from '../common/FormField';
import { Button } from '../common/Button';
import { Card, CardHeader } from '../common/Card';

/**
 * Tab component for managing journey properties
 */
const PropertiesTab: React.FC = () => {
  const { journey, addProperty, updateProperty, deleteProperty } = useJourney();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    type: '' as Property['type'],
    validationCondition: ''
  });

  // Property type options for the select dropdown
  const propertyTypeOptions = Object.values(PROPERTY_TYPES).map(type => ({
    value: type,
    label: type
  }));

  /**
   * Resets the form to its initial state
   */
  const resetForm = () => {
    setFormData({
      key: '',
      type: '',
      validationCondition: ''
    });
    setIsEditing(false);
    setEditingProperty(null);
  };

  /**
   * Handles form submission for creating or updating a property
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProperty) {
      // Update existing property
      updateProperty(editingProperty.id, formData);
    } else {
      // Create new property (ID will be assigned by API)
      addProperty(formData);
    }
    
    resetForm();
  };

  /**
   * Prepares a property for editing
   */
  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      key: property.key,
      type: property.type,
      validationCondition: property.validationCondition || ''
    });
    setIsEditing(true);
  };

  /**
   * Deletes a property after confirmation
   */
  const handleDelete = (id: string) => {
    // TODO: Add confirmation dialog
    deleteProperty(id);
  };

  /**
   * Renders the property editing form
   */
  const renderEditingForm = () => (
    <Card className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-4">
          {editingProperty ? 'Edit Property' : 'Add New Property'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Property Key Field */}
            <FormField label="Key" required>
              <Input
                value={formData.key}
                onChange={(value) => setFormData({ ...formData, key: value })}
                placeholder="e.g., user_id, email"
              />
            </FormField>

            {/* Property Type Field */}
            <FormField label="Type" required>
              <Select
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value as Property['type'] })}
                options={propertyTypeOptions}
                placeholder="Select type"
              />
            </FormField>
          </div>

          {/* Validation Condition Field */}
          <FormField label="Validation Condition">
            <Input
              value={formData.validationCondition}
              onChange={(value) => setFormData({ ...formData, validationCondition: value })}
              placeholder="e.g., length > 5, value !== null"
            />
          </FormField>

          {/* Form Actions */}
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="success"
              icon={Save}
            >
              {editingProperty ? 'Update' : 'Add'} Property
            </Button>
            <Button
              type="button"
              onClick={resetForm}
              variant="secondary"
              icon={X}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );

  /**
   * Renders the properties table
   */
  const renderPropertiesTable = () => (
    <Card title="Property List">
      {journey.properties.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No properties created yet. Click "Add Property" to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validation Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {journey.properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {property.key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {property.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {property.validationCondition || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(property)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit property"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete property"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );

  return (
    <div>
      {/* Page Header */}
      <CardHeader
        title="Properties"
        subtitle="Define data fields that flow through your journey"
        action={
          <Button
            onClick={() => setIsEditing(true)}
            variant="primary"
            icon={Plus}
          >
            Add Property
          </Button>
        }
      />

      {/* Editing Form */}
      {isEditing && renderEditingForm()}

      {/* Properties Table */}
      {renderPropertiesTable()}
    </div>
  );
};

export default PropertiesTab;