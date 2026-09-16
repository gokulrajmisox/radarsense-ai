import { useState, useEffect } from 'react';

export type ThreatLevel = 'SAFE' | 'WARNING' | 'DANGER';

export interface SensorData {
  angle: number;
  distance: number;
  movementStatus: 'Stationary' | 'Approaching' | 'Moving Away' | 'Scanning';
  dangerLevel: ThreatLevel;
  deviceStatus: 'Online' | 'Offline';
  lastUpdate: string;
}

export interface RadarEvent {
  id: string;
  time: string;
  description: string;
  status: string;
  distance: number;
  level: ThreatLevel;
}

export function useMockRadarData() {
  const [data, setData] = useState<SensorData>({
    angle: 0,
    distance: 150,
    movementStatus: 'Scanning',
    dangerLevel: 'SAFE',
    deviceStatus: 'Online',
    lastUpdate: new Date().toLocaleTimeString(),
  });

  const [events] = useState<RadarEvent[]>([
    { id: '1', time: '10:12 AM', description: 'Movement detected', status: 'Approaching', distance: 62, level: 'WARNING' },
    { id: '2', time: '09:48 AM', description: 'Danger cleared', status: 'Stationary', distance: 120, level: 'SAFE' },
    { id: '3', time: '08:45 AM', description: 'Movement detected', status: 'Moving Away', distance: 78, level: 'WARNING' },
    { id: '4', time: '07:32 AM', description: 'Danger detected', status: 'Approaching', distance: 45, level: 'DANGER' },
  ]);

  // Simulate radar sweeping 0 -> 180 -> 0 and a fixed object
  useEffect(() => {
    let currentAngle = 0;
    let direction = 1;
    let previousDistance = 150;
    
    // Simulate an object slowly moving
    let objectAngle = 80;
    let objectDistance = 90;

    const interval = setInterval(() => {
      // Sweep logic
      currentAngle += direction * 3;
      if (currentAngle >= 180) {
        currentAngle = 180;
        direction = -1;
      } else if (currentAngle <= 0) {
        currentAngle = 0;
        direction = 1;
      }

      // Slightly move the object over time
      objectAngle += (Math.random() - 0.5) * 2; 
      objectDistance += (Math.random() - 0.5) * 1.5;
      
      // Clamp object position
      if (objectAngle < 30) objectAngle = 30;
      if (objectAngle > 150) objectAngle = 150;
      if (objectDistance < 20) objectDistance = 20;
      if (objectDistance > 140) objectDistance = 140;

      // If beam hits object (within 10 degrees)
      let newDistance = 150; // default background distance
      if (Math.abs(currentAngle - objectAngle) < 10) {
        newDistance = objectDistance;
      }
      
      let movement: SensorData['movementStatus'] = 'Scanning';
      if (newDistance < 150 && previousDistance < 150) {
        if (newDistance < previousDistance - 1) movement = 'Approaching';
        else if (newDistance > previousDistance + 1) movement = 'Moving Away';
        else movement = 'Stationary';
      }

      let danger: ThreatLevel = 'SAFE';
      if (newDistance < 50) danger = 'DANGER';
      else if (newDistance < 100) danger = 'WARNING';

      setData({
        angle: currentAngle,
        distance: newDistance,
        movementStatus: movement,
        dangerLevel: danger,
        deviceStatus: 'Online',
        lastUpdate: new Date().toLocaleTimeString(),
      });

      if (newDistance < 150) {
        previousDistance = newDistance;
      }

    }, 50); // Fast sweep to match ESP32 50ms delay

    return () => clearInterval(interval);
  }, []);

  return { data, events };
}
