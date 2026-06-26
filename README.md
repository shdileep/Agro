# AGRO 🌾 — Smart Precision Agriculture & Autonomous Irrigation PWA

AGRO is an AI-powered, Progressive Web Application (PWA) designed for modern precision agriculture and smart irrigation, specifically optimized for sugarcane farming. The application integrates real-time IoT sensor telemetry (monitoring soil moisture, temperature, and ambient humidity via Firebase) with Google's Gemini Generative AI to automate watering schedules, predict crop health stress, and offer interactive multi-lingual voice guidance (in English, Tamil, Telugu, Hindi, and Malayalam) to help farmers maximize crop yield and conserve up to 40% of their water resources.

---

## 📸 Core Features & Modules

### 1. Unified Real-Time Dashboard
*   **Sensor Telemetry**: Real-time display of **Soil Moisture**, **Temperature**, and **Humidity** with Low/Medium/High threshold indicators.
*   **Pump Control Panel**: Toggle switch to manually override or automate the water pump.
*   **Solar Trackers**: Sunrise and sunset trackers to align irrigation schedules with evapotranspiration rates.

### 2. Autonomous Water Scheduling
*   **Sugarcane Phase Selection**: Irrigation models tuned for specific crop stages: **Sprouting**, **Tillering**, and **Elongation**.
*   **AGRO Automation Mode**: Automatically triggers irrigation cycles when soil moisture drops below critical levels.
*   **Irrigation Proposals**: Auto-calculates watering recommendations detailing target area (acres), volume (liters), and duration (minutes).

### 3. Live Crop Health Diagnostics
*   **Growth Simulation**: Visualizes plant growth stages with interactive agricultural animations.
*   **Field Analyzers**: Displays live metrics tracking crop metabolic rate, thermal stress levels, fungal risk indicators, and soil saturation rates.

### 4. Interactive Insights & Analytics
*   **Telemetry Trends**: High-performance interactive charts showing historical trends for moisture, temperature, and humidity.
*   **AI Recommendations**: Generates personalized tips for fertilizer schedules, soil aeration, and crop rotations.

### 5. Multi-lingual Voice AI Assistant
*   **Speech Input & Output**: Support for hands-free voice search (Speech-to-Text) and audio playback (Text-to-Speech).
*   **Multi-language Support**: Selectable languages: English, Tamil (தமிழ்), Telugu (తెలుగు), Hindi (हिंदी), and Malayalam (മലയാളം).
*   **Voice Navigation**: Control the app by speaking commands (e.g., *"open schedule"*, *"check weather"*, *"show reports"*).

---

## 🔌 IoT Architecture & Sensor Connections

The application functions on a synchronized loop connecting physical hardware sensors to the cloud:

```mermaid
graph TD
    A[Soil Moisture Sensor] -->|Analog Signal| D[ESP32 Microcontroller]
    B[DHT11/22 Temperature/Humidity] -->|Digital Signal| D
    D -->|HTTPS / WebSockets| E[(Firebase Real-Time DB)]
    E <-->|Real-time Subscription| F[React Web App Client]
    F -->|AI Queries| G[Gemini 2.0 Flash API]
    F -->|Command Writes| E
    E -->|Relay Control| H[Water Pump Relay]
