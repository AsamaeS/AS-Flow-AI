// Enhanced AI Planning Engine with Transition Management
import { Task, TimeBlock, PlanningConfig, TaskAnalysis, WorkloadStatus, Priority, EnergyLevel } from '../types';

export class PlanningEngine {
    /**
     * Main planning generation function
     */
    static async generatePlanning(tasks: Task[], config: PlanningConfig): Promise<TimeBlock[]> {
        // 1. Analyze tasks
        const analysis = this.analyzeTasks(tasks);

        // 2. Check workload
        const workload = this.assessWorkload(tasks, config);

        // 3. Sort tasks by priority and deadline
        const sortedTasks = this.sortTasks(tasks);

        // 4. Allocate time blocks
        let blocks = this.allocateTimeBlocks(sortedTasks, config);

        // 5. Optimize by energy
        blocks = this.optimizeByEnergy(blocks, config.energyLevel);

        // 6. Insert transitions (breaks, meals)
        blocks = this.insertTransitions(blocks, config.preferences);

        // 7. Balance workload
        blocks = this.balanceWorkload(blocks);

        return blocks;
    }

    /**
     * Analyze tasks to understand complexity and requirements
     */
    static analyzeTasks(tasks: Task[]): TaskAnalysis {
        const totalTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
        const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
        const deepWorkRequired = tasks.filter(t => t.focusLevel === 'deep').length;

        const complexity: 'low' | 'medium' | 'high' =
            totalTime > 8 ? 'high' :
                totalTime > 5 ? 'medium' : 'low';

        return {
            totalTime,
            highPriorityCount,
            deepWorkRequired,
            complexity
        };
    }

    /**
     * Assess if workload is balanced
     */
    static assessWorkload(tasks: Task[], config: PlanningConfig): WorkloadStatus {
        const [startH, startM] = config.startTime.split(':').map(Number);
        const [endH, endM] = config.endTime.split(':').map(Number);
        const availableMinutes = (endH * 60 + endM) - (startH * 60 + startM);
        const availableHours = availableMinutes / 60;

        const totalTaskTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
        const utilizationRate = totalTaskTime / availableHours;

        let status: 'balanced' | 'heavy' | 'light' | 'overloaded';
        let recommendation: string;

        if (utilizationRate > 1.2) {
            status = 'overloaded';
            recommendation = 'Trop de tâches pour le temps disponible. Reprogrammer certaines tâches.';
        } else if (utilizationRate > 0.85) {
            status = 'heavy';
            recommendation = 'Journée chargée. Prévoir des pauses supplémentaires.';
        } else if (utilizationRate < 0.5) {
            status = 'light';
            recommendation = 'Bonne capacité. Vous pouvez ajouter des tâches non urgentes.';
        } else {
            status = 'balanced';
            recommendation = 'Charge de travail équilibrée.';
        }

        return { status, utilizationRate, recommendation };
    }

    /**
     * Sort tasks by priority and deadline
     */
    static sortTasks(tasks: Task[]): Task[] {
        const priorityWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

        return [...tasks].sort((a, b) => {
            // Priority first
            const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
            if (priorityDiff !== 0) return priorityDiff;

            // Then deadline
            if (a.deadline && b.deadline) {
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            }
            if (a.deadline) return -1;
            if (b.deadline) return 1;

            return 0;
        });
    }

    /**
     * Allocate time blocks for tasks
     */
    static allocateTimeBlocks(tasks: Task[], config: PlanningConfig): TimeBlock[] {
        const blocks: TimeBlock[] = [];
        const [startH, startM] = config.startTime.split(':').map(Number);
        let currentMinutes = startH * 60 + startM;

        const [endH, endM] = config.endTime.split(':').map(Number);
        const endMinutes = endH * 60 + endM;

        for (const task of tasks) {
            const taskDuration = task.estimatedTime * 60; // Convert to minutes

            if (currentMinutes + taskDuration > endMinutes) {
                break; // No more time available
            }

            const block: TimeBlock = {
                id: `block-${blocks.length + 1}`,
                start: this.minutesToTime(currentMinutes),
                end: this.minutesToTime(currentMinutes + taskDuration),
                type: task.focusLevel === 'deep' ? 'deep-work' : 'task',
                task,
                title: task.title,
                priority: task.priority,
                energy: task.energyRequired,
                notes: task.notes,
                duration: taskDuration,
            };

            blocks.push(block);
            currentMinutes += taskDuration;
        }

        return blocks;
    }

