import { Bell, LayoutDashboard, Settings, FileText, Activity, BrainCircuit, User } from 'lucide-react';
import { useMockRadarData } from '../hooks/useMockRadarData';
import LiveRadar from './LiveRadar';
import ThreatLevelCard from './ThreatLevelCard';
import LiveSensorDataCard from './LiveSensorDataCard';
import RecentEventsList from './RecentEventsList';
import { ActivityGraph, ThreatDistribution } from './Charts';
import AIAssistantPanel from './AIAssistantPanel';

export default function Dashboard() {
  const { data, events } = useMockRadarData();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600">
            <Activity className="w-6 h-6" />
            <span className="text-xl font-bold text-slate-800 tracking-tight">RadarSense <span className="text-blue-600 font-semibold">AI</span></span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
          <NavItem icon={<Activity />} label="Live Radar" />
          <NavItem icon={<Bell />} label="Events" />
          <NavItem icon={<BrainCircuit />} label="AI Analysis" />
          <NavItem icon={<FileText />} label="Reports" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="md:hidden flex items-center gap-2 text-blue-600">
            <Activity className="w-6 h-6" />
            <span className="text-xl font-bold text-slate-800">RadarSense <span className="text-blue-600">AI</span></span>
          </div>
          <div className="hidden md:block"></div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Online
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-700">nithesh</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Top Row: Radar, Threat, Sensor Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Radar takes 2 columns on large screens */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Live Radar
                  </h2>
                </div>
                <div className="flex-1 p-6 flex flex-col items-center justify-center relative min-h-[300px]">
                  <LiveRadar angle={data.angle} distance={data.distance} />
                </div>
              </div>

              {/* Threat Level & Live Sensor Data */}
              <div className="flex flex-col gap-6">
                <ThreatLevelCard data={data} />
                <LiveSensorDataCard data={data} />
              </div>
            </div>

            {/* Middle Row: Charts & Events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                    <h2 className="font-semibold text-slate-800 mb-4">Radar Activity</h2>
                    <ActivityGraph />
                 </div>
                 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                    <h2 className="font-semibold text-slate-800 mb-4">Threat Distribution</h2>
                    <ThreatDistribution />
                 </div>
              </div>

              {/* Events & AI Assistant column */}
              <div className="flex flex-col gap-6 lg:row-span-2">
                <RecentEventsList events={events} />
                <AIAssistantPanel />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}>
      <span className={active ? 'text-blue-600' : 'text-slate-400'}>{icon}</span>
      {label}
    </button>
  )
}
