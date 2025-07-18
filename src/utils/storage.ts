/**
 * Local storage utilities for persisting journey data
 */

import { Journey } from '../types/journey';
import { STORAGE_KEYS } from '../constants';

/**
 * Saves journeys to local storage
 */
export const saveJourneysToStorage = (journeys: Journey[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNEYS, JSON.stringify(journeys));
  } catch (error) {
    console.error('Failed to save journeys to storage:', error);
  }
};

/**
 * Loads journeys from local storage
 */
export const loadJourneysFromStorage = (): Journey[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.JOURNEYS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load journeys from storage:', error);
    return [];
  }
};

/**
 * Saves a single journey to storage (updates existing or adds new)
 */
export const saveJourneyToStorage = (journey: Journey): void => {
  const journeys = loadJourneysFromStorage();
  const existingIndex = journeys.findIndex(j => j.id === journey.id);
  
  if (existingIndex >= 0) {
    journeys[existingIndex] = journey;
  } else {
    journeys.push(journey);
  }
  
  saveJourneysToStorage(journeys);
};

/**
 * Removes a journey from storage
 */
export const removeJourneyFromStorage = (journeyId: string): void => {
  const journeys = loadJourneysFromStorage();
  const filteredJourneys = journeys.filter(j => j.id !== journeyId);
  saveJourneysToStorage(filteredJourneys);
};