    /**
     * Optimize schedule based on user's energy level
     */
    static optimizeByEnergy(blocks: TimeBlock[], userEnergyLevel: number): TimeBlock[] {
        const energyCurve = this.generateEnergyCurve(userEnergyLevel);

        // High energy tasks should be scheduled when user energy is high
        const highEnergyBlocks = blocks.filter(b => b.energy === 'high');
        const mediumEnergyBlocks = blocks.filter(b => b.energy === 'medium');
        const lowEnergyBlocks = blocks.filter(b => b.energy === 'low');

        // Reorder based on energy curve (morning high energy users get high-energy tasks first)
        const optimized: TimeBlock[] = [];

        if (userEnergyLevel > 60) {
            // Morning person - high energy tasks first
            optimized.push(...highEnergyBlocks);
            optimized.push(...mediumEnergyBlocks);
            optimized.push(...lowEnergyBlocks);
        } else {
            // Afternoon/evening person - ramp up
            optimized.push(...lowEnergyBlocks);
            optimized.push(...mediumEnergyBlocks);
            optimized.push(...highEnergyBlocks);
        }

        // Reassign times
        const [firstBlock] = blocks;
        if (!firstBlock) return [];

        let currentMinutes = this.timeToMinutes(firstBlock.start);

        return optimized.map(block => ({
            ...block,
            start: this.minutesToTime(currentMinutes),
            end: this.minutesToTime(currentMinutes + (block.duration || 60)),
        })).map((block, index) => {
            currentMinutes = this.timeToMinutes(block.end);
            return block;
        });
    }

    /**
     * Insert breaks, meals, and transitions
     */
    static insertTransitions(blocks: TimeBlock[], preferences: PlanningConfig['preferences']): TimeBlock[] {
        const withTransitions: TimeBlock[] = [];

        for (let i = 0; i < blocks.length; i++) {
            const currentBlock = blocks[i];
            const nextBlock = blocks[i + 1];

            withTransitions.push(currentBlock);

            if (!nextBlock) continue;

            const currentEnd = this.timeToMinutes(currentBlock.end);
            const nextStart = this.timeToMinutes(nextBlock.start);

            // Add break after deep work (15 min)
            if (currentBlock.type === 'deep-work' && preferences.includeBreaks) {
                withTransitions.push({
                    id: `break-${i}`,
                    start: this.minutesToTime(currentEnd),
                    end: this.minutesToTime(currentEnd + 15),
                    type: 'break',
                    title: 'Pause (Deep Work Recovery)',
                    energy: 'low',
                    duration: 15,
                });
            }

            // Add lunch if time is around 12:00-14:00
            const currentHour = Math.floor(currentEnd / 60);
            if (currentHour >= 12 && currentHour <= 14 && preferences.includeMeals) {
                const lunchStart = 12 * 60; // 12:00
                if (currentEnd <= lunchStart && nextStart > lunchStart) {
                    withTransitions.push({
                        id: `meal-${i}`,
                        start: '12:00',
                        end: '13:00',
                        type: 'meal',
                        title: 'Déjeuner',
                        energy: 'low',
                        duration: 60,
                    });
                }
            }

            // Add buffer between meetings/calls (5 min)
            if ((currentBlock.type === 'call' || currentBlock.type === 'meeting') && nextBlock.type === 'deep-work') {
                withTransitions.push({
                    id: `buffer-${i}`,
                    start: this.minutesToTime(currentEnd),
                    end: this.minutesToTime(currentEnd + 5),
                    type: 'break',
                    title: 'Transition',
                    energy: 'low',
                    duration: 5,
                });
            }
        }

        return withTransitions;
    }

    /**
     * Balance workload to avoid overload
     */
    static balanceWorkload(blocks: TimeBlock[]): TimeBlock[] {
        // Simple balancing: ensure no more than 2 hours of continuous deep work
        const balanced: TimeBlock[] = [];
        let continuousDeepWork = 0;

        for (const block of blocks) {
            if (block.type === 'deep-work') {
                continuousDeepWork += block.duration || 0;

                if (continuousDeepWork > 120) { // 2 hours
                    // Force a break
                    balanced.push({
                        id: `forced-break-${balanced.length}`,
                        start: block.start,
                        end: this.minutesToTime(this.timeToMinutes(block.start) + 10),
                        type: 'break',
                        title: 'Pause nécessaire',
                        energy: 'low',
                        duration: 10,
                    });
                    continuousDeepWork = 0;
                }
            } else if (block.type === 'break') {
                continuousDeepWork = 0;
            }

            balanced.push(block);
        }

        return balanced;
    }

    /**
     * Generate energy curve based on user's baseline
     */
    static generateEnergyCurve(baseEnergy: number): number[] {
        const curve: number[] = [];

        for (let hour = 8; hour <= 18; hour++) {
            let energy = baseEnergy;

            // Morning boost (9-11)
            if (hour >= 9 && hour <= 11) energy += 15;

            // Post-lunch dip (13-14)
            if (hour >= 13 && hour <= 14) energy -= 20;

            // Afternoon recovery (15-17)
            if (hour >= 15 && hour <= 17) energy += 10;

            // Late decline (after 17)
            if (hour > 17) energy -= 15;

            curve.push(Math.max(0, Math.min(100, energy)));
        }

        return curve;
    }

    /**
     * Helper: Convert minutes to HH:MM
     */
    static minutesToTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    /**
     * Helper: Convert HH:MM to minutes
     */
    static timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
}

/**
 * Regenerate planning with variations
 */
export async function regeneratePlanning(
    tasks: Task[],
    config: PlanningConfig
): Promise<TimeBlock[]> {
    // Add slight randomization for variety
    const modifiedConfig = {
        ...config,
        energyLevel: Math.max(0, Math.min(100, config.energyLevel + (Math.random() * 20 - 10))),
    };

    return PlanningEngine.generatePlanning(tasks, modifiedConfig);
}
