/**
 * PipeGuru SDK - POC
 *
 * A proof-of-concept SDK for dynamically injecting campaigns
 * into React Native apps without requiring app releases.
 *
 * ## Imperative API (Recommended)
 * ```typescript
 * import {PipeGuru} from '@pipeguru/react-native-sdk';
 *
 * // Initialize once in App.tsx
 * PipeGuru.initialize('your-api-key');
 *
 * // Use anywhere in your app
 * PipeGuru.track('button_clicked', {buttonId: 'checkout'});
 * const inlineProps = PipeGuru.getInlineComponent('Home');
 * ```
 *
 * ## Optional Helpers
 * For auto-updating components, use the optional helpers:
 * ```typescript
 * import {useAutoUpdateInline, useAutoUpdatePopup} from '@pipeguru/react-native-sdk';
 *
 * const inlineProps = useAutoUpdateInline('Home');
 * const {popup, dismiss} = useAutoUpdatePopup('Home');
 * ```
 */

// Core SDK (Imperative API) - Default Export
import {PipeGuru} from './PipeGuru';
export default PipeGuru;
export {PipeGuru};

// Optional Helpers (for auto-updating components)
export {useAutoUpdateInline, useAutoUpdatePopup} from './helpers/useAutoUpdate';
export {CampaignRenderer} from './components/CampaignRenderer';

// Components (for rendering campaigns)
export {default as Popup} from './components/Popup';
export type {PopupProps} from './components/Popup';
export {default as PermissionPrompt} from './components/PermissionPrompt';
export type {PermissionPromptProps} from './components/PermissionPrompt';
export {default as InlineComponent} from './components/InlineComponent';
export type {InlineComponentProps} from './components/InlineComponent';

// Types
export type {Campaign} from './CampaignManager';

// Utils
export {requestPermission, checkPermission} from './utils/permissionHandler';
export type {PermissionType, PermissionStatus} from './utils/permissionHandler';
