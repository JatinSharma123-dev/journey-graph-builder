// Application constants

export const NODE_TYPES = {
  START: 'start',
  END: 'end',
  DEAD_END: 'dead_end',
  CUSTOM: 'custom',
  LOADER: 'loader'
} as const;

export const PROPERTY_TYPES = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
  TIMESTAMP: 'TIMESTAMP',
  RANGE: 'RANGE',
  LIST: 'LIST',
  MAP: 'MAP'
} as const;

export const FUNCTION_TYPES = {
  API: 'API',
  KAFKA: 'KAFKA'
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const;

export const HEADER_TYPES = {
  CUSTOM: 'custom',
  PROPERTY: 'property'
} as const;

export const STORAGE_KEYS = {
  JOURNEYS: 'journeys'
} as const;