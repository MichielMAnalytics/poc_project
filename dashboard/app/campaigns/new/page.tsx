'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

import { CAMPAIGNS_API_URL } from '../../../../config';

const API_URL = CAMPAIGNS_API_URL;

export default function NewCampaign() {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign>({
    id: '',
    component: 'Popup',
    trigger: {
      type: 'screen_enter',
      screen: 'Home',
    },
    props: {
      title: '',
      message: '',
      primaryButton: 'Got it!',
      secondaryButton: 'Remind me later',
    },
    active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign),
      });

      router.push('/');
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">New Campaign</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign ID *
              </label>
              <input
                type="text"
                value={campaign.id}
                onChange={(e) => setCampaign({ ...campaign, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., welcome_popup"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be unique. Use lowercase with underscores.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Screen *
              </label>
              <select
                value={campaign.trigger.screen}
                onChange={(e) =>
                  setCampaign({
                    ...campaign,
                    trigger: { ...campaign.trigger, screen: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="Home">Home</option>
                <option value="Profile">Profile</option>
                <option value="Settings">Settings</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={campaign.props.title}
                onChange={(e) =>
                  setCampaign({
                    ...campaign,
                    props: { ...campaign.props, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., Welcome! 🎉"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={campaign.props.message}
                onChange={(e) =>
                  setCampaign({
                    ...campaign,
                    props: { ...campaign.props, message: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={4}
                placeholder="Enter your message here..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Button
              </label>
              <input
                type="text"
                value={campaign.props.primaryButton}
                onChange={(e) =>
                  setCampaign({
                    ...campaign,
                    props: { ...campaign.props, primaryButton: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., Got it!"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Button
              </label>
              <input
                type="text"
                value={campaign.props.secondaryButton}
                onChange={(e) =>
                  setCampaign({
                    ...campaign,
                    props: {
                      ...campaign.props,
                      secondaryButton: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., Remind me later"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={campaign.active}
                  onChange={(e) =>
                    setCampaign({ ...campaign, active: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active (campaign will be shown in app)
                </span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Campaign
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
