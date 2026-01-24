
import React from 'react';
import { Home, LayoutDashboard, Users, Building2, Scale, Hammer, MessageSquare, Video, Settings, LogOut, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AdminView, UserRole } from '../../types';

interface SidebarProps {
    activeView: AdminView;
    setActiveView: (view: AdminView) => void;
    userRole: UserRole;
    onLogout: () => void;
}

const SidebarItem = ({ view, icon: Icon, label, activeView, setActiveView }: {
    view: AdminView,
    icon: any,
    label: string,
    activeView: string,
    setActiveView: (v: any) => void
}) => {
    const isActive = activeView === view;
    return (
        <button
            onClick={() => setActiveView(view)}
            className={cn(
                "w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive
                    ? "bg-brand-green text-white shadow-lg shadow-brand-green/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
        >
            <Icon size={18} className={cn("mr-3 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
            <span className="font-medium text-sm">{label}</span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
        </button>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({
    activeView,
    setActiveView,
    userRole,
    onLogout
}) => {
    return (
        <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col fixed h-full z-20">
            <div className="h-20 flex items-center px-6 border-b border-white/10">
                <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center mr-3">
                    <Home className="text-white" size={16} />
                </div>
                <span className="font-serif font-bold text-xl tracking-tight">Show House</span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <SidebarItem view="OVERVIEW" icon={LayoutDashboard} label="Overview" activeView={activeView} setActiveView={setActiveView} />
                <SidebarItem view="LISTINGS" icon={Home} label="Properties" activeView={activeView} setActiveView={setActiveView} />

                {/* Only Agencies can manage Agents */}
                {userRole === 'AGENCY' && (
                    <SidebarItem view="AGENTS" icon={Users} label="Agents" activeView={activeView} setActiveView={setActiveView} />
                )}

                {/* Only Admin can manage Agencies and Agent Approvals */}
                {userRole === 'ADMIN' && (
                    <>
                        <SidebarItem view="AGENCIES" icon={Building2} label="Agencies" activeView={activeView} setActiveView={setActiveView} />
                        <SidebarItem view="AGENT_APPROVAL" icon={Users} label="Agent Approvals" activeView={activeView} setActiveView={setActiveView} />
                        <SidebarItem view="SUBSCRIPTIONS" icon={CreditCard} label="Income & Subs" activeView={activeView} setActiveView={setActiveView} />
                    </>
                )}

                <SidebarItem view="CONVEYANCERS" icon={Scale} label="Conveyancers" activeView={activeView} setActiveView={setActiveView} />
                <SidebarItem view="MAINTENANCE" icon={Hammer} label="Maintenance" activeView={activeView} setActiveView={setActiveView} />
                <SidebarItem view="LEADS" icon={MessageSquare} label="Inquiries" activeView={activeView} setActiveView={setActiveView} />

                <div className="pt-6 mt-6 border-t border-white/10 px-3">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2 px-4">System</div>
                    <SidebarItem view="VIRTUAL_TOURS" icon={Video} label="Virtual Tours" activeView={activeView} setActiveView={setActiveView} />
                    {userRole === 'AGENCY' && (
                        <SidebarItem view="SETTINGS" icon={Settings} label="Enterprise Settings" activeView={activeView} setActiveView={setActiveView} />
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center text-slate-400 hover:text-white transition-colors px-4 py-2"
                >
                    <LogOut size={18} className="mr-3" /> Sign Out
                </button>
            </div>
        </aside>
    );
};
