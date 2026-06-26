import React, { useEffect, useState } from 'react';
import { ref, set } from "firebase/database";
import { db } from "../services/firebase";
import { SensorReadings, subscribeReadings } from "../services/db";

const FirebaseTest = () => {
    const [readings, setReadings] = useState<SensorReadings | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Subscribe to readings
        const unsubscribe = subscribeReadings((data) => {
            // console.log("Readings received:", data);
            setReadings(data);
        });

        return () => unsubscribe(); // Correct cleanup for listener
    }, []);

    const seedDatabase = async () => {
        try {
            // console.log("Attempting to seed database...");

            // Seed Readings
            await set(ref(db, 'Readings'), {
                temperature: { value: 30.4, unit: '°C', status: 'Medium' },
                humidity: { value: 62, unit: '%', status: 'Normal' },
                soilMoisture: { value: 44, unit: '%', status: 'Medium' },
                timestamp: new Date().toISOString()
            });

            // Seed IrrigationPump
            await set(ref(db, 'IrrigationPump'), {
                controlSystem: 'Auto',
                pumpPower: 'OFF',
                status: false,
                lastUpdated: new Date().toISOString()
            });

            // Seed WaterSchedule
            await set(ref(db, 'WaterSchedule'), {
                mode: 'AGRO Automation',
                automationStatus: 'ON',
                selectedPhase: 'germination',
                irrigationProposal: {
                    stage: 'Germination',
                    area: 1.5,
                    volume: 500,
                    time: 45
                }
            });

            // Seed AgroAutomation
            await set(ref(db, 'AgroAutomation'), {
                enabled: true,
                soilMoistureThreshold: 30,
                temperatureThreshold: 35,
                humidityThreshold: 40
            });

            // console.log("Database seeded successfully!");
            alert("Database seeded successfully! If you see readings below, it works.");
            setError(null);
        } catch (err: any) {
            console.error("Error seeding database:", err);
            setError(err.message);
            if (err.message.includes("PERMISSION_DENIED")) {
                alert("Permission Denied! Please update your Firebase Security Rules in the console to allow public read/write.");
            }
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h2>Firebase Integration Test</h2>
            <button onClick={seedDatabase}>Seed Database with Sample Data</button>

            {error && <div style={{ color: 'red', marginTop: '10px' }}>Error: {error}</div>}

            <h3>Live Readings:</h3>
            {readings ? (
                <pre>{JSON.stringify(readings, null, 2)}</pre>
            ) : (
                <p>No readings yet...</p>
            )}
        </div>
    );
};

export default FirebaseTest;
