import { ref, set, push, onValue, update } from "firebase/database";
import { db } from "./firebase";

// Types
export interface Reading {
    value: number;
    unit: string;
    status: 'Low' | 'Medium' | 'High' | string;
}

export interface SensorReadings {
    temperature: Reading;
    humidity: Reading;
    soilMoisture: Reading;
    timestamp: string;
}

export interface IrrigationPump {
    controlSystem: 'Manual' | 'Auto';
    pumpPower: 'ON' | 'OFF';
    status: boolean;
    lastUpdated: string;
}

export interface IrrigationProposal {
    stage: string;
    area: number;
    volume: number;
    time: number;
}

export interface WaterSchedule {
    mode: 'Normal' | 'AGRO Automation';
    automationStatus: 'ON' | 'OFF';
    selectedPhase: string;
    irrigationProposal: IrrigationProposal;
}

export interface WaterHistoryEntry {
    mode: string;
    status: string;
    timestamp: string;
    waterApplied: number;
    duration: number;
    moisture: number;
    area: number;
}

// References
const readingsRef = ref(db, 'Readings');
const pumpRef = ref(db, 'IrrigationPump');
const scheduleRef = ref(db, 'WaterSchedule');
const historyRef = ref(db, 'WaterHistory');
const automationRef = ref(db, 'AgroAutomation');

// Services

export const subscribeReadings = (callback: (data: SensorReadings | null) => void) => {
    return onValue(readingsRef, (snapshot) => {
        callback(snapshot.val());
    });
};

export const updatePumpStatus = (status: Partial<IrrigationPump>) => {
    return update(pumpRef, { ...status, lastUpdated: new Date().toISOString() });
};

export const subscribePumpStatus = (callback: (data: IrrigationPump | null) => void) => {
    return onValue(pumpRef, (snapshot) => {
        callback(snapshot.val());
    });
};

export const updateSchedule = (schedule: Partial<WaterSchedule>) => {
    return update(scheduleRef, schedule);
};

export const subscribeSchedule = (callback: (data: WaterSchedule | null) => void) => {
    return onValue(scheduleRef, (snapshot) => {
        callback(snapshot.val());
    });
};

export const addHistoryEntry = (entry: WaterHistoryEntry) => {
    const newHistoryRef = push(historyRef);
    return set(newHistoryRef, entry);
};

export const subscribeHistory = (callback: (data: Record<string, WaterHistoryEntry> | null) => void) => {
    return onValue(historyRef, (snapshot) => {
        callback(snapshot.val());
    });
};

export const updateAutomationSettings = (settings: any) => {
    return update(automationRef, settings);
};

// ... (existing code)

export const subscribeAutomationSettings = (callback: (data: any) => void) => {
    return onValue(automationRef, (snapshot) => {
        callback(snapshot.val());
    });
};

export interface AgroWeatherData {
    location: string;
    day: string;
    date: string;
    time: string;
    temp: number;
    condition: string;
    weatherCode: number;
}


const weatherRef = ref(db, 'AgroWeather');

export const updateAgroWeather = (data: AgroWeatherData) => {
    return set(weatherRef, data);
};

export const subscribeAgroWeather = (callback: (data: AgroWeatherData | null) => void) => {
    return onValue(weatherRef, (snapshot) => {
        callback(snapshot.val());
    });
};
