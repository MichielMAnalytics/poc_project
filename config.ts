// Shared Configuration for all projects
// Change this IP address when switching networks
export const SHARED_CONFIG = {
  // Your local machine's IP address on the current network
  API_HOST: '10.10.110.62',
  API_PORT: 4000,
} as const;

// Derived values
export const API_BASE_URL = `http://${SHARED_CONFIG.API_HOST}:${SHARED_CONFIG.API_PORT}`;
export const CAMPAIGNS_API_URL = `${API_BASE_URL}/api/campaigns`;
