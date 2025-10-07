import {useState, useEffect} from 'react';
import {
  Campaign,
  loadCampaigns,
  getCampaignsForScreen,
  markCampaignAsShown,
  hasBeenShown,
} from './CampaignManager';

interface UseCampaignsReturn {
  currentCampaign: Campaign | null;
  dismissCampaign: () => void;
  showNextCampaign: () => void;
}

export const useCampaigns = (screenName: string): UseCampaignsReturn => {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [screenCampaigns, setScreenCampaigns] = useState<Campaign[]>([]);

  // Load campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaigns = await loadCampaigns();
      setAllCampaigns(campaigns);
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns for current screen
  useEffect(() => {
    if (allCampaigns.length > 0) {
      const filtered = getCampaignsForScreen(allCampaigns, screenName);
      setScreenCampaigns(filtered);
    }
  }, [allCampaigns, screenName]);

  // Show first campaign (for POC, always show to see config changes)
  useEffect(() => {
    if (screenCampaigns.length > 0) {
      // For POC: Always show the first campaign to demonstrate config changes
      // In production, you'd check hasBeenShown() to avoid showing repeatedly
      const campaign = screenCampaigns[0];
      setCurrentCampaign(campaign);
      markCampaignAsShown(campaign.id);
    } else {
      setCurrentCampaign(null);
    }
  }, [screenCampaigns]);

  const dismissCampaign = () => {
    setCurrentCampaign(null);
  };

  const showNextCampaign = () => {
    if (screenCampaigns.length > 0) {
      const nextCampaign = screenCampaigns.find(
        campaign => !hasBeenShown(campaign.id),
      );

      if (nextCampaign) {
        setCurrentCampaign(nextCampaign);
        markCampaignAsShown(nextCampaign.id);
      }
    }
  };

  return {
    currentCampaign,
    dismissCampaign,
    showNextCampaign,
  };
};
