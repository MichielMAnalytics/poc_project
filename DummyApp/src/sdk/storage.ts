/**
 * Cross-platform storage utility
 * Uses AsyncStorage on native, localStorage on web
 */

import {Platform} from 'react-native';

// Platform-specific storage implementation
let storage: {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

if (Platform.OS === 'web') {
  // Web implementation using localStorage
  storage = {
    getItem: async (key: string) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return null;
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      } catch {
        // Silently fail
      }
    },
    removeItem: async (key: string) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } catch {
        // Silently fail
      }
    },
  };
} else {
  // Native implementation using AsyncStorage
  let AsyncStorage: any;
  try {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  } catch {
    // Fallback if AsyncStorage not installed
    AsyncStorage = {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }
  storage = AsyncStorage;
}

const STORAGE_PREFIX = '@pipeguru:';

export const PipeGuruStorage = {
  /**
   * Get dismissed campaign IDs
   */
  async getDismissedCampaigns(): Promise<Set<string>> {
    try {
      const json = await storage.getItem(`${STORAGE_PREFIX}dismissed_campaigns`);
      if (json) {
        const array = JSON.parse(json);
        return new Set(array);
      }
    } catch {
      // Silently fail
    }
    return new Set();
  },

  /**
   * Mark a campaign as dismissed
   */
  async dismissCampaign(campaignId: string): Promise<void> {
    try {
      const dismissed = await this.getDismissedCampaigns();
      dismissed.add(campaignId);
      await storage.setItem(
        `${STORAGE_PREFIX}dismissed_campaigns`,
        JSON.stringify(Array.from(dismissed)),
      );
    } catch {
      // Silently fail
    }
  },

  /**
   * Check if a campaign has been dismissed
   */
  async isCampaignDismissed(campaignId: string): Promise<boolean> {
    const dismissed = await this.getDismissedCampaigns();
    return dismissed.has(campaignId);
  },

  /**
   * Clear all dismissed campaigns (for testing)
   */
  async clearDismissedCampaigns(): Promise<void> {
    try {
      await storage.removeItem(`${STORAGE_PREFIX}dismissed_campaigns`);
    } catch {
      // Silently fail
    }
  },
};
