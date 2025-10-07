// Campaign type definitions
export interface Campaign {
  id: string;
  component: 'Popup';
  trigger: {
    type: 'screen_enter';
    screen: string;
  };
  props: {
    title: string;
    message: string;
    primaryButton?: string;
    secondaryButton?: string;
  };
  active: boolean;
}

interface CampaignsConfig {
  campaigns: Campaign[];
}

import {CAMPAIGNS_API_URL} from './config';

// Load campaigns from API
export const loadCampaigns = async (): Promise<Campaign[]> => {
  try {
    const response = await fetch(CAMPAIGNS_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config: CampaignsConfig = await response.json();
    return config.campaigns.filter(campaign => campaign.active);
  } catch (error) {
    console.error('Failed to load campaigns from API:', error);
    // Return empty array as fallback
    return [];
  }
};

// Get campaigns for a specific screen
export const getCampaignsForScreen = (
  campaigns: Campaign[],
  screenName: string,
): Campaign[] => {
  return campaigns.filter(
    campaign =>
      campaign.trigger.type === 'screen_enter' &&
      campaign.trigger.screen === screenName,
  );
};

// Check if campaign has been shown (simple in-memory storage for POC)
const shownCampaigns = new Set<string>();

export const markCampaignAsShown = (campaignId: string): void => {
  shownCampaigns.add(campaignId);
};

export const hasBeenShown = (campaignId: string): boolean => {
  return shownCampaigns.has(campaignId);
};

export const resetCampaignHistory = (): void => {
  shownCampaigns.clear();
};
