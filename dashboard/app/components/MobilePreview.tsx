'use client';

import { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  component: string;
  trigger: {
    type: string;
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

import { CAMPAIGNS_API_URL } from '../../../config';

const API_URL = CAMPAIGNS_API_URL;

export default function MobilePreview() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const homeCampaigns = data.campaigns.filter(
        (c: Campaign) => c.active && c.trigger.screen === 'Home'
      );
      setCampaigns(homeCampaigns);

      if (homeCampaigns.length > 0) {
        setCurrentCampaign(homeCampaigns[0]);
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // Refresh every 5 seconds to show changes
    const interval = setInterval(fetchCampaigns, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
      {currentCampaign ? (
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {currentCampaign.props.title}
          </h2>
          <p className="text-gray-600 mb-6">{currentCampaign.props.message}</p>
          <div className="space-y-2">
            {currentCampaign.props.primaryButton && (
              <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                {currentCampaign.props.primaryButton}
              </button>
            )}
            {currentCampaign.props.secondaryButton && (
              <button className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300">
                {currentCampaign.props.secondaryButton}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center">
          <p>No active campaigns for Home screen</p>
        </div>
      )}
    </div>
  );
}
