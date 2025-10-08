import {useState, useEffect} from 'react';
import {PipeGuru} from '../PipeGuru';
import type {InlineComponentProps} from '../components/InlineComponent';
import type {Campaign} from '../CampaignManager';

/**
 * Optional helper hook for auto-updating inline components
 * Reduces boilerplate when using PipeGuru's event system
 *
 * @param screenName The name of the screen
 * @returns Inline component props that auto-update when campaigns change
 *
 * @example
 * const inlineProps = useAutoUpdateInline('Home');
 * return <InlineComponent {...inlineProps} />;
 */
export function useAutoUpdateInline(
  screenName: string,
): InlineComponentProps | null {
  const [props, setProps] = useState<InlineComponentProps | null>(() =>
    PipeGuru.getInlineComponent(screenName),
  );

  useEffect(() => {
    const handleUpdate = () => {
      setProps(PipeGuru.getInlineComponent(screenName));
    };
    PipeGuru._on('campaigns_updated', handleUpdate);
    return () => PipeGuru._off('campaigns_updated', handleUpdate);
  }, [screenName]);

  return props;
}

/**
 * Optional helper hook for auto-updating popup campaigns
 * Reduces boilerplate when using PipeGuru's event system
 *
 * @param screenName The name of the screen
 * @returns Popup campaign that auto-updates when campaigns change, and dismiss function
 *
 * @example
 * const {popup, dismiss} = useAutoUpdatePopup('Home');
 * return popup ? <Popup {...popup.props} onDismiss={dismiss} /> : null;
 */
export function useAutoUpdatePopup(screenName: string): {
  popup: Extract<Campaign, {component: 'Popup'}> | null;
  dismiss: () => void;
} {
  const [popup, setPopup] = useState<Extract<
    Campaign,
    {component: 'Popup'}
  > | null>(() => PipeGuru.getPopupCampaign(screenName));

  useEffect(() => {
    const handleUpdate = () => {
      setPopup(PipeGuru.getPopupCampaign(screenName));
    };
    PipeGuru._on('campaigns_updated', handleUpdate);
    return () => PipeGuru._off('campaigns_updated', handleUpdate);
  }, [screenName]);

  const dismiss = () => {
    setPopup(null);
  };

  return {popup, dismiss};
}
