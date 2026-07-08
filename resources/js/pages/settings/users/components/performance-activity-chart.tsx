import { useId } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { EmptyCollectionState } from '@/components/empty-collection-state';
import type { ChartConfig } from '@/components/ui/chart';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

interface PerformanceActivityChartProps {
    points: Array<{
        label: string;
        correctivos: number;
        preventivos: number;
        total: number;
    }>;
}

const chartConfig = {
    correctivos: {
        label: 'Correctivos',
        color: '#ef4444',
    },
    preventivos: {
        label: 'Preventivos',
        color: '#2563eb',
    },
} satisfies ChartConfig;

export function PerformanceActivityChart({
    points,
}: PerformanceActivityChartProps) {
    const correctivosGradientId = useId();
    const preventivosGradientId = useId();
    const hasActivity = points.some((point) => point.total > 0);

    if (!hasActivity) {
        return (
            <EmptyCollectionState
                message="Sin actividad en el período"
                description="No se registraron tickets correctivos ni preventivos para los filtros seleccionados."
            />
        );
    }

    return (
        <div className="space-y-4">
            <ChartContainer config={chartConfig} className="h-80 w-full">
                <AreaChart
                    accessibilityLayer
                    data={points}
                    margin={{ top: 12, right: 12, left: -12, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id={correctivosGradientId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="var(--color-correctivos)"
                                stopOpacity={0.22}
                            />
                            <stop
                                offset="95%"
                                stopColor="var(--color-correctivos)"
                                stopOpacity={0.03}
                            />
                        </linearGradient>
                        <linearGradient
                            id={preventivosGradientId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="var(--color-preventivos)"
                                stopOpacity={0.18}
                            />
                            <stop
                                offset="95%"
                                stopColor="var(--color-preventivos)"
                                stopOpacity={0.02}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="4 4" />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        minTickGap={24}
                    />
                    <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                        width={32}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend
                        verticalAlign="top"
                        height={36}
                        content={<ChartLegendContent />}
                    />
                    <Area
                        type="monotone"
                        dataKey="correctivos"
                        name="Correctivos"
                        stroke="var(--color-correctivos)"
                        strokeWidth={2}
                        fill={`url(#${correctivosGradientId})`}
                        activeDot={{ r: 5 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="preventivos"
                        name="Preventivos"
                        stroke="var(--color-preventivos)"
                        strokeWidth={2}
                        fill={`url(#${preventivosGradientId})`}
                        activeDot={{ r: 5 }}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}
