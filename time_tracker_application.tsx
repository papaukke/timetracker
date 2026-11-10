import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, Square, Plus, Trash2, Edit2, Calendar as CalendarIcon, 
  BarChart2, Settings, FolderKanban, Clock, Tag, ChevronLeft, 
  ChevronRight, Check, X, Search, Power, ArrowUp, ArrowDown, Copy
} from 'lucide-react';

// --- INITIAL SEED DATA ---
const INITIAL_CLIENTS = [
  { id: 'c1', name: 'OTP Bank', color: '#6366f1', status: 'active' },
  { id: 'c2', name: 'Samsung', color: '#0ea5e9', status: 'active' },
  { id: 'c3', name: 'CKB', color: '#10b981', status: 'active' },
  { id: 'c4', name: 'Internal', color: '#f59e0b', status: 'active' }
];

const INITIAL_PROJECTS = [
  { id: 'p1', clientId: 'c1', name: 'Cyber Security Campaign', description: 'Q4 National digital security awareness video series.', status: 'active' },
  { id: 'p2', clientId: 'c1', name: 'Brand Platform', description: 'Visual identity overhaul for retail banking.', status: 'active' },
  { id: 'p3', clientId: 'c2', name: 'Multimarket MX ATL 2026', description: 'Above the line regional campaign assets.', status: 'active' },
  { id: 'p4', clientId: 'c3', name: 'MNE Kampanja Q3 2026', description: 'Q3 digital acquisition push.', status: 'active' },
  { id: 'p5', clientId: 'c4', name: 'administracija', description: 'Non billable general internal tasks.', status: 'active' }
];

const INITIAL_ACTIVITIES = [
  { id: 'a1', name: 'Creative Direction', status: 'active' },
  { id: 'a2', name: 'Concept Development', status: 'active' },
  { id: 'a3', name: 'Design', status: 'active' },
  { id: 'a4', name: 'Copywriting', status: 'active' },
  { id: 'a5', name: 'Presentation', status: 'active' },
  { id: 'a6', name: 'Research', status: 'active' },
  { id: 'a7', name: 'Strategy', status: 'active' },
  { id: 'a8', name: 'Client Meeting', status: 'active' },
  { id: 'a9', name: 'Internal Meeting', status: 'active' },
  { id: 'a10', name: 'Feedback / Review', status: 'active' },
  { id: 'a11', name: 'Production', status: 'active' },
  { id: 'a12', name: 'Administration', status: 'active' },
  { id: 'a13', name: 'Mixed', status: 'active' },
  { id: 'a14', name: 'Other', status: 'active' }
];

const PALETTE_SWATCHES = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e'];

function getInitialTimeEntries() {
  return [
    { id: 'e1', date: '2026-11-02', clientId: 'c2', projectId: 'p3', activityId: 'a1', startTime: '08:00', endTime: '15:53', duration: 473, description: 'Samsung Multimarket kickoff' },
    { id: 'e2', date: '2026-11-03', clientId: 'c2', projectId: 'p3', activityId: 'a3', startTime: '08:32', endTime: '17:04', duration: 512, description: 'Visual identity grids' },
    { id: 'e3', date: '2026-11-04', clientId: 'c1', projectId: 'p2', activityId: 'a7', startTime: '08:00', endTime: '08:44', duration: 44, description: 'Strategy sync' },
    { id: 'e4', date: '2026-11-04', clientId: 'c3', projectId: 'p4', activityId: 'a2', startTime: '10:30', endTime: '14:02', duration: 212, description: 'Q3 campaign concept review' },
    { id: 'e5', date: '2026-11-04', clientId: 'c4', projectId: 'p5', activityId: 'a12', startTime: '14:10', endTime: '14:39', duration: 29, description: 'Invoicing' },
    { id: 'e6', date: '2026-11-04', clientId: 'c1', projectId: 'p1', activityId: 'a11', startTime: '14:45', endTime: '16:04', duration: 79, description: 'Video asset export' },
    { id: 'e7', date: '2026-11-05', clientId: 'c1', projectId: 'p1', activityId: 'a1', startTime: '08:00', endTime: '09:39', duration: 99, description: 'Storyboard review' },
    { id: 'e8', date: '2026-11-05', clientId: 'c1', projectId: 'p1', activityId: 'a3', startTime: '09:45', endTime: '10:51', duration: 66, description: 'Keyframe adjustments' },
    { id: 'e9', date: '2026-11-05', clientId: 'c1', projectId: 'p1', activityId: 'a11', startTime: '11:00', endTime: '14:34', duration: 214, description: 'Final production build' },
    { id: 'e10', date: '2026-11-05', clientId: 'c4', projectId: 'p5', activityId: 'a12', startTime: '14:40', endTime: '18:22', duration: 222, description: 'Internal admin sync' },
    { id: 'e11', date: '2026-11-06', clientId: 'c1', projectId: 'p1', activityId: 'a1', startTime: '08:00', endTime: '12:30', duration: 270, description: 'Campaign launch prep' },
    { id: 'e12', date: '2026-11-06', clientId: 'c4', projectId: 'p5', activityId: 'a12', startTime: '12:45', endTime: '17:04', duration: 259, description: 'Timesheet reviews' }
  ];
}

