'use client';

import { useState, useEffect } from 'react';
import { Headphones, Plus, X, Maximize2, Minimize2 } from 'lucide-react';
import { FocusMode } from '@/lib/types';
import { focusModes, focusModeStorage, getModeBackground } from '@/data/focus-modes';
import { storage } from '@/data/demo-data';
import FocusModeCard from '@/components/focus/FocusModeCard';
import FullscreenFocusMode from '@/components/focus/FullscreenFocusMode';
import { useLanguage } from '@/context/LanguageContext';

export default function FocusModesPage() {
    const { t } = useLanguage();
    const [activeModeId, setActiveModeId] = useState<string | null>(null);
    const [fullscreenMode, setFullscreenMode] = useState<FocusMode | null>(null);
    const [savedModes, setSavedModes] = useState<FocusMode[]>([]);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [fadeIn, setFadeIn] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        icon: '🎵',
    });

    useEffect(() => {
        const userData = storage.getUser();
        if (userData) {
            setUser(userData);
            const saved = focusModeStorage.getSavedModes(userData.id);
            setSavedModes(saved);
            const activeMode = focusModeStorage.getActiveFocusMode(userData.id);
            if (activeMode) setActiveModeId(activeMode.id);
        }

        setTimeout(() => setFadeIn(true), 100);
    }, []);

    const handleActivateMode = (mode: FocusMode) => {
        if (user) {
            setActiveModeId(mode.id);
            focusModeStorage.setActiveFocusMode(user.id, mode);
            setFullscreenMode(mode);
        }
    };

    const handleExitFullscreen = () => {
        setFullscreenMode(null);
        if (user) {
            focusModeStorage.setActiveFocusMode(user.id, null);
            setActiveModeId(null);
        }
    };

    const handleCreateCustomMode = () => {
        if (!user || !formData.name || !formData.url) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const newMode: FocusMode = {
            id: `custom-${Date.now()}`,
            name: formData.name,
            type: 'custom',
            description: 'Mode personnalisé créé par vous',
            audioUrl: formData.url,
            colors: {
                primary: '#8B5CF6',
                secondary: '#EC4899',
                gradient: 'from-violet-600 via-purple-600 to-pink-600',
            },
            animation: 'none',
            icon: formData.icon,
        };

        focusModeStorage.saveFocusMode(user.id, newMode);
        setSavedModes(focusModeStorage.getSavedModes(user.id));

        // Reset form
        setFormData({ name: '', url: '', icon: '🎵' });
        setShowCustomModal(false);

        alert(t('modeCreatedSuccess'));
    };

    // If in fullscreen mode, show immersive experience
    if (fullscreenMode) {
        return (
            <FullscreenFocusMode
                mode={fullscreenMode}
                onExit={handleExitFullscreen}
            />
        );
    }

    const allModes = [...focusModes, ...savedModes];

    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black p-8 transition-all duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 backdrop-blur-xl bg-white/5 dark:bg-white/5 rounded-3xl p-6 border border-white/10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Headphones className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                {t('focusModesTitle')}
                            </h1>
                            <p className="text-gray-300 dark:text-gray-400 mt-1">
                                {t('focusModesDesc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pre-configured Modes */}
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                        {t('integratedModes')}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {focusModes.map((mode) => (
                            <div key={mode.id} className="transform transition-transform duration-500">
                                <FocusModeCard
                                    mode={mode}
                                    isActive={activeModeId === mode.id}
                                    onActivate={() => handleActivateMode(mode)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom Modes */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                            <span className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></span>
                            {t('customModes')}
                        </h2>
                        <button
                            onClick={() => setShowCustomModal(true)}
                            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 backdrop-blur-xl bg-white/10 px-4 py-2 rounded-xl border border-white/20 transition-all hover:bg-white/20"
                        >
                            <Plus className="w-5 h-5" />
                            {t('createMode')}
                        </button>
                    </div>

                    {savedModes.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {savedModes.map((mode) => (
                                <FocusModeCard
                                    key={mode.id}
                                    mode={mode}
                                    isActive={activeModeId === mode.id}
                                    onActivate={() => handleActivateMode(mode)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl shadow-2xl p-10 text-center border border-white/20">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <Plus className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {t('createCustomMode')}
                            </h3>
                            <p className="text-gray-300 mb-8 max-w-md mx-auto">
                                {t('addCustomSounds')}
                            </p>
                            <button
                                onClick={() => setShowCustomModal(true)}
                                className="btn-primary bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-4 text-lg rounded-2xl shadow-xl transition-all hover:scale-105"
                            >
                                <Plus className="w-6 h-6 inline mr-2" />
                                {t('createMode')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showCustomModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-white">{t('createCustomMode')}</h3>
                                <button onClick={() => setShowCustomModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-7 h-7" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        {t('modeName')} *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Lo-Fi Hip Hop"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field bg-white/10 border-white/20 text-white placeholder-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        {t('audioUrl')} *
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/audio.mp3"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        className="input-field bg-white/10 border-white/20 text-white placeholder-gray-400"
                                    />
                                    <p className="text-xs text-gray-400 mt-2">
                                        💡 {t('useDirectMp3')}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        {t('iconEmoji')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="🎵"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        maxLength={2}
                                        className="input-field bg-white/10 border-white/20 text-white placeholder-gray-400 text-4xl text-center"
                                    />
                                </div>

                                <div className="text-sm text-blue-300 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                                    <strong>{t('audioExamples')} :</strong>
                                    <ul className="mt-2 space-y-1 text-xs">
                                        <li>• Mixkit: https://assets.mixkit.co/...</li>
                                        <li>• Archive.org: https://archive.org/download/...</li>
                                        <li>• Votre serveur: https://monsit e.com/audio.mp3</li>
                                    </ul>
                                </div>

                                <button
                                    onClick={handleCreateCustomMode}
                                    disabled={!formData.name || !formData.url}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 rounded-2xl transition-all hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ✨ {t('createMode')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
