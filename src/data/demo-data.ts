// Demo Data for FocusFlow AI v2
import { User, Task } from '../lib/types';

export const demoUser: User = {
    id: 'demo-user-1',
    email: 'asmae@focusflow.ai',
    name: 'Asmae',
    preferences: {
        morningPerson: true,
        peakHoursStart: '09:00',
        peakHoursEnd: '12:00',
        defaultTaskDuration: 1,
        breakDuration: 15,
        theme: 'light',
    },
};

export const demoTasks: Task[] = [
    {
        id: '1',
        userId: 'demo-user-1',
        title: 'Préparer présentation client',
        priority: 'high',
        estimatedTime: 2,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        energyRequired: 'high',
        focusLevel: 'deep',
        notes: 'Slides + démo produit',
        completed: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        userId: 'demo-user-1',
        title: 'Code review équipe',
        priority: 'high',
        estimatedTime: 1.5,
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        energyRequired: 'high',
        focusLevel: 'deep',
        notes: 'Review 5 PR en attente',
        completed: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        userId: 'demo-user-1',
        title: 'Réunion planning sprint',
        priority: 'medium',
        estimatedTime: 1,
        energyRequired: 'medium',
        focusLevel: 'medium',
        notes: 'Sprint planning Q1',
        completed: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: '4',
        userId: 'demo-user-1',
        title: 'Répondre aux emails',
        priority: 'low',
        estimatedTime: 0.5,
        energyRequired: 'low',
        focusLevel: 'light',
        notes: 'Trier inbox',
        completed: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: '5',
        userId: 'demo-user-1',
        title: 'Documentation API',
        priority: 'medium',
        estimatedTime: 1.5,
        energyRequired: 'medium',
        focusLevel: 'medium',
        notes: 'Mettre à jour endpoints',
        completed: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: '6',
        userId: 'demo-user-1',
        title: 'Call avec designer',
        priority: 'medium',
        estimatedTime: 0.5,
        energyRequired: 'medium',
        focusLevel: 'light',
        notes: 'Review UI mockups',
        completed: false,
        createdAt: new Date().toISOString(),
    },
];

// Initialize demo data in localStorage
export function initializeDemoData() {
    if (typeof window === 'undefined') return;

    const existingUser = localStorage.getItem('focusflow_user');
    if (!existingUser) {
        localStorage.setItem('focusflow_user', JSON.stringify(demoUser));
        localStorage.setItem(`focusflow_tasks_${demoUser.id}`, JSON.stringify(demoTasks));
    }
}

// Storage helpers
export const storage = {
    getUser: (): User | null => {
        if (typeof window === 'undefined') return null;
        const data = localStorage.getItem('focusflow_user');
        return data ? JSON.parse(data) : null;
    },

    setUser: (user: User) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('focusflow_user', JSON.stringify(user));
    },

    getTasks: (userId: string): Task[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(`focusflow_tasks_${userId}`);
        return data ? JSON.parse(data) : [];
    },

    setTasks: (userId: string, tasks: Task[]) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(`focusflow_tasks_${userId}`, JSON.stringify(tasks));
    },

    getSchedule: (userId: string, date: string) => {
        if (typeof window === 'undefined') return null;
        const data = localStorage.getItem(`focusflow_schedule_${userId}_${date}`);
        return data ? JSON.parse(data) : null;
    },

    setSchedule: (userId: string, date: string, schedule: any) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(`focusflow_schedule_${userId}_${date}`, JSON.stringify(schedule));
    },
};
