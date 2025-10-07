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
export {useInlineComponent} from './useInlineComponent';
export type {Campaign} from './CampaignManager';
export {resetCampaignHistory} from './CampaignManager';

// Components
export {default as Popup} from './components/Popup';
export type {PopupProps} from './components/Popup';
export {default as PermissionPrompt} from './components/PermissionPrompt';
export type {PermissionPromptProps} from './components/PermissionPrompt';
export {default as InlineComponent} from './components/InlineComponent';
export type {InlineComponentProps} from './components/InlineComponent';

// Utils
export {requestPermission, checkPermission} from './utils/permissionHandler';
export type {PermissionType, PermissionStatus} from './utils/permissionHandler';
