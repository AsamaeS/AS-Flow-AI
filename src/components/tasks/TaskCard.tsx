'use client';

import { Task } from '@/lib/types';
import { Clock, Calendar, Trash2, Edit } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    onEdit?: () => void;
    onDelete?: () => void;
    onToggle?: () => void;
}

const priorityColors = {
    high: 'border-l-4 border-red-500',
    medium: 'border-l-4 border-yellow-500',
    low: 'border-l-4 border-green-500',
};

const energyIcons = {
    high: '🔥',
    medium: '⚡',
    low: '💤',
};

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
    return (
        <div className={`bg-white rounded-lg shadow-card p-4 card-hover ${priorityColors[task.priority]}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={onToggle}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                        <h3 className={`font-semibold text-slate-900 ${task.completed ? 'line-through opacity-50' : ''}`}>
                            {task.title}
                        </h3>
                        {task.notes && (
                            <p className="text-sm text-slate-600 mt-1">{task.notes}</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    {onEdit && (
                        <button onClick={onEdit} className="text-slate-400 hover:text-blue-600 transition-colors">
                            <Edit className="w-4 h-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button onClick={onDelete} className="text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{task.estimatedTime}h</span>
                </div>

                <div className="flex items-center gap-1">
                    <span>{energyIcons[task.energyRequired]}</span>
                    <span className="capitalize">{task.energyRequired}</span>
                </div>

                {task.deadline && (
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(task.deadline).toLocaleDateString('fr-FR')}</span>
                    </div>
                )}

                <span className={`
          px-2 py-0.5 rounded-full text-xs font-medium ml-auto
          ${task.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
          ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
          ${task.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
        `}>
                    {task.priority.toUpperCase()}
                </span>
            </div>
        </div>
    );
}
