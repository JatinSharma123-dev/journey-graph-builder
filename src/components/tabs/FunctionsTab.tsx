import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { Function } from '../../types/journey';

const FunctionsTab: React.FC = () => {
  const { journey, addFunction, updateFunction, deleteFunction } = useJourney();
  const [isEditing, setIsEditing] = useState(false);
  const [editingFunction, setEditingFunction] = useState<Function | null>(null);
  const [headerKeys, setHeaderKeys] = useState<{ [key: string]: string }>({});
  const [extraFieldKeys, setExtraFieldKeys] = useState<{ [key: string]: string }>({});
  const [inputPropertyKeys, setInputPropertyKeys] = useState<{ [key: string]: string }>({});
  const [outputPropertyKeys, setOutputPropertyKeys] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    config: {
      host: '',
      path: '',
      method: 'GET',
      header_params: {} as { [key: string]: string },
      headers: {} as { [key: string]: string },
      extraFields: {} as { [key: string]: string }
    },
    input_properties: {} as { [key: string]: string },
    output_properties: {} as { [key: string]: string }
  });

  const handleHeaderParamKeyChange = (oldKey: string, newKey: string) => {
  setHeaderKeys(prev => ({
    ...prev,
    [oldKey]: newKey
  }));
};

const handleHeaderParamKeyBlur = (oldKey: string) => {
  const newKey = headerKeys[oldKey] || oldKey;
  if (newKey !== oldKey && newKey.trim() !== '') {
    const value = formData.config.header_params[oldKey];
    const newParams = { ...formData.config.header_params };
    delete newParams[oldKey];
    newParams[newKey] = value;
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, header_params: newParams }
    }));
    setHeaderKeys(prev => {
      const updated = { ...prev };
      delete updated[oldKey];
      return updated;
    });
  }
};

const handleHeaderKeyChange = (oldKey: string, newKey: string) => {
  setHeaderKeys(prev => ({
    ...prev,
    [oldKey]: newKey
  }));
};

const handleHeaderKeyBlur = (oldKey: string) => {
  const newKey = headerKeys[oldKey] || oldKey;
  if (newKey !== oldKey && newKey.trim() !== '') {
    const value = formData.config.headers[oldKey];
    const newHeaders = { ...formData.config.headers };
    delete newHeaders[oldKey];
    newHeaders[newKey] = value;
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, headers: newHeaders }
    }));
    setHeaderKeys(prev => {
      const updated = { ...prev };
      delete updated[oldKey];
      return updated;
    });
  }
};

const handleExtraFieldKeyChange = (oldKey: string, newKey: string) => {
  setExtraFieldKeys(prev => ({
    ...prev,
    [oldKey]: newKey
  }));
};

const handleExtraFieldKeyBlur = (oldKey: string) => {
  const newKey = extraFieldKeys[oldKey] || oldKey;
  if (newKey !== oldKey && newKey.trim() !== '') {
    const value = formData.config.extraFields[oldKey];
    const newFields = { ...formData.config.extraFields };
    delete newFields[oldKey];
    newFields[newKey] = value;
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, extraFields: newFields }
    }));
    setExtraFieldKeys(prev => {
      const updated = { ...prev };
      delete updated[oldKey];
      return updated;
    });
  }
};

const handleInputPropertyKeyChange = (oldKey: string, newKey: string) => {
  setInputPropertyKeys(prev => ({
    ...prev,
    [oldKey]: newKey
  }));
};

const handleInputPropertyKeyBlur = (oldKey: string) => {
  const newKey = inputPropertyKeys[oldKey] || oldKey;
  if (newKey !== oldKey && newKey.trim() !== '') {
    const value = formData.input_properties[oldKey];
    const newInputs = { ...formData.input_properties };
    delete newInputs[oldKey];
    newInputs[newKey] = value;
    setFormData(prev => ({
      ...prev,
      input_properties: newInputs
    }));
    setInputPropertyKeys(prev => {
      const updated = { ...prev };
      delete updated[oldKey];
      return updated;
    });
  }
};

