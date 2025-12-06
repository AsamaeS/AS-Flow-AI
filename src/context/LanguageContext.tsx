'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, languageStorage } from '@/data/i18n';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('fr');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = languageStorage.get();
        setLanguageState(stored);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        languageStorage.set(lang);
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    };

    // Don't render children until mounted to avoid hydration issues
    // But provide a default context value immediately for SSR
    if (!mounted) {
        // Return children wrapped in provider with default values for SSR
        const defaultContext: LanguageContextType = {
            language: 'fr',
            setLanguage: () => { },
            t: (key: string) => key,
        };

        return (
            <LanguageContext.Provider value={defaultContext}>
                {children}
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        // Instead of throwing, return default values for safety
        console.warn('useLanguage used outside LanguageProvider, returning defaults');
        return {
            language: 'fr' as Language,
            setLanguage: () => { },
            t: (key: string) => key,
        };
    }
    return context;
};
