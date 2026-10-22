import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Layers,
  LogOut,
  Sliders,
  CheckCircle2,
  Clock,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Navbar({
  onToggleSidebar,
  onOpenCommandPalette,
  pageTitle,
  onNavigateToServices
}) {
  const { currentService, currentUser, logout, switchService, activeModule, setActiveModule } = useAuth();
  const { addToast } = useToast();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Mock Notifications matching Requirement 18
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Rental Request Received',
      desc: 'New equipment rental request received from Rahul Kumar for Wheelchair (ER-1001).',
      time: '10 min ago',
      unread: true,
      service: 'Equipment Rental',
      module: 'requests'
    },
    {
      id: 2,
      title: 'Vendor Confirmation Required',
      desc: 'Vendor confirmation required for ER-1003 (Oxygen Concentrator 5L) & ER-1009 (Nebulizer).',
      time: '25 min ago',
      unread: true,
      service: 'Equipment Rental',
      module: 'requests'
    },
    {
      id: 3,
      title: 'Equipment Delivery Completed',
      desc: 'Equipment delivery completed for ER-1002 (Semi-Fowler Hospital Bed in Kuvempunagar).',
      time: '1 hour ago',
      unread: true,
      service: 'Equipment Rental',
      module: 'requests'
    },
    {
      id: 4,
      title: 'Rental Period Ending Tomorrow',
      desc: 'Rental period ending tomorrow for ER-1005 (BiPAP Machine in Bangalore). Check extension or return schedule.',
      time: '2 hours ago',
      unread: false,
      service: 'Equipment Rental',
      module: 'active-rentals'
    }
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    addToast('All notifications marked as read', 'info');
  };

  const currentModuleObj = currentService?.modules?.find((m) => m.id === activeModule);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-brand-slate-200/80 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100 transition-colors lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb / Current Service & Module Title */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="font-bold text-brand-navy-900">
              {currentService?.fullName || 'MediUnify'}
            </span>
            <span className="text-brand-slate-400">/</span>
            <span className="font-semibold text-brand-teal-700">
              {pageTitle || currentModuleObj?.name || activeModule || 'Dashboard'}
            </span>
          </div>

          {/* Search Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-brand-slate-50 hover:bg-brand-slate-100 border border-brand-slate-200 rounded-xl text-xs text-brand-slate-400 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search portals, requests, vendors...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white border border-brand-slate-200 text-brand-slate-500 rounded">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2 rounded-xl text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-coral-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Operational Alerts
                      </h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.module) {
                            setActiveModule(n.module);
                          }
                          setNotifications((prev) =>
                            prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
                          );
                          setIsNotificationsOpen(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                          n.unread ? 'bg-teal-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900 leading-tight">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.desc}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {n.service}
                          </span>
                          {n.unread && (
                            <span className="text-[10px] font-semibold text-teal-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" /> Unread
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        addToast('Viewing all system logs', 'info');
                      }}
                      className="text-xs font-bold text-teal-700 hover:underline"
                    >
                      View All System Activity Logs
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 p-1 pl-2 rounded-xl hover:bg-brand-slate-100 transition-colors border border-transparent hover:border-brand-slate-200"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-navy-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {currentUser?.name?.slice(0, 2)?.toUpperCase() || 'AD'}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-brand-navy-900 leading-tight">
                  {currentUser?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-brand-teal-600 font-semibold">{currentService?.name} Lead</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-brand-slate-400 hidden sm:block" />
            </button>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-brand-slate-200 shadow-xl py-2 z-50 animate-slide-up">
                  <div className="px-4 py-3 border-b border-brand-slate-100">
                    <p className="text-sm font-bold text-brand-navy-900">{currentUser?.name}</p>
                    <p className="text-xs text-brand-slate-500 truncate">{currentUser?.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-green-500 animate-pulse" />
                      <span className="text-[11px] font-semibold text-brand-green-700">Online & Verified</span>
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveModule('settings');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-50 rounded-xl transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-brand-slate-400" />
                      Portal Settings & Preferences
                    </button>
                    <button
                      onClick={() => {
                        if (onNavigateToServices) onNavigateToServices();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-50 rounded-xl transition-colors"
                    >
                      <Layers className="w-4 h-4 text-brand-slate-400" />
                      Return to Service Hub
                    </button>
                  </div>

                  <div className="p-1 pt-1.5 border-t border-brand-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        addToast('Logged out successfully', 'info');
                        if (onNavigateToServices) onNavigateToServices();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-brand-coral-600 hover:bg-brand-coral-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4"/>
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
