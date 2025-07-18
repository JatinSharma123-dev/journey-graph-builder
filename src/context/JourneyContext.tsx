/**
 * Journey Context Provider
 * 
 * This context manages the state of a journey and provides methods to modify it.
 * It handles all CRUD operations for journey components (properties, nodes, functions, etc.)
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Journey, JourneyContextType, Property, Node, Function, NodeFunctionMapping, Edge } from '../types/journey';

// Create the context
const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

/**
 * Hook to access the journey context
 * Must be used within a JourneyProvider
 */
export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};

interface JourneyProviderProps {
  children: ReactNode;
  initialJourney?: Journey;
}

/**
 * Journey Provider Component
 * Wraps components that need access to journey state and operations
 */
export const JourneyProvider: React.FC<JourneyProviderProps> = ({ children, initialJourney }) => {
  /**
   * Creates an empty journey with default values
   */
  const createEmptyJourney = (): Journey => ({
    id: '',
    name: '',
    description: '',
    properties: [],
    nodes: [],
    functions: [],
    mappings: [],
    edges: [],
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [journey, setJourney] = useState<Journey>(initialJourney || createEmptyJourney());

  /**
   * Updates journey with partial data and sets updatedAt timestamp
   */
  const updateJourney = (updates: Partial<Journey>) => {
    setJourney(prev => ({ ...prev, ...updates, updatedAt: new Date() }));
  };

  // Property management functions
  
  /**
   * Adds a new property to the journey
   * Note: ID will be assigned by API, keeping empty for now
   */
  const addProperty = (property: Omit<Property, 'id'>) => {
    const newProperty: Property = {
      ...property,
      id: '' // Will be assigned by API
    };
    setJourney(prev => ({
      ...prev,
      properties: [...prev.properties, newProperty],
      updatedAt: new Date()
    }));
  };

  /**
   * Updates an existing property
   */
  const updateProperty = (id: string, property: Partial<Property>) => {
    setJourney(prev => ({
      ...prev,
      properties: prev.properties.map(p => p.id === id ? { ...p, ...property } : p),
      updatedAt: new Date()
    }));
  };

  /**
   * Deletes a property and removes it from all nodes that reference it
   */
  const deleteProperty = (id: string) => {
    setJourney(prev => ({
      ...prev,
      properties: prev.properties.filter(p => p.id !== id),
      nodes: prev.nodes.map(n => ({ ...n, properties: n.properties.filter(pId => pId !== id) })),
      updatedAt: new Date()
    }));
  };

  // Node management functions
  
  /**
   * Adds a new node to the journey
   * Note: ID will be assigned by API, keeping empty for now
   */
  const addNode = (node: Omit<Node, 'id'>) => {
    const newNode: Node = {
      ...node,
      id: '' // Will be assigned by API
    };
    setJourney(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: new Date()
    }));
  };

  /**
   * Updates an existing node
   */
  const updateNode = (id: string, node: Partial<Node>) => {
    setJourney(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === id ? { ...n, ...node } : n),
      updatedAt: new Date()
    }));
  };

  /**
   * Deletes a node and all related edges and mappings
   */
  const deleteNode = (id: string) => {
    setJourney(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== id),
      edges: prev.edges.filter(e => e.fromNodeId !== id && e.toNodeId !== id),
      mappings: prev.mappings.filter(m => m.nodeId !== id),
      updatedAt: new Date()
    }));
  };

  // Function management functions
  
  /**
   * Adds a new function to the journey
   * Note: ID will be assigned by API, keeping empty for now
   */
  const addFunction = (func: Omit<Function, 'id'>) => {
    const newFunction: Function = {
      ...func,
      id: '' // Will be assigned by API
    };
    setJourney(prev => ({
      ...prev,
      functions: [...prev.functions, newFunction],
      updatedAt: new Date()
    }));
  };

  /**
   * Updates an existing function
   */
  const updateFunction = (id: string, func: Partial<Function>) => {
    setJourney(prev => ({
      ...prev,
      functions: prev.functions.map(f => f.id === id ? { ...f, ...func } : f),
      updatedAt: new Date()
    }));
  };

  /**
   * Deletes a function and all mappings that reference it
   */
  const deleteFunction = (id: string) => {
    setJourney(prev => ({
      ...prev,
      functions: prev.functions.filter(f => f.id !== id),
      mappings: prev.mappings.filter(m => m.functionId !== id),
      updatedAt: new Date()
    }));
  };

  // Mapping management functions
  
  /**
   * Adds a new node-function mapping
   * Note: ID will be assigned by API, keeping empty for now
   */
  const addMapping = (mapping: Omit<NodeFunctionMapping, 'id'>) => {
    const newMapping: NodeFunctionMapping = {
      ...mapping,
      id: '' // Will be assigned by API
    };
    setJourney(prev => ({
      ...prev,
      mappings: [...prev.mappings, newMapping],
      updatedAt: new Date()
    }));
  };

  /**
   * Updates an existing mapping
   */
  const updateMapping = (id: string, mapping: Partial<NodeFunctionMapping>) => {
    setJourney(prev => ({
      ...prev,
      mappings: prev.mappings.map(m => m.id === id ? { ...m, ...mapping } : m),
      updatedAt: new Date()
    }));
  };

  /**
   * Deletes a mapping
   */
  const deleteMapping = (id: string) => {
    setJourney(prev => ({
      ...prev,
      mappings: prev.mappings.filter(m => m.id !== id),
      updatedAt: new Date()
    }));
  };

  // Edge management functions
  
  /**
   * Adds a new edge between nodes
   * Note: ID will be assigned by API, keeping empty for now
   */
  const addEdge = (edge: Omit<Edge, 'id'>) => {
    const newEdge: Edge = {
      ...edge,
      id: '' // Will be assigned by API
    };
    setJourney(prev => {
      return {
        ...prev,
        edges: [...prev.edges, newEdge],
        updatedAt: new Date()
      };
    });
  };

  /**
   * Updates an existing edge
   */
  const updateEdge = (id: string, edge: Partial<Edge>) => {
    setJourney(prev => ({
      ...prev,
      edges: prev.edges.map(e => e.id === id ? { ...e, ...edge } : e),
      updatedAt: new Date()
    }));
  };

  /**
   * Deletes an edge
   */
  const deleteEdge = (id: string) => {
    setJourney(prev => ({
      ...prev,
      edges: prev.edges.filter(e => e.id !== id),
      updatedAt: new Date()
    }));
  };

  /**
   * Saves the journey to local storage
   * In production, this would make an API call
   */
  const saveJourney = () => {
    const savedJourneys = JSON.parse(localStorage.getItem('journeys') || '[]');
    const existingIndex = savedJourneys.findIndex((j: Journey) => j.id === journey.id);
    
    if (existingIndex >= 0) {
      savedJourneys[existingIndex] = journey;
    } else {
      savedJourneys.push(journey);
    }
    
    localStorage.setItem('journeys', JSON.stringify(savedJourneys));
  };

  /**
   * Toggles the active state of the journey
   */
  const activateJourney = () => {
    setJourney(prev => ({ ...prev, isActive: !prev.isActive, updatedAt: new Date() }));
  };

  // Provide all context values
  return (
    <JourneyContext.Provider value={{
      journey,
      updateJourney,
      addProperty,
      updateProperty,
      deleteProperty,
      addNode,
      updateNode,
      deleteNode,
      addFunction,
      updateFunction,
      deleteFunction,
      addMapping,
      updateMapping,
      deleteMapping,
      addEdge,
      updateEdge,
      deleteEdge,
      saveJourney,
      activateJourney
    }}>
      {children}
    </JourneyContext.Provider>
  );
};