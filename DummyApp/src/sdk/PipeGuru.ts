import {Campaign, loadCampaigns, getCampaignsForScreen} from './CampaignManager';
import {InlineComponentProps} from './components/InlineComponent';

type EventListener = (...args: any[]) => void;

class PipeGuruSDK {
  private static instance: PipeGuruSDK | null = null;
  private apiKey: string = '';
  private campaigns: Campaign[] = [];
  private listeners: Map<string, EventListener[]> = new Map();
  private pollingInterval: any = null;
  private isInitialized: boolean = false;

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
  initialize(apiKey: string): void {
    if (this.isInitialized) {
      console.warn('[PipeGuru] SDK already initialized');
      return;
    }

    this.apiKey = apiKey;
    this.isInitialized = true;

    // Start fetching campaigns
    this.fetchCampaigns();
    this.pollingInterval = setInterval(() => this.fetchCampaigns(), 5000);

    console.log('[PipeGuru] SDK initialized with API key:', apiKey);
  }

  /**
   * Track an event
   * @param eventName The name of the event to track
   * @param properties Optional event properties
   */
  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.isInitialized) {
      console.warn('[PipeGuru] SDK not initialized. Call PipeGuru.initialize() first.');
      return;
    }

    console.log('[PipeGuru] Track:', eventName, properties);
    // In production, this would send to your backend
  }

  /**
   * Show an experiment popup
   * @param experimentId The ID of the experiment to show
   */
  showExperiment(experimentId: string): void {
    if (!this.isInitialized) {
      console.warn('[PipeGuru] SDK not initialized. Call PipeGuru.initialize() first.');
      return;
    }

    console.log('[PipeGuru] Show experiment:', experimentId);
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
        campaign.component === 'InlineComponent',
    );

    return inlineComponents.length > 0 ? inlineComponents[0].props : null;
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
        campaign.component === 'Popup',
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
    console.log(`[PipeGuru] getPermissionPromptCampaign for "${screenName}":`, {
      totalCampaigns: this.campaigns.length,
      screenCampaigns: screenCampaigns.length,
      screenCampaignIds: screenCampaigns.map(c => `${c.id} (${c.component})`),
    });
    const prompts = screenCampaigns.filter(
      (campaign): campaign is Extract<Campaign, {component: 'PermissionPrompt'}> =>
        campaign.component === 'PermissionPrompt',
    );

    console.log(`[PipeGuru] Found ${prompts.length} PermissionPrompt campaigns`);
    return prompts.length > 0 ? prompts[0] : null;
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
      console.log('[PipeGuru] Listener added for campaigns_updated, immediately calling with existing campaigns');
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

      console.log('[PipeGuru] fetchCampaigns result:', {
        count: newCampaigns.length,
        campaigns: newCampaigns.map(c => ({ id: c.id, component: c.component, screen: c.trigger.screen, active: c.active })),
      });

      // Check if campaigns actually changed
      const campaignsChanged =
        JSON.stringify(this.campaigns) !== JSON.stringify(newCampaigns);

      this.campaigns = newCampaigns;

      if (campaignsChanged) {
        console.log('[PipeGuru] Campaigns changed, emitting event');
        this.emit('campaigns_updated', this.campaigns);
      }
    } catch (error) {
      console.error('[PipeGuru] Failed to fetch campaigns:', error);
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
