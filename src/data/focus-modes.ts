// Focus Modes Data - Ultra-realistic backgrounds with HD audio
import { FocusMode } from '@/lib/types';

export const focusModes: FocusMode[] = [
    {
        id: 'rain',
        name: 'rain',
        type: 'rain',
        description: 'rainDesc',
        audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3',
        colors: {
            primary: '#1E3A8A',
            secondary: '#475569',
            gradient: 'from-slate-900 via-slate-800 to-blue-900',
        },
        animation: 'rain',
        icon: '🌧️',
    },
    {
        id: 'beach',
        name: 'beach',
        type: 'beach',
        description: 'beachDesc',
        audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3',
        colors: {
            primary: '#F59E0B',
            secondary: '#06B6D4',
            gradient: 'from-cyan-500 via-blue-400 to-amber-300',
        },
        animation: 'waves',
        icon: '🏖️',
    },
    {
        id: 'fire',
        name: 'fire',
        type: 'custom',
        description: 'fireDesc',
        audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3',
        colors: {
            primary: '#EA580C',
            secondary: '#DC2626',
            gradient: 'from-orange-600 via-red-600 to-yellow-600',
        },
        animation: 'none',
        icon: '🔥',
    },
    {
        id: 'night',
        name: 'night',
        type: 'night',
        description: 'nightDesc',
        audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2483/2483-preview.mp3',
        colors: {
            primary: '#000000',
            secondary: '#1A1A1A',
            gradient: 'from-black via-slate-950 to-black',
        },
        animation: 'stars',
        icon: '🌙',
    },
];

// Storage helpers for focus modes
export const focusModeStorage = {
    getSavedModes: (userId: string) => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(`focusflow_saved_modes_${userId}`);
        return data ? JSON.parse(data) : [];
    },

    saveFocusMode: (userId: string, mode: FocusMode) => {
        if (typeof window === 'undefined') return;
        const saved = focusModeStorage.getSavedModes(userId);
        localStorage.setItem(
            `focusflow_saved_modes_${userId}`,
            JSON.stringify([...saved, mode])
        );
    },

    deleteFocusMode: (userId: string, modeId: string) => {
        if (typeof window === 'undefined') return;
        const saved = focusModeStorage.getSavedModes(userId);
        const filtered = saved.filter((m: FocusMode) => m.id !== modeId);
        localStorage.setItem(`focusflow_saved_modes_${userId}`, JSON.stringify(filtered));
    },

    getActiveFocusMode: (userId: string) => {
        if (typeof window === 'undefined') return null;
        const data = localStorage.getItem(`focusflow_active_mode_${userId}`);
        return data ? JSON.parse(data) : null;
    },

    setActiveFocusMode: (userId: string, mode: FocusMode | null) => {
        if (typeof window === 'undefined') return;
        if (mode) {
            localStorage.setItem(`focusflow_active_mode_${userId}`, JSON.stringify(mode));
        } else {
            localStorage.removeItem(`focusflow_active_mode_${userId}`);
        }
    },
};

// Get background image path for each mode
export const getModeBackground = (modeId: string): string => {
    const backgrounds: Record<string, string> = {
        rain: '/backgrounds/rain.png',
        beach: '/backgrounds/beach.png',
        fire: '/backgrounds/fire.png',
        night: '/backgrounds/night.png',
    };
    return backgrounds[modeId] || '';
};

// Get translated mode name
export const getModeName = (modeId: string, t: (key: string) => string): string => {
    const mode = focusModes.find(m => m.id === modeId);
    return mode ? t(mode.name) : modeId;
};

// Get translated mode description
export const getModeDescription = (modeId: string, t: (key: string) => string): string => {
    const mode = focusModes.find(m => m.id === modeId);
    return mode ? t(mode.description) : '';
};
