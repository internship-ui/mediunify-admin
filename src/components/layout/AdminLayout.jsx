import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CommandPalette from '../common/CommandPalette';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children, onNavigateToServices }) {
  const { currentService } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onNavigateToServices={onNavigateToServices}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Navbar */}
        <Navbar
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onNavigateToServices={onNavigateToServices}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1700px] mx-auto animate-fade-in">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="px-6 py-4 border-t border-brand-slate-200/60 bg-white/50 text-xs text-brand-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 MediUnify Healthcare Intelligence Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-brand-slate-500">
              {currentService?.fullName || 'Admin Suite'}
            </span>
            <span>•</span>
            <span className="text-brand-green-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green-500 animate-pulse" /> System Active
            </span>
          </div>
        </footer>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
