import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth, findServiceConfig } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import ServiceSelectionPage from './pages/service-selection/ServiceSelectionPage';
import ServiceLoginPage from './pages/auth/ServiceLoginPage';
import AdminLayout from './components/layout/AdminLayout';
import LabAdminView from './pages/lab/LabAdminView';
import RadiologyAdminView from './pages/radiology/RadiologyAdminView';
import PharmacyAdminView from './pages/pharmacy/PharmacyAdminView';
import EquipmentRentalsAdminView from './pages/equipment-rentals/EquipmentRentalsAdminView';
import SurgeryAdminView from './pages/surgery/SurgeryAdminView';
import HomeNursingAdminView from './pages/home-nursing/HomeNursingAdminView';
import ThirdPartyPharmacyAdminView from './pages/third-party-pharmacy/ThirdPartyPharmacyAdminView';
import { SERVICES_CONFIG } from './data/servicesConfig';

function AppContent() {
  const { currentServiceId, currentService, login, switchService, setActiveModule } = useAuth();
  const { addToast } = useToast();

  // Helper to parse path stripping any prefix like /mediunify-admin/
  const parseCurrentPath = () => {
    let path = window.location.pathname.replace(/^\/+/g, '');
    if (path.startsWith('mediunify-admin/')) {
      path = path.slice('mediunify-admin/'.length);
    } else if (path === 'mediunify-admin') {
      path = '';
    }
    const parts = path.split('/');

    if (parts[0] === 'services') {
      return { page: 'services', serviceId: null, module: null };
    }

    if (parts[0] === '' || !parts[0]) {
      return { page: 'services', serviceId: null, module: null };
    }

    if (parts[0] === 'admin') {
      const matched = findServiceConfig(parts[1]);
      if (matched) {
        let mod = parts[2];
        if (!mod) {
          try {
            const sp = new URLSearchParams(window.location.search);
            mod = sp.get('tab') || sp.get('module');
          } catch (e) {}
        }
        return { page: 'dashboard', serviceId: matched.id, module: mod };
      }
    }

    const matchedService = findServiceConfig(parts[0]);
    if (matchedService) {
      if (parts[1] === 'login') {
        return { page: 'login', serviceId: matchedService.id, module: null };
      }
      let mod = parts[1] && parts[1] !== 'dashboard' ? parts[1] : null;
      if (!mod) {
        try {
          const sp = new URLSearchParams(window.location.search);
          mod = sp.get('tab') || sp.get('module');
        } catch (e) {}
      }
      return { page: 'dashboard', serviceId: matchedService.id, module: mod };
    }

    return { page: 'services', serviceId: null, module: null };
  };

  // Route State: { page: 'services' | 'login' | 'dashboard', serviceId: string | null }
  const [route, setRoute] = useState(() => {
    const parsed = parseCurrentPath();
    if (parsed.module) {
      setTimeout(() => setActiveModule(parsed.module), 0);
    }
    return { page: parsed.page, serviceId: parsed.serviceId };
  });

  // Sync state to browser URL history
  const navigateTo = (page, serviceId = null, module = 'dashboard') => {
    const targetService = findServiceConfig(serviceId);
    const resolvedId = targetService ? targetService.id : serviceId;

    setRoute({ page, serviceId: resolvedId });
    if (module) setActiveModule(module);

    const basePrefix = window.location.pathname.startsWith('/mediunify-admin') ? '/mediunify-admin' : '';
    let url = `${basePrefix}/services`;
    if (page === 'login' && resolvedId) {
      url = `${basePrefix}/${resolvedId}/login`;
    } else if (page === 'dashboard' && resolvedId) {
      url = module && module !== 'dashboard' ? `${basePrefix}/admin/${resolvedId}/${module}` : `${basePrefix}/admin/${resolvedId}`;
    }

    window.history.pushState({ page, serviceId: resolvedId, module }, '', url);
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (e) => {
      const state = e.state;
      if (state && state.page) {
        setRoute({ page: state.page, serviceId: state.serviceId });
        if (state.page === 'dashboard' && state.serviceId) {
          switchService(state.serviceId);
          if (state.module) setActiveModule(state.module);
        }
      } else {
        const parsed = parseCurrentPath();
        setRoute({ page: parsed.page, serviceId: parsed.serviceId });
        if (parsed.page === 'dashboard' && parsed.serviceId) {
          switchService(parsed.serviceId);
          if (parsed.module) setActiveModule(parsed.module);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [switchService, setActiveModule]);

  // Keep currentService in sync with route
  useEffect(() => {
    if (route.page === 'dashboard' && route.serviceId && currentServiceId !== route.serviceId) {
      switchService(route.serviceId);
    }
  }, [route, currentServiceId, switchService]);

  // Render Service Admin Dashboard view based on active service
  const renderDashboardModule = () => {
    const activeId = currentService?.id || route.serviceId || 'lab';
    switch (activeId) {
      case 'lab':
        return <LabAdminView />;
      case 'radiology':
        return <RadiologyAdminView />;
      case 'pharmacy':
        return <PharmacyAdminView />;
      case 'equipment-rentals':
      case 'equipment-rental':
        return <EquipmentRentalsAdminView />;
      case 'surgery':
        return <SurgeryAdminView />;
      case 'home-nursing':
      case 'home-care':
        return <HomeNursingAdminView />;
      case 'multiple-pharmacy':
      case 'multi-pharmacy':
      case 'multiple':
      case 'third-party-pharmacy':
      case 'third-party':
      case 'external-pharmacy':
        return <ThirdPartyPharmacyAdminView />;
      default:
        return <LabAdminView />;
    }
  };

  // 1. Service Selection Page
  if (route.page === 'services') {
    return (
      <ServiceSelectionPage
        onSelectService={(serviceId) => navigateTo('login', serviceId)}
        onQuickLogin={(serviceId) => navigateTo('dashboard', serviceId)}
      />
    );
  }

  // 2. Service Login Page
  if (route.page === 'login') {
    return (
      <ServiceLoginPage
        serviceId={route.serviceId || 'equipment-rentals'}
        onBackToServices={() => navigateTo('services')}
        onLoginSuccess={(serviceId) => navigateTo('dashboard', serviceId)}
      />
    );
  }

  // 3. Admin Dashboard
  return (
    <AdminLayout onNavigateToServices={() => navigateTo('services')}>
      {renderDashboardModule()}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
