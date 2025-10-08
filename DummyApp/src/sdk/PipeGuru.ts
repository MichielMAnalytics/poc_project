import {Campaign, loadCampaigns, getCampaignsForScreen} from './CampaignManager';
import {InlineComponentProps} from './components/InlineComponent';
import {PipeGuruStorage} from './storage';

type EventListener = (...args: any[]) => void;

class PipeGuruSDK {
  private static instance: PipeGuruSDK | null = null;
  private apiKey: string = '';
  private campaigns: Campaign[] = [];
  private listeners: Map<string, EventListener[]> = new Map();
  private pollingInterval: any = null;
  private isInitialized: boolean = false;
  private dismissedCampaigns: Set<string> = new Set();

  private constructor() {}

  /**
   * Get the singleton instance
   */
  static getInstance(): PipeGuruSDK {
    if (!PipeGuruSDK.instance) {
      PipeGuruSDK.instance = new PipeGuruSDK();
    }
    return PipeGuruSDK.instance;
  }

  /**
   * Initialize the SDK with your API key
   * @param apiKey Your PipeGuru API key
   */
  async initialize(apiKey: string): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    this.apiKey = apiKey;
    this.isInitialized = true;

    // Load dismissed campaigns from storage
    this.dismissedCampaigns = await PipeGuruStorage.getDismissedCampaigns();

