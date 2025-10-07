# Campaign Management POC

A proof-of-concept for managing in-app campaigns with a no-code editor and QR code testing.

## What's Running

1. **Backend API**: http://localhost:4000
2. **Dashboard**: http://localhost:3000  
3. **Mobile App**: iOS Simulator or Android

## Quick Start

```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Dashboard
cd dashboard && npm run dev

# Terminal 3 - Mobile App
cd DummyApp && npm run ios
```

## Demo Flow

1. Open dashboard at http://localhost:3000
2. Click "Edit" on the welcome_popup campaign
3. Change the title text
4. Click "Save Changes"
5. Reload the mobile app to see the new text

## Features

✅ No-code popup editor
✅ Live preview mockup
✅ QR code generation for device testing
✅ API-driven campaigns (no app release needed)
✅ Theme inheritance (popups match app style)

## Architecture

- **Backend**: Express API with JSON file storage
- **Dashboard**: Next.js with Tailwind CSS
- **Mobile**: React Native with custom SDK

See full documentation in each folder's README.
