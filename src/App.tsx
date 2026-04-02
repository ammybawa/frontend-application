/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Cloud, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Plan the day', completed: true },
    { id: '2', text: 'Review project goals', completed: false },
    { id: '3', text: 'Take a short walk', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [time, setTime] = useState(new Date());
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const isDaytime = time.getHours() >= 6 && time.getHours() < 18;

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm font-medium tracking-widest uppercase">
              {isDaytime ? <Sun size={14} /> : <Moon size={14} />}
              <span>{isDaytime ? 'Good Morning' : 'Good Evening'}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h1>
            <p className="mt-4 text-gray-400 font-medium">
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex items-center gap-6"
          >
            <div className="text-center">
              <span className="block text-xs text-gray-400 uppercase tracking-widest mb-1 font-bold">Focus</span>
              <span className="text-3xl font-mono font-bold tabular-nums tracking-tight">
                {formatTimer(timerSeconds)}
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button 
                onClick={() => { setIsTimerRunning(false); setTimerSeconds(25 * 60); }}
                className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </motion.div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Tasks Section */}
          <section className="md:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500 font-bold">
                {tasks.filter(t => !t.completed).length} remaining
              </span>
            </div>

            <form onSubmit={addTask} className="mb-8 relative group">
              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
              <input 
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all shadow-sm"
              />
            </form>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      task.completed 
                        ? 'bg-gray-50 border-transparent opacity-60' 
                        : 'bg-white border-gray-100 shadow-sm hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
                      {task.completed ? (
                        <CheckCircle2 className="text-black" size={22} />
                      ) : (
                        <Circle className="text-gray-200 group-hover:text-gray-400 transition-colors" size={22} />
                      )}
                      <span className={`text-lg transition-all ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {task.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Sidebar / Info Section */}
          <aside className="md:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-black text-white p-8 rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Cloud size={20} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Weather</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-bold tracking-tighter">22°</span>
                  <span className="text-xl text-gray-400 font-medium mb-2">Partly Cloudy</span>
                </div>
                <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                  The perfect temperature for a quick walk or focus session.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-8 border border-gray-100 rounded-[2.5rem] bg-white shadow-sm"
            >
              <h3 className="text-lg font-bold mb-4 tracking-tight">Daily Insight</h3>
              <p className="text-gray-500 italic leading-relaxed">
                "Simplicity is the ultimate sophistication."
              </p>
              <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-gray-400">Next Break</span>
                  <span className="text-sm font-medium">In 15 minutes</span>
                </div>
              </div>
            </motion.div>
          </aside>

        </main>

        <footer className="mt-24 pt-12 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-300 font-medium uppercase tracking-[0.2em]">
            ZenDash &copy; {new Date().getFullYear()} &bull; Built with React + Vite
          </p>
        </footer>
      </div>
    </div>
  );
}

