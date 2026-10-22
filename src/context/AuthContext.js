import React, { createContext, useContext, useState, useEffect } from 'react';
import { SERVICES_CONFIG } from '../data/servicesConfig';

const AuthContext = createContext(null);

export function findServiceConfig(id) {
  if (!id) return null;
  const normalized = id.toLowerCase().trim();
  if (normalized === 'equipment-rental' || normalized === 'equipment-rentals' || normalized === 'equipment') {
    return SERVICES_CONFIG.find((s) => s.id === 'equipment-rentals');
  }
  if (normalized === 'home-care' || normalized === 'home-nursing' || normalized === 'nursing' || normalized === 'homecare') {
    return SERVICES_CONFIG.find((s) => s.id === 'home-nursing');
  }
  if (
    normalized === 'third-party' ||
    normalized === 'thirdparty' ||
    normalized === 'third-party-pharmacy' ||
    normalized === 'external-pharmacy' ||
    normalized === 'multiple-pharmacy' ||
    normalized === 'multi-pharmacy' ||
    normalized === 'multipharmacy' ||
    normalized === 'multiple'
  ) {
    return SERVICES_CONFIG.find((s) => s.id === 'third-party-pharmacy');
  }

  return SERVICES_CONFIG.find((s) => s.id === normalized) || null;
}

export function AuthProvider({ children }) {
  const [currentServiceId, setCurrentServiceId] = useState(() => {
    let path = window.location.pathname.replace(/^\/+/g, '');
    if (path.startsWith('mediunify-admin/')) {
      path = path.slice('mediunify-admin/'.length);
    } else if (path === 'mediunify-admin') {
      path = '';
    }
    const parts = path.split('/');

    if (parts[0] === 'admin' && parts[1]) {
      const match = findServiceConfig(parts[1]);
      if (match) return match.id;
    }

    const matchDirect = findServiceConfig(parts[0]);
    if (matchDirect) return matchDirect.id;

    return localStorage.getItem('mediunify_active_service') || 'lab';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mediunify_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore JSON parse errors
      }
    }

    // Default admin user so it never defaults to null
    return {
      name: 'Lab Administrator',
      email: 'lab.admin@mediunify.com',
      role: 'Chief Lab Operations Officer',
      serviceId: 'lab',
      avatarUrl: `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80`,
      loggedInAt: new Date().toISOString()
    };
  });

  const [activeModule, setActiveModule] = useState(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab') || searchParams.get('module');
      if (tabParam) return tabParam;
    } catch (e) {}

    let path = window.location.pathname.replace(/^\/+/g, '');
    if (path.startsWith('mediunify-admin/')) {
      path = path.slice('mediunify-admin/'.length);
    } else if (path === 'mediunify-admin') {
      path = '';
    }
    const parts = path.split('/');
    if (parts[0] === 'admin' && parts[2]) {
      return parts[2];
    }
    if (parts[0] !== 'admin' && parts[1] && parts[1] !== 'login' && parts[1] !== 'dashboard') {
      return parts[1];
    }
    return 'dashboard';
  });

  useEffect(() => {
    if (currentServiceId) {
      localStorage.setItem('mediunify_active_service', currentServiceId);
    } else {
      localStorage.removeItem('mediunify_active_service');
    }
  }, [currentServiceId]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mediunify_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mediunify_user');
    }
  }, [currentUser]);

  const login = (serviceId, email, password) => {
    const service = findServiceConfig(serviceId);
    const resolvedId = service ? service.id : serviceId;
    const serviceName = service ? service.name : 'Healthcare';
    
    const user = {
      name: `${serviceName} Administrator`,
      email: email || `${resolvedId}.admin@mediunify.com`,
      role: `${serviceName} Admin Lead`,
      serviceId: resolvedId,
      avatarUrl: `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80`,
      loggedInAt: new Date().toISOString()
    };

    setCurrentServiceId(resolvedId);
    setCurrentUser(user);
    setActiveModule('dashboard');
    return user;
  };

  const logout = () => {
    setCurrentServiceId(null);
    setCurrentUser(null);
    setActiveModule('dashboard');
    localStorage.removeItem('mediunify_active_service');
    localStorage.removeItem('mediunify_user');
  };

  const switchService = (serviceId) => {
    const service = findServiceConfig(serviceId);
    if (!service) return;
    const serviceName = service.name;
    
    const user = {
      name: `${serviceName} Administrator`,
      email: `${service.id}.admin@mediunify.com`,
      role: `${serviceName} Admin Lead`,
      serviceId: service.id,
      avatarUrl: `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80`,
      loggedInAt: new Date().toISOString()
    };
    setCurrentServiceId(service.id);
    setCurrentUser(user);
    setActiveModule('dashboard');
  };

  const currentService = findServiceConfig(currentServiceId) || SERVICES_CONFIG.find((s) => s.id === 'lab') || SERVICES_CONFIG[0];

  return (
    <AuthContext.Provider
      value={{
        currentServiceId,
        currentService,
        currentUser,
        activeModule,
        setActiveModule,
        login,
        logout,
        switchService
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