    // Start fetching campaigns
    this.fetchCampaigns();
    this.pollingInterval = setInterval(() => this.fetchCampaigns(), 5000);
  }

  /**
   * Track an event
   * @param eventName The name of the event to track
   * @param properties Optional event properties
   */
  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.isInitialized) {
      return;
    }

    console.log('[PipeGuru Analytics]', eventName, properties);
    // In production, this would send to your backend
  }

  /**
   * Track campaign impression (when campaign is shown)
   * @param campaignId The ID of the campaign
   * @param campaignType The type of campaign (Popup, PermissionPrompt, InlineComponent)
   */
  trackCampaignImpression(campaignId: string, campaignType: string): void {
    this.track('campaign_impression', {
      campaignId,
      campaignType,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track campaign dismissal (when user closes/dismisses campaign)
   * @param campaignId The ID of the campaign
   * @param campaignType The type of campaign
   * @param dismissalReason How it was dismissed (e.g., 'close_button', 'secondary_button', 'backdrop')
   */
  trackCampaignDismissal(
    campaignId: string,
    campaignType: string,
    dismissalReason: string,
  ): void {
    this.track('campaign_dismissed', {
      campaignId,
      campaignType,
      dismissalReason,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track campaign action (when user takes action on campaign)
   * @param campaignId The ID of the campaign
   * @param campaignType The type of campaign
   * @param actionType The type of action (e.g., 'primary_button', 'secondary_button', 'link_click')
   * @param actionData Additional action data
   */
  trackCampaignAction(
    campaignId: string,
    campaignType: string,
    actionType: string,
    actionData?: Record<string, any>,
  ): void {
    this.track('campaign_action', {
      campaignId,
      campaignType,
      actionType,
      actionData,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Show an experiment popup
   * @param experimentId The ID of the experiment to show
   */
  showExperiment(experimentId: string): void {
    if (!this.isInitialized) {
      return;
    }

    // In production, this would trigger a specific experiment
  }

  /**
   * Get inline component props for a specific screen
   * @param screenName The name of the screen
   * @returns Inline component props or null if no active inline component
   */
  getInlineComponent(screenName: string): InlineComponentProps | null {
    const screenCampaigns = getCampaignsForScreen(this.campaigns, screenName);
    const inlineComponents = screenCampaigns.filter(
      (campaign): campaign is Extract<Campaign, {component: 'InlineComponent'}> =>
        campaign.component === 'InlineComponent' &&
        !this.dismissedCampaigns.has(campaign.id),
    );

    return inlineComponents.length > 0 ? inlineComponents[0].props : null;
  }

  /**
   * Get all inline components for a specific screen
   * @param screenName The name of the screen
   * @param campaignIds Optional array of campaign IDs to filter by
   * @returns Array of inline component props
   */
  getInlineComponents(
    screenName: string,
    campaignIds?: string[],
  ): Array<InlineComponentProps & {id: string}> {
    const screenCampaigns = getCampaignsForScreen(this.campaigns, screenName);
    let inlineComponents = screenCampaigns.filter(
      (campaign): campaign is Extract<Campaign, {component: 'InlineComponent'}> =>
        campaign.component === 'InlineComponent' &&
        !this.dismissedCampaigns.has(campaign.id),
    );

    // Filter by specific campaign IDs if provided
    if (campaignIds && campaignIds.length > 0) {
      inlineComponents = inlineComponents.filter(campaign =>
        campaignIds.includes(campaign.id),
      );
    }

    return inlineComponents.map(campaign => ({
      ...campaign.props,
      id: campaign.id,
    }));
  }

  /**
   * Get the current popup campaign for a specific screen
   * @param screenName The name of the screen
   * @returns Popup campaign or null if no active popup
   */
  getPopupCampaign(screenName: string): Extract<Campaign, {component: 'Popup'}> | null {
    const screenCampaigns = getCampaignsForScreen(this.campaigns, screenName);
    const popups = screenCampaigns.filter(
      (campaign): campaign is Extract<Campaign, {component: 'Popup'}> =>
        campaign.component === 'Popup' && !this.dismissedCampaigns.has(campaign.id),
    );

    return popups.length > 0 ? popups[0] : null;
  }

  /**
   * Get the current permission prompt campaign for a specific screen
   * @param screenName The name of the screen
   * @returns Permission prompt campaign or null if no active permission prompt
   */
  getPermissionPromptCampaign(screenName: string): Extract<Campaign, {component: 'PermissionPrompt'}> | null {
    const screenCampaigns = getCampaignsForScreen(this.campaigns, screenName);
    const prompts = screenCampaigns.filter(
      (campaign): campaign is Extract<Campaign, {component: 'PermissionPrompt'}> =>
        campaign.component === 'PermissionPrompt' &&
        !this.dismissedCampaigns.has(campaign.id),
    );

    return prompts.length > 0 ? prompts[0] : null;
  }

  /**
   * Dismiss a campaign (won't show again until storage cleared)
   * @param campaignId The ID of the campaign to dismiss
   * @param campaignType The type of campaign for analytics
   * @param dismissalReason How it was dismissed
   */
  async dismissCampaign(
    campaignId: string,
    campaignType: string,
    dismissalReason: string,
  ): Promise<void> {
    this.dismissedCampaigns.add(campaignId);
    await PipeGuruStorage.dismissCampaign(campaignId);
    this.trackCampaignDismissal(campaignId, campaignType, dismissalReason);

    // Emit campaigns_updated to trigger re-render of components
    this.emit('campaigns_updated', this.campaigns);
  }

  /**
   * Subscribe to SDK events
   * @param event The event name (e.g., 'campaigns_updated')
   * @param callback The callback to run when the event fires
   */
  _on(event: string, callback: EventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // If campaigns are already loaded, immediately call the callback
    if (event === 'campaigns_updated' && this.campaigns.length > 0) {
      callback(this.campaigns);
    }
  }

  /**
   * Unsubscribe from SDK events
   * @param event The event name
   * @param callback The callback to remove
   */
  _off(event: string, callback: EventListener): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   * @param event The event name
   * @param args Arguments to pass to callbacks
   */
  private emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(...args));
  }

  /**
   * Fetch campaigns from the backend
   */
  private async fetchCampaigns(): Promise<void> {
    try {
      const newCampaigns = await loadCampaigns();

      // Check if campaigns actually changed
      const campaignsChanged =
        JSON.stringify(this.campaigns) !== JSON.stringify(newCampaigns);

      this.campaigns = newCampaigns;

      if (campaignsChanged) {
        this.emit('campaigns_updated', this.campaigns);
      }
    } catch (error) {
      // Silently fail in production
    }
  }

  /**
   * Clean up resources (for testing/hot reload)
   */
  _cleanup(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.listeners.clear();
    this.isInitialized = false;
    this.campaigns = [];
  }
}

// Export singleton instance
export const PipeGuru = PipeGuruSDK.getInstance();
