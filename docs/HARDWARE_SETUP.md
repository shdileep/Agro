# Agro IoT Hardware & Wiring Setup

## Microcontroller & Component Specifications

| Component | Pin / Interface | ESP32 GPIO | Operating Voltage |
| :--- | :--- | :--- | :--- |
| **Capacitive Soil Moisture Sensor v1.2** | AOUT (Analog) | `GPIO 34 (ADC1_CH6)` | 3.3V |
| **DHT22 Temperature & Humidity Sensor** | DATA (Digital) | `GPIO 4` | 3.3V / 5V |
| **5V Single Channel Relay Module** | IN (Control) | `GPIO 26` | 5V |
| **Status LED Indicator** | Anode (+) | `GPIO 2` | 3.3V |

---

## Wiring Diagram

```
+-------------------+             +-----------------------+
|  ESP32 DevKit V1  |             | Capacitive Soil Sens  |
|                   |             |                       |
|           3V3 ----+-------------> VCC                   |
|           GND ----+-------------> GND                   |
|        GPIO34 <---+-------------+ AOUT                  |
|                   |             +-----------------------+
|                   |             +-----------------------+
|                   |             |      DHT22 Sensor     |
|                   |             |                       |
|         GPIO4 <---+-------------+ DATA                  |
|                   |             | (with 10k pull-up)    |
|                   |             +-----------------------+
|                   |             +-----------------------+
|                   |             |    5V Relay Module    |
|                   |             |                       |
|           VIN ----+-------------> VCC                   |
|        GPIO26 ----+-------------> IN (Active LOW)       |
|           GND ----+-------------> GND                   |
+-------------------+             +-----------------------+
```

## Calibration Guidelines
1. **Air Value (0% Moisture)**: Read dry sensor value in free air (~3200-3500 on ESP32 12-bit ADC).
2. **Water Value (100% Moisture)**: Read sensor value submerged in water cup up to boundary line (~1400-1600).
3. Map value to percentage: `Moisture % = map(rawValue, dryValue, wetValue, 0, 100)`.
