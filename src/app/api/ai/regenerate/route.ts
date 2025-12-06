// API Route: Regenerate Planning
import { NextRequest, NextResponse } from 'next/server';
import { regeneratePlanning } from '@/lib/mcp/planning-engine';
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

        // Regenerate planning with variations
        const schedule = await regeneratePlanning(tasks, config);

        return NextResponse.json({
            success: true,
            schedule,
        });
    } catch (error) {
        console.error('Planning regeneration error:', error);
        return NextResponse.json(
            { error: 'Failed to regenerate planning' },
            { status: 500 }
        );
    }
}
