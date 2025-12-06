// API Route: Generate AI Planning
import { NextRequest, NextResponse } from 'next/server';
import { PlanningEngine } from '@/lib/mcp/planning-engine';
import { PlanningConfig, Task } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tasks, config }: { tasks: Task[]; config: PlanningConfig } = body;

        if (!tasks || !Array.isArray(tasks)) {
            return NextResponse.json(
                { error: 'Tasks array is required' },
                { status: 400 }
            );
        }

        // Generate planning using AI engine
        const schedule = await PlanningEngine.generatePlanning(tasks, config);

        return NextResponse.json({
            success: true,
            schedule,
            analysis: PlanningEngine.analyzeTasks(tasks),
            workload: PlanningEngine.assessWorkload(tasks, config),
        });
    } catch (error) {
        console.error('Planning generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate planning' },
            { status: 500 }
        );
    }
}
