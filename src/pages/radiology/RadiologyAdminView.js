import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Master and Operational Data
import {
  RADIOLOGY_STATS,
  RADIOLOGY_CENTERS,
  RADIOLOGY_MACHINES,
  RADIOLOGY_CATALOGUE,
  RADIOLOGY_RADIOLOGISTS,
  INITIAL_RADIOLOGY_ORDERS,
  INITIAL_RADIOLOGY_REPORTS,
  INITIAL_RADIOLOGY_SLOTS,
  INITIAL_RADIOLOGY_SUB_SCANS
} from '../../data/radiologyData';

// Modals & Drawers
import RadiologyOrderDetailDrawer from './components/RadiologyOrderDetailDrawer';
import RadiologyVerifyOrderModal from './components/RadiologyVerifyOrderModal';
import RadiologyRescheduleModal from './components/RadiologyRescheduleModal';
import RadiologyScanExecutionModal from './components/RadiologyScanExecutionModal';
import RadiologyAssignRadiologistModal from './components/RadiologyAssignRadiologistModal';
import RadiologyReportUploadModal from './components/RadiologyReportUploadModal';
import RadiologyReportReviewModal from './components/RadiologyReportReviewModal';
import RadiologyReportPreviewModal from './components/RadiologyReportPreviewModal';
import RadiologyAddEditScanModal from './components/RadiologyAddEditScanModal';
import RadiologyAddEditCenterModal from './components/RadiologyAddEditCenterModal';
import RadiologyAddEditMachineModal from './components/RadiologyAddEditMachineModal';
import RadiologyMachineMaintenanceModal from './components/RadiologyMachineMaintenanceModal';
import RadiologyEditPricingModal from './components/RadiologyEditPricingModal';

// Submodule Views
import RadiologyDashboardView from './views/RadiologyDashboardView';
import RadiologyOrdersView from './views/RadiologyOrdersView';
import RadiologyCatalogueView from './views/RadiologyCatalogueView';
import RadiologyCentersView from './views/RadiologyCentersView';
import RadiologyMachinesView from './views/RadiologyMachinesView';
import RadiologySlotsView from './views/RadiologySlotsView';
import RadiologyReportsView from './views/RadiologyReportsView';
import RadiologyPricingTatView from './views/RadiologyPricingTatView';
import RadiologySettingsView from './views/RadiologySettingsView';

