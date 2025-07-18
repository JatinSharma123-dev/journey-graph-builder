/**
 * Utility functions for ID generation
 * Note: These are temporary placeholders. In production, IDs will be assigned by the API
 */

/**
 * Generates a temporary ID for local use
 * This will be replaced by API-generated IDs in production
 */
export const generateTempId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Checks if an ID is a temporary ID
 */
export const isTempId = (id: string): boolean => {
  return id.startsWith('temp_');
};