// --- UTILITIES ---
function formatMinutes(totalMins) {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatSeconds(totalSecs) {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function parseDurationInput(str) {
  if (!str) return 0;
  const trimmed = str.trim().toLowerCase();
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }
  let total = 0;
  const hMatch = trimmed.match(/(\d+)\s*h/);
  const mMatch = trimmed.match(/(\d+)\s*m/);
  const decMatch = trimmed.match(/^(\d*\.?\d+)\s*h$/);
  
  if (decMatch && !hMatch && !mMatch) {
    return Math.round(parseFloat(decMatch[1]) * 60);
  }
  if (hMatch) total += parseInt(hMatch[1], 10) * 60;
  if (mMatch) total += parseInt(mMatch[1], 10);
  return total > 0 ? total : 0;
}

function parseTimeInput(str) {
  if (!str) return '09:00';
  const clean = str.replace(/\D/g, '');
  if (clean.length === 4) {
    return `${clean.slice(0, 2)}:${clean.slice(2, 4)}`;
  }
  if (clean.length === 3) {
    return `0${clean.slice(0, 1)}:${clean.slice(1, 3)}`;
  }
  return str;
}

function timeStrToMins(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function minsToTimeStr(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// --- MAIN APP ---
export default function App() {
  const [currentTab, setCurrentTab] = useState('today');
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [timeEntries, setTimeEntries] = useState(getInitialTimeEntries());

  // Active Timer State
  const [activeTimer, setActiveTimer] = useState({
    isRunning: false,
    clientId: 'c1',
    projectId: 'p1',
    activityId: 'a1',
    description: '',
    elapsedSeconds: 0,
    startTimeObj: null
  });

  const timerRef = useRef(null);

  useEffect(() => {
    if (activeTimer.isRunning) {
      timerRef.current = setInterval(() => {
        setActiveTimer(prev => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [activeTimer.isRunning]);

  const startTimer = (clientId, projectId, activityId) => {
    if (activeTimer.isRunning) {
      stopActiveTimer();
    }
    const now = new Date();
    const startTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setActiveTimer({
      isRunning: true,
      clientId: clientId || clients[0]?.id,
      projectId: projectId || projects[0]?.id,
      activityId: activityId || activities[0]?.id,
      description: '',
      elapsedSeconds: 0,
      startTimeObj: { timeStr: startTimeStr, dateStr: now.toISOString().split('T')[0] }
    });
  };

  const stopActiveTimer = () => {
    if (!activeTimer.isRunning) return;
    const durationMins = Math.max(1, Math.round(activeTimer.elapsedSeconds / 60));
    const now = new Date();
    const endTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEntry = {
      id: 'e_' + Date.now(),
      date: activeTimer.startTimeObj ? activeTimer.startTimeObj.dateStr : now.toISOString().split('T')[0],
      clientId: activeTimer.clientId,
      projectId: activeTimer.projectId,
      activityId: activeTimer.activityId,
      startTime: activeTimer.startTimeObj ? activeTimer.startTimeObj.timeStr : '09:00',
      endTime: endTimeStr,
      duration: durationMins,
      description: activeTimer.description || 'Live tracked session'
    };
    setTimeEntries(prev => [newEntry, ...prev]);
    setActiveTimer(prev => ({ ...prev, isRunning: false, elapsedSeconds: 0, startTimeObj: null }));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-slate-100">
            <h1 className="text-xl font-bold tracking-tight text-indigo-600 flex items-center gap-2">
              <Clock className="w-6 h-6" /> ChronoFlow
            </h1>
            <p className="text-xs text-slate-400 mt-1">Minimal Time & Project Hub</p>
          </div>
          <nav className="p-4 space-y-1">
            <SidebarItem icon={<Clock size={18}/>} label="Today" active={currentTab === 'today'} onClick={() => setCurrentTab('today')} />
            <SidebarItem icon={<CalendarIcon size={18}/>} label="Calendar" active={currentTab === 'calendar'} onClick={() => setCurrentTab('calendar')} />
            <SidebarItem icon={<BarChart2 size={18}/>} label="Reports" active={currentTab === 'reports'} onClick={() => setCurrentTab('reports')} />
            <SidebarItem icon={<FolderKanban size={18}/>} label="Clients & Projects" active={currentTab === 'clients'} onClick={() => setCurrentTab('clients')} />
            <SidebarItem icon={<Settings size={18}/>} label="Settings" active={currentTab === 'settings'} onClick={() => setCurrentTab('settings')} />
          </nav>
        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Timer</div>
            {activeTimer.isRunning ? (
              <div>
                <div className="text-lg font-mono font-bold text-indigo-600">{formatSeconds(activeTimer.elapsedSeconds)}</div>
                <button onClick={stopActiveTimer} className="mt-2 w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition">
                  <Square size={12} /> Stop & Save
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Timer is idle</div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:hidden">
          <h1 className="font-bold text-indigo-600 flex items-center gap-2">
            <Clock size={20} /> ChronoFlow
          </h1>
          <div className="flex gap-2">
            <button onClick={() => setCurrentTab('today')} className={`p-2 rounded-lg ${currentTab === 'today' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}><Clock size={18}/></button>
            <button onClick={() => setCurrentTab('calendar')} className={`p-2 rounded-lg ${currentTab === 'calendar' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}><CalendarIcon size={18}/></button>
            <button onClick={() => setCurrentTab('reports')} className={`p-2 rounded-lg ${currentTab === 'reports' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}><BarChart2 size={18}/></button>
            <button onClick={() => setCurrentTab('clients')} className={`p-2 rounded-lg ${currentTab === 'clients' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}><FolderKanban size={18}/></button>
            <button onClick={() => setCurrentTab('settings')} className={`p-2 rounded-lg ${currentTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}><Settings size={18}/></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {currentTab === 'today' && (
            <TodayView 
              timeEntries={timeEntries} 
              setTimeEntries={setTimeEntries} 
              clients={clients} 
              projects={projects} 
              activities={activities}
              activeTimer={activeTimer}
              setActiveTimer={setActiveTimer}
              startTimer={startTimer}
              stopActiveTimer={stopActiveTimer}
            />
          )}
          {currentTab === 'calendar' && (
            <CalendarView 
              timeEntries={timeEntries} 
              setTimeEntries={setTimeEntries}
              clients={clients}
              projects={projects}
              activities={activities}
            />
          )}
          {currentTab === 'reports' && (
            <ReportsView 
              timeEntries={timeEntries} 
              clients={clients} 
              projects={projects} 
              activities={activities} 
            />
          )}
          {currentTab === 'clients' && (
            <ClientsView 
              clients={clients} 
              setClients={setClients} 
              projects={projects} 
              setProjects={setProjects} 
            />
          )}
          {currentTab === 'settings' && (
            <SettingsView 
              activities={activities} 
              setActivities={setActivities} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      {icon} {label}
    </button>
  );
}

// --- TODAY VIEW ---
function TodayView({ timeEntries, setTimeEntries, clients, projects, activities, activeTimer, setActiveTimer, startTimer, stopActiveTimer }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const todayStr = '2026-11-09';

  const recentProjects = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const entry of timeEntries) {
      if (!seen.has(entry.projectId)) {
        seen.add(entry.projectId);
        const proj = projects.find(p => p.id === entry.projectId);
        const cli = clients.find(c => c.id === entry.clientId);
        if (proj) {
          list.push({ project: proj, client: cli });
        }
      }
      if (list.length >= 10) break;
    }
    for (const proj of projects) {
      if (!seen.has(proj.id) && list.length < 10) {
        seen.add(proj.id);
        const cli = clients.find(c => c.id === proj.clientId);
        list.push({ project: proj, client: cli });
      }
    }
    return list;
  }, [timeEntries, projects, clients]);

  const groupedEntries = useMemo(() => {
    const map = {};
    timeEntries.forEach(entry => {
      if (!map[entry.date]) map[entry.date] = [];
      map[entry.date].push(entry);
    });
    return map;
  }, [timeEntries]);

  const totalTodayMins = useMemo(() => {
    return (groupedEntries[todayStr] || []).reduce((acc, curr) => acc + curr.duration, 0);
  }, [groupedEntries, todayStr]);

  const handleDelete = (id) => {
    if (confirm('Delete this time entry?')) {
      setTimeEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleDuplicate = (entry) => {
    const dup = { ...entry, id: 'e_' + Date.now() };
    setTimeEntries(prev => [dup, ...prev]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header & Total Today */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Today</h2>
          <p className="text-sm text-slate-500">Monday, Nov 9, 2026</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl text-right">
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Total Tracked Today</div>
            <div className="text-xl font-bold text-indigo-900">{formatMinutes(totalTodayMins)}</div>
          </div>
          <button 
            onClick={() => { setEditingEntry(null); setIsModalOpen(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
          >
            <Plus size={18} /> Add Time
          </button>
        </div>
      </div>

      {/* Active Live Timer Header & Quick Start */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Tracker</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select 
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                value={activeTimer.clientId}
                onChange={e => setActiveTimer(p => ({ ...p, clientId: e.target.value }))}
              >
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select 
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                value={activeTimer.projectId}
                onChange={e => setActiveTimer(p => ({ ...p, projectId: e.target.value }))}
              >
                {projects.filter(p => p.clientId === activeTimer.clientId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select 
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                value={activeTimer.activityId}
                onChange={e => setActiveTimer(p => ({ ...p, activityId: e.target.value }))}
              >
                {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-end">
            <div className="text-2xl font-mono font-bold text-slate-800">{formatSeconds(activeTimer.elapsedSeconds)}</div>
            {activeTimer.isRunning ? (
              <button onClick={stopActiveTimer} className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition">
                <Square size={16} /> Stop
              </button>
            ) : (
              <button onClick={() => startTimer(activeTimer.clientId, activeTimer.projectId, activeTimer.activityId)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition">
                <Play size={16} /> Play
              </button>
            )}
          </div>
        </div>

        {/* Quick Start Buttons: Top 10 Recent Projects */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Start Recent Projects</div>
          <div className="flex flex-wrap gap-2">
            {recentProjects.map(({ project, client }) => (
              <button 
                key={project.id}
                onClick={() => startTimer(client?.id, project.id, activities[0]?.id)}
                className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 flex items-center gap-2 transition"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: client?.color || '#6366f1' }}></span>
                <span className="truncate max-w-[140px]">{project.name}</span>
                <span className="text-indigo-600 font-bold uppercase tracking-wide">| PLAY</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Grouped By Date */}
      <div className="space-y-6">
        {Object.keys(groupedEntries).sort().reverse().map(dateStr => {
          const entries = groupedEntries[dateStr];
          const dayTotal = entries.reduce((acc, curr) => acc + curr.duration, 0);
          const isToday = dateStr === todayStr;
          const displayDate = isToday ? 'TODAY' : dateStr;

          return (
            <div key={dateStr} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{displayDate}</span>
                <span className="text-xs font-semibold text-slate-700">{formatMinutes(dayTotal)}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {entries.map(entry => {
                  const client = clients.find(c => c.id === entry.clientId);
                  const project = projects.find(p => p.id === entry.projectId);
                  const activity = activities.find(a => a.id === entry.activityId);

                  return (
                    <div key={entry.id} className="p-4 md:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: client?.color || '#6366f1' }}></span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">
                            {project?.name || 'Unknown Project'} <span className="text-slate-400 font-normal">({client?.name})</span>
                          </div>
                          <div className="text-xs text-slate-500 truncate flex items-center gap-2 mt-0.5">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{activity?.name || 'General'}</span>
                            {entry.description && <span>• {entry.description}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900">{formatMinutes(entry.duration)}</div>
                          <div className="text-xs text-slate-400">{entry.startTime} - {entry.endTime}</div>
                        </div>
                        <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                          <button onClick={() => startTimer(entry.clientId, entry.projectId, entry.activityId)} title="Quick Resume" className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Play size={14}/></button>
                          <button onClick={() => handleDuplicate(entry)} title="Duplicate" className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Copy size={14}/></button>
                          <button onClick={() => { setEditingEntry(entry); setIsModalOpen(true); }} title="Edit" className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Edit2 size={14}/></button>
                          <button onClick={() => handleDelete(entry.id)} title="Delete" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <TimeEntryModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          clients={clients} 
          projects={projects} 
          activities={activities} 
          timeEntries={timeEntries}
          setTimeEntries={setTimeEntries}
          editingEntry={editingEntry}
        />
      )}
    </div>
  );
}

// --- TIME ENTRY MODAL ---
function TimeEntryModal({ isOpen, onClose, clients, projects, activities, timeEntries, setTimeEntries, editingEntry }) {
  const [clientId, setClientId] = useState(editingEntry ? editingEntry.clientId : clients[0]?.id);
  const [projectId, setProjectId] = useState(editingEntry ? editingEntry.projectId : projects[0]?.id);
  const [activityId, setActivityId] = useState(editingEntry ? editingEntry.activityId : activities[0]?.id);
  const [date, setDate] = useState(editingEntry ? editingEntry.date : '2026-11-09');
  const [startTimeInput, setStartTimeInput] = useState(editingEntry ? editingEntry.startTime : '09:00');
  const [endTimeInput, setEndTimeInput] = useState(editingEntry ? editingEntry.endTime : '10:00');
  const [durationStr, setDurationStr] = useState(editingEntry ? String(editingEntry.duration) : '60');
  const [description, setDescription] = useState(editingEntry ? editingEntry.description : '');

  const availableProjects = projects.filter(p => p.clientId === clientId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedStart = parseTimeInput(startTimeInput);
    const parsedEnd = parseTimeInput(endTimeInput);
    const startMins = timeStrToMins(parsedStart);
    const endMins = timeStrToMins(parsedEnd);
    let dur = endMins - startMins;
    if (dur <= 0) dur = parseDurationInput(durationStr) || 60;

    const newEntry = {
      id: editingEntry ? editingEntry.id : 'e_' + Date.now(),
      date,
      clientId,
      projectId,
      activityId,
      startTime: parsedStart,
      endTime: minsToTimeStr(startMins + dur),
      duration: dur,
      description
    };

    if (editingEntry) {
      setTimeEntries(prev => prev.map(item => item.id === editingEntry.id ? newEntry : item));
    } else {
      setTimeEntries(prev => [newEntry, ...prev]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">{editingEntry ? 'Edit Time Entry' : 'Add Time Entry'}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Client</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" value={clientId} onChange={e => setClientId(e.target.value)}>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Project</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" value={projectId} onChange={e => setProjectId(e.target.value)}>
              {availableProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Activity Type</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" value={activityId} onChange={e => setActivityId(e.target.value)}>
              {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</label>
              <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Start Time</label>
              <input type="text" placeholder="0930" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" value={startTimeInput} onChange={e => setStartTimeInput(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">End Time</label>
              <input type="text" placeholder="1030" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" value={endTimeInput} onChange={e => setEndTimeInput(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Duration / Quick Preset</label>
            <div className="flex gap-2 mb-2">
              {['15m', '30m', '45m', '1h', '1h 30m', '2h'].map(preset => (
                <button key={preset} type="button" onClick={() => setDurationStr(preset)} className="bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-medium transition">
                  {preset}
                </button>
              ))}
            </div>
            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" value={durationStr} onChange={e => setDurationStr(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description (Optional)</label>
            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" value={description} onChange={e => setDescription(e.target.value)} placeholder="What did you work on?" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition">Save Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- CALENDAR VIEW ---
function CalendarView({ timeEntries, setTimeEntries, clients, projects, activities }) {
  const weekDayLabels = [
    { label: 'Mo, Nov 2', date: '2026-11-02' },
    { label: 'Tu, Nov 3', date: '2026-11-03' },
    { label: 'We, Nov 4', date: '2026-11-04' },
    { label: 'Th, Nov 5', date: '2026-11-05' },
    { label: 'Fr, Nov 6', date: '2026-11-06' },
    { label: 'Sa, Nov 7', date: '2026-11-07' },
    { label: 'Su, Nov 8', date: '2026-11-08' }
  ];

  const hours = Array.from({ length: 17 }, (_, i) => i + 4); // 04:00 to 20:00

  const [interaction, setInteraction] = useState(null);
  const containerRef = useRef(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseDown = (e, entry, type) => {
    e.stopPropagation();
    const startY = e.clientY;
    const startMins = timeStrToMins(entry.startTime);
    setInteraction({
      entryId: entry.id,
      type,
      startY,
      initialStartMins: startMins,
      initialDuration: entry.duration
    });
  };

  const handleMouseMove = (e) => {
    if (!interaction) return;
    const deltaY = e.clientY - interaction.startY;
    const deltaMins = Math.round((deltaY / 60) * 60 / 10) * 10;

    setTimeEntries(prev => prev.map(item => {
      if (item.id !== interaction.entryId) return item;
      if (interaction.type === 'resize-bottom') {
        const newDur = Math.max(10, interaction.initialDuration + deltaMins);
        return { ...item, duration: newDur, endTime: minsToTimeStr(timeStrToMins(item.startTime) + newDur) };
      }
      if (interaction.type === 'resize-top') {
        const potentialStart = interaction.initialStartMins + deltaMins;
        const potentialEnd = interaction.initialStartMins + interaction.initialDuration;
        const newDur = Math.max(10, potentialEnd - potentialStart);
        if (newDur >= 10) {
          return { ...item, startTime: minsToTimeStr(potentialStart), duration: newDur };
        }
      }
      if (interaction.type === 'move') {
        const newStart = Math.max(240, Math.min(1200, interaction.initialStartMins + deltaMins));
        return { ...item, startTime: minsToTimeStr(newStart), endTime: minsToTimeStr(newStart + item.duration) };
      }
      return item;
    }));
  };

  const handleMouseUp = () => {
    setInteraction(null);
  };

  const getEventStyle = (entry) => {
    const startMins = timeStrToMins(parseTimeInput(entry.startTime));
    const topPx = ((startMins - 240) / 60) * 60;
    const heightPx = Math.max(24, (entry.duration / 60) * 60);
    return { top: `${topPx}px`, height: `${heightPx}px` };
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 select-none" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} ref={containerRef}>
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Schedule</h2>
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            <button className="px-3 py-1 bg-white shadow-sm rounded-lg text-xs font-semibold text-slate-800">Week</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50"><ChevronLeft size={16}/></button>
          <span className="text-sm font-semibold text-slate-700 px-2">Nov 2 - Nov 8, 2026</span>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="grid grid-cols-8 bg-white border-b border-slate-200 text-xs font-semibold text-slate-500 text-center py-2 shrink-0">
        <div className="border-r border-slate-100">Time</div>
        {weekDayLabels.map(d => (
          <div key={d.date} className="border-r border-slate-100 last:border-none">
            {d.label}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <div className="grid grid-cols-8 min-h-[1020px] relative">
          <div className="border-r border-slate-200 bg-slate-50/50">
            {hours.map(h => (
              <div key={h} className="h-[60px] border-b border-slate-200/60 text-right pr-3 pt-1 text-xs font-mono text-slate-400">
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {weekDayLabels.map(col => {
            const dayEntries = timeEntries.filter(e => e.date === col.date);
            return (
              <div key={col.date} className="border-r border-slate-200/60 relative last:border-none">
                {hours.map(h => (
                  <div key={h} className="h-[60px] border-b border-slate-200/40 border-dashed"></div>
                ))}
                {dayEntries.map(entry => {
                  const client = clients.find(c => c.id === entry.clientId);
                  const project = projects.find(p => p.id === entry.projectId);
                  const style = getEventStyle(entry);

                  return (
                    <div
                      key={entry.id}
                      style={{ ...style, backgroundColor: (client?.color || '#6366f1') + '15', borderColor: client?.color || '#6366f1' }}
                      className="absolute left-1 right-1 rounded-xl border-l-4 p-2 overflow-hidden shadow-sm group cursor-pointer flex flex-col justify-between transition-shadow hover:shadow-md"
                      onMouseDown={(e) => handleMouseDown(e, entry, 'move')}
                      onDoubleClick={() => { setEditingEntry(entry); setIsModalOpen(true); }}
                    >
                      <div 
                        className="absolute top-0 left-0 right-0 h-2 cursor-s-resize hover:bg-black/10"
                        onMouseDown={(e) => handleMouseDown(e, entry, 'resize-top')}
                      ></div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 truncate">{project?.name || 'Project'}</div>
                        <div className="text-[10px] text-slate-600 truncate">{client?.name}</div>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">{entry.startTime} ({formatMinutes(entry.duration)})</div>
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize hover:bg-black/10"
                        onMouseDown={(e) => handleMouseDown(e, entry, 'resize-bottom')}
                      ></div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <TimeEntryModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          clients={clients} 
          projects={projects} 
          activities={activities} 
          timeEntries={timeEntries}
          setTimeEntries={setTimeEntries}
          editingEntry={editingEntry}
        />
      )}
    </div>
  );
}

// --- REPORTS VIEW ---
function ReportsView({ timeEntries, clients, projects, activities }) {
  const [selectedPeriod, setSelectedPeriod] = useState('this-week');

  const weekDayColumns = [
    { label: 'Mo, Nov 2', date: '2026-11-02' },
    { label: 'Tu, Nov 3', date: '2026-11-03' },
    { label: 'We, Nov 4', date: '2026-11-04' },
    { label: 'Th, Nov 5', date: '2026-11-05' },
    { label: 'Fr, Nov 6', date: '2026-11-06' },
    { label: 'Sa, Nov 7', date: '2026-11-07' },
    { label: 'Su, Nov 8', date: '2026-11-08' }
  ];

  const projectRows = useMemo(() => {
    const activeProjects = projects.filter(p => p.status === 'active');
    return activeProjects.map(proj => {
      const client = clients.find(c => c.id === proj.clientId);
      const dayTotals = {};
      let rowTotal = 0;

      weekDayColumns.forEach(col => {
        const sum = timeEntries
          .filter(e => e.projectId === proj.id && e.date === col.date)
          .reduce((acc, curr) => acc + curr.duration, 0);
        dayTotals[col.date] = sum;
        rowTotal += sum;
      });

      return { project: proj, client, dayTotals, rowTotal };
    }).filter(r => r.rowTotal > 0);
  }, [projects, clients, timeEntries]);

  const columnTotals = useMemo(() => {
    const totals = {};
    let grandTotal = 0;
    weekDayColumns.forEach(col => {
      const sum = timeEntries
        .filter(e => e.date === col.date)
        .reduce((acc, curr) => acc + curr.duration, 0);
      totals[col.date] = sum;
      grandTotal += sum;
    });
    return { totals, grandTotal };
  }, [timeEntries]);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reports Dashboard</h2>
          <p className="text-sm text-slate-500">Multi-day project tracking matrix</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
          >
            <option value="this-week">This Week (Nov 2 - Nov 8)</option>
            <option value="last-week">Last Week</option>
            <option value="this-month">This Month</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-4 px-6 w-80">Projects</th>
              {weekDayColumns.map(col => (
                <th key={col.date} className="py-4 px-4 text-center font-semibold text-slate-600">{col.label}</th>
              ))}
              <th className="py-4 px-6 text-right font-bold text-slate-900">Total:</th>
              <th className="py-4 px-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {projectRows.map(({ project, client, dayTotals, rowTotal }) => (
              <tr key={project.id} className="hover:bg-slate-50/60 transition">
                <td className="py-4 px-6 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: client?.color || '#6366f1' }}></span>
                  <span className="font-semibold text-slate-900 truncate">{project.name} <span className="text-slate-400 font-normal">- {client?.name}</span></span>
                </td>
                {weekDayColumns.map(col => {
                  const mins = dayTotals[col.date];
                  return (
                    <td key={col.date} className="py-4 px-4 text-center font-mono text-slate-600">
                      <div className="bg-slate-50 border border-slate-200/80 rounded-lg py-1.5 px-2 text-xs">
                        {mins > 0 ? minsToTimeStr(mins) + ':00' : ''}
                      </div>
                    </td>
                  );
                })}
                <td className="py-4 px-6 text-right font-mono font-bold text-slate-900">
                  {minsToTimeStr(rowTotal)}:00
                </td>
                <td className="py-4 px-4 text-center text-slate-400 hover:text-rose-600 cursor-pointer">
                  <X size={16} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100/70 border-t border-slate-200 font-bold text-slate-900 text-sm">
              <td className="py-4 px-6 uppercase tracking-wider text-xs">Total:</td>
              {weekDayColumns.map(col => {
                const daySum = columnTotals.totals[col.date];
                return (
                  <td key={col.date} className="py-4 px-4 text-center font-mono text-xs">
                    {minsToTimeStr(daySum)}:00
                  </td>
                );
              })}
              <td className="py-4 px-6 text-right font-mono text-indigo-600">
                {minsToTimeStr(columnTotals.grandTotal)}:00
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// --- CLIENTS & PROJECTS VIEW ---
function ClientsView({ clients, setClients, projects, setProjects }) {
  const [activeSubTab, setActiveSubTab] = useState('projects');
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const p = {
      id: 'p_' + Date.now(),
      clientId: selectedClientId,
      name: newProjectName,
      description: 'Newly created project',
      status: 'active'
    };
    setProjects(prev => [p, ...prev]);
    setNewProjectName('');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Clients & Projects</h2>
          <p className="text-sm text-slate-500">Manage client accounts and campaign projects</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveSubTab('projects')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeSubTab === 'projects' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Projects</button>
          <button onClick={() => setActiveSubTab('clients')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeSubTab === 'clients' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Clients</button>
        </div>
      </div>

      {activeSubTab === 'projects' && (
        <div className="space-y-6">
          <form onSubmit={handleAddProject} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-3">
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="text" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="New Project Name..." value={newProjectName} onChange={e => setNewProjectName(e.target.value)} />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition">Add Project</button>
          </form>

          <div className="space-y-3">
            {projects.map(proj => {
              const client = clients.find(c => c.id === proj.clientId);
              return (
                <div key={proj.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: client?.color || '#6366f1' }}></span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{proj.name}</div>
                      <div className="text-xs text-slate-500">{client?.name} • {proj.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-lg">Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'clients' && (
        <div className="space-y-4">
          {clients.map(cli => (
            <div key={cli.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: cli.color }}></span>
                <span className="font-bold text-slate-900">{cli.name}</span>
              </div>
              <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-lg">Active</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- SETTINGS VIEW ---
function SettingsView({ activities, setActivities }) {
  const [newActivityName, setNewActivityName] = useState('');

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivityName.trim()) return;
    const act = { id: 'act_' + Date.now(), name: newActivityName, status: 'active' };
    setActivities(prev => [...prev, act]);
    setNewActivityName('');
  };

  const toggleStatus = (id) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Activity Types</h2>
        <p className="text-sm text-slate-500 mb-6">Configure available work categories</p>

        <form onSubmit={handleAddActivity} className="flex gap-3 mb-6">
          <input type="text" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="New activity type name..." value={newActivityName} onChange={e => setNewActivityName(e.target.value)} />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition">Add Activity</button>
        </form>

        <div className="space-y-2">
          {activities.map(act => (
            <div key={act.id} className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-800">{act.name}</span>
              <button onClick={() => toggleStatus(act.id)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${act.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                {act.status}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}