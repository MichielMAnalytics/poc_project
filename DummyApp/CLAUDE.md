# POC: Dynamic React Native SDK

## Goal
Build a minimal SDK that can dynamically inject a popup into DummyApp using theme inheritance, demonstrating how you could update campaigns without app releases.

## What We'll Build

### 1. SDK Core Structure
Create `src/sdk/` folder with:
- **Provider Component** - Wraps app, provides theme context
- **Theme System** - Simple context for sharing app colors/fonts
- **Campaign Manager** - Fetches mock campaign config and decides what to show
- **Popup Component** - One reusable popup that uses theme

### 2. Mock Campaign Configuration
Create a mock JSON config file that represents what your backend API would send:
```json
{
  "campaigns": [{
    "id": "welcome_popup",
    "trigger": "home_screen_enter",
    "component": "Popup",
    "props": {
      "title": "Welcome! 🎉",
      "message": "This popup was injected dynamically by the SDK!",
      "primaryButton": "Got it!",
      "secondaryButton": "Remind me later"
    }
  }]
}
```

### 3. App Theme
Extract DummyApp's current styling into a theme object (#007AFF blue, fonts, spacing)

### 4. Integration
- Wrap App.tsx with SDK Provider
- Pass theme to SDK
- Add SDK hook to HomeScreen to trigger campaigns
- Demo: Popup appears when opening Home screen

### 5. Demo Scenarios
Show that by just changing the mock JSON, you can:
- Change popup text
- Change button labels
- Show on different screens
- All without touching app code

## File Structure
```
src/
├── sdk/
│   ├── index.ts                 # Main exports
│   ├── SDKProvider.tsx          # Provider component
│   ├── ThemeContext.tsx         # Theme system
│   ├── CampaignManager.ts       # Campaign logic
│   ├── useCampaigns.ts          # Hook for screens to use
│   ├── components/
│   │   └── Popup.tsx            # Popup component
│   └── mock/
│       └── campaigns.json       # Mock config
├── theme/
│   └── appTheme.ts              # DummyApp theme definition
├── screens/                     # (existing)
└── navigation/                  # (existing)
```

## Implementation Steps

1. ✅ Document plan in CLAUDE.md
2. Create SDK folder structure
3. Build Theme system (context + types)
4. Build Popup component (uses theme)
5. Build Campaign Manager (reads mock JSON)
6. Build Provider (wraps everything)
7. Build useCampaigns hook (for screens)
8. Extract app theme into appTheme.ts
9. Wrap App.tsx with Provider
10. Add hook to HomeScreen
11. Test: Launch app → Popup appears on Home screen
12. Test: Change mock JSON → See different popup

## What This Proves

✅ Theme inheritance works (popup matches app styling)
✅ Dynamic content works (change JSON, see different content)
✅ No app release needed (just update "backend" config)
✅ Native feel (real RN components, not WebView)
✅ Simple integration (wrap once, use anywhere)

## Limitations (Intentional for POC)
- No real API (mock JSON file)
- One component type (just Popup)
- Simple triggers (just screen enter)
- No persistence (popup shows every time)
- No analytics

This POC demonstrates the core architecture. Later you can add more components, real API, complex triggers, etc.

## Current Progress
See todo list for live progress tracking.
