# POC: Dynamic React Native SDK

> **Note:** This SDK has been refactored from a Provider/hooks pattern to an **imperative API pattern** (like Segment, Mixpanel, PostHog). See [POC Findings](../findings/POC-findings.md) for the full analysis and rationale.

## Current Architecture

### Imperative API Pattern

The SDK uses a singleton pattern with event-driven updates:

```typescript
// Initialize once at app startup
import PipeGuru from '@pipeguru/react-native-sdk';
PipeGuru.initialize('your-api-key');

// Use anywhere in your app
const popup = PipeGuru.getPopupCampaign('Home');
const inline = PipeGuru.getInlineComponent('Home');
PipeGuru.track('button_clicked', {buttonId: 'checkout'});
```

### How It Works

1. **Singleton SDK** (`PipeGuru.ts`)
   - Single instance across the app
   - Initializes once, polls for campaigns every 5 seconds
   - Emits `campaigns_updated` events when campaigns change

2. **Campaign Loading** (`CampaignManager.ts`)
   - Fetches campaigns from API: `http://{host}:4000/api/campaigns`
   - Filters by `active: true` status
   - Returns campaigns matching screen triggers

3. **Auto-Updating Components**
   - Screens subscribe to `campaigns_updated` events
   - When campaigns load/change, components re-render automatically
   - Example:
   ```typescript
   const [popup, setPopup] = useState(() => PipeGuru.getPopupCampaign('Home'));

   useEffect(() => {
     const handleUpdate = () => setPopup(PipeGuru.getPopupCampaign('Home'));
     PipeGuru._on('campaigns_updated', handleUpdate);
     return () => PipeGuru._off('campaigns_updated', handleUpdate);
   }, []);
   ```

4. **Web Compatibility**
   - React Native's `Modal` doesn't work in react-native-web
   - Solution: Use absolutely-positioned `View` components with `zIndex: 9999`
   - Works seamlessly on both native and web

## SDK Structure

```
src/sdk/
├── index.ts                      # Main exports (imperative API)
├── PipeGuru.ts                   # Singleton SDK class
├── CampaignManager.ts            # Campaign fetching & filtering
├── config.ts                     # API endpoint configuration
├── theme.ts                      # Centralized theme
├── components/
│   ├── Popup.tsx                 # Modal-style popup (absolute positioning)
│   ├── PermissionPrompt.tsx      # Permission request UI
│   ├── InlineComponent.tsx       # Inline promotional banners
│   └── CampaignRenderer.tsx      # Auto-renders campaigns for a screen
├── helpers/
│   └── useAutoUpdate.ts          # Optional hooks for auto-updating
└── utils/
    └── permissionHandler.ts      # Native permission requests
```

## Campaign Types

### 1. Popup
Modal-style alerts that overlay the screen:
```json
{
  "id": "welcome_popup",
  "component": "Popup",
  "trigger": {"type": "screen_enter", "screen": "Home"},
  "props": {
    "title": "Welcome! 🎉",
    "message": "This popup was injected dynamically!",
    "primaryButton": "Got it!",
    "secondaryButton": "Remind me later"
  },
  "active": true
}
```

### 2. PermissionPrompt
Pre-permission dialogs (ask before OS prompt):
```json
{
  "id": "camera_permission",
  "component": "PermissionPrompt",
  "trigger": {"type": "screen_enter", "screen": "Profile"},
  "props": {
    "permissionType": "camera",
    "title": "Camera Access Needed",
    "message": "We'd like to access your camera...",
    "allowButton": "Allow Camera",
    "denyButton": "Not Now"
  },
  "active": true
}
```

### 3. InlineComponent
Promotional banners injected inline:
```json
{
  "id": "promo_banner",
  "component": "InlineComponent",
  "trigger": {"type": "screen_enter", "screen": "Home"},
  "props": {
    "icon": "🎁",
    "heading": "Special Offer!",
    "body": "Get 50% off your first purchase.",
    "button": {
      "text": "Claim Now",
      "backgroundColor": "#007AFF",
      "textColor": "#FFFFFF"
    },
    "style": {
      "backgroundColor": "#FFE5E5",
      "padding": 20,
      "borderRadius": 16
    }
  },
  "active": true
}
```

## Integration Examples

### Native App (DummyApp)

**App.tsx** - Initialize at module level:
```typescript
import PipeGuru from './src/sdk';

PipeGuru.initialize('demo-api-key');

function App() {
  return <AppNavigator />;
}
```

**HomeScreen.tsx** - Use in components:
```typescript
import {PipeGuru, Popup, InlineComponent} from '../sdk';

const HomeScreen = () => {
  // Auto-updating inline component
  const [inlineProps, setInlineProps] = useState(() =>
    PipeGuru.getInlineComponent('Home')
  );

  useEffect(() => {
    const handleUpdate = () => {
      setInlineProps(PipeGuru.getInlineComponent('Home'));
    };
    PipeGuru._on('campaigns_updated', handleUpdate);
    return () => PipeGuru._off('campaigns_updated', handleUpdate);
  }, []);

  // Auto-updating popup
  const [popup, setPopup] = useState(() =>
    PipeGuru.getPopupCampaign('Home')
  );

  useEffect(() => {
    const handleUpdate = () => {
      setPopup(PipeGuru.getPopupCampaign('Home'));
    };
    PipeGuru._on('campaigns_updated', handleUpdate);
    return () => PipeGuru._off('campaigns_updated', handleUpdate);
  }, []);

  return (
    <View>
      {/* Your screen content */}

      {/* Inline component renders when active */}
      {inlineProps && <InlineComponent {...inlineProps} />}

      {/* Popup renders when active */}
      {popup && (
        <Popup
          visible={true}
          {...popup.props}
          onDismiss={() => setPopup(null)}
        />
      )}
    </View>
  );
};
```

