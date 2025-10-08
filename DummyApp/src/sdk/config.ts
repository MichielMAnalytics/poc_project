// SDK Configuration
// Change this IP address when switching networks
export const SDK_CONFIG = {
  // Your local machine's IP address on the current network
  API_HOST: '10.10.110.62',
  API_PORT: 4000,
};

// Derived values
export const API_BASE_URL = `http://${SDK_CONFIG.API_HOST}:${SDK_CONFIG.API_PORT}`;
export const CAMPAIGNS_API_URL = `${API_BASE_URL}/api/campaigns`;
