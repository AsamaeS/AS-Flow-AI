'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListTodo, Sparkles, Settings, LogOut, Headphones, Bot, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Sidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const navigation = [
        { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
        { name: t('aiGenerate'), href: '/dashboard/generate', icon: Sparkles },
        { name: t('tasks'), href: '/dashboard/tasks', icon: ListTodo },
        { name: t('focusModes'), href: '/dashboard/focus-modes', icon: Headphones },
        { name: t('aiAssistant'), href: '/dashboard/assistant', icon: Bot },
        { name: t('shortcuts'), href: '/dashboard/shortcuts', icon: LinkIcon },
        { name: t('settings'), href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 min-h-screen p-4 transition-colors">
            {/* Logo */}
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">AS-Flow</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                sidebar-item
                ${isActive ? 'sidebar-item-active' : ''}
              `}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-4 left-4 right-4">
                <Link
                    href="/login"
                    className="sidebar-item text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <LogOut className="w-5 h-5" />
                    <span>{t('logout')}</span>
                </Link>
            </div>
        </div>
    );
}
