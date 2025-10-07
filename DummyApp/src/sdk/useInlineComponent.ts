import {useState, useEffect} from 'react';
import {
  Campaign,
  loadCampaigns,
  getCampaignsForScreen,
} from './CampaignManager';
import type {InlineComponentCampaign} from './CampaignManager';
import type {InlineComponentProps} from './components/InlineComponent';

/**
 * Hook to get inline component campaign for a specific screen
 *
 * @param screenName - Name of the screen to filter campaigns for
 * @returns The inline component campaign props or null if no active campaign
 */
export const useInlineComponent = (screenName: string): InlineComponentProps | null => {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [inlineComponentProps, setInlineComponentProps] = useState<InlineComponentProps | null>(null);

  // Load campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaigns = await loadCampaigns();
      setAllCampaigns(campaigns);
    };

    fetchCampaigns();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchCampaigns, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter for InlineComponent campaigns on current screen
  useEffect(() => {
    if (allCampaigns.length > 0) {
      const filtered = getCampaignsForScreen(allCampaigns, screenName);
      const inlineComponents = filtered.filter(
        (campaign): campaign is InlineComponentCampaign =>
          campaign.component === 'InlineComponent',
      );

      // Return the first active inline component campaign, or null if none
      if (inlineComponents.length > 0) {
        setInlineComponentProps(inlineComponents[0].props);
      } else {
        setInlineComponentProps(null);
      }
    } else {
      setInlineComponentProps(null);
    }
  }, [allCampaigns, screenName]);

  return inlineComponentProps;
};
