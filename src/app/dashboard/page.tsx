'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { storage } from '@/data/demo-data';
import Link from 'next/link';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [schedule, setSchedule] = useState<any>(null);

    useEffect(() => {
        const userData = storage.getUser();
        const scheduleData = storage.getSchedule();

        if (userData) setUser(userData);
        if (scheduleData) setSchedule(scheduleData);
    }, []);

    const stats = [
        { label: 'Tâches complétées', value: '12', icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
        { label: 'Heures focus', value: '24h', icon: Clock, color: 'from-blue-500 to-cyan-500' },
        { label: 'Streak', value: '7 jours', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
        { label: 'Productivité', value: '92%', icon: Zap, color: 'from-amber-500 to-orange-500' },
    ];

    return (
        <div className="min-h-screen p-8 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Header with glassmorphism */}
                <div className="mb-10 glass rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-bold gradient-text mb-2">
                                Bonjour, {user?.name || 'Utilisateur'} 👋
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <Link
                            href="/dashboard/generate"
                            className="btn-primary flex items-center gap-2 px-6 py-3 text-lg"
                        >
                            <Sparkles className="w-6 h-6" />
                            Générer mon planning
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="glass rounded-2xl p-6 card-hover shadow-lg animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <Link href="/dashboard/focus-modes" className="glass rounded-2xl p-6 card-hover shadow-lg group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🎧</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Focus Modes</h3>
                        <p className="text-gray-600 dark:text-gray-400">Environnements immersifs</p>
                    </Link>

                    <Link href="/dashboard/assistant" className="glass rounded-2xl p-6 card-hover shadow-lg group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🤖</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Assistant</h3>
                        <p className="text-gray-600 dark:text-gray-400">Chat intelligent</p>
                    </Link>

                    <Link href="/dashboard/shortcuts" className="glass rounded-2xl p-6 card-hover shadow-lg group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🔗</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Shortcuts</h3>
                        <p className="text-gray-600 dark:text-gray-400">Accès rapides</p>
                    </Link>
                </div>

                {/* Schedule Preview */}
                <div className="glass rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Planning Aujourd'hui
                            </h2>
                        </div>
                        <Link href="/dashboard/tasks" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Voir toutes les tâches →
                        </Link>
                    </div>

                    {schedule && schedule.blocks && schedule.blocks.length > 0 ? (
                        <div className="space-y-3">
                            {schedule.blocks.slice(0, 5).map((block: any, index: number) => (
                                <div key={index} className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/20 dark:hover:bg-black/30 transition-colors">
                                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400 min-w-[100px]">
                                        {block.startTime} - {block.endTime}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-white">{block.title || block.task?.title}</p>
                                        {block.task?.priority && (
                                            <span className={`text-xs px-2 py-1 rounded-full ${block.task.priority === 'high' ? 'bg-red-500/20 text-red-700 dark:text-red-300' :
                                                    block.task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' :
                                                        'bg-green-500/20 text-green-700 dark:text-green-300'
                                                }`}>
                                                {block.task.priority}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-10 h-10 text-white" />
                            </div>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                                Aucun planning généré pour aujourd'hui
                            </p>
                            <Link href="/dashboard/generate" className="btn-primary inline-flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Générer mon planning maintenant
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
