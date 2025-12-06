'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon, Plus, Pin, Trash2, X, Search } from 'lucide-react';
import { Shortcut } from '@/lib/types';
import { shortcutStorage } from '@/data/shortcuts';
import { storage } from '@/data/demo-data';

export default function ShortcutsPage() {
    const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        category: 'custom' as Shortcut['category'],
    });

    useEffect(() => {
        const userData = storage.getUser();
        if (userData) {
            setUser(userData);
            const userShortcuts = shortcutStorage.getShortcuts(userData.id);
            setShortcuts(userShortcuts);
        }
    }, []);

    const filteredShortcuts = shortcuts.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.url.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = () => {
        if (!user || !formData.name || !formData.url) return;

        const newShortcut: Shortcut = {
            id: Date.now().toString(),
            name: formData.name,
            url: formData.url,
            icon: shortcutStorage.getFavicon(formData.url),
            category: formData.category,
            isPinned: false,
            createdAt: new Date().toISOString(),
            userId: user.id,
        };

        shortcutStorage.addShortcut(user.id, newShortcut);
        setShortcuts(shortcutStorage.getShortcuts(user.id));
        setFormData({ name: '', url: '', category: 'custom' });
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (!user || !confirm('Supprimer ce raccourci ?')) return;
        shortcutStorage.deleteShortcut(user.id, id);
        setShortcuts(shortcutStorage.getShortcuts(user.id));
    };

    const handleTogglePin = (id: string) => {
        if (!user) return;
        shortcutStorage.togglePin(user.id, id);
        setShortcuts(shortcutStorage.getShortcuts(user.id));
    };

    return (
        <div className="p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <LinkIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Shortcuts</h1>
                            <p className="text-slate-600 dark:text-slate-400">Accès rapide à vos sites favoris</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Rechercher un raccourci..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>

                {/* Shortcuts Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredShortcuts.map((shortcut) => (
                        <a
                            key={shortcut.id}
                            href={shortcut.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-card hover:shadow-lg transition-all"
                        >
                            <img
                                src={shortcut.icon}
                                alt={shortcut.name}
                                className="w-12 h-12 mx-auto mb-3"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = shortcutStorage.getFavicon(shortcut.url);
                                }}
                            />
                            <p className="text-center font-semibold text-sm text-slate-900 dark:text-white truncate">
                                {shortcut.name}
                            </p>

                            {shortcut.isPinned && (
                                <Pin className="absolute top-2 right-2 w-4 h-4 text-blue-500 fill-current" />
                            )}

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleTogglePin(shortcut.id);
                                    }}
                                    className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                >
                                    <Pin className={`w-4 h-4 ${shortcut.isPinned ? 'fill-current text-blue-600' : 'text-slate-600'}`} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(shortcut.id);
                                    }}
                                    className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Empty state */}
                {filteredShortcuts.length === 0 && (
                    <div className="text-center py-12">
                        <LinkIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">
                            {search ? 'Aucun raccourci trouvé' : 'Aucun raccourci pour le moment'}
                        </p>
                    </div>
                )}

                {/* Add Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Nouveau Raccourci
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Nom *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="GitHub"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        URL *
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://github.com"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Catégorie
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Shortcut['category'] })}
                                        className="input-field"
                                    >
                                        <option value="research">Research</option>
                                        <option value="tools">Tools</option>
                                        <option value="social">Social</option>
                                        <option value="productivity">Productivity</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>

                                <button onClick={handleAdd} disabled={!formData.name || !formData.url} className="w-full btn-primary">
                                    Ajouter le Raccourci
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
