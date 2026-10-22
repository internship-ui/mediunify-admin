import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Master and Operational Data
import {
  MASTER_TESTS,
  POPULAR_CHECKUPS,
  CURATED_CHECKUPS,
  LAB_CENTERS,
  COLLECTION_STAFF,
  INITIAL_LAB_ORDERS,
  INITIAL_LAB_SAMPLES,
  INITIAL_LAB_REPORTS
} from '../../data/labData';

// Modals & Drawers
import OrderDetailDrawer from './components/OrderDetailDrawer';
import VerifyOrderModal from './components/VerifyOrderModal';
import ScheduleCollectionModal from './components/ScheduleCollectionModal';
import SampleRejectModal from './components/SampleRejectModal';
import ReportUploadModal from './components/ReportUploadModal';
import ReportVerificationModal from './components/ReportVerificationModal';
import ReportPreviewModal from './components/ReportPreviewModal';
import AddEditTestModal from './components/AddEditTestModal';
import PackageDetailModal from './components/PackageDetailModal';
import AddEditPackageModal from './components/AddEditPackageModal';
import AddEditStaffModal from './components/AddEditStaffModal';
import AddEditCenterModal from './components/AddEditCenterModal';
import EditPricingTatModal from './components/EditPricingTatModal';

// Submodule Views
import LabDashboardView from './views/LabDashboardView';
import LabOrdersView from './views/LabOrdersView';
import LabTestCatalogueView from './views/LabTestCatalogueView';
import LabCheckupPackagesView from './views/LabCheckupPackagesView';
import LabSampleManagementView from './views/LabSampleManagementView';
import LabCollectionStaffView from './views/LabCollectionStaffView';
import LabCentersView from './views/LabCentersView';
import LabReportsView from './views/LabReportsView';
import LabPricingTatView from './views/LabPricingTatView';
import LabSettingsView from './views/LabSettingsView';
import NovusBillsView from './views/NovusBillsView';

