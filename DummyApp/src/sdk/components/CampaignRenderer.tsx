import React from 'react';
import {useAutoUpdatePopup} from '../helpers/useAutoUpdate';
import Popup from './Popup';

/**
 * Optional global campaign renderer component
 * Automatically shows popups for a specific screen
 *
 * This component handles auto-updating and dismissal logic,
 * so you don't need to manage popup state manually.
 *
 * @example
 * // In HomeScreen.tsx
 * return (
 *   <SafeAreaView>
 *     <Text>Home Screen</Text>
 *     <CampaignRenderer screenName="Home" />
 *   </SafeAreaView>
 * );
 */
export const CampaignRenderer: React.FC<{screenName: string}> = ({
  screenName,
}) => {
  const {popup, dismiss} = useAutoUpdatePopup(screenName);

  if (!popup) {
    return null;
  }

  return (
    <Popup
      visible={true}
      title={popup.props.title}
      message={popup.props.message}
      primaryButton={popup.props.primaryButton}
      secondaryButton={popup.props.secondaryButton}
      onPrimaryPress={dismiss}
      onSecondaryPress={dismiss}
      onDismiss={dismiss}
    />
  );
};
