'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
    audioUrl: string;
    isActive: boolean;
    onPlayStateChange?: (isPlaying: boolean) => void;
}

export default function AudioPlayer({ audioUrl, isActive, onPlayStateChange }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(60);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
            audioRef.current.loop = true;
        }
    }, [volume]);

    useEffect(() => {
        if (!isActive && isPlaying) {
            handlePause();
        }
    }, [isActive]);

    const handlePlay = () => {
        audioRef.current?.play();
        setIsPlaying(true);
        onPlayStateChange?.(true);
    };

    const handlePause = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
        onPlayStateChange?.(false);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            handlePause();
        } else {
            handlePlay();
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
        <div className="flex items-center gap-4">
            <audio ref={audioRef} src={audioUrl} />

            {/* Play/Pause Button - Premium style */}
            <button
                onClick={togglePlayPause}
                className="w-14 h-14 rounded-full bg-white/30 hover:bg-white/40 backdrop-blur-md transition-all duration-300 flex items-center justify-center border-2 border-white/40 shadow-lg hover:scale-110"
            >
                {isPlaying ? (
                    <Pause className="w-7 h-7 text-white drop-shadow-lg" />
                ) : (
                    <Play className="w-7 h-7 text-white ml-1 drop-shadow-lg" />
                )}
            </button>

            {/* Volume Control - Glassmorphism */}
            <div className="flex items-center gap-3 flex-1">
                <button
                    onClick={toggleMute}
                    className="text-white/90 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                    {isMuted || volume === 0 ? (
                        <VolumeX className="w-6 h-6 drop-shadow-md" />
                    ) : (
                        <Volume2 className="w-6 h-6 drop-shadow-md" />
                    )}
                </button>

                <div className="flex-1 relative">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none bg-white/20 backdrop-blur-sm cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-125
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:shadow-lg"
                    />
                </div>

                <span className="text-white/90 text-sm min-w-[3ch] text-right font-semibold drop-shadow-md">
                    {volume}%
                </span>
            </div>
        </div>
    );
}
