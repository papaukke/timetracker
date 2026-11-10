import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: string;
  seconds: number;
}

export default function TimeTrackerApp() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('timetracker_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Design Scoping', category: 'Creative', seconds: 1200 },
      { id: '2', title: 'Client Review Meeting', category: 'Management', seconds: 2700 }
    ];
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');

  useEffect(() => {
    localStorage.setItem('timetracker_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeId !== null) {
      interval = setInterval(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === activeId ? { ...task, seconds: task.seconds + 1 } : task
          )
        );
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeId]);

  const toggleTimer = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  const resetTimer = (id: string) => {
    if (activeId === id) setActiveId(null);
    setTasks(tasks.map((task) => (task.id === id ? { ...task, seconds: 0 } : task)));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      category: newTaskCategory.trim() || 'General',
      seconds: 0,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskCategory('');
  };

  const deleteTask = (id: string) => {
    if (activeId === id) setActiveId(null);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb', paddingBottom: '16px' }}>
        <Clock size={28} color="#2563eb" />
        <h1 style={{ fontSize: '24px', margin: 0, color: '#111827' }}>Time Tracker</h1>
      </header>

      <form onSubmit={addTask} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Task title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
        <input
          type="text"
          placeholder="Category..."
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
        <button
          type="submit"
          style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Plus size={18} /> Add
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: activeId === task.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937' }}>{task.title}</div>
              <span style={{ fontSize: '12px', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '12px', color: '#6b7280' }}>
                {task.category}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 600, color: '#374151' }}>
                {formatTime(task.seconds)}
              </span>
              <button
                onClick={() => toggleTimer(task.id)}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: activeId === task.id ? '#fef2f2' : '#eff6ff',
                  color: activeId === task.id ? '#ef4444' : '#2563eb',
                  cursor: 'pointer',
                }}
              >
                {activeId === task.id ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={() => resetTimer(task.id)}
                style={{ padding: '8px', borderRadius: '50%', border: 'none', backgroundColor: '#f3f4f6', color: '#6b7280', cursor: 'pointer' }}
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                style={{ padding: '8px', borderRadius: '50%', border: 'none', backgroundColor: '#f3f4f6', color: '#ef4444', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