export default function RadiologyAdminView() {
  const { activeModule, setActiveModule } = useAuth();
  const { addToast } = useToast();

  // Central Operational State
  const [orders, setOrders] = useState(INITIAL_RADIOLOGY_ORDERS);
  const [centers, setCenters] = useState(RADIOLOGY_CENTERS);
  const [machines, setMachines] = useState(RADIOLOGY_MACHINES);
  const [subScans, setSubScans] = useState(INITIAL_RADIOLOGY_SUB_SCANS);
  const [catalogue, setCatalogue] = useState(RADIOLOGY_CATALOGUE);
  const [radiologists, setRadiologists] = useState(RADIOLOGY_RADIOLOGISTS);
  const [reports, setReports] = useState(INITIAL_RADIOLOGY_REPORTS);
  const [slots, setSlots] = useState(INITIAL_RADIOLOGY_SLOTS);

  // Sub-tab navigation state
  const [ordersSubTab, setOrdersSubTab] = useState('ALL');

  // Modal & Drawer State
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [detailTargetOrder, setDetailTargetOrder] = useState(null);

  // Synchronize modal order state when orders collection updates
  useEffect(() => {
    if (detailTargetOrder) {
      const updated = orders.find((o) => o.orderId === detailTargetOrder.orderId);
      if (updated && updated !== detailTargetOrder) {
        setDetailTargetOrder(updated);
      }
    }
  }, [orders]);

  const [isVerifyOrderOpen, setIsVerifyOrderOpen] = useState(false);
  const [verifyTargetOrder, setVerifyTargetOrder] = useState(null);

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleTargetOrder, setRescheduleTargetOrder] = useState(null);

  const [isScanExecOpen, setIsScanExecOpen] = useState(false);
  const [scanExecTargetOrder, setScanExecTargetOrder] = useState(null);
  const [scanExecActionType, setScanExecActionType] = useState('arrive'); // 'arrive' | 'start' | 'complete'

  const [isAssignRadiologistOpen, setIsAssignRadiologistOpen] = useState(false);
  const [assignTargetOrder, setAssignTargetOrder] = useState(null);

  const [isReportUploadOpen, setIsReportUploadOpen] = useState(false);
  const [uploadTargetReport, setUploadTargetReport] = useState(null);
  const [uploadTargetOrder, setUploadTargetOrder] = useState(null);

  const [isReportReviewOpen, setIsReportReviewOpen] = useState(false);
  const [reviewTargetReport, setReviewTargetReport] = useState(null);
  const [reviewTargetOrder, setReviewTargetOrder] = useState(null);

  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);
  const [previewTargetReport, setPreviewTargetReport] = useState(null);
  const [previewTargetOrder, setPreviewTargetOrder] = useState(null);

  const [isAddEditScanOpen, setIsAddEditScanOpen] = useState(false);
  const [editingScan, setEditingScan] = useState(null);

  const [isAddEditCenterOpen, setIsAddEditCenterOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);

  const [isAddEditMachineOpen, setIsAddEditMachineOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);

  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [maintenanceTargetMachine, setMaintenanceTargetMachine] = useState(null);

  const [isEditPricingOpen, setIsEditPricingOpen] = useState(false);
  const [pricingTargetScan, setPricingTargetScan] = useState(null);

  // ==================== WORKFLOW ADVANCEMENT HANDLERS ====================

  // 1. VERIFY ORDER & MACHINE SLOT
  const handleConfirmVerifyOrder = (orderId, notes) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'VERIFIED',
              title: 'Booking & Gantry Slot Confirmed',
              timestamp,
              responsible: 'Radiology Desk Lead',
              note: notes || 'Clinical history and fasting requirements verified.',
              completed: true
            }
          ];
          const updated = { ...o, orderStatus: 'CONFIRMED', timeline: updatedTimeline };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
    setOrdersSubTab('CONFIRMED');
  };

  // 2. RESCHEDULE ORDER
  const handleConfirmReschedule = (orderId, reschedData) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    
    // Update matching order
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'RESCHEDULED',
              title: `Appointment Rescheduled to ${reschedData.newDate} (${reschedData.newSlot})`,
              timestamp,
              responsible: 'Radiology Operations',
              note: `Moved to ${reschedData.newMachine} at ${reschedData.newCenter?.split('-')[0]}. Reason: ${reschedData.reason}`,
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'RESCHEDULED',
            appointmentDate: reschedData.newDate,
            appointmentTime: reschedData.newSlot,
            center: reschedData.newCenter,
            machine: reschedData.newMachine,
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
  };

  // 3. MARK PATIENT ARRIVED
  const handleConfirmArrival = (orderId) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'PATIENT ARRIVED',
              title: 'Patient Checked In at Center Reception',
              timestamp,
              responsible: 'Reception Desk',
              note: 'Patient metal screening verified. Locker token issued.',
              completed: true
            }
          ];
          const updated = { ...o, orderStatus: 'PATIENT ARRIVED', arrivalTime: timestamp, timeline: updatedTimeline };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
  };

  // 4. START SCAN EXECUTION
  const handleConfirmStartScan = (orderId, scanData) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'SCAN IN PROGRESS',
              title: 'Loaded in Scanner Suite (Execution Active)',
              timestamp,
              responsible: scanData.technologist || 'Senior Radiographer',
              note: scanData.contrastDosage
                ? `Contrast administered: ${scanData.contrastDosage}. ${scanData.remarks}`
                : scanData.remarks || 'Imaging sequences running.',
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'SCAN IN PROGRESS',
            operator: scanData.technologist,
            scanStartTime: timestamp,
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
  };

  // 5. FINALIZE SCAN COMPLETED & TRANSMIT TO PACS
  const handleConfirmCompleteScan = (orderId, completeData) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'SCAN COMPLETED',
              title: 'Raw DICOM Images Transmitted to PACS',
              timestamp,
              responsible: 'PACS Automated Gateway',
              note: `${completeData.slicesAcquired || '1,200 Slices'} archived. Ready for Radiologist interpretation.`,
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'SCAN COMPLETED',
            scanEndTime: timestamp,
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
    setOrdersSubTab('SCAN COMPLETED');
  };

  // 6. ASSIGN REPORTING RADIOLOGIST
  const handleConfirmAssignment = (orderId, assignData) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    
    // Update order
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'RADIOLOGIST ASSIGNED',
              title: `Assigned to ${assignData.radiologistName}`,
              timestamp,
              responsible: 'Reporting Dispatch Lead',
              note: `Priority: ${assignData.priority}. ${assignData.instructions}`,
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'RADIOLOGIST ASSIGNED',
            radiologist: assignData.radiologistName,
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );

    // Update radiologist pending count
    setRadiologists((prev) =>
      prev.map((r) =>
        r.name === assignData.radiologistName ? { ...r, pendingReports: r.pendingReports + 1 } : r
      )
    );
  };

  // 7. SAVE / DRAFT REPORT
  const handleSaveReport = (reportId, reportData) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    // Upsert report in state
    setReports((prev) => {
      const exists = prev.some((r) => r.reportId === reportId);
      if (exists) {
        return prev.map((r) => (r.reportId === reportId ? { ...r, ...reportData } : r));
      }
      return [reportData, ...prev];
    });

    // Update corresponding order
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === reportData.orderId || o.reportId === reportId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'REPORT UPLOADED',
              title: 'Draft Findings Compiled by Radiologist',
              timestamp,
              responsible: reportData.verifiedBy || o.radiologist || 'Reporting Fellow',
              note: 'Preliminary findings compiled. Awaiting clinical authorization.',
              completed: true
            }
          ];
          const updated = { ...o, orderStatus: 'REPORT UPLOADED', reportId, timeline: updatedTimeline };
          if (detailTargetOrder?.orderId === o.orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
    setOrdersSubTab('REPORT UPLOADED');
  };

  // 8. VERIFY REPORT BY CONSULTANT RADIOLOGIST
  const handleConfirmVerification = (reportId, verData) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    // Update report
    setReports((prev) =>
      prev.map((r) =>
        r.reportId === reportId
          ? { ...r, reportStatus: 'VERIFIED', verifiedBy: verData.verifiedBy, deliveryStatus: 'Ready for Patient Dispatch' }
          : r
      )
    );

    // Update order
    setOrders((prev) =>
      prev.map((o) => {
        if (o.reportId === reportId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'REPORT VERIFIED',
              title: `Digitally Signed by ${verData.verifiedBy}`,
              timestamp,
              responsible: verData.verifiedBy,
              note: verData.verificationNotes || 'Cryptographic digital signature affixed.',
              completed: true
            }
          ];
          const updated = { ...o, orderStatus: 'REPORT VERIFIED', timeline: updatedTimeline };
          if (detailTargetOrder?.orderId === o.orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
  };

  // 9. REJECT REPORT FOR REVISION
  const handleRejectReport = (reportId, rejectData) => {
    setReports((prev) =>
      prev.map((r) =>
        r.reportId === reportId
          ? { ...r, reportStatus: 'REJECTED', deliveryStatus: `Correction Required: ${rejectData.rejectionReason}` }
          : r
      )
    );

    setOrders((prev) =>
      prev.map((o) => {
        if (o.reportId === reportId) {
          return { ...o, orderStatus: 'REPORT PENDING' };
        }
        return o;
      })
    );
  };

  // 10. DELIVER REPORT TO PATIENT
  const handleSendReportToPatient = (reportIdOrOrderId) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    let targetCenter = 'Center';

    // Update report
    setReports((prev) =>
      prev.map((r) =>
        r.reportId === reportIdOrOrderId || r.orderId === reportIdOrOrderId
          ? { ...r, reportStatus: 'DELIVERED', deliveryStatus: 'Delivered via WhatsApp & Health Vault (Presented by MediUnify)' }
          : r
      )
    );

    // Update order
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === reportIdOrOrderId || o.reportId === reportIdOrOrderId) {
          targetCenter = o.center || 'Scan Center';
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'COMPLETED',
              title: 'Diagnostic Report Delivered to Patient',
              timestamp,
              responsible: 'Auto Delivery Gateway',
              note: `Presented by MediUnify • Scanned in ${targetCenter}. PDF report sent via WhatsApp (+91 ${o.patient?.phone?.slice(-10)}) and published to Health Records Vault.`,
              completed: true
            }
          ];
          const updated = { ...o, orderStatus: 'COMPLETED', timeline: updatedTimeline };
          if (detailTargetOrder?.orderId === o.orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
    setOrdersSubTab('COMPLETED');

    addToast(`Report shared with patient (Presented by MediUnify • Scanned in ${targetCenter})!`, 'success');
  };

  // 11. CANCEL ORDER
  const handleCancelOrder = (orderId, reason) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'CANCELLED',
              title: 'Order Cancelled & Gantry Slot Released',
              timestamp,
              responsible: 'Admin / Support Desk',
              note: reason || 'Cancelled upon patient request.',
              completed: true
            }
          ];
          const updated = { ...o, orderStatus: 'CANCELLED', paymentStatus: 'Refunded', timeline: updatedTimeline };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
    addToast(`Order ${orderId} has been cancelled. Slot released.`, 'info');
  };

  // 12. STREAMLINED 1-CLICK MILESTONE ADVANCEMENT (Radiology Center-Visit Flow)
  const handleAdvanceDemoStep = (orderId) => {
    const target = orders.find((o) => o.orderId === orderId);
    if (!target) return;
    const status = (target.orderStatus || 'NEW').toUpperCase();
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    // Step 1 -> Step 2: Verify Booking & Machine Slot
    if (status === 'NEW' || status === 'BOOKED') {
      const updatedTimeline = [
        ...(target.timeline || []),
        {
          step: 'VERIFIED',
          title: 'Booking & Gantry Slot Confirmed',
          timestamp,
          responsible: 'Radiology Desk Lead',
          note: `Appointment confirmed for ${target.appointmentDate} (${target.appointmentTime}) at ${target.center} (${target.machine}). Fasting and metal clearance checklist verified.`,
          completed: true
        }
      ];
      const updated = { ...target, orderStatus: 'VERIFIED', timeline: updatedTimeline };
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
      setDetailTargetOrder(updated);
      addToast(`Order ${orderId}: Booking and machine slot confirmed!`, 'success');
      return;
    }

    // Step 2 -> Step 3: Patient Arrived at Physical Center
    if (status === 'VERIFIED' || status === 'PATIENT SCHEDULED') {
      const updatedTimeline = [
        ...(target.timeline || []),
        {
          step: 'PATIENT ARRIVED',
          title: 'Patient Checked In at Center Reception',
          timestamp,
          responsible: 'Reception Desk',
          note: `Patient arrived at ${target.center}. Physical check-in complete, locker token issued, pre-scan metal screening cleared.`,
          completed: true
        }
      ];
      const updated = { ...target, orderStatus: 'PATIENT ARRIVED', arrivalTime: timestamp, timeline: updatedTimeline };
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
      setDetailTargetOrder(updated);
      addToast(`Patient checked in at ${target.center}!`, 'success');
      return;
    }

    // Step 3 -> Step 4: Scan Executed & Raw DICOM to PACS
    if (status === 'PATIENT ARRIVED' || status === 'SCAN IN PROGRESS') {
      const updatedTimeline = [
        ...(target.timeline || []),
        {
          step: 'SCAN COMPLETED',
          title: 'Imaging Procedure Completed (DICOM Transmitted to PACS)',
          timestamp,
          responsible: 'Senior Imaging Technologist',
          note: `Full sequence scan completed on ${target.machine}. 1,280 DICOM raw cross-sectional slices acquired and archived to PACS repository.`,
          completed: true
        }
      ];
      const updated = {
        ...target,
        orderStatus: 'SCAN COMPLETED',
        scanEndTime: timestamp,
        operator: target.operator || 'Technologist Rajesh Gowda',
        timeline: updatedTimeline
      };
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
      setDetailTargetOrder(updated);
      addToast(`Scan procedure executed on ${target.machine}. DICOM archived!`, 'success');
      return;
    }

    // Step 4 -> Step 5: Admin / Radiologist Uploads Branded MediUnify Report
    if (status === 'SCAN COMPLETED' || status === 'RADIOLOGIST ASSIGNED' || status === 'REPORT PENDING') {
      const assignedDoc = target.radiologist || 'Dr. Vikramaditya Hegde, MD, FRCR';
      const reportId = target.reportId || `RPT-RAD-${orderId.replace(/[^0-9]/g, '') || '9001'}`;

      const newReportData = {
        reportId,
        orderId: target.orderId,
        patientName: target.patient?.name,
        patientAge: target.patient?.age,
        gender: target.patient?.gender,
        patientId: target.patient?.patientId || 'PT-8801',
        scanName: target.scan?.name,
        scanCode: target.scan?.code,
        modality: target.scan?.category || 'MRI',
        centerName: target.center,
        machineName: target.machine,
        clinicalHistory: target.clinicalNotes || 'Diagnostic imaging requisition evaluated with standard sequences.',
        protocol: 'High-resolution multi-planar reconstruction with volumetric contiguous slices.',
        findings: [
          { section: 'Target Anatomical Structures', text: `Diagnostic imaging of ${target.scan?.bodyPart || 'target anatomical region'} demonstrates physiological signal intensity, anatomical continuity, and preserved structural contours.` },
          { section: 'Neurovascular & Soft Tissue Architecture', text: 'No focal mass lesion, acute hemorrhage, pathological contrast enhancement or significant structural pathology.' }
        ],
        impression: `1. Diagnostic imaging study of ${target.scan?.name || 'region'} within normal limits.\n2. No acute or focal radiological abnormality identified.`,
        verifiedBy: assignedDoc,
        reportStatus: 'VERIFIED',
        uploadedDate: timestamp,
        deliveryStatus: 'Ready for Patient Dispatch',
        brand: 'MediUnify Diagnostic Network'
      };

      setReports((prev) => {
        const exists = prev.some((r) => r.reportId === reportId || r.orderId === orderId);
        if (exists) return prev.map((r) => (r.reportId === reportId || r.orderId === orderId ? { ...r, ...newReportData } : r));
        return [newReportData, ...prev];
      });

      const updatedTimeline = [
        ...(target.timeline || []),
        {
          step: 'REPORT UPLOADED',
          title: 'Official MediUnify Diagnostic Report Uploaded',
          timestamp,
          responsible: assignedDoc,
          note: 'Verified and digitally signed under MediUnify Diagnostic Hub with QR cryptographic verification.',
          completed: true
        }
      ];

      const updated = {
        ...target,
        orderStatus: 'REPORT VERIFIED',
        reportId,
        radiologist: assignedDoc,
        timeline: updatedTimeline
      };
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
      setDetailTargetOrder(updated);
      addToast('Official MediUnify Diagnostic Report generated and uploaded!', 'success');
      return;
    }

    // Step 5 -> Step 6: Deliver to Patient via WhatsApp & Health Vault
    if (status === 'REPORT UPLOADED' || status === 'REPORT VERIFIED' || status === 'REPORT UNDER REVIEW') {
      handleSendReportToPatient(orderId);
      return;
    }
  };

  // 13. RESET ORDER DEMO STEP
  const handleResetOrderDemo = (orderId) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const resetTimeline = [
            {
              step: 'NEW',
              title: 'Scan Booked by Patient',
              timestamp,
              responsible: 'Patient Self-Service Booking',
              note: `Booked for ${o.appointmentDate} (${o.appointmentTime}) at ${o.center}.`,
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'NEW',
            arrivalTime: null,
            scanStartTime: null,
            scanEndTime: null,
            operator: null,
            timeline: resetTimeline
          };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
    addToast(`Order ${orderId} reset to Step 1 (Booked) for demonstration`, 'info');
  };

  // 14. CRUD HANDLERS (Scan, Center, Machine, Radiologist, Slots)
  const handleSaveScan = (scanData) => {
    setCatalogue((prev) => {
      const exists = prev.some((s) => s.id === scanData.id || s.code === scanData.code);
      if (exists) return prev.map((s) => (s.id === scanData.id || s.code === scanData.code ? { ...s, ...scanData } : s));
      return [{ ...scanData, id: `SCAN-${Date.now().toString().slice(-4)}` }, ...prev];
    });
  };

  const handleToggleScanStatus = (scanId) => {
    setCatalogue((prev) =>
      prev.map((s) => (s.id === scanId ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
    );
    addToast('Scan status updated in catalogue', 'info');
  };

  const handleTogglePopularScan = (scanId) => {
    let nextPopular = false;
    let scanName = 'Scan';
    setCatalogue((prev) =>
      prev.map((s) => {
        if (s.id === scanId) {
          nextPopular = !s.isPopular;
          scanName = s.name;
          return { ...s, isPopular: nextPopular };
        }
        return s;
      })
    );
    addToast(
      nextPopular
        ? `⭐ "${scanName}" marked as Popular Scan (featured on Patient App)`
        : `"${scanName}" removed from Popular Scans`,
      'info'
    );
  };

  const handleSaveCenter = (centerData) => {
    setCenters((prev) => {
      const exists = prev.some((c) => c.id === centerData.id);
      if (exists) return prev.map((c) => (c.id === centerData.id ? { ...c, ...centerData } : c));
      return [centerData, ...prev];
    });
  };

  const handleToggleCenterStatus = (centerId) => {
    setCenters((prev) =>
      prev.map((c) => (c.id === centerId ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c))
    );
    addToast('Center operational status updated', 'info');
  };

  const handleSaveSubScan = (subScanData) => {
    setSubScans((prev) => {
      const exists = prev.some((s) => s.id === subScanData.id);
      if (exists) return prev.map((s) => (s.id === subScanData.id ? { ...s, ...subScanData } : s));
      return [subScanData, ...prev];
    });
  };

  const handleSaveMachine = (machineData) => {
    setMachines((prev) => {
      const exists = prev.some((m) => m.id === machineData.id);
      if (exists) return prev.map((m) => (m.id === machineData.id ? { ...m, ...machineData } : m));
      return [machineData, ...prev];
    });
  };

  const handleConfirmMaintenance = (machineId, maintData) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === machineId ? { ...m, status: maintData.status, maintenanceStatus: maintData.maintenanceReason } : m))
    );
  };

  const handleToggleSlotStatus = (slotId, nextStatus) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, status: nextStatus } : s))
    );
  };

  const handleAddCustomSlot = (centerId, machineId, date, time) => {
    const machineObj = machines.find((m) => m.id === machineId || m.name.includes(machineId)) || machines[0];
    const newSlot = {
      id: `SLOT-${Date.now().toString().slice(-4)}`,
      centerId: centerId !== 'ALL' ? centerId : 'CTR-MYS-01',
      machineId: machineObj.id,
      machineName: machineObj.name,
      scanType: machineObj.modality,
      date: date || '2026-10-01',
      startTime: time.split('-')[0]?.trim() || '05:30 PM',
      endTime: time.split('-')[1]?.trim() || '06:15 PM',
      duration: '45 min',
      status: 'Available',
      orderId: null
    };
    setSlots((prev) => [newSlot, ...prev]);
    addToast(`New slot created: ${newSlot.startTime} for ${machineObj.name}`, 'success');
  };

  // 13. PREVIEW & DETAIL WRAPPERS
  const handleOpenOrderDetails = (order) => {
    setDetailTargetOrder(order);
    setIsOrderDetailOpen(true);
  };

  const handleOpenReportPreview = (reportOrOrder) => {
    if (reportOrOrder.reportId && reportOrOrder.findings) {
      setPreviewTargetReport(reportOrOrder);
      const matchingOrder = orders.find((o) => o.orderId === reportOrOrder.orderId || o.reportId === reportOrOrder.reportId);
      setPreviewTargetOrder(matchingOrder || null);
    } else {
      const rep = reports.find((r) => r.orderId === reportOrOrder.orderId || r.reportId === reportOrOrder.reportId) || {
        reportId: reportOrOrder.reportId || 'RPT-RAD-4001',
        orderId: reportOrOrder.orderId,
        patientName: reportOrOrder.patient?.name,
        patientAge: reportOrOrder.patient?.age,
        gender: reportOrOrder.patient?.gender,
        patientId: reportOrOrder.patient?.patientId || 'PT-8801',
        scanName: reportOrOrder.scan?.name,
        scanCode: reportOrOrder.scan?.code,
        modality: reportOrOrder.scan?.category || 'MRI',
        centerName: reportOrOrder.center,
        machineName: reportOrOrder.machine,
        clinicalHistory: reportOrOrder.clinicalNotes || 'Diagnostic imaging requisition.',
        protocol: 'Volumetric contiguous cross-sectional DICOM image volume.',
        findings: [
          { section: 'Target Anatomical Region', text: 'Normal morphological contours, tissue attenuation and signal intensity.' },
          { section: 'Bone & Soft Tissue Structures', text: 'Intact cortical margins without fracture or destructive osteolytic pathology.' }
        ],
        impression: '1. Normal diagnostic imaging study.\n2. No acute or focal pathological abnormality identified.',
        verifiedBy: reportOrOrder.radiologist || 'Dr. Vikramaditya Hegde, MD, FRCR',
        reportStatus: 'VERIFIED',
        uploadedDate: '2026-10-01 07:15 AM'
      };
      setPreviewTargetReport(rep);
      setPreviewTargetOrder(reportOrOrder);
    }
    setIsReportPreviewOpen(true);
  };

  // ==================== SUBMODULE VIEW SWITCHER ====================
  const renderActiveView = () => {
    switch (activeModule) {
      case 'orders':
        return (
          <RadiologyOrdersView
            orders={orders}
            initialTab={ordersSubTab}
            onOpenOrderDetails={handleOpenOrderDetails}
            onVerifyOrder={(o) => {
              setVerifyTargetOrder(o);
              setIsVerifyOrderOpen(true);
            }}
            onRescheduleOrder={(o) => {
              setRescheduleTargetOrder(o);
              setIsRescheduleOpen(true);
            }}
            onMarkArrived={(o) => {
              setScanExecTargetOrder(o);
              setScanExecActionType('arrive');
              setIsScanExecOpen(true);
            }}
            onStartScan={(o) => {
              setScanExecTargetOrder(o);
              setScanExecActionType('start');
              setIsScanExecOpen(true);
            }}
            onCompleteScan={(o) => {
              setScanExecTargetOrder(o);
              setScanExecActionType('complete');
              setIsScanExecOpen(true);
            }}
            onAssignRadiologist={(o) => {
              setAssignTargetOrder(o);
              setIsAssignRadiologistOpen(true);
            }}
            onUploadReport={(o) => {
              setUploadTargetOrder(o);
              setUploadTargetReport(null);
              setIsReportUploadOpen(true);
            }}
            onReviewReport={(o) => {
              const rep = reports.find((r) => r.orderId === o.orderId) || {
                reportId: o.reportId || 'RPT-RAD-4001',
                orderId: o.orderId,
                patientName: o.patient?.name,
                patientAge: o.patient?.age,
                gender: o.patient?.gender,
                scanName: o.scan?.name,
                verifiedBy: o.radiologist,
                reportStatus: 'UNDER REVIEW',
                findings: [
                  { section: 'Anatomical Structure', text: 'Normal morphology and attenuation.' }
                ],
                impression: '1. No acute abnormality detected.'
              };
              setReviewTargetReport(rep);
              setReviewTargetOrder(o);
              setIsReportReviewOpen(true);
            }}
            onPreviewReport={handleOpenReportPreview}
            onDeliverReport={(o) => handleSendReportToPatient(o.orderId)}
          />
        );

      case 'catalogue':
        return (
          <RadiologyCatalogueView
            catalogue={catalogue}
            onOpenAddScan={() => {
              setEditingScan(null);
              setIsAddEditScanOpen(true);
            }}
            onOpenEditScan={(s) => {
              setEditingScan(s);
              setIsAddEditScanOpen(true);
            }}
            onToggleScanStatus={handleToggleScanStatus}
            onTogglePopularScan={handleTogglePopularScan}
          />
        );

      case 'centers':
        return (
          <RadiologyCentersView
            centers={centers}
            machines={machines}
            orders={orders}
            onOpenAddCenter={() => {
              setEditingCenter(null);
              setIsAddEditCenterOpen(true);
            }}
            onOpenEditCenter={(c) => {
              setEditingCenter(c);
              setIsAddEditCenterOpen(true);
            }}
            onToggleCenterStatus={handleToggleCenterStatus}
            onViewCenterMachines={() => setActiveModule('machines')}
          />
        );

      case 'machines':
        return (
          <RadiologyMachinesView
            subScans={subScans}
            onOpenAddSubScan={() => {
              setEditingMachine(null);
              setIsAddEditMachineOpen(true);
            }}
            onOpenEditSubScan={(s) => {
              setEditingMachine(s);
              setIsAddEditMachineOpen(true);
            }}
            onToggleSubScanStatus={(id) => {
              setSubScans((prev) =>
                prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
              );
              addToast('Sub Scan operational status updated', 'info');
            }}
          />
        );

      case 'slots':
        return (
          <RadiologySlotsView
            slots={slots}
            machines={machines}
            centers={centers}
            onToggleSlotStatus={handleToggleSlotStatus}
            onAddCustomSlot={handleAddCustomSlot}
          />
        );

      case 'reports':
        return (
          <RadiologyReportsView
            reports={reports}
            orders={orders}
            onOpenUploadModal={(rep) => {
              setUploadTargetReport(rep);
              setUploadTargetOrder(null);
              setIsReportUploadOpen(true);
            }}
            onOpenReviewModal={(rep) => {
              setReviewTargetReport(rep);
              setReviewTargetOrder(null);
              setIsReportReviewOpen(true);
            }}
            onOpenPreviewModal={handleOpenReportPreview}
            onSendReportToPatient={handleSendReportToPatient}
          />
        );

      case 'pricing-tat':
        return (
          <RadiologyPricingTatView
            catalogue={catalogue}
            onOpenEditPricing={(scan) => {
              setPricingTargetScan(scan);
              setIsEditPricingOpen(true);
            }}
            onToggleStatus={handleToggleScanStatus}
          />
        );

      case 'settings':
        return <RadiologySettingsView />;

      case 'dashboard':
      default:
        return (
          <RadiologyDashboardView
            orders={orders}
            machines={machines}
            centers={centers}
            catalogue={catalogue}
            reports={reports}
            onNavigateToModule={(mod, subTab) => {
              setActiveModule(mod);
              if (subTab) setOrdersSubTab(subTab);
            }}
            onOpenOrderDetails={handleOpenOrderDetails}
            onVerifyOrder={(o) => {
              setVerifyTargetOrder(o);
              setIsVerifyOrderOpen(true);
            }}
            onOpenScanExecution={(o, type) => {
              setScanExecTargetOrder(o);
              setScanExecActionType(type);
              setIsScanExecOpen(true);
            }}
            onAssignRadiologist={(o) => {
              setAssignTargetOrder(o);
              setIsAssignRadiologistOpen(true);
            }}
            onOpenReportPreview={handleOpenReportPreview}
            onOpenMaintenanceModal={(m) => {
              setMaintenanceTargetMachine(m);
              setIsMaintenanceModalOpen(true);
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-full animate-fade-in">
      
      {/* Active Submodule View */}
      {renderActiveView()}

      {/* ==================== MODALS & DRAWERS ==================== */}

      {/* 1. Centered Order Detail Workspace Modal */}
      <RadiologyOrderDetailDrawer
        isOpen={isOrderDetailOpen}
        onClose={() => setIsOrderDetailOpen(false)}
        order={detailTargetOrder}
        orders={orders}
        onSelectOrder={setDetailTargetOrder}
        onAdvanceDemoStep={handleAdvanceDemoStep}
        onResetOrderDemo={handleResetOrderDemo}
        onVerifyOrder={(o) => {
          setVerifyTargetOrder(o);
          setIsVerifyOrderOpen(true);
        }}
        onRescheduleOrder={(o) => {
          setRescheduleTargetOrder(o);
          setIsRescheduleOpen(true);
        }}
        onMarkArrived={(o) => {
          setScanExecTargetOrder(o);
          setScanExecActionType('arrive');
          setIsScanExecOpen(true);
        }}
        onStartScan={(o) => {
          setScanExecTargetOrder(o);
          setScanExecActionType('start');
          setIsScanExecOpen(true);
        }}
        onCompleteScan={(o) => {
          setScanExecTargetOrder(o);
          setScanExecActionType('complete');
          setIsScanExecOpen(true);
        }}
        onAssignRadiologist={(o) => {
          setAssignTargetOrder(o);
          setIsAssignRadiologistOpen(true);
        }}
        onUploadReport={(o) => {
          setUploadTargetOrder(o);
          setUploadTargetReport(null);
          setIsReportUploadOpen(true);
        }}
        onReviewReport={(o) => {
          const rep = reports.find((r) => r.orderId === o.orderId) || {
            reportId: o.reportId || 'RPT-RAD-4001',
            orderId: o.orderId,
            patientName: o.patient?.name,
            patientAge: o.patient?.age,
            gender: o.patient?.gender,
            scanName: o.scan?.name,
            verifiedBy: o.radiologist,
            reportStatus: 'UNDER REVIEW',
            findings: [
              { section: 'Target Anatomical Structure', text: 'Normal morphology and attenuation.' }
            ],
            impression: '1. No acute structural pathology detected.'
          };
          setReviewTargetReport(rep);
          setReviewTargetOrder(o);
          setIsReportReviewOpen(true);
        }}
        onPreviewReport={handleOpenReportPreview}
        onDeliverReport={(o) => handleSendReportToPatient(o.orderId)}
        onCancelOrder={handleCancelOrder}
      />

      {/* 2. Verify Booking Modal */}
      <RadiologyVerifyOrderModal
        isOpen={isVerifyOrderOpen}
        onClose={() => setIsVerifyOrderOpen(false)}
        order={verifyTargetOrder}
        onConfirmVerify={handleConfirmVerifyOrder}
        onCancelOrder={handleCancelOrder}
      />

      {/* 3. Reschedule Modal */}
      <RadiologyRescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        order={rescheduleTargetOrder}
        allMachines={machines}
        allCenters={centers}
        onConfirmReschedule={handleConfirmReschedule}
      />

      {/* 4. Scan Execution / Arrival Modal */}
      <RadiologyScanExecutionModal
        isOpen={isScanExecOpen}
        onClose={() => setIsScanExecOpen(false)}
        order={scanExecTargetOrder}
        actionType={scanExecActionType}
        onConfirmArrival={handleConfirmArrival}
        onConfirmStartScan={handleConfirmStartScan}
        onConfirmCompleteScan={handleConfirmCompleteScan}
      />

      {/* 5. Assign Radiologist Modal */}
      <RadiologyAssignRadiologistModal
        isOpen={isAssignRadiologistOpen}
        onClose={() => setIsAssignRadiologistOpen(false)}
        order={assignTargetOrder}
        allRadiologists={radiologists}
        onConfirmAssignment={handleConfirmAssignment}
      />

      {/* 6. Upload Report Modal */}
      <RadiologyReportUploadModal
        isOpen={isReportUploadOpen}
        onClose={() => setIsReportUploadOpen(false)}
        report={uploadTargetReport}
        order={uploadTargetOrder}
        onSaveReport={handleSaveReport}
      />

      {/* 7. Clinical Report Review & Verification Modal */}
      <RadiologyReportReviewModal
        isOpen={isReportReviewOpen}
        onClose={() => setIsReportReviewOpen(false)}
        report={reviewTargetReport}
        order={reviewTargetOrder}
        onConfirmVerification={handleConfirmVerification}
        onRejectReport={handleRejectReport}
      />

      {/* 8. Official Report Preview Modal */}
      <RadiologyReportPreviewModal
        isOpen={isReportPreviewOpen}
        onClose={() => setIsReportPreviewOpen(false)}
        report={previewTargetReport}
        order={previewTargetOrder}
      />

      {/* 9. Add / Edit Scan Modal */}
      <RadiologyAddEditScanModal
        isOpen={isAddEditScanOpen}
        onClose={() => setIsAddEditScanOpen(false)}
        scan={editingScan}
        onSaveScan={handleSaveScan}
      />

      {/* 10. Add / Edit Center Modal */}
      <RadiologyAddEditCenterModal
        isOpen={isAddEditCenterOpen}
        onClose={() => setIsAddEditCenterOpen(false)}
        center={editingCenter}
        onSaveCenter={handleSaveCenter}
      />

      {/* 11. Add / Edit Sub Scan Modal */}
      <RadiologyAddEditMachineModal
        isOpen={isAddEditMachineOpen}
        onClose={() => {
          setIsAddEditMachineOpen(false);
          setEditingMachine(null);
        }}
        subScan={editingMachine}
        allCenters={centers}
        onSaveSubScan={handleSaveSubScan}
      />

      {/* 13. Machine Maintenance Wizard Modal */}
      <RadiologyMachineMaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        machine={maintenanceTargetMachine}
        allOrders={orders}
        onConfirmMaintenance={handleConfirmMaintenance}
        onReassignOrder={(o) => {
          setIsMaintenanceModalOpen(false);
          setRescheduleTargetOrder(o);
          setIsRescheduleOpen(true);
        }}
      />

      {/* 14. Edit Pricing & TAT Modal */}
      <RadiologyEditPricingModal
        isOpen={isEditPricingOpen}
        onClose={() => setIsEditPricingOpen(false)}
        scan={pricingTargetScan}
        onSavePricing={(id, updated) => handleSaveScan(updated)}
      />

    </div>
  );
}
