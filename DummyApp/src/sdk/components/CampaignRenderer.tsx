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
 * @param campaignIds - Optional: Array of campaign IDs to show (only applies to inline type)
 *                      If provided, only campaigns with these IDs will be rendered
 */
interface CampaignRendererProps {
  screen: string;
  type?: 'inline' | 'overlay';
  campaignIds?: string[];
}

export const CampaignRenderer: React.FC<CampaignRendererProps> = ({
  screen,
  type,
  campaignIds,
}) => {
  // Auto-fetch all campaign types for this screen
  const [popup, setPopup] = useState(() => PipeGuru.getPopupCampaign(screen));
  const [permission, setPermission] = useState(() =>
    PipeGuru.getPermissionPromptCampaign(screen),
  );
  const [inlineComponents, setInlineComponents] = useState(() =>
    PipeGuru.getInlineComponents(screen, campaignIds),
  );

  // Track impressions when campaigns appear
  useEffect(() => {
    if (popup) {
      PipeGuru.trackCampaignImpression(popup.id, 'Popup');
    }
  }, [popup]);

  useEffect(() => {
    if (permission) {
      PipeGuru.trackCampaignImpression(permission.id, 'PermissionPrompt');
    }
  }, [permission]);

  useEffect(() => {
    inlineComponents.forEach(inline => {
      PipeGuru.trackCampaignImpression(inline.id, 'InlineComponent');
    });
  }, [inlineComponents]);

  // Auto-update when campaigns change
  useEffect(() => {
    const handleUpdate = () => {
      setPopup(PipeGuru.getPopupCampaign(screen));
      setPermission(PipeGuru.getPermissionPromptCampaign(screen));
      setInlineComponents(PipeGuru.getInlineComponents(screen, campaignIds));
    };

    PipeGuru._on('campaigns_updated', handleUpdate);
    return () => PipeGuru._off('campaigns_updated', handleUpdate);
  }, [screen, campaignIds]);

  // Handler for dismissing campaigns with persistence
  const handleDismissPopup = async (reason: string) => {
    if (popup) {
      await PipeGuru.dismissCampaign(popup.id, 'Popup', reason);
      PipeGuru.trackCampaignAction(popup.id, 'Popup', reason);
    }
  };

  const handleDismissPermission = async (reason: string) => {
    if (permission) {
      await PipeGuru.dismissCampaign(permission.id, 'PermissionPrompt', reason);
      PipeGuru.trackCampaignAction(permission.id, 'PermissionPrompt', reason);
    }
  };

  const handleDismissInline = async (campaignId: string) => {
    await PipeGuru.dismissCampaign(campaignId, 'InlineComponent', 'close_button');
  };

  // Render only inline components
  if (type === 'inline') {
    return (
      <>
        {inlineComponents.map(inline => (
          <InlineComponent
            key={inline.id}
            {...inline}
            onDismiss={
              inline.onDismiss
                ? () => {
                    handleDismissInline(inline.id);
                    inline.onDismiss?.();
                  }
                : undefined
            }
          />
        ))}
      </>
    );
  }

  // Render only overlays (popups and permissions)
  if (type === 'overlay') {
    return (
      <>
        {popup && (
          <Popup
            visible={true}
            title={popup.props.title}
            message={popup.props.message}
            primaryButton={popup.props.primaryButton}
            secondaryButton={popup.props.secondaryButton}
            onPrimaryPress={() => {
              handleDismissPopup('primary_button');
            }}
            onSecondaryPress={() => {
              handleDismissPopup('secondary_button');
            }}
            onDismiss={() => {
              handleDismissPopup('backdrop');
            }}
          />
        )}

        {permission && (
          <PermissionPrompt
            visible={true}
            permissionType={permission.props.permissionType}
            title={permission.props.title}
            message={permission.props.message}
            allowButton={permission.props.allowButton}
            denyButton={permission.props.denyButton}
            onDismiss={() => {
              handleDismissPermission('close_button');
            }}
          />
        )}
      </>
    );
  }

  // Default: Render all types
  return (
    <>
      {/* Inline components */}
      {inlineComponents.map(inline => (
        <InlineComponent
          key={inline.id}
          {...inline}
          onDismiss={
            inline.onDismiss
              ? () => {
                  handleDismissInline(inline.id);
                  inline.onDismiss?.();
                }
              : undefined
          }
        />
      ))}

      {/* Popup */}
      {popup && (
        <Popup
          visible={true}
          title={popup.props.title}
          message={popup.props.message}
          primaryButton={popup.props.primaryButton}
          secondaryButton={popup.props.secondaryButton}
          onPrimaryPress={() => {
            handleDismissPopup('primary_button');
          }}
          onSecondaryPress={() => {
            handleDismissPopup('secondary_button');
          }}
          onDismiss={() => {
            handleDismissPopup('backdrop');
          }}
        />
      )}

      {/* Permission prompt */}
      {permission && (
        <PermissionPrompt
          visible={true}
          permissionType={permission.props.permissionType}
          title={permission.props.title}
          message={permission.props.message}
          allowButton={permission.props.allowButton}
          denyButton={permission.props.denyButton}
          onDismiss={() => {
            handleDismissPermission('close_button');
          }}
        />
      )}
    </>
  );
};
