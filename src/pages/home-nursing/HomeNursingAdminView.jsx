import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Import Master Datasets & Matching Engine
import {
  NURSES_LIST,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_SERVICE_TYPES,
  findEligibleNurses
} from '../../data/homeCareData';

// Import Views
import HomeCareOverviewView from './views/HomeCareOverviewView';
import HomeCareRequestsView from './views/HomeCareRequestsView';
import NurseMapView from './views/NurseMapView';
import NursesManagementView from './views/NursesManagementView';
import ServiceTypesView from './views/ServiceTypesView';

export default function HomeNursingAdminView() {
  const { activeModule, setActiveModule } = useAuth();
  const { addToast } = useToast();

  // Central React States
  const [requests, setRequests] = useState(INITIAL_SERVICE_REQUESTS);
  const [nurses, setNurses] = useState(NURSES_LIST);
  const [serviceTypes, setServiceTypes] = useState(INITIAL_SERVICE_TYPES);

  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedNurseId, setSelectedNurseId] = useState(null);
  const [requestsInitialFilter, setRequestsInitialFilter] = useState('All');

  // Navigation Helper with Filter
  const handleNavigateWithTab = (mod, filter = 'All') => {
    setRequestsInitialFilter(filter);
    setSelectedRequestId(null);
    setSelectedNurseId(null);
    setActiveModule(mod);
  };

  // 1. Admin Calls Patient & Confirms Service
  const handleCallPatient = (reqId, notes) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          overallStatus: 'Patient Contacted',
          timeline: [
            ...(r.timeline || []),
            {
              status: 'Patient Contacted',
              timestamp: `Today, ${timestamp}`,
              actor: 'Admin (Telephonic Confirmation)',
              note: notes || 'Spoke with patient and confirmed service requirement and time slot.'
            }
          ]
        };
      })
    );
    addToast({
      title: 'Patient Call Logged',
      message: `Request #${reqId} confirmed with patient. Ready to send payment link.`,
      type: 'info'
    });
  };

  // 2. Admin Sends Payment Link with Custom Entered Amount
  const handleSendPaymentLink = (reqId, customAmount, paymentNotes) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const targetReq = requests.find((r) => r.id === reqId);
    const amount = Number(customAmount) > 0 ? Number(customAmount) : (targetReq?.serviceAmount || 750);

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          serviceAmount: amount,
          overallStatus: 'Payment Link Sent',
          paymentStatus: 'Link Sent',
          paymentLinkStatus: 'Sent via SMS & WhatsApp',
          paymentNotes: paymentNotes || r.paymentNotes,
          timeline: [
            ...(r.timeline || []),
            {
              status: 'Payment Link Sent',
              timestamp: `Today, ${timestamp}`,
              actor: 'Admin / System',
              note: `Online payment link for ₹${amount} sent to patient mobile. ${paymentNotes ? `(Note: ${paymentNotes})` : ''}`
            }
          ]
        };
      })
    );
    addToast({
      title: 'Payment Link Sent',
      message: `Payment link of ₹${amount} pushed via SMS & WhatsApp to ${targetReq?.patientName || 'patient'}.`,
      type: 'success'
    });
  };

  // 3. Simulate Patient Online Payment Completed
  const handleSimulatePayment = (reqId) => {
    const txnId = `TXN-UPI-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const targetReq = requests.find((r) => r.id === reqId);

    // Auto find eligible nurses for broadcast
    const eligible = findEligibleNurses(targetReq, nurses);
    const notifiedList = eligible.slice(0, 3).map((en) => ({
      nurseId: en.id,
      nurseName: en.name,
      phone: en.phone,
      specialization: en.specialization,
      distanceKm: en.distanceKm,
      availabilityStatus: en.availabilityStatus,
      notificationSentAt: `Today, ${nowTime}`,
      responseStatus: 'Waiting for Response',
      responseAt: null
    }));

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          paymentStatus: 'Completed',
          paymentLinkStatus: 'Paid',
          overallStatus: notifiedList.length > 0 ? 'Nurses Notified' : 'Payment Completed',
          paymentDetails: {
            transactionId: txnId,
            paidAt: `Today, ${nowTime}`,
            amount: r.serviceAmount || 750,
            mode: 'Online (UPI / PhonePe)'
          },
          nursesNotified: notifiedList,
          timeline: [
            ...(r.timeline || []),
            {
              status: 'Payment Completed',
              timestamp: `Today, ${nowTime}`,
              actor: 'Patient (Payment Gateway)',
              note: `Online payment of ₹${r.serviceAmount || 750} verified (${txnId}).`
            },
            ...(notifiedList.length > 0
              ? [
                  {
                    status: 'Nurses Notified',
                    timestamp: `Today, ${nowTime}`,
                    actor: 'Automatic Match Engine',
                    note: `System matched ${notifiedList.length} eligible registered nurses near ${r.locality} and broadcasted notification.`
                  }
                ]
              : [])
          ]
        };
      })
    );

    addToast({
      title: 'Payment Confirmed & Nurses Notified',
      message: `₹${targetReq?.serviceAmount || 750} verified. System automatically notified ${notifiedList.length} eligible nurses in Mysuru.`,
      type: 'success'
    });
  };

  // 4. Auto-Notify Eligible Nurses (Manual trigger if needed)
  const handleBroadcastNurses = (reqId) => {
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const targetReq = requests.find((r) => r.id === reqId);
    const eligible = findEligibleNurses(targetReq, nurses);

    const notifiedList = eligible.slice(0, 3).map((en) => ({
      nurseId: en.id,
      nurseName: en.name,
      phone: en.phone,
      specialization: en.specialization,
      distanceKm: en.distanceKm,
      availabilityStatus: en.availabilityStatus,
      notificationSentAt: `Today, ${nowTime}`,
      responseStatus: 'Waiting for Response',
      responseAt: null
    }));

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          overallStatus: 'Nurses Notified',
          nursesNotified: notifiedList,
          timeline: [
            ...(r.timeline || []),
            {
              status: 'Nurses Notified',
              timestamp: `Today, ${nowTime}`,
              actor: 'Auto Dispatch Engine',
              note: `Broadcasted care request to ${notifiedList.length} eligible nurses.`
            }
          ]
        };
      })
    );

    addToast({
      title: 'Eligible Nurses Notified',
      message: `${notifiedList.length} nurses within proximity notified. Waiting for first nurse to accept.`,
      type: 'info'
    });
  };

  // 5. Simulate Nurse Accepts Request
  const handleSimulateNurseAccept = (reqId) => {
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const targetReq = requests.find((r) => r.id === reqId);
    if (!targetReq) return;

    // Pick first candidate nurse or find closest eligible
    let acceptedCandidate = targetReq.nursesNotified?.[0];
    let candidateNurseObj = acceptedCandidate
      ? nurses.find((n) => n.id === acceptedCandidate.nurseId)
      : nurses[0];

    const assignedInfo = {
      nurseId: candidateNurseObj.id,
      nurseName: candidateNurseObj.name,
      phone: candidateNurseObj.phone,
      email: candidateNurseObj.email,
      specialization: candidateNurseObj.specialization,
      registeredLocation: candidateNurseObj.address,
      distanceKm: acceptedCandidate?.distanceKm || 1.8,
      acceptedAt: `Today, ${nowTime}`,
      serviceDateTime: `${targetReq.requestedDate}, ${targetReq.requestedTime}`
    };

    // Update requests state
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;

        // Mark candidate as accepted, others as declined/closed
        const updatedNotified = (r.nursesNotified || []).map((n, idx) => {
          if (idx === 0 || n.nurseId === candidateNurseObj.id) {
            return { ...n, responseStatus: 'Accepted', responseAt: `Today, ${nowTime}` };
          }
          return { ...n, responseStatus: 'Declined', responseAt: `Today, ${nowTime}` };
        });

        return {
          ...r,
          overallStatus: 'Nurse Accepted',
          assignedNurse: assignedInfo,
          nursesNotified: updatedNotified.length > 0 ? updatedNotified : [
            {
              nurseId: candidateNurseObj.id,
              nurseName: candidateNurseObj.name,
              phone: candidateNurseObj.phone,
              specialization: candidateNurseObj.specialization,
              distanceKm: 1.8,
              availabilityStatus: 'Available',
              notificationSentAt: `Today, ${nowTime}`,
              responseStatus: 'Accepted',
              responseAt: `Today, ${nowTime}`
            }
          ],
          timeline: [
            ...(r.timeline || []),
            {
              status: 'Nurse Accepted',
              timestamp: `Today, ${nowTime}`,
              actor: `${candidateNurseObj.name} (Mobile App)`,
              note: `${candidateNurseObj.name} accepted the home care visit. System automatically closed other pending broadcasts.`
            }
          ]
        };
      })
    );

    // Update nurse's status in master list
    setNurses((prev) =>
      prev.map((n) => {
        if (n.id !== candidateNurseObj.id) return n;
        return {
          ...n,
          status: 'SCHEDULED',
          nextBooking: {
            date: targetReq.requestedDate,
            time: targetReq.requestedTime,
            patient: targetReq.patientName,
            service: targetReq.serviceRequired
          }
        };
      })
    );

    addToast({
      title: 'Nurse Accepted Request',
      message: `${candidateNurseObj.name} accepted Request #${reqId}. Booking confirmed.`,
      type: 'success'
    });
  };

  // 6. Start Service (Nurse Arrives)
  const handleStartService = (reqId) => {
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const targetReq = requests.find((r) => r.id === reqId);

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          overallStatus: 'Service In Progress',
          timeline: [
            ...(r.timeline || []),
            {
              status: 'Service In Progress',
              timestamp: `Today, ${nowTime}`,
              actor: `${r.assignedNurse?.nurseName || 'Nurse'}`,
              note: 'Nurse arrived at patient residence and commenced care procedure.'
            }
          ]
        };
      })
    );

    if (targetReq?.assignedNurse?.nurseId) {
      setNurses((prev) =>
        prev.map((n) => (n.id === targetReq.assignedNurse.nurseId ? { ...n, status: 'BUSY' } : n))
      );
    }

    addToast({
      title: 'Service In Progress',
      message: `Nurse has started home visit for Request #${reqId}.`,
      type: 'info'
    });
  };

  // 7. Complete Service
  const handleCompleteService = (reqId) => {
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const targetReq = requests.find((r) => r.id === reqId);

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          overallStatus: 'Completed',
          timeline: [
            ...(r.timeline || []),
            {
              status: 'Completed',
              timestamp: `Today, ${nowTime}`,
              actor: `${r.assignedNurse?.nurseName || 'Nurse'}`,
              note: 'Home care visit successfully completed. Clinical report logged.'
            }
          ]
        };
      })
    );

    if (targetReq?.assignedNurse?.nurseId) {
      setNurses((prev) =>
        prev.map((n) => {
          if (n.id !== targetReq.assignedNurse.nurseId) return n;
          return {
            ...n,
            status: 'AVAILABLE',
            completedVisits: (n.completedVisits || 0) + 1,
            nextBooking: null
          };
        })
      );
    }

    addToast({
      title: 'Visit Marked Completed',
      message: `Request #${reqId} completed successfully.`,
      type: 'success'
    });
  };

  // 8. Cancel Request
  const handleCancelRequest = (reqId, reason) => {
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          overallStatus: 'Cancelled',
          paymentStatus: r.paymentStatus === 'Completed' ? 'Refunded' : r.paymentStatus,
          timeline: [
            ...(r.timeline || []),
            {
              status: 'Cancelled',
              timestamp: `Today, ${nowTime}`,
              actor: 'Admin',
              note: `Request cancelled. Reason: ${reason}`
            }
          ]
        };
      })
    );

    addToast({
      title: 'Request Cancelled',
      message: `Request #${reqId} cancelled. Status updated.`,
      type: 'info'
    });
  };

  // 9. Add New Nurse
  const handleAddNurse = (newNurse) => {
    const newId = `NURSE-00${nurses.length + 1}`;
    const nurseObj = {
      id: newId,
      ...newNurse
    };
    setNurses((prev) => [nurseObj, ...prev]);
    addToast({
      title: 'Nurse Successfully Added',
      message: `${nurseObj.name} added to registered nurse directory and map.`,
      type: 'success'
    });
  };

  // 10. Update Nurse Status
  const handleUpdateNurseStatus = (nurseId, status) => {
    setNurses((prev) =>
      prev.map((n) => (n.id === nurseId ? { ...n, status } : n))
    );
    addToast({
      title: 'Nurse Status Updated',
      message: `Nurse status changed to ${status}.`,
      type: 'info'
    });
  };

  // 11. Toggle Nurse Account Status (Active / Inactive)
  const handleToggleAccountStatus = (nurseId) => {
    setNurses((prev) =>
      prev.map((n) => {
        if (n.id !== nurseId) return n;
        const newStatus = n.accountStatus === 'Active' ? 'Inactive' : 'Active';
        return { ...n, accountStatus: newStatus };
      })
    );
    addToast({
      title: 'Account Status Updated',
      message: `Nurse account status updated.`,
      type: 'info'
    });
  };

  // 12. Service Types Management
  const handleAddService = (newSrv) => {
    setServiceTypes((prev) => [...prev, newSrv]);
    addToast({
      title: 'Service Added',
      message: `${newSrv.name} added to home care catalog.`,
      type: 'success'
    });
  };

  const handleUpdateService = (updatedSrv) => {
    setServiceTypes((prev) =>
      prev.map((s) => (s.id === updatedSrv.id ? updatedSrv : s))
    );
    addToast({
      title: 'Service Updated',
      message: `${updatedSrv.name} specifications updated.`,
      type: 'success'
    });
  };

  const handleToggleServiceStatus = (srvId) => {
    setServiceTypes((prev) =>
      prev.map((s) => {
        if (s.id !== srvId) return s;
        const newStatus = s.status === 'Active' ? 'Inactive' : 'Active';
        return { ...s, status: newStatus };
      })
    );
    addToast({
      title: 'Service Status Changed',
      message: `Service status updated.`,
      type: 'info'
    });
  };

  // Resolve active module
  const currentModule = (activeModule || 'overview').toLowerCase().trim();

  const isRequests = ['requests', 'service-requests', 'care-requests'].includes(currentModule);
  const isNurseMap = ['nurse-map', 'map', 'nurse_map'].includes(currentModule);
  const isNurses = ['nurses', 'nurse-list', 'staff', 'all-nurses', 'add-nurse'].includes(currentModule);
  const isServiceTypes = ['service-types', 'services', 'services-catalog'].includes(currentModule);
  const isOverview = ['overview', 'dashboard', 'home-nursing', 'home-care'].includes(currentModule) ||
    (!isRequests && !isNurseMap && !isNurses && !isServiceTypes);

  return (
    <div>
      {/* 1. Overview / Dashboard View */}
      {isOverview && (
        <HomeCareOverviewView
          requests={requests}
          nurses={nurses}
          serviceTypes={serviceTypes}
          onNavigateModule={handleNavigateWithTab}
          onOpenRequest={(reqId) => {
            setSelectedRequestId(reqId);
            setActiveModule('requests');
          }}
          onOpenNurse={(nurseId) => {
            setSelectedNurseId(nurseId);
            setActiveModule('nurses');
          }}
        />
      )}

      {/* 2. Requests Management View */}
      {isRequests && (
        <HomeCareRequestsView
          requests={requests}
          nurses={nurses}
          serviceTypes={serviceTypes}
          selectedRequestId={selectedRequestId}
          onSelectRequest={(id) => setSelectedRequestId(id)}
          onCallPatient={handleCallPatient}
          onSendPaymentLink={handleSendPaymentLink}
          onSimulatePayment={handleSimulatePayment}
          onBroadcastNurses={handleBroadcastNurses}
          onSimulateNurseAccept={handleSimulateNurseAccept}
          onStartService={handleStartService}
          onCompleteService={handleCompleteService}
          onCancelRequest={handleCancelRequest}
          initialStatusFilter={requestsInitialFilter}
        />
      )}

      {/* 3. Nurse Map Monitoring View */}
      {isNurseMap && (
        <NurseMapView
          nurses={nurses}
          requests={requests}
          onOpenNurseDetails={(nurseId) => {
            setSelectedNurseId(nurseId);
            setActiveModule('nurses');
          }}
          onOpenRequestDetails={(reqId) => {
            setSelectedRequestId(reqId);
            setActiveModule('requests');
          }}
        />
      )}

      {/* 4. Nurses Directory & Management View */}
      {isNurses && (
        <NursesManagementView
          nurses={nurses}
          serviceTypes={serviceTypes}
          onAddNurse={handleAddNurse}
          onUpdateStatus={handleUpdateNurseStatus}
          onToggleAccountStatus={handleToggleAccountStatus}
          selectedNurseId={selectedNurseId}
          onSelectNurse={(id) => setSelectedNurseId(id)}
        />
      )}

      {/* 5. Service Types Catalog View */}
      {isServiceTypes && (
        <ServiceTypesView
          serviceTypes={serviceTypes}
          onAddService={handleAddService}
          onUpdateService={handleUpdateService}
          onToggleServiceStatus={handleToggleServiceStatus}
        />
      )}
    </div>
  );
}
