// Default shortcuts data
import { Shortcut } from '@/lib/types';

export const defaultShortcuts: Shortcut[] = [
    {
        id: '1',
        name: 'Google Scholar',
        url: 'https://scholar.google.com',
        icon: 'https://scholar.google.com/favicon.ico',
        category: 'research',
        isPinned: true,
        createdAt: new Date().toISOString(),
        userId: 'demo-user-1',
    },
    {
        id: '2',
        name: 'GitHub',
        url: 'https://github.com',
        icon: 'https://github.com/favicon.ico',
        category: 'tools',
        isPinned: true,
        createdAt: new Date().toISOString(),
        userId: 'demo-user-1',
    },
    {
        id: '3',
        name: 'Notion',
        url: 'https://notion.so',
        icon: 'https://notion.so/images/favicon.ico',
        category: 'productivity',
        isPinned: false,
        createdAt: new Date().toISOString(),
        userId: 'demo-user-1',
    },
    {
        id: '4',
        name: 'ChatGPT',
        url: 'https://chat.openai.com',
        icon: 'https://chat.openai.com/favicon.ico',
        category: 'tools',
        isPinned: true,
        createdAt: new Date().toISOString(),
        userId: 'demo-user-1',
    },
    {
        id: '5',
        name: 'Google Drive',
        url: 'https://drive.google.com',
        icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
        category: 'productivity',
        isPinned: false,
        createdAt: new Date().toISOString(),
        userId: 'demo-user-1',
    },
];

export const shortcutStorage = {
    getShortcuts: (userId: string): Shortcut[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(`focusflow_shortcuts_${userId}`);
        if (!data) {
            // Initialize with defaults
            shortcutStorage.setShortcuts(userId, defaultShortcuts);
            return defaultShortcuts;
        }
        return JSON.parse(data);
    },

    setShortcuts: (userId: string, shortcuts: Shortcut[]) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(`focusflow_shortcuts_${userId}`, JSON.stringify(shortcuts));
    },

    addShortcut: (userId: string, shortcut: Shortcut) => {
        const shortcuts = shortcutStorage.getShortcuts(userId);
        shortcuts.push(shortcut);
        shortcutStorage.setShortcuts(userId, shortcuts);
    },

    deleteShortcut: (userId: string, shortcutId: string) => {
        const shortcuts = shortcutStorage.getShortcuts(userId);
        const filtered = shortcuts.filter(s => s.id !== shortcutId);
        shortcutStorage.setShortcuts(userId, filtered);
    },

    togglePin: (userId: string, shortcutId: string) => {
        const shortcuts = shortcutStorage.getShortcuts(userId);
        const updated = shortcuts.map(s =>
            s.id === shortcutId ? { ...s, isPinned: !s.isPinned } : s
        );
        shortcutStorage.setShortcuts(userId, updated);
    },

    getFavicon: (url: string): string => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch {
            return '/default-icon.svg';
        }
    },
};
