'use client';

import { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { FocusMode } from '@/lib/types';
import { getModeBackground, getModeName, getModeDescription } from '@/data/focus-modes';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import BackgroundAnimation from './BackgroundAnimation';

interface FullscreenFocusModeProps {
    mode: FocusMode;
    onExit: () => void;
}

export default function FullscreenFocusMode({ mode, onExit }: FullscreenFocusModeProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(60);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLanguage();
    const backgroundImage = getModeBackground(mode.id);

    // Get translated texts
    const displayName = getModeName(mode.id, t);
    const displayDescription = getModeDescription(mode.id, t);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
            audioRef.current.loop = true;

            audioRef.current.onerror = (e) => {
                console.error('Audio error:', e);
                setError(t('audioLoadError'));
                setIsPlaying(false);
            };

            audioRef.current.oncanplaythrough = () => {
                setError(null);
            };
        }
    }, [volume, t]);

    useEffect(() => {
        const playAudio = () => {
            if (audioRef.current) {
                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                            setError(null);
                        })
                        .catch((error) => {
                            console.error('Autoplay failed:', error);
                            setError(t('clickPlayToStart'));
                            setIsPlaying(false);
                        });
                }
            }
        };

        const timer = setTimeout(playAudio, 500);

        return () => {
            clearTimeout(timer);
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [t]);

    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        setError(null);
                    })
                    .catch((err) => {
                        console.error('Play error:', err);
                        setError(t('audioLoadError'));
                    });
            }
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
            if (audioRef.current) audioRef.current.muted = false;
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
            {/* Ultra-realistic background */}
            {backgroundImage && (
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImage}
                        alt={displayName}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            )}

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mode.colors.gradient} opacity-30 mix-blend-overlay`} />

            {/* Animation overlay */}
            <div className="absolute inset-0">
                <BackgroundAnimation type={mode.animation} />
            </div>

            {/* Audio element with crossOrigin */}
            <audio ref={audioRef} src={mode.audioUrl} crossOrigin="anonymous" />

            {/* Top bar with glassmorphism */}
            <div className="absolute top-0 left-0 right-0 p-6 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-2xl bg-black/20 rounded-3xl p-6 border border-white/20 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="text-6xl drop-shadow-2xl">{mode.icon}</div>
                        <div>
                            <h1 className="text-4xl font-bold text-white drop-shadow-2xl mb-1">
                                {displayName}
                            </h1>
                            <p className="text-white/90 drop-shadow-lg text-lg">
                                {displayDescription}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onExit}
                        className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white/40 flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                        title={t('exit')}
                    >
                        <X className="w-7 h-7 text-white drop-shadow-lg" />
                    </button>
                </div>
            </div>

            {/* Center content - Minimal UI */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center animate-slide-up">
                    <div className="backdrop-blur-2xl bg-white/10 dark:bg-black/30 rounded-full p-8 border-2 border-white/30 shadow-2xl mb-8 inline-block">
                        <button
                            onClick={togglePlayPause}
                            className="w-24 h-24 rounded-full bg-white/30 hover:bg-white/40 backdrop-blur-md transition-all duration-300 flex items-center justify-center border-4 border-white/50 shadow-2xl hover:scale-110"
                            title={isPlaying ? t('pause') : t('play')}
                        >
                            {isPlaying ? (
                                <Pause className="w-12 h-12 text-white drop-shadow-2xl" />
                            ) : (
                                <Play className="w-12 h-12 text-white ml-2 drop-shadow-2xl" />
                            )}
                        </button>
                    </div>

                    {error ? (
                        <p className="text-red-400 text-xl font-medium drop-shadow-xl bg-black/40 px-6 py-3 rounded-full">
                            {error}
                        </p>
                    ) : (
                        <p className="text-white/80 text-2xl font-light drop-shadow-xl">
                            {t('breatheAndFocus')}
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="max-w-2xl mx-auto backdrop-blur-2xl bg-black/20 rounded-3xl p-6 border border-white/20 shadow-2xl">
                    <div className="flex items-center gap-6">
                        {/* Volume icon */}
                        <button
                            onClick={toggleMute}
                            className="text-white/90 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-xl"
                            title={t('volume')}
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX className="w-7 h-7 drop-shadow-lg" />
                            ) : (
                                <Volume2 className="w-7 h-7 drop-shadow-lg" />
                            )}
                        </button>

                        {/* Volume slider */}
                        <div className="flex-1 relative">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                className="w-full h-3 rounded-full appearance-none bg-white/20 backdrop-blur-sm cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-2xl
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-125
                  [&::-moz-range-thumb]:w-6
                  [&::-moz-range-thumb]:h-6
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:shadow-2xl"
                            />
                        </div>

                        {/* Volume percentage */}
                        <span className="text-white/90 text-lg min-w-[4ch] text-right font-bold drop-shadow-lg">
                            {volume}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Subtle breathing animation overlay */}
            <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
        </div>
    );
}
