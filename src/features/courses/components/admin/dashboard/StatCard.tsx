import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/shared/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend: number;
  trendLabel?: string;
  format?: 'number' | 'currency' | 'percentage';
  className?: string; // Added this to fix the Dashboard error
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendLabel = 'vs last month', 
  format = 'number',
  className 
}: StatCardProps) {
  const isPositive = trend >= 0;
  
  const formatValue = () => {
    if (format === 'currency') return `$${Number(value).toLocaleString()}`;
    if (format === 'percentage') return `${value}%`;
    return Number(value).toLocaleString();
  };

  return (
    <div className={cn(
      "group rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {formatValue()}
          </p>
          <div className="flex items-center gap-1.5">
            <span className={cn(
              'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
              isPositive 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'bg-rose-50 text-rose-600'
            )}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend)}%
            </span>
            <span className="text-xs text-slate-400">{trendLabel}</span>
          </div>
        </div>

        {/* This div creates the soft colored circle behind the icon from your screenshot */}
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}