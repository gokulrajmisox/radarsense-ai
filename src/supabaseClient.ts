// Placeholder for Supabase integration
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
Supabase Schema Prepared:

1. radar_readings
- id
- device_id
- angle
- distance_cm
- measured_at
- danger_level
- movement_status

2. danger_events
- id
- device_id
- started_at
- movement_started_at
- ended_at
- start_angle
- end_angle
- start_distance_cm
- minimum_distance_cm
- movement_direction
- estimated_speed_mps
- duration_seconds
- danger_level
- ai_summary
- created_at

3. ai_reports
- id
- device_id
- report_type
- period_start
- period_end
- total_events
- highest_risk
- peak_activity_start
- peak_activity_end
- summary
- recommendations
- created_at
*/
