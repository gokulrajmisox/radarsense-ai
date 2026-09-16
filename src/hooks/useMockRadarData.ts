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

  const [events, setEvents] = useState<RadarEvent[]>([
    { id: '1', time: '10:12 AM', description: 'Movement detected', status: 'Approaching', distance: 62, level: 'WARNING' },
    { id: '2', time: '09:48 AM', description: 'Danger cleared', status: 'Stationary', distance: 120, level: 'SAFE' },
    { id: '3', time: '08:45 AM', description: 'Movement detected', status: 'Moving Away', distance: 78, level: 'WARNING' },
    { id: '4', time: '07:32 AM', description: 'Danger detected', status: 'Approaching', distance: 45, level: 'DANGER' },
  ]);

  // Simulate radar sweeping 0 -> 180 -> 0
  useEffect(() => {
    let currentAngle = 0;
    let direction = 1;
    let previousDistance = 150;

    const interval = setInterval(() => {
      currentAngle += direction * 5;
      if (currentAngle >= 180) {
        currentAngle = 180;
        direction = -1;
      } else if (currentAngle <= 0) {
        currentAngle = 0;
        direction = 1;
      }

      // Generate a random distance to simulate objects (mostly nothing = 150, occasionally closer)
      const isObject = Math.random() > 0.8;
      let newDistance = isObject ? Math.floor(Math.random() * 120) + 20 : 150;
      
      let movement: SensorData['movementStatus'] = 'Scanning';
      if (newDistance < 150 && previousDistance < 150) {
        if (newDistance < previousDistance - 5) movement = 'Approaching';
        else if (newDistance > previousDistance + 5) movement = 'Moving Away';
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

      previousDistance = newDistance;

    }, 200); // Update every 200ms

    return () => clearInterval(interval);
  }, []);

  return { data, events };
}
