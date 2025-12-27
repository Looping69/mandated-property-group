
import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => (
    <div
        className={cn("bg-white rounded-xl border border-slate-100 shadow-sm", className)}
        onClick={onClick}
    >
        {children}
    </div>
);

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'neutral' | 'purple';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
    const styles = {
        default: "bg-slate-100 text-slate-800",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        warning: "bg-amber-50 text-amber-700 border border-amber-100",
        neutral: "bg-slate-50 text-slate-600 border border-slate-100",
        purple: "bg-brand-purple/10 text-brand-purple border border-brand-purple/20"
    };
    return (
        <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold tracking-wide", styles[variant || 'default'], className)}>
            {children}
        </span>
    );
};

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
    <input
        ref={ref}
        className={cn(
            "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            props.className
        )}
        {...props}
    />
));
Input.displayName = "Input";

export const StatCard = ({ title, value, icon: Icon, trend, onClick }: any) => (
    <Card
        className={cn(
            "p-6 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow",
            onClick && "cursor-pointer"
        )}
        //@ts-ignore
        onClick={onClick}
    >
        <div className="flex justify-between items-start z-10">
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-purpleLight transition-colors">
                <Icon size={20} className="text-slate-500 group-hover:text-brand-purple" />
            </div>
            {trend && (
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={12} className="mr-1" /> {trend}
                </span>
            )}
        </div>
        <div className="z-10">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">{title}</p>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-brand-purple/5 to-brand-green/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
    </Card>
);
