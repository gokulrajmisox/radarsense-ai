import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

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
    angle: 90,
    distance: 150,
    movementStatus: 'Scanning',
    dangerLevel: 'SAFE',
    deviceStatus: 'Offline', // Default to offline until we receive data
    lastUpdate: '--:--:--',
  });

  const [events, setEvents] = useState<RadarEvent[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Function to handle device going offline
    const resetOfflineTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        setData(prev => ({ ...prev, deviceStatus: 'Offline' }));
      }, 5000); // 5 seconds without data = offline
    };

    // Fetch initial latest reading
    const fetchLatest = async () => {
      const { data: readings } = await supabase
        .from('radar_readings')
        .select('*')
        .order('measured_at', { ascending: false })
        .limit(1);

      if (readings && readings.length > 0) {
        const reading = readings[0];
        setData({
          angle: reading.angle,
          distance: reading.distance_cm,
          movementStatus: reading.movement_status,
          dangerLevel: reading.danger_level as ThreatLevel,
          deviceStatus: 'Online',
          lastUpdate: new Date(reading.measured_at).toLocaleTimeString(),
        });
        resetOfflineTimeout();
      }
    };

    fetchLatest();

    // Subscribe to realtime updates from ESP32
    const subscription = supabase
      .channel('radar_readings_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'radar_readings' }, 
        (payload) => {
          const reading = payload.new;
          setData({
            angle: reading.angle,
            distance: reading.distance_cm,
            movementStatus: reading.movement_status,
            dangerLevel: reading.danger_level as ThreatLevel,
            deviceStatus: 'Online',
            lastUpdate: new Date(reading.measured_at).toLocaleTimeString(),
          });
          
          // Log an event if danger is detected
          if (reading.danger_level === 'DANGER' || reading.danger_level === 'WARNING') {
            setEvents(prev => [{
              id: reading.id,
              time: new Date(reading.measured_at).toLocaleTimeString(),
              description: reading.danger_level === 'DANGER' ? 'Danger detected' : 'Warning: Object close',
              status: reading.movement_status,
              distance: Math.round(reading.distance_cm),
              level: reading.danger_level as ThreatLevel
            }, ...prev].slice(0, 10));
          }

          resetOfflineTimeout();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { data, events };
}
