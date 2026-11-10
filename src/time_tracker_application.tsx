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
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '
