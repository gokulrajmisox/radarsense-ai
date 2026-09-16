import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { SensorData } from '../hooks/useMockRadarData';

export default function ThreatLevelCard({ data }: { data: SensorData }) {
  const isDanger = data.dangerLevel === 'DANGER';
  const isWarning = data.dangerLevel === 'WARNING';
  
  const getColors = () => {
    if (isDanger) return 'bg-red-50 border-red-200 text-red-700';
    if (isWarning) return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-green-50 border-green-200 text-green-700';
  };

  const getIcon = () => {
    if (isDanger) return <ShieldAlert className="w-10 h-10 text-red-500" />;
    if (isWarning) return <ShieldAlert className="w-10 h-10 text-amber-500" />;
    return <ShieldCheck className="w-10 h-10 text-green-500" />;
  };

  const getMessage = () => {
    if (isDanger) return 'Immediate danger detected! Object very close.';
    if (isWarning) return 'Warning: Object approaching warning zone.';
    return 'No immediate danger detected.';
  };

  return (
    <div className={`rounded-2xl border p-6 flex items-start gap-4 transition-colors duration-500 shadow-sm ${getColors()}`}>
      <div className="shrink-0 mt-1">
        {getIcon()}
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">Threat Level</h3>
        <div className="text-3xl font-bold mb-2 flex items-center gap-2">
          {data.dangerLevel}
          {isDanger && <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>}
          {isWarning && <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>}
          {!isDanger && !isWarning && <span className="w-3 h-3 rounded-full bg-green-500"></span>}
        </div>
        <p className="text-sm font-medium opacity-90">{getMessage()}</p>
      </div>
    </div>
  );
}
