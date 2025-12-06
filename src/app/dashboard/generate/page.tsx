'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';
import { storage } from '@/data/demo-data';
import { PlanningConfig, Task } from '@/lib/types';

export default function GeneratePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [config, setConfig] = useState<PlanningConfig>({
        startTime: '09:00',
        endTime: '18:00',
        energyLevel: 70,
        focusCapacity: 'high',
        constraints: '',
        preferences: {
            includeBreaks: true,
            includeMeals: true,
            deepWorkPreferred: true,
        },
    });

    useEffect(() => {
        const user = storage.getUser();
        if (user) {
            setTasks(storage.getTasks(user.id));
        }
    }, []);

    const handleGenerate = async () => {
        setLoading(true);

        try {
            const user = storage.getUser();
            if (!user) return;

            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks, config }),
            });

            const data = await response.json();

            if (data.success) {
                const today = new Date().toISOString().split('T')[0];
                storage.setSchedule(user.id, today, { blocks: data.schedule });

                // Redirect to dashboard
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Generate My Day</h1>
                    <p className="text-slate-600">Configure your preferences and let AI create the perfect schedule</p>
                </div>

                {tasks.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800">
                            ⚠️ No tasks found. Please add tasks first before generating a schedule.
                        </p>
                    </div>
                )}

                {tasks.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-blue-800">
                            ✓ Ready to plan {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}

                {/* Configuration Form */}
                <div className="bg-white rounded-xl shadow-card p-8">
                    <div className="space-y-6">
                        {/* Time Range */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Hours</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={config.startTime}
                                        onChange={(e) => setConfig({ ...config, startTime: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={config.endTime}
                                        onChange={(e) => setConfig({ ...config, endTime: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Energy Level */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Energy Level</h3>
                            <div className="space-y-3">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={config.energyLevel}
                                    onChange={(e) => setConfig({ ...config, energyLevel: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full appearance-none cursor-pointer"
                                />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Low</span>
                                    <span className="font-semibold text-slate-900">{config.energyLevel}%</span>
                                    <span className="text-slate-600">High</span>
                                </div>
                            </div>
                        </div>

                        {/* Focus Capacity */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Focus Capacity</h3>
                            <div className="flex gap-3">
                                {(['low', 'medium', 'high'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setConfig({ ...config, focusCapacity: level })}
                                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${config.focusCapacity === level
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preferences */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Preferences</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={config.preferences.includeBreaks}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            preferences: { ...config.preferences, includeBreaks: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-slate-700">Include breaks</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={config.preferences.includeMeals}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            preferences: { ...config.preferences, includeMeals: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-slate-700">Include meals</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={config.preferences.deepWorkPreferred}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            preferences: { ...config.preferences, deepWorkPreferred: e.target.checked }
                                        })}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-slate-700">Prioritize deep work blocks</span>
                                </label>
                            </div>
                        </div>

                        {/* Constraints */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Constraints</h3>
                            <textarea
                                value={config.constraints}
                                onChange={(e) => setConfig({ ...config, constraints: e.target.value })}
                                placeholder="e.g., Lunch from 12:00-13:00, Meeting at 15:00..."
                                className="input-field resize-none h-24"
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || tasks.length === 0}
                            className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating your perfect schedule...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate My Day
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
