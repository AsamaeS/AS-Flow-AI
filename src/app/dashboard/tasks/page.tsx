'use client';

import { useState, useEffect } from 'react';
import { Plus, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { storage } from '@/data/demo-data';
import { Task, Priority, EnergyLevel, FocusLevel } from '@/lib/types';
import TaskCard from '@/components/tasks/TaskCard';

export default function TasksPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        priority: 'medium' as Priority,
        estimatedTime: 1,
        deadline: '',
        energyRequired: 'medium' as EnergyLevel,
        focusLevel: 'medium' as FocusLevel,
        notes: '',
    });

    useEffect(() => {
        const user = storage.getUser();
        if (user) {
            setTasks(storage.getTasks(user.id));
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = storage.getUser();
        if (!user) return;

        if (editingTask) {
            const updated = tasks.map(t =>
                t.id === editingTask.id ? { ...t, ...formData } : t
            );
            setTasks(updated);
            storage.setTasks(user.id, updated);
        } else {
            const newTask: Task = {
                id: Date.now().toString(),
                userId: user.id,
                ...formData,
                completed: false,
                createdAt: new Date().toISOString(),
            };
            const updated = [...tasks, newTask];
            setTasks(updated);
            storage.setTasks(user.id, updated);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            priority: 'medium',
            estimatedTime: 1,
            deadline: '',
            energyRequired: 'medium',
            focusLevel: 'medium',
            notes: '',
        });
        setEditingTask(null);
        setShowModal(false);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            priority: task.priority,
            estimatedTime: task.estimatedTime,
            deadline: task.deadline || '',
            energyRequired: task.energyRequired,
            focusLevel: task.focusLevel,
            notes: task.notes || '',
        });
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (!confirm('Delete this task?')) return;
        const user = storage.getUser();
        if (!user) return;

        const updated = tasks.filter(t => t.id !== id);
        setTasks(updated);
        storage.setTasks(user.id, updated);
    };

    const handleToggle = (id: string) => {
        const user = storage.getUser();
        if (!user) return;

        const updated = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        setTasks(updated);
        storage.setTasks(user.id, updated);
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Tasks & Goals</h1>
                    <p className="text-slate-600">Manage your tasks and send them to AI planner</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Task
                    </button>
                    {tasks.length > 0 && (
                        <button
                            onClick={() => router.push('/dashboard/generate')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Send className="w-5 h-5" />
                            Send to AI Planner
                        </button>
                    )}
                </div>
            </div>

            {/* Tasks Grid */}
            {tasks.length === 0 ? (
                <div className="bg-white rounded-xl shadow-card p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">No Tasks Yet</h2>
                    <p className="text-slate-600 mb-6">Create your first task to get started</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        Create Task
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={() => handleEdit(task)}
                            onDelete={() => handleDelete(task.id)}
                            onToggle={() => handleToggle(task.id)}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                {editingTask ? 'Edit Task' : 'New Task'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Task Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="input-field"
                                        placeholder="What needs to be done?"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Priority *
                                        </label>
                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                                            className="input-field"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Estimated Time (hours) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            value={formData.estimatedTime}
                                            onChange={(e) => setFormData({ ...formData, estimatedTime: parseFloat(e.target.value) })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Deadline
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Energy Required *
                                        </label>
                                        <select
                                            value={formData.energyRequired}
                                            onChange={(e) => setFormData({ ...formData, energyRequired: e.target.value as EnergyLevel })}
                                            className="input-field"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Focus Level *
                                    </label>
                                    <select
                                        value={formData.focusLevel}
                                        onChange={(e) => setFormData({ ...formData, focusLevel: e.target.value as FocusLevel })}
                                        className="input-field"
                                    >
                                        <option value="light">Light</option>
                                        <option value="medium">Medium</option>
                                        <option value="deep">Deep Work</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="input-field resize-none h-24"
                                        placeholder="Additional details..."
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 btn-primary"
                                    >
                                        {editingTask ? 'Update Task' : 'Create Task'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