const handleOutputPropertyKeyChange = (oldKey: string, newKey: string) => {
  setOutputPropertyKeys(prev => ({
    ...prev,
    [oldKey]: newKey
  }));
};

const handleOutputPropertyKeyBlur = (oldKey: string) => {
  const newKey = outputPropertyKeys[oldKey] || oldKey;
  if (newKey !== oldKey && newKey.trim() !== '') {
    const value = formData.output_properties[oldKey];
    const newOutputs = { ...formData.output_properties };
    delete newOutputs[oldKey];
    newOutputs[newKey] = value;
    setFormData(prev => ({
      ...prev,
      output_properties: newOutputs
    }));
    setOutputPropertyKeys(prev => {
      const updated = { ...prev };
      delete updated[oldKey];
      return updated;
    });
  }
};

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      config: {
        host: '',
        path: '',
        method: 'GET',
        header_params: {},
        headers: {},
        extraFields: {}
      },
      input_properties: {},
      output_properties: {}
    });
    setIsEditing(false);
    setEditingFunction(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const functionData = {
      ...formData,
      config: {
        ...formData.config,
        ...formData.config.extraFields
      }
    };
    
    if (editingFunction) {
      updateFunction(editingFunction.id, functionData);
    } else {
      addFunction(functionData);
    }
    
    resetForm();
  };

  const handleEdit = (func: Function) => {
    setEditingFunction(func);
    const { host, path, method, header_params, headers, ...extraFields } = func.config;
    setFormData({
      name: func.name,
      type: func.type,
      config: {
        host,
        path,
        method,
        header_params,
        headers,
        extraFields
      },
      input_properties: func.input_properties,
      output_properties: func.output_properties
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    deleteFunction(id);
  };

  const addHeaderField = () => {
    const key = `header_${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        headers: {
          ...prev.config.headers,
          [key]: ''
        }
      }
    }));
  };

  const updateHeaderField = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        headers: {
          ...prev.config.headers,
          [key]: value
        }
      }
    }));
  };

  const removeHeaderField = (key: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        headers: Object.fromEntries(
          Object.entries(prev.config.headers).filter(([k]) => k !== key)
        )
      }
    }));
  };

  const addHeaderParamField = () => {
    const key = `param_${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        header_params: {
          ...prev.config.header_params,
          [key]: ''
        }
      }
    }));
  };

  const updateHeaderParamField = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        header_params: {
          ...prev.config.header_params,
          [key]: value
        }
      }
    }));
  };

  const removeHeaderParamField = (key: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        header_params: Object.fromEntries(
          Object.entries(prev.config.header_params).filter(([k]) => k !== key)
        )
      }
    }));
  };

  const addExtraField = () => {
    const key = `field_${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        extraFields: {
          ...prev.config.extraFields,
          [key]: ''
        }
      }
    }));
  };

  const updateExtraField = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        extraFields: {
          ...prev.config.extraFields,
          [key]: value
        }
      }
    }));
  };

  const removeExtraField = (key: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        extraFields: Object.fromEntries(
          Object.entries(prev.config.extraFields).filter(([k]) => k !== key)
        )
      }
    }));
  };

  const addInputProperty = () => {
    const key = `input_${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      input_properties: {
        ...prev.input_properties,
        [key]: ''
      }
    }));
  };

  const updateInputProperty = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      input_properties: {
        ...prev.input_properties,
        [key]: value
      }
    }));
  };

  const removeInputProperty = (key: string) => {
    setFormData(prev => ({
      ...prev,
      input_properties: Object.fromEntries(
        Object.entries(prev.input_properties).filter(([k]) => k !== key)
      )
    }));
  };

  const addOutputProperty = () => {
    const key = `output_${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      output_properties: {
        ...prev.output_properties,
        [key]: ''
      }
    }));
  };

  const updateOutputProperty = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      output_properties: {
        ...prev.output_properties,
        [key]: value
      }
    }));
  };

  const removeOutputProperty = (key: string) => {
    setFormData(prev => ({
      ...prev,
      output_properties: Object.fromEntries(
        Object.entries(prev.output_properties).filter(([k]) => k !== key)
      )
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Functions</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Function
        </button>
      </div>

      {isEditing && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-900 mb-4">
            {editingFunction ? 'Edit Function' : 'Add New Function'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="e.g., Send Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., api, webhook, service"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                  <input
                    type="text"
                    value={formData.config.host}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      config: { ...formData.config, host: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://api.example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Path</label>
                  <input
                    type="text"
                    value={formData.config.path}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      config: { ...formData.config, path: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="/api/v1/users"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <select
                    value={formData.config.method}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      config: { ...formData.config, method: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>

              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Header Params</label>
                  <button
                    type="button"
                    onClick={addHeaderParamField}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Header Param
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(formData.config.header_params).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <input
                        type="text"
                        value={headerKeys[key] ?? key}
                        onChange={(e) => handleHeaderParamKeyChange(key, e.target.value)}
                        onBlur={() => handleHeaderParamKeyBlur(key)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Param key"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateHeaderParamField(key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Param value"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeaderParamField(key)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Headers</label>
                  <button
                    type="button"
                    onClick={addHeaderField}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Header
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(formData.config.headers).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <input
                        type="text"
                        value={headerKeys[key] ?? key}
                        onChange={(e) => handleHeaderKeyChange(key, e.target.value)}
                        onBlur={() => handleHeaderKeyBlur(key)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Header key"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateHeaderField(key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Header value"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeaderField(key)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Extra Fields</label>
                  <button
                    type="button"
                    onClick={addExtraField}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Field
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(formData.config.extraFields).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <input
                        type="text"
                        value={extraFieldKeys[key] ?? key}
                        onChange={(e) => handleExtraFieldKeyChange(key, e.target.value)}
                        onBlur={() => handleExtraFieldKeyBlur(key)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Field key"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateExtraField(key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Field value"
                      />
                      <button
                        type="button"
                        onClick={() => removeExtraField(key)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Input Properties</label>
                    <button
                      type="button"
                      onClick={addInputProperty}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Input
                    </button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(formData.input_properties).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <input
                          type="text"
                          value={inputPropertyKeys[key] ?? key}
                          onChange={(e) => handleInputPropertyKeyChange(key, e.target.value)}
                          onBlur={() => handleInputPropertyKeyBlur(key)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Input key"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateInputProperty(key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Input value"
                        />
                        <button
                          type="button"
                          onClick={() => removeInputProperty(key)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Output Properties</label>
                    <button
                      type="button"
                      onClick={addOutputProperty}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Output
                    </button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(formData.output_properties).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <input
                          type="text"
                          value={outputPropertyKeys[key] ?? key}
                          onChange={(e) => handleOutputPropertyKeyChange(key, e.target.value)}
                          onBlur={() => handleOutputPropertyKeyBlur(key)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Output key"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateOutputProperty(key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Output value"
                        />
                        <button
                          type="button"
                          onClick={() => removeOutputProperty(key)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                {editingFunction ? 'Update' : 'Add'} Function
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
          <h3 className="font-medium text-gray-900">Function List</h3>
        </div>
        
        {journey.functions.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No functions created yet. Click "Add Function" to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {journey.functions.map((func) => (
              <div key={func.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{func.name}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {func.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{func.config.method}</span> {func.config.host}{func.config.path}
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Header Params: {Object.keys(func.config.header_params).length}</span>
                      <span>Inputs: {Object.keys(func.input_properties).length}</span>
                      <span>Outputs: {Object.keys(func.output_properties).length}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(func)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(func.id)}
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
    </div>
  );
};

export default FunctionsTab;