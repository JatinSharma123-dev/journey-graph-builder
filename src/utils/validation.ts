/**
 * Validation utilities for form inputs and data
 */

/**
 * Validates if a string is not empty after trimming
 */
export const isValidString = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates if a URL is properly formatted
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates if an email is properly formatted
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a property key follows naming conventions
 */
export const isValidPropertyKey = (key: string): boolean => {
  // Allow letters, numbers, underscores, no spaces
  const keyRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  return keyRegex.test(key);
};