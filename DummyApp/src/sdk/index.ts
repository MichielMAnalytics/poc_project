/**
 * Dynamic SDK - POC
 *
 * A proof-of-concept SDK for dynamically injecting campaigns
 * into React Native apps without requiring app releases.
 */

// Main Provider
export {SDKProvider} from './SDKProvider';

// Theme System
export {useTheme, ThemeProvider} from './ThemeContext';
export type {AppTheme} from './ThemeContext';

// Campaigns
export {useCampaigns} from './useCampaigns';
export type {Campaign} from './CampaignManager';
export {resetCampaignHistory} from './CampaignManager';

// Components
export {default as Popup} from './components/Popup';
export type {PopupProps} from './components/Popup';
