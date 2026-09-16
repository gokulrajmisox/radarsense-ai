import { Bell } from 'lucide-react';
import type { RadarEvent } from '../hooks/useMockRadarData';

export default function RecentEventsList({ events }: { events: RadarEvent[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 max-h-[400px] flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" />
          Recent Events
        </h2>
        <button className="text-xs text-blue-600 font-medium hover:underline">View All &rarr;</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {events.map((event, i) => (
          <div key={event.id} className="relative pl-6 pb-4 last:pb-0">
            {/* Timeline line */}
            {i !== events.length - 1 && (
              <div className="absolute left-1.5 top-5 bottom-0 w-px bg-slate-100"></div>
            )}
            
            {/* Timeline dot */}
            <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white ${
              event.level === 'DANGER' ? 'bg-red-500' :
              event.level === 'WARNING' ? 'bg-amber-500' : 'bg-green-500'
            }`}></div>
            
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium mb-1">{event.time}</span>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${
                  event.level === 'DANGER' ? 'text-red-700' :
                  event.level === 'WARNING' ? 'text-amber-700' : 'text-green-700'
                }`}>
                  {event.description}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {event.distance} cm
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-1">{event.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
