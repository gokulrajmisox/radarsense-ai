import { Activity, Clock, Compass, Navigation, Radio, Shield } from 'lucide-react';
import { SensorData } from '../hooks/useMockRadarData';

export default function LiveSensorDataCard({ data }: { data: SensorData }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-500" />
          Live Sensor Data
        </h2>
      </div>
      <div className="p-4 divide-y divide-slate-50">
        <DataRow icon={<Compass className="w-4 h-4 text-blue-500" />} label="Current Angle" value={`${Math.round(data.angle)}°`} />
        <DataRow icon={<Navigation className="w-4 h-4 text-blue-500" />} label="Distance" value={`${Math.round(data.distance)} cm`} />
        <DataRow icon={<Activity className="w-4 h-4 text-blue-500" />} label="Movement" value={data.movementStatus} />
        <DataRow icon={<Shield className="w-4 h-4 text-blue-500" />} label="Danger Level" value={data.dangerLevel} highlight={data.dangerLevel} />
        <DataRow icon={<Radio className="w-4 h-4 text-blue-500" />} label="Device Status" value={data.deviceStatus} highlight={data.deviceStatus} />
        <DataRow icon={<Clock className="w-4 h-4 text-blue-500" />} label="Last Update" value={data.lastUpdate} />
      </div>
    </div>
  );
}

function DataRow({ icon, label, value, highlight }: { icon: React.ReactNode, label: string, value: string, highlight?: string }) {
  let valueColor = "text-slate-900 font-semibold";
  if (highlight === 'DANGER' || highlight === 'Offline') valueColor = "text-red-600 font-bold";
  if (highlight === 'WARNING') valueColor = "text-amber-600 font-bold";
  if (highlight === 'SAFE' || highlight === 'Online') valueColor = "text-green-600 font-bold";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`text-sm ${valueColor}`}>{value}</span>
    </div>
  );
}
