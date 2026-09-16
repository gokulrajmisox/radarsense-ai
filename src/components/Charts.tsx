import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const activityData = [
  { time: '04:00', value: 10 },
  { time: '05:00', value: 25 },
  { time: '06:00', value: 15 },
  { time: '07:00', value: 45 },
  { time: '08:00', value: 120 },
  { time: '09:00', value: 35 },
  { time: '10:00', value: 20 },
];

export function ActivityGraph() {
  return (
    <div className="h-64 w-full">
      <div className="flex justify-end mb-2 gap-2">
        {['1H', '6H', '24H', '7D'].map((filter, i) => (
          <button key={filter} className={`text-xs px-3 py-1 rounded-full font-medium ${i === 1 ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {filter}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ color: '#64748b', marginBottom: '4px' }}
          />
          <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const threatData = [
  { name: 'Danger', value: 3, color: '#ef4444' },
  { name: 'Warning', value: 5, color: '#f59e0b' },
  { name: 'Safe', value: 4, color: '#10b981' },
];

export function ThreatDistribution() {
  return (
    <div className="h-64 w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={threatData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {threatData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-slate-800">12</span>
        <span className="text-xs text-slate-500 font-medium">Total Events</span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-0 right-0 flex flex-col gap-2">
        {threatData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span>{entry.name}</span>
            <span className="ml-auto text-slate-400">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
