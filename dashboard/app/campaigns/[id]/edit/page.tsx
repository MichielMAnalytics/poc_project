'use client';

import { useState, useEffect, use } from 'react';
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

import { CAMPAIGNS_API_URL } from '../../../../../config';

const API_URL = CAMPAIGNS_API_URL;

// Component preview (isolated popup)
function ComponentPreview({ campaign }: { campaign: Campaign }) {
  return (
    <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {campaign.props.title}
        </h2>
        <p className="text-gray-600 mb-6">{campaign.props.message}</p>
        <div className="space-y-2">
          {campaign.props.primaryButton && (
            <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              {campaign.props.primaryButton}
            </button>
          )}
          {campaign.props.secondaryButton && (
            <button className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300">
              {campaign.props.secondaryButton}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditCampaign({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign>({
    id: id,
    component: 'Popup',
    trigger: {
      type: 'screen_enter',
      screen: 'Home',
    },
    props: {
      title: '',
      message: '',
      primaryButton: '',
      secondaryButton: '',
    },
    active: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        setCampaign(data);
      } catch (error) {
        console.error('Failed to fetch campaign:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign),
      });

      router.push('/');
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Campaign</h1>

        <div className="grid grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign ID
                </label>
                <input
                  type="text"
                  value={campaign.id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screen
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
                  Title
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
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
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
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
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

          {/* Preview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Preview</h2>
            <div className="border border-gray-200 rounded overflow-hidden bg-gray-50" style={{ height: '500px' }}>
              <ComponentPreview campaign={campaign} />
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Preview updates as you type. Changes are saved when you click "Save Changes".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
