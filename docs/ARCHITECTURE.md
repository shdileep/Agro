# Agro System Architecture

## Overview
Agro is a Smart Precision Agriculture Progressive Web Application (PWA) that connects IoT telemetry with AI-powered advisory to optimize crop yield and water management.

```
+-------------------------------------------------------------+
|                       Agro Web PWA                         |
|  (React 19 + TypeScript + Vite + Tailwind CSS + Recharts)    |
+------------------------------+------------------------------+
                               |
         +---------------------+---------------------+
         |                                           |
         v                                           v
+------------------+                       +-------------------+
|  Firebase RTDB   |                       |  Google Gemini AI |
|  - Realtime Sens |                       |  - Disease Diag   |
|  - Relay State   |                       |  - Irrigation Rec |
|  - Hist Telemetry|                       |  - Crop Advising  |
+--------+---------+                       +-------------------+
         |
         v
+------------------+
|  ESP32 / NodeMCU |
|  - Soil Moisture |
|  - DHT22 Temp/Hum|
|  - 5V Relay Pump |
+------------------+
```

## Key Layers
1. **Presentation Layer**: Built with React 19, Recharts for dynamic charts, and Tailwind CSS.
2. **Realtime IoT Layer**: Firebase Realtime Database for real-time telemetry streaming and bidirectional pump control.
3. **Intelligence Layer**: Google Gemini GenAI SDK for visual crop disease diagnostics and personalized multilingual farming advice.
4. **Offline / PWA Layer**: Service worker caching and IndexedDB/Local storage for field operation during intermittent connectivity.
