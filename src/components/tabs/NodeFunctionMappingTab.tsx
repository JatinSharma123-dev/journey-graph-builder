import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { NodeFunctionMapping } from '../../types/journey';

const NodeFunctionMappingTab: React.FC = () => {
  const { journey, addMapping, updateMapping, deleteMapping } = useJourney();
  const [isEditing, setIsEditing] = useState(false);
  const [editingMapping, setEditingMapping] = useState<NodeFunctionMapping | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    nodeId: '',
    functionId: '',
    condition: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      nodeId: '',
      functionId: '',
      condition: ''
    });
    setIsEditing(false);
    setEditingMapping(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMapping) {
      updateMapping(editingMapping.id, formData);
    } else {
      addMapping(formData);
    }
    
    resetForm();
  };

  const handleEdit = (mapping: NodeFunctionMapping) => {
    setEditingMapping(mapping);
    setFormData({
      name: mapping.name,
      description: mapping.description,
      nodeId: mapping.nodeId,
      functionId: mapping.functionId,
      condition: mapping.condition
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    deleteMapping(id);
  };

  const getNodeName = (nodeId: string) => {
    const node = journey.nodes.find(n => n.id === nodeId);
    return node ? node.name : 'Unknown Node';
  };

  const getFunctionName = (functionId: string) => {
    const func = journey.functions.find(f => f.id === functionId);
    return func ? func.name : 'Unknown Function';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Node-Function Mapping</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Mapping
        </button>
      </div>

      {isEditing && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-900 mb-4">
            {editingMapping ? 'Edit Mapping' : 'Add New Mapping'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., User Registration Handler"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Node *
                </label>
                <select
                  value={formData.nodeId}
                  onChange={(e) => setFormData({ ...formData, nodeId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a node...</option>
                  {journey.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name} ({node.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Function *
              </label>
              <select
                value={formData.functionId}
                onChange={(e) => setFormData({ ...formData, functionId: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a function...</option>
                {journey.functions.map((func) => (
                  <option key={func.id} value={func.id}>
                    {func.name} ({func.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe this mapping..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <input
                type="text"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., user.status === 'active'"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                {editingMapping ? 'Update' : 'Add'} Mapping
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium text-gray-900">Mapping List</h3>
        </div>
        
        {journey.mappings.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No mappings created yet. Click "Add Mapping" to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {journey.mappings.map((mapping) => (
              <div key={mapping.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{mapping.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{mapping.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500 mb-2">
                      <span>
                        <strong>Node:</strong> {getNodeName(mapping.nodeId)}
                      </span>
                      <span>
                        <strong>Function:</strong> {getFunctionName(mapping.functionId)}
                      </span>
                    </div>
                    {mapping.condition && (
                      <div className="text-sm text-gray-500">
                        <strong>Condition:</strong> {mapping.condition}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(mapping)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(mapping.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {journey.nodes.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <p className="text-yellow-800 text-sm">
            You need to create nodes first before creating mappings. Go to the Nodes tab to add nodes.
          </p>
        </div>
      )}

      {journey.functions.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <p className="text-yellow-800 text-sm">
            You need to create functions first before creating mappings. Go to the Functions tab to add functions.
          </p>
        </div>
      )}
    </div>
  );
};

export default NodeFunctionMappingTab;