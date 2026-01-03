import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    color?: 'blue' | 'green' | 'orange' | 'purple';
}

const colorClasses = {
    blue: {
        border: 'border-blue-200/50',
        glow: 'shadow-[0_25px_70px_-35px_rgba(59,130,246,0.55)]',
        gradient: 'bg-linear-to-br from-blue-500/12 via-white/60 to-blue-300/10',
        icon: 'bg-blue-500/15 text-blue-600',
    },
    green: {
        border: 'border-emerald-200/50',
        glow: 'shadow-[0_25px_70px_-35px_rgba(16,185,129,0.45)]',
        gradient: 'bg-linear-to-br from-emerald-500/12 via-white/60 to-emerald-300/10',
        icon: 'bg-emerald-500/15 text-emerald-600',
    },
    orange: {
        border: 'border-amber-200/50',
        glow: 'shadow-[0_25px_70px_-35px_rgba(245,158,11,0.45)]',
        gradient: 'bg-linear-to-br from-amber-500/12 via-white/60 to-amber-300/10',
        icon: 'bg-amber-500/15 text-amber-600',
    },
    purple: {
        border: 'border-purple-200/50',
        glow: 'shadow-[0_25px_70px_-35px_rgba(168,85,247,0.45)]',
        gradient: 'bg-linear-to-br from-purple-500/12 via-white/60 to-purple-300/10',
        icon: 'bg-purple-500/15 text-purple-600',
    },
} as const;

export default function StatsCard({ title, value, icon: Icon, trend, color = 'blue' }: StatsCardProps) {
    const variant = colorClasses[color];

    return (
        <div className={`relative overflow-hidden rounded-[28px] border bg-white/70 backdrop-blur-sm transition-all duration-300 ${variant.border} ${variant.glow} hover:-translate-y-0.5`}>
            <div className={`absolute inset-0 opacity-90 ${variant.gradient}`} />
            <div className="relative flex items-start justify-between gap-4 p-6">
                <div className="space-y-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500">
                        {title}
                    </span>
                    <div>
                        <p className="text-3xl font-semibold text-anthracite drop-shadow-sm">{value}</p>
                        {trend && (
                            <span
                                className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                                    trend.isPositive
                                        ? 'bg-emerald-500/15 text-emerald-600'
                                        : 'bg-rose-500/15 text-rose-600'
                                }`}
                            >
                                <span className="text-base leading-none">{trend.isPositive ? '↗' : '↘'}</span>
                                {trend.value}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur ${variant.icon}`}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
}
