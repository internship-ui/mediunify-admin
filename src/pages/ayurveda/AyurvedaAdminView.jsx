import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  AYURVEDA_CENTRES,
  AYURVEDA_SERVICES,
  AYURVEDA_PRACTITIONERS,
  AYURVEDA_CONSULTATION_PRICING,
  AYURVEDA_THERAPY_PRICING,
  AYURVEDA_PACKAGES,
  AYURVEDA_BOOKINGS,
  AYURVEDA_CALLBACKS,
  AYURVEDA_REVIEWS,
  AYURVEDA_LOCATIONS,
  AYURVEDA_NOTIFICATIONS
} from '../../data/ayurveda';

import AyurvedaDashboardView from './views/AyurvedaDashboardView';
import CentresManagementView from './views/CentresManagementView';
import CentreDetailsView from './views/CentreDetailsView';
import CentreVerificationView from './views/CentreVerificationView';
import ServicesManagementView from './views/ServicesManagementView';
import PractitionersView from './views/PractitionersView';
import PricingPackagesView from './views/PricingPackagesView';
import BookingsView from './views/BookingsView';
import CallbacksView from './views/CallbacksView';
import ReviewsView from './views/ReviewsView';
import FeaturedCentresView from './views/FeaturedCentresView';
import LocationsView from './views/LocationsView';
import NotificationsView from './views/NotificationsView';
import ReportsView from './views/ReportsView';

