/**
 * Type definitions for the Journey Graph Builder application
 * 
 * These types define the structure of data used throughout the application.
 * Each interface represents a core concept in the journey building process.
 */

/**
 * Represents a data property that flows through the journey
 */
export interface Property {
  id: string; // Will be assigned by API, empty for new properties
  key: string;
  type: string;
  validationCondition?: string;
}

/**
 * Represents a step or decision point in the journey flow
 */
export interface Node {
  id: string; // Will be assigned by API, empty for new nodes
  name: string;
  type: string;
  description: string;
  properties: string[]; // Property IDs
  x?: number;
  y?: number;
}

/**
 * Represents a header configuration for API functions
 */
export interface FunctionHeader {
  key: string;
  type: 'custom' | 'property';
  value: string;
}

/**
 * Represents an external function (API call, etc.) that can be executed
 */
export interface Function {
  id: string; // Will be assigned by API, empty for new functions
  name: string;
  type: string;
  config: {
    host: string;
    path: string;
    method: string;
    header_params: { [key: string]: string };
    headers: FunctionHeader[];
    requestBody?: { [key: string]: string };
    requestBodyPath?: { [key: string]: string };
    [key: string]: any;
  };
  input_properties: { [key: string]: string };
  output_properties: { [key: string]: string };
}

/**
 * Represents the connection between a node and a function
 */
export interface NodeFunctionMapping {
  id: string; // Will be assigned by API, empty for new mappings
  name: string;
  description: string;
  nodeId: string;
  functionId: string;
  condition: string;
}

/**
 * Represents a connection between two nodes in the journey flow
 */
export interface Edge {
  id: string; // Will be assigned by API, empty for new edges
  fromNodeId: string;
  toNodeId: string;
  validationCondition: string;
  isDefault?: boolean; // Flag to identify the default edge between start and end
}

/**
 * Represents a complete journey with all its components
 */
export interface Journey {
  id: string; // Will be assigned by API, empty for new journeys
  name: string;
  description: string;
  properties: Property[];
  nodes: Node[];
  functions: Function[];
  mappings: NodeFunctionMapping[];
  edges: Edge[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Context type for managing journey state and operations
 */
export interface JourneyContextType {
  journey: Journey;
  updateJourney: (updates: Partial<Journey>) => void;
  addProperty: (property: Omit<Property, 'id'>) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  addNode: (node: Omit<Node, 'id'>) => void;
  updateNode: (id: string, node: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  addFunction: (func: Omit<Function, 'id'>) => void;
  updateFunction: (id: string, func: Partial<Function>) => void;
  deleteFunction: (id: string) => void;
  addMapping: (mapping: Omit<NodeFunctionMapping, 'id'>) => void;
  updateMapping: (id: string, mapping: Partial<NodeFunctionMapping>) => void;
  deleteMapping: (id: string) => void;
  addEdge: (edge: Omit<Edge, 'id'>) => void;
  updateEdge: (id: string, edge: Partial<Edge>) => void;
  deleteEdge: (id: string) => void;
  saveJourney: () => void;
  activateJourney: () => void;
}