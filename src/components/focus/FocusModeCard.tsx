'use client';

import { useState } from 'react';
import { FocusMode } from '@/lib/types';
import AudioPlayer from './AudioPlayer';
import BackgroundAnimation from './BackgroundAnimation';
import { Check } from 'lucide-react';
import { getModeBackground, getModeName, getModeDescription } from '@/data/focus-modes';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

interface FocusModeCardProps {
    mode: FocusMode;
    isActive: boolean;
    onActivate: () => void;
}

export default function FocusModeCard({ mode, isActive, onActivate }: FocusModeCardProps) {
    const [showPlayer, setShowPlayer] = useState(false);
    const { t } = useLanguage();
    const backgroundImage = getModeBackground(mode.id);

    // Get translated name and description
    const displayName = getModeName(mode.id, t);
    const displayDescription = getModeDescription(mode.id, t);

    const handleActivate = () => {
        onActivate();
        setShowPlayer(true);
    };

    return (
        <div
            className={`relative overflow-hidden rounded-3xl transition-all duration-500 cursor-pointer ${isActive ? 'ring-4 ring-blue-500 shadow-2xl scale-105' : 'hover:scale-102 shadow-xl'
                }`}
            style={{ minHeight: '450px' }}
        >
            {/* Ultra-realistic background image */}
            {backgroundImage && (
                <div className="absolute inset-0 pointer-events-none">
                    <Image
                        src={backgroundImage}
                        alt={displayName}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30" />
                </div>
            )}

            {/* Gradient overlay (subtle) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mode.colors.gradient} opacity-40 mix-blend-overlay pointer-events-none`} />

            {/* Animation Layer */}
            {isActive && <BackgroundAnimation type={mode.animation} />}

            {/* Content with glassmorphism - INTERACTIVE */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between pointer-events-auto">
                {/* Header with glassmorphism */}
                <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-2xl p-5 border border-white/20 pointer-events-none">
                    <div className="text-6xl mb-3 drop-shadow-lg">{mode.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{displayName}</h3>
                    <p className="text-white/90 text-sm drop-shadow-md">{displayDescription}</p>
                </div>

                {/* Audio Player (shown when active) with glassmorphism */}
                {isActive && showPlayer ? (
                    <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-2xl p-4 border border-white/20">
                        <AudioPlayer
                            audioUrl={mode.audioUrl}
                            isActive={isActive}
                            onPlayStateChange={(playing) => {
                                if (!playing) setShowPlayer(false);
                            }}
                        />
                    </div>
                ) : (
                    <button
                        onClick={handleActivate}
                        className={`w-full py-4 rounded-2xl font-semibold transition-all backdrop-blur-xl border-2 relative z-20 ${isActive
                            ? 'bg-white/20 text-white border-white/50 shadow-lg'
                            : 'bg-white/90 dark:bg-black/50 text-slate-900 dark:text-white border-white/30 hover:bg-white hover:shadow-xl'
                            }`}
                    >
                        {isActive ? (
                            <span className="flex items-center justify-center gap-2">
                                <Check className="w-5 h-5" />
                                {t('active')}
                            </span>
                        ) : (
                            t('activate')
                        )}
                    </button>
                )}
            </div>

            {/* Subtle glow effect when active */}
            {isActive && (
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none" />
            )}
        </div>
    );
}
