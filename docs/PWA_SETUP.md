# Agro Progressive Web Application (PWA) Setup

## Features
- **Offline Reliability**: Cache core application shell and UI components using `vite-plugin-pwa`.
- **Installability**: Meets standalone PWA requirements for mobile Android/iOS home screen installation.
- **Push Telemetry Alerts**: Real-time push alert handling for soil moisture drops and critical weather forecasts.

## PWA Configuration
The PWA manifest is configured in `vite.config.ts` with:
- App Name: `Agro - Smart Agriculture`
- Theme Color: `#16a34a`
- Display Mode: `standalone`
- Orientation: `portrait-primary`

## Testing PWA Offline
1. Run `npm run build` followed by `npm run preview`.
2. Open Chrome DevTools -> Application -> Service Workers.
3. Check the **Offline** checkbox and verify sensor fallback views.
