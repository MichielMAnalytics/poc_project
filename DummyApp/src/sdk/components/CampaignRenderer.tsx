import React, {useState, useEffect} from 'react';
import {PipeGuru} from '../PipeGuru';
import Popup from './Popup';
import PermissionPrompt from './PermissionPrompt';
import InlineComponent from './InlineComponent';

/**
 * CampaignRenderer - Automatic campaign display component
 *
 * Automatically fetches and renders ALL campaign types for a specific screen:
 * - Popups (modal overlays)
 * - Permission Prompts (pre-permission dialogs)
 * - Inline Components (promotional banners)
 *
 * This component handles all the complexity of state management, event listeners,
 * and auto-updates, so customers only need one line of code per screen.
 *
 * @example
 * // In HomeScreen.tsx
 * import { CampaignRenderer } from '@pipeguru/react-native';
 *
 * const HomeScreen = () => (
 *   <SafeAreaView>
 *     <Text>Home Screen</Text>
 *     <CampaignRenderer screen="Home" />
 *   </SafeAreaView>
 * );
 */
/**
 * Props for CampaignRenderer
 * @param screen - The screen name to render campaigns for
 * @param type - Optional: Render only specific campaign type ('inline' | 'overlay')
 *               - 'inline': Only inline components (rendered in content flow)
 *               - 'overlay': Only popups and permissions (rendered as overlays)
 *               - undefined: Render all types (default)
 */
interface CampaignRendererProps {
  screen: string;
  type?: 'inline' | 'overlay';
}

export const CampaignRenderer: React.FC<CampaignRendererProps> = ({
  screen,
  type,
}) => {
  // Auto-fetch all campaign types for this screen
  const [popup, setPopup] = useState(() => PipeGuru.getPopupCampaign(screen));
  const [permission, setPermission] = useState(() =>
    PipeGuru.getPermissionPromptCampaign(screen),
  );
  const [inline, setInline] = useState(() =>
    PipeGuru.getInlineComponent(screen),
  );

  // Auto-update when campaigns change
  useEffect(() => {
    const handleUpdate = () => {
      setPopup(PipeGuru.getPopupCampaign(screen));
      setPermission(PipeGuru.getPermissionPromptCampaign(screen));
      setInline(PipeGuru.getInlineComponent(screen));
    };

    PipeGuru._on('campaigns_updated', handleUpdate);
    return () => PipeGuru._off('campaigns_updated', handleUpdate);
  }, [screen]);

  // Render only inline components
  if (type === 'inline') {
    return <>{inline && <InlineComponent {...inline} />}</>;
  }

  // Render only overlays (popups and permissions)
  if (type === 'overlay') {
    return (
      <>
        {popup && (
          <Popup
            visible={true}
            {...popup.props}
            onPrimaryPress={() => setPopup(null)}
            onSecondaryPress={() => setPopup(null)}
            onDismiss={() => setPopup(null)}
          />
        )}

        {permission && (
          <PermissionPrompt
            visible={true}
            {...permission.props}
            onDismiss={() => setPermission(null)}
          />
        )}
      </>
    );
  }

  // Default: Render all types
  return (
    <>
      {/* Inline component */}
      {inline && <InlineComponent {...inline} />}

      {/* Popup */}
      {popup && (
        <Popup
          visible={true}
          {...popup.props}
          onPrimaryPress={() => setPopup(null)}
          onSecondaryPress={() => setPopup(null)}
          onDismiss={() => setPopup(null)}
        />
      )}

      {/* Permission prompt */}
      {permission && (
        <PermissionPrompt
          visible={true}
          {...permission.props}
          onDismiss={() => setPermission(null)}
        />
      )}
    </>
  );
};