export default function AyurvedaAdminView() {
  const { activeModule, setActiveModule } = useAuth();
  const { addToast } = useToast();

  // Central Live State Stores (initialized from modular dummy data)
  const [centres, setCentres] = useState(AYURVEDA_CENTRES);
  const [services, setServices] = useState(AYURVEDA_SERVICES);
  const [practitioners, setPractitioners] = useState(AYURVEDA_PRACTITIONERS);
  const [consultationPricing, setConsultationPricing] = useState(AYURVEDA_CONSULTATION_PRICING);
  const [therapyPricing, setTherapyPricing] = useState(AYURVEDA_THERAPY_PRICING);
  const [packages, setPackages] = useState(AYURVEDA_PACKAGES);
  const [bookings, setBookings] = useState(AYURVEDA_BOOKINGS);
  const [callbacks, setCallbacks] = useState(AYURVEDA_CALLBACKS);
  const [reviews, setReviews] = useState(AYURVEDA_REVIEWS);
  const [locations, setLocations] = useState(AYURVEDA_LOCATIONS);
  const [notifications, setNotifications] = useState(AYURVEDA_NOTIFICATIONS);

  // Selected Centre for Centre Details View (/admin/ayurveda/centres/:id)
  const [selectedCentre, setSelectedCentre] = useState(null);

  // Selected entities for quick modal triggers across modules
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);
  const [selectedCallbackForModal, setSelectedCallbackForModal] = useState(null);
  const [selectedVerificationCentre, setSelectedVerificationCentre] = useState(null);

  // --- CENTRE ACTIONS ---
  const handleSaveCentre = (centreData, isEdit) => {
    if (isEdit) {
      setCentres((prev) => prev.map((c) => (c.id === centreData.id ? { ...c, ...centreData } : c)));
      if (selectedCentre?.id === centreData.id) {
        setSelectedCentre({ ...selectedCentre, ...centreData });
      }
      addToast(`Updated Ayurveda Centre: ${centreData.name}`, 'success');
    } else {
      setCentres((prev) => [centreData, ...prev]);
      addToast(`Added new Ayurveda Centre: ${centreData.name}`, 'success');
    }
  };

  const handleToggleFeature = (ctr) => {
    const updatedStatus = !ctr.isFeatured;
    setCentres((prev) =>
      prev.map((c) => (c.id === ctr.id ? { ...c, isFeatured: updatedStatus, featuredOrder: updatedStatus ? prev.filter((x) => x.isFeatured).length + 1 : 0 } : c))
    );
    if (selectedCentre?.id === ctr.id) {
      setSelectedCentre({ ...selectedCentre, isFeatured: updatedStatus });
    }
    addToast(
      updatedStatus
        ? `Added '${ctr.name}' to Featured Centres`
        : `Removed '${ctr.name}' from Featured Centres`,
      'info'
    );
  };

  const handleToggleCentreStatus = (ctr) => {
    const nextStatus = ctr.status === 'Active' ? 'Inactive' : 'Active';
    setCentres((prev) =>
      prev.map((c) => (c.id === ctr.id ? { ...c, status: nextStatus } : c))
    );
    if (selectedCentre?.id === ctr.id) {
      setSelectedCentre({ ...selectedCentre, status: nextStatus });
    }
    addToast(`Centre status changed to '${nextStatus}' for ${ctr.name}`, 'info');
  };

  // --- VERIFICATION ACTIONS ---
  const handleApproveCentre = (centreId) => {
    setCentres((prev) =>
      prev.map((c) => (c.id === centreId ? { ...c, verificationStatus: 'Verified', status: 'Active', verifiedDate: new Date().toISOString().slice(0, 10) } : c))
    );
    addToast('Ayurveda centre approved and published successfully!', 'success');
  };

  const handleRejectCentre = (centreId, reason) => {
    setCentres((prev) =>
      prev.map((c) => (c.id === centreId ? { ...c, verificationStatus: 'Rejected', status: 'Inactive', rejectReason: reason } : c))
    );
    addToast('Centre verification rejected with notice sent to applicant.', 'warning');
  };

  const handleRequestChanges = (centreId, remarks) => {
    setCentres((prev) =>
      prev.map((c) => (c.id === centreId ? { ...c, verificationStatus: 'Under Review', rejectReason: remarks } : c))
    );
    addToast('Requested revisions and uploaded remarks for applicant.', 'info');
  };

  // --- SERVICE ACTIONS ---
  const handleSaveService = (serviceData, isEdit) => {
    if (isEdit) {
      setServices((prev) => prev.map((s) => (s.id === serviceData.id ? { ...s, ...serviceData } : s)));
      addToast(`Updated service: ${serviceData.name}`, 'success');
    } else {
      setServices((prev) => [serviceData, ...prev]);
      addToast(`Created new service: ${serviceData.name}`, 'success');
    }
  };

  const handleToggleServiceStatus = (srv) => {
    const nextStatus = srv.status === 'Active' ? 'Inactive' : 'Active';
    setServices((prev) =>
      prev.map((s) => (s.id === srv.id ? { ...s, status: nextStatus } : s))
    );
    addToast(`Service '${srv.name}' set to ${nextStatus}`, 'info');
  };

  // --- PRACTITIONER ACTIONS ---
  const handleSavePractitioner = (docData, isEdit) => {
    if (isEdit) {
      setPractitioners((prev) => prev.map((p) => (p.id === docData.id ? { ...p, ...docData } : p)));
      addToast(`Updated doctor profile: ${docData.name}`, 'success');
    } else {
      setPractitioners((prev) => [docData, ...prev]);
      addToast(`Added new practitioner: ${docData.name}`, 'success');
    }
  };

  const handleTogglePractitionerStatus = (doc) => {
    const nextStatus = doc.status === 'Active' ? 'Inactive' : 'Active';
    setPractitioners((prev) =>
      prev.map((p) => (p.id === doc.id ? { ...p, status: nextStatus } : p))
    );
    addToast(`Doctor '${doc.name}' status set to ${nextStatus}`, 'info');
  };

  // --- PACKAGE ACTIONS ---
  const handleSavePackage = (pkgData, isEdit) => {
    if (isEdit) {
      setPackages((prev) => prev.map((pkg) => (pkg.id === pkgData.id ? { ...pkg, ...pkgData } : pkg)));
      addToast(`Updated package: ${pkgData.name}`, 'success');
    } else {
      setPackages((prev) => [pkgData, ...prev]);
      addToast(`Created new package: ${pkgData.name}`, 'success');
    }
  };

  const handleTogglePackageStatus = (pkg) => {
    const nextStatus = pkg.status === 'Active' ? 'Inactive' : 'Active';
    setPackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, status: nextStatus } : p))
    );
    addToast(`Package '${pkg.name}' set to ${nextStatus}`, 'info');
  };

  // --- BOOKING ACTIONS ---
  const handleUpdateBookingStatus = (bookingId, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    addToast(`Booking ${bookingId} status updated to '${status}'`, 'success');
  };

  const handleRescheduleBooking = (bookingId, newDate, newTime) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, date: newDate, time: newTime, status: 'Confirmed' } : b))
    );
    addToast(`Booking ${bookingId} rescheduled to ${newDate} at ${newTime}`, 'success');
  };

  // --- CALLBACK ACTIONS ---
  const handleUpdateCallbackStatus = (callbackId, status) => {
    setCallbacks((prev) =>
      prev.map((cb) => (cb.id === callbackId ? { ...cb, status } : cb))
    );
    addToast(`Callback ${callbackId} marked as '${status}'`, 'info');
  };

  const handleAddInternalNote = (callbackId, noteText) => {
    setCallbacks((prev) =>
      prev.map((cb) => {
        if (cb.id === callbackId) {
          const notes = [
            ...(cb.internalNotes || []),
            {
              author: 'Admin Support Lead',
              date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              text: noteText
            }
          ];
          return { ...cb, internalNotes: notes };
        }
        return cb;
      })
    );
    addToast('Added internal coordination note', 'success');
  };

  // --- REVIEW ACTIONS ---
  const handleToggleReviewVisibility = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const next = r.status === 'Published' ? 'Hidden' : 'Published';
          addToast(`Review ${reviewId} is now ${next}`, 'info');
          return { ...r, status: next };
        }
        return r;
      })
    );
  };

  // --- FEATURED REORDER ACTIONS ---
  const handleMoveFeaturedOrder = (centreId, direction) => {
    const featuredList = centres
      .filter((c) => c.isFeatured)
      .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99));

    const currentIndex = featuredList.findIndex((c) => c.id === centreId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= featuredList.length) return;

    const itemA = featuredList[currentIndex];
    const itemB = featuredList[targetIndex];

    const tempOrder = itemA.featuredOrder || currentIndex + 1;
    const newOrder = itemB.featuredOrder || targetIndex + 1;

    setCentres((prev) =>
      prev.map((c) => {
        if (c.id === itemA.id) return { ...c, featuredOrder: newOrder };
        if (c.id === itemB.id) return { ...c, featuredOrder: tempOrder };
        return c;
      })
    );

    addToast(`Updated featured display ranking for '${itemA.name}'`, 'info');
  };

  const handleAddFeaturedCentre = (centreId) => {
    const currentFeaturedCount = centres.filter((c) => c.isFeatured).length;
    setCentres((prev) =>
      prev.map((c) => (c.id === centreId ? { ...c, isFeatured: true, featuredOrder: currentFeaturedCount + 1 } : c))
    );
    addToast('Added centre to featured carousel', 'success');
  };

  const handleRemoveFeaturedCentre = (centreId) => {
    setCentres((prev) =>
      prev.map((c) => (c.id === centreId ? { ...c, isFeatured: false, featuredOrder: 0 } : c))
    );
    addToast('Removed centre from featured carousel', 'info');
  };

  // --- LOCATION ACTIONS ---
  const handleSaveLocation = (locationData, isEdit) => {
    if (isEdit) {
      setLocations((prev) => prev.map((l) => (l.id === locationData.id ? { ...l, ...locationData } : l)));
      addToast(`Updated location: ${locationData.city} (${locationData.area})`, 'success');
    } else {
      setLocations((prev) => [locationData, ...prev]);
      addToast(`Created new location: ${locationData.city}`, 'success');
    }
  };

  const handleToggleLocationStatus = (locationId) => {
    setLocations((prev) =>
      prev.map((l) => {
        if (l.id === locationId) {
          const next = l.status === 'Active' ? 'Inactive' : 'Active';
          addToast(`Location status updated to '${next}'`, 'info');
          return { ...l, status: next };
        }
        return l;
      })
    );
  };

  // --- NOTIFICATION ACTIONS ---
  const handleSendNotification = (notifData) => {
    setNotifications((prev) => [notifData, ...prev]);
    addToast(`Broadcasted notification: ${notifData.title}`, 'success');
  };

  const handleResendNotification = (notifId) => {
    const notif = notifications.find((n) => n.id === notifId);
    if (notif) {
      addToast(`Resent notification to ${notif.target}`, 'success');
    }
  };

  // --- RENDER CURRENT VIEW BASED ON activeModule ---
  const renderModuleView = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <AyurvedaDashboardView
            centres={centres}
            bookings={bookings}
            callbacks={callbacks}
            services={services}
            practitioners={practitioners}
            onNavigateModule={(mod) => {
              setSelectedCentre(null);
              setActiveModule(mod);
            }}
            onViewCentre={(ctr) => {
              setSelectedCentre(ctr);
              setActiveModule('centres');
            }}
            onReviewVerification={(ctr) => {
              setActiveModule('verification');
            }}
            onViewBooking={(b) => {
              setActiveModule('bookings');
            }}
            onViewCallback={(cb) => {
              setActiveModule('callbacks');
            }}
          />
        );

      case 'centres':
        if (selectedCentre) {
          return (
            <CentreDetailsView
              centre={selectedCentre}
              services={services}
              practitioners={practitioners}
              consultationPricing={consultationPricing}
              therapyPricing={therapyPricing}
              packages={packages}
              bookings={bookings}
              reviews={reviews}
              onBack={() => setSelectedCentre(null)}
              onEditCentre={(ctr) => {
                // Handled in details
              }}
              onToggleFeature={handleToggleFeature}
              onToggleStatus={handleToggleCentreStatus}
              onViewBooking={(b) => {
                setActiveModule('bookings');
              }}
            />
          );
        }
        return (
          <CentresManagementView
            centres={centres}
            onViewCentre={(ctr) => setSelectedCentre(ctr)}
            onSaveCentre={handleSaveCentre}
            onToggleFeature={handleToggleFeature}
            onToggleStatus={handleToggleCentreStatus}
            onManageServices={(ctr) => {
              setActiveModule('services');
            }}
            onManagePractitioners={(ctr) => {
              setActiveModule('practitioners');
            }}
          />
        );

      case 'verification':
        return (
          <CentreVerificationView
            centres={centres}
            services={services}
            practitioners={practitioners}
            onApproveCentre={handleApproveCentre}
            onRejectCentre={handleRejectCentre}
            onRequestChanges={handleRequestChanges}
          />
        );

      case 'services':
        return (
          <ServicesManagementView
            services={services}
            centres={centres}
            onSaveService={handleSaveService}
            onToggleServiceStatus={handleToggleServiceStatus}
          />
        );

      case 'practitioners':
        return (
          <PractitionersView
            practitioners={practitioners}
            centres={centres}
            onSavePractitioner={handleSavePractitioner}
            onTogglePractitionerStatus={handleTogglePractitionerStatus}
          />
        );

      case 'pricing':
        return (
          <PricingPackagesView
            consultations={consultationPricing}
            therapies={therapyPricing}
            packages={packages}
            centres={centres}
            onSavePackage={handleSavePackage}
            onTogglePackageStatus={handleTogglePackageStatus}
          />
        );

      case 'bookings':
        return (
          <BookingsView
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onRescheduleBooking={handleRescheduleBooking}
          />
        );

      case 'callbacks':
        return (
          <CallbacksView
            callbacks={callbacks}
            onUpdateCallbackStatus={handleUpdateCallbackStatus}
            onAddInternalNote={handleAddInternalNote}
          />
        );

      case 'reviews':
        return (
          <ReviewsView
            reviews={reviews}
            centres={centres}
            onToggleReviewVisibility={handleToggleReviewVisibility}
          />
        );

      case 'featured':
        return (
          <FeaturedCentresView
            centres={centres}
            onMoveFeaturedOrder={handleMoveFeaturedOrder}
            onAddFeaturedCentre={handleAddFeaturedCentre}
            onRemoveFeaturedCentre={handleRemoveFeaturedCentre}
          />
        );

      case 'locations':
        return (
          <LocationsView
            locations={locations}
            onSaveLocation={handleSaveLocation}
            onToggleLocationStatus={handleToggleLocationStatus}
          />
        );

      case 'notifications':
        return (
          <NotificationsView
            notifications={notifications}
            onSendNotification={handleSendNotification}
            onResendNotification={handleResendNotification}
          />
        );

      case 'reports':
        return (
          <ReportsView
            centres={centres}
            services={services}
            bookings={bookings}
            callbacks={callbacks}
          />
        );

      default:
        return (
          <AyurvedaDashboardView
            centres={centres}
            bookings={bookings}
            callbacks={callbacks}
            services={services}
            practitioners={practitioners}
            onNavigateModule={(mod) => setActiveModule(mod)}
            onViewCentre={(ctr) => {
              setSelectedCentre(ctr);
              setActiveModule('centres');
            }}
          />
        );
    }
  };

  return <div className="space-y-6">{renderModuleView()}</div>;
}
