// TypeScript types for Focus Modes
import { Task, TimeBlock, User, UserPreferences, Priority, EnergyLevel, FocusLevel, BlockType, Schedule, PlanningConfig, TaskAnalysis, WorkloadStatus } from './types';

export type FocusModeType = 'rain' | 'beach' | 'night' | 'custom';
export type AnimationType = 'rain' | 'waves' | 'stars' | 'none';

export interface FocusMode {
    id: string;
    name: string;
    type: FocusModeType;
    description: string;
    audioUrl: string;
    colors: {
        primary: string;
        secondary: string;
        gradient: string;
    };
    animation: AnimationType;
    icon: string;
}

export interface CustomFocusMode extends FocusMode {
    source: 'youtube' | 'spotify' | 'local';
    sourceUrl?: string;
    uploadedFile?: string;
    createdAt: string;
    userId: string;
}

export interface AudioPlayerState {
    isPlaying: boolean;
    volume: number;
    currentTime: number;
    duration: number;
}

export interface Shortcut {
    id: string;
    name: string;
    url: string;
    icon: string;
    category: 'research' | 'tools' | 'social' | 'productivity' | 'custom';
    isPinned: boolean;
    createdAt: string;
    userId: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    type?: 'text' | 'action';
    actionData?: any;
}

export interface ChatMemory {
    sessionId: string;
    messages: ChatMessage[];
    context: {
        currentTasks: Task[];
        currentSchedule: TimeBlock[];
        userPreferences: UserPreferences;
    };
}

// Re-export original types
export type {
    Task,
    TimeBlock,
    User,
    UserPreferences,
    Priority,
    EnergyLevel,
    FocusLevel,
    BlockType,
    Schedule,
    PlanningConfig,
    TaskAnalysis,
    WorkloadStatus,
};
