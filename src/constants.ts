
export const MOISTURE_THRESHOLDS = {
  low: 30,
  high: 70
};

export const TEMP_THRESHOLDS = {
  low: 20,
  high: 35
};

export const HUMIDITY_THRESHOLDS = {
  low: 40,
  high: 80
};

export const SUGARCANE_DEFAULTS = {
  area: 1, // Acre
  baseWaterPerAcre: 40000, // Liters average
  targetDepth: 3 // Inches
};

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' }
];

export const CROP_GROWTH_STAGES = [
  { id: 'germination', name: 'Germination & Emergence', durationDays: 35 },
  { id: 'tillering', name: 'Tillering Stage', durationDays: 60 },
  { id: 'grand_growth', name: 'Grand Growth Stage', durationDays: 120 },
  { id: 'maturation', name: 'Maturity & Ripening', durationDays: 60 }
];

export const PUMP_SAFETY_LIMITS = {
  maxContinuousRunMinutes: 180,
  cooldownPeriodMinutes: 30,
  minVoltage: 180,
  maxVoltage: 250
};

