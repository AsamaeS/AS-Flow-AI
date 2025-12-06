'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Save } from 'lucide-react';
import { storage } from '@/data/demo-data';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [settings, setSettings] = useState({
        morningPerson: true,
        peakHoursStart: '09:00',
        peakHoursEnd: '12:00',
        defaultTaskDuration: 1,
        breakDuration: 15,
    });

    useEffect(() => {
        const userData = storage.getUser();
        if (userData) {
            setUser(userData);
            setSettings({
                morningPerson: userData.preferences.morningPerson,
                peakHoursStart: userData.preferences.peakHoursStart,
                peakHoursEnd: userData.preferences.peakHoursEnd,
                defaultTaskDuration: userData.preferences.defaultTaskDuration,
                breakDuration: userData.preferences.breakDuration,
            });
        }
    }, []);

    const handleSave = () => {
        if (!user) return;

        const updatedUser = {
            ...user,
            preferences: {
                ...user.preferences,
                ...settings,
                theme,
            },
        };

        storage.setUser(updatedUser);
        setUser(updatedUser);
        alert('Settings saved successfully!');
    };

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
                    <p className="text-slate-600 dark:text-slate-400">Customize your FocusFlow experience</p>
                </div>

                <div className="space-y-6">
                    {/* Appearance */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Appearance</h2>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <div className="flex items-center gap-3">
                                {theme === 'dark' ? (
                                    <Moon className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <Sun className="w-5 h-5 text-yellow-600" />
                                )}
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">Theme</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative w-14 h-8 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${theme === 'dark' ? 'transform translate-x-6' : ''
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Productivity Preferences */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Productivity Preferences</h2>

                        <div className="space-y-6">
                            {/* Morning/Night Person */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                    I'm a...
                                </label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setSettings({ ...settings, morningPerson: true })}
                                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${settings.morningPerson
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        <Sun className={`w-6 h-6 mx-auto mb-2 ${settings.morningPerson ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <p className="font-semibold text-slate-900 dark:text-white">Morning Person</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Most productive in AM</p>
                                    </button>
                                    <button
                                        onClick={() => setSettings({ ...settings, morningPerson: false })}
                                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${!settings.morningPerson
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        <Moon className={`w-6 h-6 mx-auto mb-2 ${!settings.morningPerson ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <p className="font-semibold text-slate-900 dark:text-white">Evening Person</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Most productive in PM</p>
                                    </button>
                                </div>
                            </div>

                            {/* Peak Hours */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                    Peak Productivity Hours
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Start</label>
                                        <input
                                            type="time"
                                            value={settings.peakHoursStart}
                                            onChange={(e) => setSettings({ ...settings, peakHoursStart: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">End</label>
                                        <input
                                            type="time"
                                            value={settings.peakHoursEnd}
                                            onChange={(e) => setSettings({ ...settings, peakHoursEnd: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Default Settings */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Default Task Duration (hours)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0.5"
                                        value={settings.defaultTaskDuration}
                                        onChange={(e) => setSettings({ ...settings, defaultTaskDuration: parseFloat(e.target.value) })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Break Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        step="5"
                                        min="5"
                                        value={settings.breakDuration}
                                        onChange={(e) => setSettings({ ...settings, breakDuration: parseInt(e.target.value) })}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Account</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={user?.name || ''}
                                    disabled
                                    className="input-field bg-slate-50 dark:bg-slate-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="input-field bg-slate-50 dark:bg-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Save className="w-5 h-5" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Language Selector */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Langue / Language
                </label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="input-field w-full"
                >
                    <option value="fr">🇫🇷 Français</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="es">🇪🇸 Español</option>
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Changera la langue de l'interface
                </p>
            </div>
        </div>
    );
}