export default function LabAdminView() {
  const { activeModule, setActiveModule } = useAuth();
  const { addToast } = useToast();

  // Central Operational State
  const [orders, setOrders] = useState(INITIAL_LAB_ORDERS);
  const [samples, setSamples] = useState(INITIAL_LAB_SAMPLES);
  const [reports, setReports] = useState(INITIAL_LAB_REPORTS);
  const [tests, setTests] = useState(MASTER_TESTS);
  const [popularPackages, setPopularPackages] = useState(POPULAR_CHECKUPS);
  const [curatedPackages, setCuratedPackages] = useState(CURATED_CHECKUPS);
  const [staff, setStaff] = useState(COLLECTION_STAFF);
  const [centers, setCenters] = useState(LAB_CENTERS);

  // Sub-tab state for LabOrdersView
  const [ordersSubTab, setOrdersSubTab] = useState('ALL');

  // Modal & Drawer State
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [detailTargetOrder, setDetailTargetOrder] = useState(null);

  const [isVerifyOrderOpen, setIsVerifyOrderOpen] = useState(false);
  const [verifyTargetOrder, setVerifyTargetOrder] = useState(null);

  const [isScheduleCollectionOpen, setIsScheduleCollectionOpen] = useState(false);
  const [scheduleTargetOrder, setScheduleTargetOrder] = useState(null);

  const [isSampleRejectOpen, setIsSampleRejectOpen] = useState(false);
  const [rejectTargetSample, setRejectTargetSample] = useState(null);

  const [isReportUploadOpen, setIsReportUploadOpen] = useState(false);
  const [uploadTargetReport, setUploadTargetReport] = useState(null);
  const [uploadTargetOrder, setUploadTargetOrder] = useState(null);

  const [isReportVerificationOpen, setIsReportVerificationOpen] = useState(false);
  const [verifyTargetReport, setVerifyTargetReport] = useState(null);

  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);
  const [previewTargetReport, setPreviewTargetReport] = useState(null);
  const [previewTargetOrder, setPreviewTargetOrder] = useState(null);

  const [isAddEditTestOpen, setIsAddEditTestOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  const [isPackageDetailOpen, setIsPackageDetailOpen] = useState(false);
  const [detailTargetPackage, setDetailTargetPackage] = useState(null);

  const [isAddEditPackageOpen, setIsAddEditPackageOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageType, setPackageType] = useState('popular');

  const [isAddEditStaffOpen, setIsAddEditStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [isAddEditCenterOpen, setIsAddEditCenterOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);

  const [isEditPricingTatOpen, setIsEditPricingTatOpen] = useState(false);
  const [pricingTargetItem, setPricingTargetItem] = useState(null);
  const [pricingItemType, setPricingItemType] = useState('test');

  // Keep detailTargetOrder synchronized with orders list
  useEffect(() => {
    if (isOrderDetailOpen && detailTargetOrder) {
      const live = orders.find((o) => o.orderId === detailTargetOrder.orderId);
      if (live && live !== detailTargetOrder) {
        setDetailTargetOrder(live);
      }
    }
  }, [orders, isOrderDetailOpen]);

  // ==================== WORKFLOW STATE ADVANCEMENT HANDLERS ====================

  // 1. VERIFY ORDER (NEW -> VERIFIED)
  const handleConfirmVerifyOrder = (orderId, notes) => {
    const timestamp = '01 Oct 10:25 AM';
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'VERIFIED',
              title: 'Admin Verified Order',
              timestamp,
              responsible: 'Lab Administrator',
              note: notes || 'Clinical requirements and fasting instructions verified.',
              completed: true
            }
          ];
          const updated = { ...o, orderStatus: 'VERIFIED', timeline: updatedTimeline };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
  };

  // 2. ASSIGN PHLEBOTOMIST (VERIFIED -> PHLEBOTOMIST ASSIGNED)
  const handleConfirmScheduleCollection = (orderId, scheduleData) => {
    const timestamp = '01 Oct 10:30 AM';
    
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'PHLEBOTOMIST ASSIGNED',
              title: `Phlebotomist Assigned (${scheduleData.staff})`,
              timestamp,
              responsible: 'Dispatch Operations Desk',
              note: `Assigned ${scheduleData.staff} (${scheduleData.staffId}). Slot allocated: ${scheduleData.date} (${scheduleData.timeSlot}). ${scheduleData.instructions}`,
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'COLLECTOR ASSIGNED',
            assignedStaff: scheduleData.staff,
            assignedStaffDetails: {
              name: scheduleData.staff,
              id: scheduleData.staffId || 'PH1004',
              phone: scheduleData.staffPhone || '+91 98765 43211',
              location: scheduleData.staffLocation || 'Near Patient',
              vehicle: 'KA-04-SK-1004',
              status: 'Assigned'
            },
            collection: {
              ...(o.collection || {}),
              assignedCollector: {
                id: scheduleData.staffId || 'PH1004',
                name: scheduleData.staff,
                phone: scheduleData.staffPhone || '+91 98765 43211',
                status: 'Assigned'
              }
            },
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
    setOrdersSubTab('COLLECTOR ASSIGNED');
  };

  // 3. PHLEBOTOMIST LIVE MICRO-STEPS SIMULATION
  const handlePhlebotomistStep = (orderId, targetStep) => {
    const stepTimes = {
      'ACCEPTED': '02 Oct 09:20 AM',
      'ON THE WAY': '02 Oct 09:30 AM',
      'ARRIVED': '02 Oct 09:55 AM',
      'PATIENT VERIFIED': '02 Oct 09:58 AM',
      'COLLECTION STARTED': '02 Oct 10:00 AM',
      'SAMPLE COLLECTED': '02 Oct 10:12 AM'
    };

    const stepNotes = {
      'ACCEPTED': 'Phlebotomist accepted the booking and confirmed specimen kit.',
      'ON THE WAY': 'Phlebotomist en route with temperature-controlled cold container.',
      'ARRIVED': 'Phlebotomist arrived at patient address in Vijayanagar, Bengaluru.',
      'PATIENT VERIFIED': 'Patient identity and fasting status verified at doorstep.',
      'COLLECTION STARTED': 'Phlebotomy procedure initiated. EDTA, Fluoride, SST tubes and urine container prepared.',
      'SAMPLE COLLECTED': 'All 3 required specimen containers sealed, barcoded and verified.'
    };

    const timestamp = stepTimes[targetStep] || '02 Oct 10:12 AM';

    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: targetStep,
              title: `Phlebotomist ${targetStep.toLowerCase().replace(/_/g, ' ')}`,
              timestamp,
              responsible: o.assignedStaff || 'Suresh Kumar',
              note: stepNotes[targetStep] || 'Operational step updated.',
              completed: true
            }
          ];

          const updated = {
            ...o,
            orderStatus: targetStep,
            timeline: updatedTimeline,
            sampleDetails: {
              ...o.sampleDetails,
              status: targetStep === 'SAMPLE COLLECTED' ? 'Collected' : o.sampleDetails?.status || 'Pending'
            }
          };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );

    addToast(`Phlebotomist status updated: ${targetStep}`, 'success');
  };

  // 4. MARK SAMPLE COLLECTED
  const handleMarkSampleCollected = (orderId) => {
    handlePhlebotomistStep(orderId, 'SAMPLE COLLECTED');
  };

  // 5. MARK SAMPLE RECEIVED AT LAB (SAMPLE COLLECTED -> SAMPLE RECEIVED)
  const handleMarkSampleReceived = (orderId) => {
    const timestamp = '02 Oct 11:05 AM';

    // Update samples
    setSamples((prev) =>
      prev.map((s) => {
        if (s.orderId === orderId) {
          return {
            ...s,
            sampleStatus: 'RECEIVED',
            receivedTime: timestamp
          };
        }
        return s;
      })
    );

    // Update orders
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'SAMPLE RECEIVED',
              title: 'Samples Received at Lab Hub',
              timestamp,
              responsible: 'Lab Accession Desk',
              note: 'Samples received with cold chain intact. Barcodes scanned and accessioned.',
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'SAMPLE RECEIVED',
            sampleDetails: {
              ...o.sampleDetails,
              status: 'Received',
              receivedTime: timestamp
            },
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );

    addToast('Samples verified and RECEIVED at central laboratory accession hub.', 'success');
  };

  // 6. VERIFY RECEIVED SAMPLES (SAMPLE RECEIVED -> SAMPLE VERIFIED)
  const handleVerifySample = (orderId) => {
    const timestamp = '02 Oct 11:20 AM';

    setSamples((prev) =>
      prev.map((s) => (s.orderId === orderId ? { ...s, sampleStatus: 'VERIFIED' } : s))
    );

    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'SAMPLE VERIFIED',
              title: 'Samples Verified & Accepted by Accessionist',
              timestamp,
              responsible: 'Chief Technologist',
              note: 'Sample condition verified: Zero hemolysis, correct fill volume, quality certified.',
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'SAMPLE VERIFIED',
            sampleDetails: {
              ...o.sampleDetails,
              status: 'Verified'
            },
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );

    addToast('Sample quality accepted and VERIFIED for analyzer loading.', 'success');
  };

  // 7. START PROCESSING (SAMPLE VERIFIED -> PROCESSING)
  const handleStartProcessing = (orderId) => {
    const timestamp = '02 Oct 11:30 AM';

    setSamples((prev) =>
      prev.map((s) => (s.orderId === orderId ? { ...s, sampleStatus: 'PROCESSING' } : s))
    );

    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'PROCESSING',
              title: 'Processing Started on Automated Analyzers',
              timestamp,
              responsible: 'Sysmex XN-550 & Beckman AU480',
              note: 'Assays calibrated and loaded onto automated clinical analyzers.',
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'PROCESSING',
            processingDetails: {
              ...o.processingDetails,
              status: 'Processing',
              startedAt: timestamp
            },
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );

    addToast('Analyzers running. Order status: PROCESSING.', 'info');
  };

  // 8. UPLOAD / COMPILE REPORT (PROCESSING -> REPORT UPLOADED)
  const handleSaveReport = (reportId, reportData) => {
    const timestamp = '03 Oct 09:30 AM';

    setReports((prev) => {
      const exists = prev.some((r) => r.reportId === reportId);
      if (exists) {
        return prev.map((r) =>
          r.reportId === reportId ? { ...r, ...reportData, reportStatus: 'UPLOADED' } : r
        );
      }
      return [
        {
          reportId,
          ...reportData,
          reportStatus: 'UPLOADED',
          uploadedDate: timestamp,
          deliveryStatus: 'Pending Pathologist Review'
        },
        ...prev
      ];
    });

    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === reportData.orderId || o.reportId === reportId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'REPORT UPLOADED',
              title: 'Diagnostic Report Uploaded with MediUnify Watermark',
              timestamp,
              responsible: `${reportData.labCenter || 'Partner Lab'} / MediUnify Hub`,
              note: `Certified diagnostic report received from ${reportData.labCenter || 'testing center'}. MediUnify watermark applied.`,
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'REPORT UPLOADED',
            reportId,
            reportDetails: {
              ...o.reportDetails,
              status: 'Uploaded',
              uploadedDate: timestamp
            },
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === o.orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );

    addToast(`Diagnostic report from ${reportData.labCenter || 'testing center'} uploaded with MediUnify watermark`, 'success');
  };

  // 9. CONFIRM REPORT VERIFICATION BY PATHOLOGIST (REPORT UPLOADED -> REPORT VERIFIED)
  const handleConfirmVerification = (reportId, verData) => {
    const timestamp = '03 Oct 10:00 AM';

    setReports((prev) =>
      prev.map((r) =>
        r.reportId === reportId
          ? {
              ...r,
              reportStatus: 'VERIFIED',
              verifiedBy: verData.verifiedBy || 'Dr. Ramesh S. Rao, MD (Chief Pathologist)',
              deliveryStatus: 'Ready for Patient Delivery'
            }
          : r
      )
    );

    setOrders((prev) =>
      prev.map((o) => {
        if (o.reportId === reportId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'REPORT VERIFIED',
              title: `Report Verified by ${verData.verifiedBy || 'Dr. Ramesh S. Rao, MD'}`,
              timestamp,
              responsible: verData.verifiedBy || 'Dr. Ramesh S. Rao, MD',
              note: 'Clinical correlation and reference ranges verified with digital QR seal.',
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'REPORT VERIFIED',
            reportDetails: {
              ...o.reportDetails,
              status: 'Verified',
              verifiedBy: verData.verifiedBy || 'Dr. Ramesh S. Rao, MD',
              verifiedDate: timestamp
            },
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === o.orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );

    addToast(`Report ${reportId} verified and signed by pathologist`, 'success');
  };

  // 10. DELIVER REPORT TO PATIENT (REPORT VERIFIED -> REPORT DELIVERED -> COMPLETED)
  const handleSendReportToPatient = (reportIdOrOrderId) => {
    const timestamp = '03 Oct 10:05 AM';

    setReports((prev) =>
      prev.map((r) =>
        r.reportId === reportIdOrOrderId || r.orderId === reportIdOrOrderId
          ? { ...r, reportStatus: 'DELIVERED', deliveryStatus: 'Delivered via WhatsApp & Email' }
          : r
      )
    );

    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === reportIdOrOrderId || o.reportId === reportIdOrOrderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'REPORT DELIVERED',
              title: 'Report Delivered to Rahul Kumar',
              timestamp,
              responsible: 'Auto Delivery Dispatcher',
              note: `PDF report sent via WhatsApp (+91 ${o.patient?.phone}) and Email (${o.patient?.email}).`,
              completed: true
            },
            {
              step: 'COMPLETED',
              title: 'Order Workflow Completed',
              timestamp,
              responsible: 'MediUnify Lab Core',
              note: 'Single continuous workflow completed successfully from Booking to Delivery.',
              completed: true
            }
          ];
          const updated = {
            ...o,
            orderStatus: 'COMPLETED',
            reportDetails: {
              ...o.reportDetails,
              status: 'Delivered',
              deliveredDate: timestamp
            },
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === o.orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );

    setSamples((prev) =>
      prev.map((s) => (s.orderId === reportIdOrOrderId ? { ...s, sampleStatus: 'COMPLETED' } : s))
    );

    addToast('Report delivered to patient via WhatsApp & Email. ORDER COMPLETED!', 'success');
  };

  // 11. ONE-CLICK ADVANCE TO NEXT WORKFLOW STEP (PRIMARY INTERACTIVE FLOW ASSISTANT)
  const handleAdvanceDemoStep = (orderId) => {
    const ord = orders.find((o) => o.orderId === orderId);
    if (!ord) return;

    const status = ord.orderStatus?.toUpperCase() || 'NEW';

    if (status === 'NEW' || status === 'BOOKED') {
      handleConfirmVerifyOrder(orderId, 'Verified clinical tests, fasting guidelines, and patient address.');
      addToast('Order Verified by Admin', 'success');
    } else if (status === 'VERIFIED' || status === 'ADMIN VERIFIED' || status === 'PENDING VERIFICATION') {
      handleConfirmScheduleCollection(orderId, {
        staff: 'Suresh Kumar',
        staffId: 'PH1004',
        staffPhone: '+91 98765 43211',
        staffLocation: 'Near Patient',
        center: 'MediUnify Central Reference Laboratory - Main Hub',
        date: '02 October 2026',
        timeSlot: '10:00 AM',
        instructions: 'Carry barcoded EDTA purple, fluoride grey, SST gold tubes, and urine cup.'
      });
      addToast('Collector Suresh Kumar Assigned. Out to bring samples.', 'success');
    } else if (
      status === 'PHLEBOTOMIST ASSIGNED' ||
      status === 'COLLECTOR ASSIGNED' ||
      status === 'COLLECTION SCHEDULED' ||
      status === 'ACCEPTED' ||
      status === 'ON THE WAY' ||
      status === 'ARRIVED' ||
      status === 'PATIENT VERIFIED' ||
      status === 'COLLECTION STARTED' ||
      status === 'SAMPLE COLLECTED' ||
      status === 'COLLECTED'
    ) {
      handleMarkSampleReceived(orderId);
      addToast('Collector brought samples to lab. Sample received & accessioned.', 'success');
    } else if (
      status === 'SAMPLE RECEIVED' ||
      status === 'RECEIVED' ||
      status === 'SAMPLE VERIFIED' ||
      status === 'PROCESSING' ||
      status === 'REPORT PENDING' ||
      status === 'IN LAB / PROCESSING'
    ) {
      handleSaveReport(ord.reportId || 'REP10001', {
        orderId,
        patientName: ord.patient?.name,
        testOrPackageName: ord.bookedItem?.name || ord.testOrPackage?.name,
        sampleId: 'SMP10001 / SMP10002 / SMP10003'
      });
      handleConfirmVerification(ord.reportId || 'REP10001', {
        verifiedBy: 'Dr. Ramesh S. Rao, MD (Chief Pathologist)'
      });
      addToast('Lab tests completed. Certified diagnostic report uploaded.', 'success');
    } else if (status === 'REPORT UPLOADED' || status === 'REPORT READY' || status === 'REPORT VERIFIED' || status === 'VERIFIED REPORT') {
      handleSendReportToPatient(orderId);
    }
  };

  // 12. RESET ORDER TO INITIAL "NEW" STATE (FOR SMOOTH REPEATED DEMONSTRATION)
  const handleResetOrderDemo = (orderId) => {
    const original = INITIAL_LAB_ORDERS.find((o) => o.orderId === orderId);
    let freshOrder = null;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const fresh = original ? JSON.parse(JSON.stringify(original)) : {
            ...o,
            orderStatus: 'NEW',
            assignedStaff: null,
            assignedStaffDetails: null,
            collection: { ...o.collection, assignedCollector: null },
            sampleDetails: { ...o.sampleDetails, status: 'Pending Verification' },
            timeline: [
              {
                step: 'NEW',
                title: 'Order Placed by Patient',
                timestamp: '08 Oct 08:30 AM',
                responsible: 'Patient Self-Service Web/App',
                note: 'Online booking confirmed. Awaiting administrative review and phlebotomist assignment.',
                completed: true
              }
            ]
          };
          freshOrder = fresh;
          return fresh;
        }
        return o;
      })
    );
    if (detailTargetOrder?.orderId === orderId && freshOrder) {
      setDetailTargetOrder(freshOrder);
    }
    addToast(`Reset ${orderId} to initial NEW order state for workflow demonstration.`, 'info');
  };

  // 13. TRIGGER SAMPLE RECOLLECTION HANDLER
  const handleTriggerRecollection = (orderId, issueData) => {
    const timestamp = '02 Oct 11:25 AM';
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const oldSampleId = o.sampleDetails?.sampleIds?.[0] || 'SMP10001';
          const newSampleId = `${oldSampleId}-R2`;
          const updatedIssuesHistory = [
            ...(o.sampleDetails?.issuesHistory || []),
            {
              attempt: (o.sampleDetails?.issuesHistory?.length || 0) + 1,
              sampleId: oldSampleId,
              issueType: issueData.issueReason || 'Pre-Analytical Issue',
              issueReason: issueData.issueNotes || 'Sample rejected during accession quality check.',
              actionTaken: 'Triggered sample recollection and re-assigned phlebotomist.',
              flaggedBy: 'Accession Pathologist',
              receivedAt: timestamp
            }
          ];

          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'RECOLLECTION REQUIRED',
              title: `Recollection Triggered (${issueData.issueReason})`,
              timestamp,
              responsible: 'Accession Desk',
              note: `Pre-analytical issue: ${issueData.issueReason}. ${issueData.issueNotes || ''}. Previous attempt logged and preserved in audit trail.`,
              completed: true
            }
          ];

          const updated = {
            ...o,
            orderStatus: 'RECOLLECTION REQUIRED',
            sampleDetails: {
              ...o.sampleDetails,
              status: 'RECOLLECTION REQUIRED',
              condition: 'Pending Recollection',
              issuesHistory: updatedIssuesHistory
            },
            timeline: updatedTimeline
          };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
    addToast(`Sample issue flagged for ${orderId}. Recollection required.`, 'warning');
  };

  // Reject sample
  const handleConfirmRejectSample = (sampleId, rejectData) => {
    setSamples((prev) =>
      prev.map((s) =>
        s.sampleId === sampleId
          ? { ...s, sampleStatus: 'REJECTED', rejectionReason: rejectData.reason }
          : s
      )
    );
  };

  // Reject / Send report for correction
  const handleRejectReport = (reportId, rejectData) => {
    setReports((prev) =>
      prev.map((r) =>
        r.reportId === reportId
          ? { ...r, reportStatus: 'REJECTED / CORRECTION', rejectionReason: rejectData.rejectionReason }
          : r
      )
    );
    addToast(`Report ${reportId} sent back for re-testing/correction.`, 'warning');
  };

  // Cancel order
  const handleCancelOrder = (orderId, reason) => {
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedTimeline = [
            ...(o.timeline || []),
            {
              step: 'CANCELLED',
              title: 'Order Cancelled',
              timestamp,
              responsible: 'Admin Desk',
              note: reason || 'Order cancelled by administrator.',
              completed: true
            }
          ];
          const updated = { ...o, orderStatus: 'CANCELLED', timeline: updatedTimeline };
          if (detailTargetOrder?.orderId === orderId) setDetailTargetOrder(updated);
          return updated;
        }
        return o;
      })
    );
  };

  // Open full order details drawer
  const handleOpenOrderDetails = (order) => {
    const fullOrder = orders.find((o) => o.orderId === order.orderId) || order;
    setDetailTargetOrder(fullOrder);
    setIsOrderDetailOpen(true);
  };

  // Open Official Branded Ready Report Preview Modal (Inspect before or after sending)
  const handleOpenPreviewReport = (orderOrReport) => {
    if (!orderOrReport) return;

    // If already passed a complete report with parameters
    if (orderOrReport.reportId && orderOrReport.parameters && orderOrReport.parameters.length > 0) {
      setPreviewTargetReport(orderOrReport);
      const matchingOrder = orders.find(
        (o) => o.orderId === orderOrReport.orderId || o.reportId === orderOrReport.reportId
      );
      setPreviewTargetOrder(matchingOrder || null);
      setIsReportPreviewOpen(true);
      return;
    }

    const orderId = orderOrReport.orderId || orderOrReport.reportId;
    const targetOrder = orders.find((o) => o.orderId === orderId) || orderOrReport;
    const existingRep = reports.find((r) => r.orderId === orderId || r.reportId === targetOrder.reportId);

    // Build complete, authentic, ready diagnostic report with all laboratory parameters
    const readyReport = {
      reportId: existingRep?.reportId || targetOrder.reportId || `REP${targetOrder.orderId?.replace(/[^0-9]/g, '') || '10001'}`,
      orderId: targetOrder.orderId || 'LAB10001',
      patientName: targetOrder.patient?.name || 'Rahul Kumar',
      patientAge: targetOrder.patient?.age || 32,
      gender: targetOrder.patient?.gender || 'Male',
      testOrPackageName: targetOrder.bookedItem?.name || targetOrder.testOrPackage?.name || 'Complete Health Screening Package (7 Tests)',
      sampleId: targetOrder.sampleId || targetOrder.sampleDetails?.sampleIds?.join(' / ') || 'SMP10001 / SMP10002 / SMP10003',
      labCenter: targetOrder.collection?.center || targetOrder.center || existingRep?.labCenter || 'Nova Diagnostics & Laboratory Centre',
      reportStatus: targetOrder.orderStatus === 'COMPLETED' ? 'DELIVERED' : 'VERIFIED',
      uploadedDate: existingRep?.uploadedDate || targetOrder.reportDetails?.uploadedDate || '03 Oct 09:30 AM',
      verifiedBy: existingRep?.verifiedBy || targetOrder.reportDetails?.verifiedBy || 'Dr. Ramesh S. Rao, MD (Chief Pathologist, Nova Diagnostics)',
      deliveryStatus: targetOrder.orderStatus === 'COMPLETED' ? 'Delivered via WhatsApp & Email' : 'Ready for Patient Delivery',
      parameters: (existingRep?.parameters && existingRep.parameters.length > 0)
        ? existingRep.parameters
        : [
            { name: 'Hemoglobin (Hb)', value: '14.6', unit: 'g/dL', normalRange: '13.0 - 17.0', flag: 'Normal' },
            { name: 'Total Leukocyte Count (WBC)', value: '7,200', unit: 'cells/cu.mm', normalRange: '4,000 - 11,000', flag: 'Normal' },
            { name: 'Platelet Count', value: '2.60', unit: 'lakh/cu.mm', normalRange: '1.50 - 4.50', flag: 'Normal' },
            { name: 'Fasting Blood Glucose', value: '94', unit: 'mg/dL', normalRange: '70 - 99', flag: 'Normal' },
            { name: 'HbA1c (Glycated Hemoglobin)', value: '5.4', unit: '%', normalRange: '< 5.7', flag: 'Normal' },
            { name: 'Total Cholesterol', value: '182', unit: 'mg/dL', normalRange: '< 200', flag: 'Normal' },
            { name: 'Triglycerides', value: '138', unit: 'mg/dL', normalRange: '< 150', flag: 'Normal' },
            { name: 'HDL Cholesterol', value: '48', unit: 'mg/dL', normalRange: '> 40', flag: 'Normal' },
            { name: 'LDL Cholesterol', value: '106', unit: 'mg/dL', normalRange: '< 100', flag: 'Borderline' },
            { name: 'SGOT / AST', value: '26', unit: 'U/L', normalRange: '10 - 40', flag: 'Normal' },
            { name: 'SGPT / ALT', value: '31', unit: 'U/L', normalRange: '7 - 45', flag: 'Normal' },
            { name: 'Serum Bilirubin (Total)', value: '0.8', unit: 'mg/dL', normalRange: '0.2 - 1.2', flag: 'Normal' },
            { name: 'Serum Creatinine', value: '0.95', unit: 'mg/dL', normalRange: '0.7 - 1.3', flag: 'Normal' },
            { name: 'Blood Urea', value: '24', unit: 'mg/dL', normalRange: '15 - 40', flag: 'Normal' },
            { name: 'Urine Routine (Protein)', value: 'Nil', unit: 'Semi-Quant', normalRange: 'Nil / Negative', flag: 'Normal' },
            { name: 'Urine Routine (Sugar)', value: 'Nil', unit: 'Semi-Quant', normalRange: 'Nil / Negative', flag: 'Normal' }
          ]
    };

    setPreviewTargetReport(readyReport);
    setPreviewTargetOrder(targetOrder);
    setIsReportPreviewOpen(true);
  };

  // Add / Edit Test
  const handleSaveTest = (testData) => {
    setTests((prev) => {
      const exists = prev.some((t) => t.id === testData.id || t.code === testData.code);
      if (exists) {
        return prev.map((t) => (t.id === testData.id || t.code === testData.code ? testData : t));
      }
      return [testData, ...prev];
    });
  };

  // Toggle Test Status
  const handleToggleTestStatus = (id) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' } : t))
    );
  };

  // Add / Edit Package
  const handleSavePackage = (pkgData, type) => {
    if (type === 'curated') {
      setCuratedPackages((prev) => {
        const exists = prev.some((p) => p.id === pkgData.id || p.code === pkgData.code);
        if (exists) return prev.map((p) => (p.id === pkgData.id || p.code === pkgData.code ? pkgData : p));
        return [pkgData, ...prev];
      });
    } else {
      setPopularPackages((prev) => {
        const exists = prev.some((p) => p.id === pkgData.id || p.code === pkgData.code);
        if (exists) return prev.map((p) => (p.id === pkgData.id || p.code === pkgData.code ? pkgData : p));
        return [pkgData, ...prev];
      });
    }
  };

  // Toggle Package Status
  const handleTogglePackageStatus = (id, type) => {
    if (type === 'curated') {
      setCuratedPackages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p))
      );
    } else {
      setPopularPackages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p))
      );
    }
  };

  // Duplicate Package
  const handleDuplicatePackage = (pkg, type) => {
    const cloned = {
      ...pkg,
      id: `PKG-CLONE-${Date.now().toString().slice(-4)}`,
      code: `${pkg.code}-COPY`,
      name: `${pkg.name} (Copy)`
    };
    handleSavePackage(cloned, type);
    addToast(`Duplicated package: ${cloned.name}`, 'success');
  };

  // Staff Save & Status Toggle
  const handleSaveStaff = (staffData) => {
    setStaff((prev) => {
      const exists = prev.some((s) => s.id === staffData.id);
      if (exists) return prev.map((s) => (s.id === staffData.id ? staffData : s));
      return [staffData, ...prev];
    });
  };

  const handleToggleStaffAvailability = (id) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, availability: s.availability === 'Available' ? 'Busy' : 'Available' }
          : s
      )
    );
  };

  // Center Save & Status Toggle
  const handleSaveCenter = (centerData) => {
    setCenters((prev) => {
      const exists = prev.some((c) => c.id === centerData.id);
      if (exists) return prev.map((c) => (c.id === centerData.id ? centerData : c));
      return [centerData, ...prev];
    });
  };

  const handleToggleCenterStatus = (id) => {
    setCenters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c))
    );
  };

  // Advance sample status
  const handleAdvanceSampleStatus = (sampleId, nextStatus) => {
    setSamples((prev) =>
      prev.map((s) => (s.sampleId === sampleId ? { ...s, sampleStatus: nextStatus } : s))
    );
    addToast(`Sample ${sampleId} transitioned to ${nextStatus}`, 'success');
  };

  // Render Submodule Views
  const renderActiveView = () => {
    switch (activeModule) {
      case 'orders':
        return (
          <LabOrdersView
            orders={orders}
            onOpenOrderDetails={handleOpenOrderDetails}
            onOpenVerifyOrder={(o) => {
              setVerifyTargetOrder(o);
              setIsVerifyOrderOpen(true);
            }}
            onOpenScheduleCollection={(o) => {
              setScheduleTargetOrder(o);
              setIsScheduleCollectionOpen(true);
            }}
            onMarkSampleCollected={handleMarkSampleCollected}
            onMarkSampleReceived={handleMarkSampleReceived}
            onStartProcessing={handleStartProcessing}
            onUploadReport={(o) => {
              setUploadTargetOrder(o);
              setUploadTargetReport(null);
              setIsReportUploadOpen(true);
            }}
            onVerifyReport={(o) => {
              const rep = reports.find((r) => r.orderId === o.orderId) || {
                reportId: o.reportId || 'REP10001',
                orderId: o.orderId,
                patientName: o.patient?.name,
                patientAge: o.patient?.age,
                gender: o.patient?.gender,
                testOrPackageName: o.bookedItem?.name || o.testOrPackage?.name,
                sampleId: o.sampleId || 'SMP10001'
              };
              setVerifyTargetReport(rep);
              setIsReportVerificationOpen(true);
            }}
            onSendToPatient={handleSendReportToPatient}
            onPreviewReport={handleOpenPreviewReport}
            initialTab={ordersSubTab}
          />
        );

      case 'tests':
        return (
          <LabTestCatalogueView
            tests={tests}
            onOpenAddTest={() => {
              setEditingTest(null);
              setIsAddEditTestOpen(true);
            }}
            onOpenEditTest={(t) => {
              setEditingTest(t);
              setIsAddEditTestOpen(true);
            }}
            onToggleTestStatus={handleToggleTestStatus}
          />
        );

      case 'packages':
        return (
          <LabCheckupPackagesView
            popularPackages={popularPackages}
            curatedPackages={curatedPackages}
            onOpenPackageDetails={(pkg) => {
              setDetailTargetPackage(pkg);
              setIsPackageDetailOpen(true);
            }}
            onOpenAddPackage={(type) => {
              setEditingPackage(null);
              setPackageType(type);
              setIsAddEditPackageOpen(true);
            }}
            onOpenEditPackage={(pkg, type) => {
              setEditingPackage(pkg);
              setPackageType(type);
              setIsAddEditPackageOpen(true);
            }}
            onDuplicatePackage={handleDuplicatePackage}
            onTogglePackageStatus={handleTogglePackageStatus}
          />
        );

      case 'staff':
        return (
          <LabCollectionStaffView
            staff={staff}
            onOpenAddStaff={() => {
              setEditingStaff(null);
              setIsAddEditStaffOpen(true);
            }}
            onOpenEditStaff={(s) => {
              setEditingStaff(s);
              setIsAddEditStaffOpen(true);
            }}
            onToggleAvailability={handleToggleStaffAvailability}
            onToggleStaffStatus={(id) => {
              setStaff((prev) =>
                prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
              );
            }}
          />
        );

      case 'samples':
        return (
          <LabSampleManagementView
            samples={samples}
            onOpenRejectModal={(s) => {
              setRejectTargetSample(s);
              setIsSampleRejectOpen(true);
            }}
            onAdvanceSampleStatus={handleAdvanceSampleStatus}
          />
        );

      case 'reports':
        return (
          <LabReportsView
            reports={reports}
            onOpenUploadModal={(rep) => {
              setUploadTargetReport(rep);
              setUploadTargetOrder(null);
              setIsReportUploadOpen(true);
            }}
            onOpenVerificationModal={(rep) => {
              setVerifyTargetReport(rep);
              setIsReportVerificationOpen(true);
            }}
            onOpenPreviewModal={handleOpenPreviewReport}
            onSendReportToPatient={handleSendReportToPatient}
          />
        );

      case 'centers':
        return (
          <LabCentersView
            centers={centers}
            onOpenAddCenter={() => {
              setEditingCenter(null);
              setIsAddEditCenterOpen(true);
            }}
            onOpenEditCenter={(c) => {
              setEditingCenter(c);
              setIsAddEditCenterOpen(true);
            }}
            onToggleCenterStatus={handleToggleCenterStatus}
          />
        );

      case 'pricing-tat':
        return (
          <LabPricingTatView
            tests={tests}
            popularPackages={popularPackages}
            curatedPackages={curatedPackages}
            onOpenEditPricing={(item, itemType) => {
              setPricingTargetItem(item);
              setPricingItemType(itemType);
              setIsEditPricingTatOpen(true);
            }}
            onToggleStatus={(id, itemType) => {
              if (itemType === 'test') {
                handleToggleTestStatus(id);
              } else {
                handleTogglePackageStatus(id, 'popular');
              }
            }}
          />
        );

      case 'bills':
        return (
          <NovusBillsView
            orders={orders}
            onOpenOrderDetails={handleOpenOrderDetails}
          />
        );

      case 'settings':
        return <LabSettingsView />;

      case 'dashboard':
      default:
        return (
          <LabDashboardView
            orders={orders}
            samples={samples}
            reports={reports}
            staff={staff}
            tests={tests}
            packages={[...popularPackages, ...curatedPackages]}
            onNavigateToModule={(mod, subTab) => {
              setActiveModule(mod);
              if (subTab) setOrdersSubTab(subTab);
            }}
            onOpenOrderDetails={handleOpenOrderDetails}
            onVerifyOrder={(o) => {
              setVerifyTargetOrder(o);
              setIsVerifyOrderOpen(true);
            }}
            onScheduleCollection={(o) => {
              setScheduleTargetOrder(o);
              setIsScheduleCollectionOpen(true);
            }}
            onVerifyReport={(rep) => {
              setVerifyTargetReport(rep);
              setIsReportVerificationOpen(true);
            }}
            onUploadReport={(o) => {
              setUploadTargetOrder(o);
              setUploadTargetReport(null);
              setIsReportUploadOpen(true);
            }}
            onMarkSampleCollected={handleMarkSampleCollected}
            onMarkSampleReceived={handleMarkSampleReceived}
            onSendToPatient={handleSendReportToPatient}
            onPreviewReport={handleOpenPreviewReport}
          />
        );
    }
  };

  return (
    <div className="min-h-full animate-fade-in">
      
      {/* Active Submodule View */}
      {renderActiveView()}

      {/* ==================== MODALS & DRAWERS ==================== */}

      {/* 1. Order Detail Workspace Modal */}
      <OrderDetailDrawer
        isOpen={isOrderDetailOpen}
        onClose={() => setIsOrderDetailOpen(false)}
        order={detailTargetOrder}
        orders={orders}
        onSelectOrder={setDetailTargetOrder}
        allTests={tests}
        onVerifyOrder={(o) => {
          setVerifyTargetOrder(o);
          setIsVerifyOrderOpen(true);
        }}
        onScheduleCollection={(o) => {
          setScheduleTargetOrder(o);
          setIsScheduleCollectionOpen(true);
        }}
        onConfirmScheduleCollection={handleConfirmScheduleCollection}
        availableStaff={staff}
        onPhlebotomistStep={handlePhlebotomistStep}
        onMarkSampleCollected={handleMarkSampleCollected}
        onMarkSampleReceived={handleMarkSampleReceived}
        onVerifySample={handleVerifySample}
        onStartProcessing={handleStartProcessing}
        onUploadReport={(o) => {
          setUploadTargetOrder(o);
          setUploadTargetReport(null);
          setIsReportUploadOpen(true);
        }}
        onVerifyReport={(o) => {
          const rep = reports.find((r) => r.orderId === o.orderId) || {
            reportId: o.reportId || 'REP10001',
            orderId: o.orderId,
            patientName: o.patient?.name,
            patientAge: o.patient?.age,
            gender: o.patient?.gender,
            testOrPackageName: o.bookedItem?.name || o.testOrPackage?.name,
            sampleId: o.sampleId || 'SMP10001'
          };
          setVerifyTargetReport(rep);
          setIsReportVerificationOpen(true);
        }}
        onSendToPatient={handleSendReportToPatient}
        onPreviewReport={handleOpenPreviewReport}
        onTriggerRecollection={handleTriggerRecollection}
        onCancelOrder={(o) => {
          setVerifyTargetOrder(o);
          setIsVerifyOrderOpen(true);
        }}
        onAdvanceDemoStep={handleAdvanceDemoStep}
        onResetOrderDemo={handleResetOrderDemo}
      />

      {/* 2. Verify Order Modal */}
      <VerifyOrderModal
        isOpen={isVerifyOrderOpen}
        onClose={() => setIsVerifyOrderOpen(false)}
        order={verifyTargetOrder}
        onConfirmVerify={handleConfirmVerifyOrder}
        onCancelOrder={handleCancelOrder}
      />

      {/* 3. Schedule Collection / Assign Phlebotomist Modal */}
      <ScheduleCollectionModal
        isOpen={isScheduleCollectionOpen}
        onClose={() => setIsScheduleCollectionOpen(false)}
        order={scheduleTargetOrder}
        onConfirmSchedule={handleConfirmScheduleCollection}
      />

      {/* 4. Reject Sample Modal */}
      <SampleRejectModal
        isOpen={isSampleRejectOpen}
        onClose={() => setIsSampleRejectOpen(false)}
        sample={rejectTargetSample}
        onConfirmReject={handleConfirmRejectSample}
      />

      {/* 5. Upload Report Modal */}
      <ReportUploadModal
        isOpen={isReportUploadOpen}
        onClose={() => setIsReportUploadOpen(false)}
        report={uploadTargetReport}
        order={uploadTargetOrder}
        onSaveReport={handleSaveReport}
        onPreviewReport={handleOpenPreviewReport}
      />

      {/* 6. Pathologist Verification Modal */}
      <ReportVerificationModal
        isOpen={isReportVerificationOpen}
        onClose={() => setIsReportVerificationOpen(false)}
        report={verifyTargetReport}
        order={detailTargetOrder}
        onConfirmVerification={handleConfirmVerification}
        onRejectReport={handleRejectReport}
      />

      {/* 7. Official Report Preview Modal */}
      <ReportPreviewModal
        isOpen={isReportPreviewOpen}
        onClose={() => setIsReportPreviewOpen(false)}
        report={previewTargetReport}
        order={previewTargetOrder}
        onSendToPatient={handleSendReportToPatient}
      />

      {/* 8. Add / Edit Test Modal */}
      <AddEditTestModal
        isOpen={isAddEditTestOpen}
        onClose={() => setIsAddEditTestOpen(false)}
        test={editingTest}
        onSaveTest={handleSaveTest}
      />

      {/* 9. Checkup Package Details Modal */}
      <PackageDetailModal
        isOpen={isPackageDetailOpen}
        onClose={() => setIsPackageDetailOpen(false)}
        packageData={detailTargetPackage}
        onUpdatePackage={(pkg) => handleSavePackage(pkg, pkg.category?.includes('Lifestyle') ? 'curated' : 'popular')}
        allTests={tests}
      />

      {/* 10. Add / Edit Package Modal */}
      <AddEditPackageModal
        isOpen={isAddEditPackageOpen}
        onClose={() => setIsAddEditPackageOpen(false)}
        packageData={editingPackage}
        packageType={packageType}
        allTests={tests}
        onSavePackage={handleSavePackage}
      />

      {/* 11. Add / Edit Staff Modal */}
      <AddEditStaffModal
        isOpen={isAddEditStaffOpen}
        onClose={() => setIsAddEditStaffOpen(false)}
        staff={editingStaff}
        onSaveStaff={handleSaveStaff}
      />

      {/* 12. Add / Edit Center Modal */}
      <AddEditCenterModal
        isOpen={isAddEditCenterOpen}
        onClose={() => setIsAddEditCenterOpen(false)}
        center={editingCenter}
        onSaveCenter={handleSaveCenter}
      />

      {/* 13. Edit Pricing & TAT Modal */}
      <EditPricingTatModal
        isOpen={isEditPricingTatOpen}
        onClose={() => setIsEditPricingTatOpen(false)}
        item={pricingTargetItem}
        itemType={pricingItemType}
        onSave={(id, updatedItem) => {
          if (pricingItemType === 'test') {
            handleSaveTest(updatedItem);
          } else {
            handleSavePackage(updatedItem, updatedItem.category?.includes('Lifestyle') ? 'curated' : 'popular');
          }
        }}
      />

    </div>
  );
}