### Web Preview (Next.js)

**preview-native/page.tsx** - Wait for campaigns before rendering:
```typescript
'use client';
import PipeGuru from '@app/sdk';

export default function PreviewNativePage() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    PipeGuru.initialize('demo-api-key');

    // Wait for initial campaigns to load
    const handleFirstLoad = () => {
      setIsInitialized(true);
      PipeGuru._off('campaigns_updated', handleFirstLoad);
    };

    PipeGuru._on('campaigns_updated', handleFirstLoad);
  }, []);

  return (
    <View>
      {isInitialized ? (
        <HomeScreen />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
```

## Key Technical Decisions

### 1. Why Imperative API?
- **Industry standard**: Matches Segment, Mixpanel, PostHog
- **Simpler integration**: No Provider wrapper needed
- **More flexible**: Can be used outside React components
- **Better for enterprise**: Developers expect this pattern

### 2. Why Event Emitter Pattern?
- Campaigns load asynchronously from API
- Components need to react to campaign updates
- Event system allows auto-updates without re-renders
- Clean subscription model

### 3. Why Not React Native Modal?
- `Modal` component doesn't work in react-native-web
- Causes blank screens/no rendering on web
- Solution: Absolutely-positioned `View` with `zIndex: 9999`
- Works identically on native and web

### 4. Race Condition Fix (Web Only)
**Problem**: On fresh page reload, screens mounted before campaigns loaded
- Preview page initialized SDK
- Set `isInitialized=true` immediately
- Screens rendered with `campaigns=[]`
- Campaigns loaded later, but components missed the event

**Solution**: Wait for first `campaigns_updated` event
- Initialize SDK
- Listen for `campaigns_updated`
- Only set `isInitialized=true` after first load
- Screens now mount with campaigns ready

**Why Native Doesn't Have This Issue**:
- Native app initializes at module level (before any component mounts)
- Campaigns start loading immediately
- By the time screens mount, campaigns are usually loaded
- If not, the event system catches them up

## Testing the POC

### 1. Start the Backend
```bash
cd backend
npm start  # Runs on http://localhost:4000
```

### 2. Test Native App
```bash
cd DummyApp
npx react-native run-ios
# OR
npx react-native run-android
```

### 3. Test Web Preview
```bash
cd dashboard
npm run dev  # Opens http://localhost:3000/preview-native
```

### 4. Toggle Campaigns
- Open `backend/data/campaigns.json`
- Set `"active": true/false` to enable/disable campaigns
- Both native and web update within 5 seconds (polling interval)

## What This Proves

✅ **Dynamic content injection** - Change campaigns without app releases
✅ **Real-time updates** - 5-second polling, auto-updates in app
✅ **Native feel** - Real React Native components, not WebView
✅ **Web compatibility** - Works in react-native-web for preview
✅ **Theme consistency** - Centralized theme, matches app design
✅ **Multiple component types** - Popups, permissions, inline banners
✅ **Simple integration** - Single line to initialize, minimal code
✅ **Industry-standard API** - Familiar to developers using Segment/Mixpanel

## Known Limitations (Intentional for POC)

- **No real backend** - Uses JSON file, not production API
- **Simple polling** - Real SDK would use WebSocket/Server-Sent Events
- **No persistence** - Campaigns re-show on every screen visit
- **No analytics** - No tracking of impressions/conversions
- **No A/B testing** - Single variant per campaign
- **No targeting** - All users see same campaigns
- **Basic triggers** - Only `screen_enter`, no complex conditions

## Next Steps for Production

1. **Real API Integration**
   - Replace JSON file with production API
   - Implement authentication
   - Add caching layer

2. **Advanced Triggering**
   - User properties (plan, signup date, etc.)
   - Behavioral triggers (after N actions)
   - Time-based triggers (after X days)

3. **Analytics**
   - Track impressions, clicks, conversions
   - A/B test reporting
   - Funnel analysis

4. **More Components**
   - Tooltips, bottom sheets, NPS surveys
   - Multi-step flows
   - Video components

5. **Targeting & Personalization**
   - User segments
   - Feature flags
   - Dynamic content based on user data

6. **Performance**
   - WebSocket for real-time updates
   - Caching strategy
   - Background refresh

## File Change History

- **2024**: Initial POC with Provider pattern
- **2024**: Refactored to imperative API pattern
- **2024**: Fixed Modal → View for web compatibility
- **2024**: Fixed race condition in web preview
- **2024**: Added event system for auto-updates
