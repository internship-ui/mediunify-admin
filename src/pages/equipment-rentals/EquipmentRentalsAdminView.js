import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Import master datasets focused on Vendor Verification & Request Monitoring
import {
  INITIAL_VENDORS_DATA,
  INITIAL_RENTAL_REQUESTS
} from '../../data/equipmentRentalData';

// Import sub-views matching exact 6 modules
import EquipmentRentalDashboardView from './views/EquipmentRentalDashboardView';
import RentalRequestsView from './views/RentalRequestsView';
import VendorVerificationView from './views/VendorVerificationView';
import VendorsManagementView from './views/VendorsManagementView';
import ActiveRentalsView from './views/ActiveRentalsView';
import CompletedRentalsView from './views/CompletedRentalsView';
import EarningsRentalValueView from './views/EarningsRentalValueView';

export default function EquipmentRentalsAdminView() {
  const { activeModule, setActiveModule } = useAuth();
  const { addToast } = useToast();

  // Master State Stores
  const [vendors, setVendors] = useState(INITIAL_VENDORS_DATA);
  const [requests, setRequests] = useState(INITIAL_RENTAL_REQUESTS);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // 1. Approve Vendor
  const handleApproveVendor = (vendorId) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              status: 'Active',
              rejectionReason: null
            }
          : v
      )
    );

    const vendor = vendors.find((v) => v.id === vendorId);
    addToast({
      title: 'Vendor Approved',
      message: `${vendor?.businessName || vendorId} has been verified and marked Active.`,
      type: 'success'
    });
  };

  // 2. Reject Vendor
  const handleRejectVendor = (vendorId, reason) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              status: 'Rejected',
              rejectionReason: reason
            }
          : v
      )
    );

    const vendor = vendors.find((v) => v.id === vendorId);
    addToast({
      title: 'Vendor Registration Rejected',
      message: `${vendor?.businessName || vendorId} was rejected. Reason: "${reason}"`,
      type: 'info'
    });
  };

  // 3. Add Vendor Manually
  const handleAddVendor = (newVendorData) => {
    setVendors((prev) => [newVendorData, ...prev]);
    addToast({
      title: 'Vendor Added',
      message: `${newVendorData.businessName} has been registered successfully.`,
      type: 'success'
    });
  };

  // 4. Update Vendor Status (Active <-> Inactive)
  const handleUpdateVendorStatus = (vendorId, newStatus) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              status: newStatus
            }
          : v
      )
    );

    const vendor = vendors.find((v) => v.id === vendorId);
    addToast({
      title: 'Status Updated',
      message: `${vendor?.businessName || vendorId} is now ${newStatus}.`,
      type: 'info'
    });
  };

  // 5. Edit Vendor
  const handleEditVendor = (updatedVendor) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === updatedVendor.id ? { ...v, ...updatedVendor } : v))
    );
    addToast({
      title: 'Vendor Updated',
      message: `${updatedVendor.businessName} details updated successfully.`,
      type: 'success'
    });
  };

  // 6. Verify Vendor
  const handleVerifyVendor = (vendorId) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, verificationStatus: 'Verified', status: 'Active' }
          : v
      )
    );
    const vendor = vendors.find((v) => v.id === vendorId);
    addToast({
      title: 'Vendor Verified',
      message: `${vendor?.businessName || vendorId} has been verified and activated.`,
      type: 'success'
    });
  };

  // Drilldown helper: open specific request
  const handleOpenRequest = (reqId) => {
    setSelectedRequestId(reqId);
    setActiveModule('requests');
  };

  const currentModule = (activeModule || 'dashboard').toLowerCase().trim();

  return (
    <div>
      {/* 1. Dashboard View */}
      {currentModule === 'dashboard' && (
        <EquipmentRentalDashboardView
          requests={requests}
          vendors={vendors}
          onNavigateModule={(mod) => {
            setSelectedRequestId(null);
            setActiveModule(mod);
          }}
          onOpenRequest={handleOpenRequest}
        />
      )}

      {/* 2. Rental Requests View */}
      {(currentModule === 'requests' || currentModule === 'rental-requests') && (
        <RentalRequestsView
          requests={requests}
          selectedRequestId={selectedRequestId}
          onSelectRequest={(id) => setSelectedRequestId(id)}
        />
      )}

      {/* 3. Vendor Verification View (Main admin function) */}
      {(currentModule === 'vendor-verification' || currentModule === 'verification') && (
        <VendorVerificationView
          vendors={vendors}
          onApproveVendor={handleApproveVendor}
          onRejectVendor={handleRejectVendor}
          onAddVendor={handleAddVendor}
        />
      )}

      {/* 4. Vendors Directory / Management */}
      {(currentModule === 'vendors' || currentModule === 'vendor-list') && (
        <VendorsManagementView
          vendors={vendors}
          onAddVendor={handleAddVendor}
          onEditVendor={handleEditVendor}
          onVerifyVendor={handleVerifyVendor}
          onUpdateVendorStatus={handleUpdateVendorStatus}
        />
      )}

      {/* 5. Active Rentals */}
      {(currentModule === 'active-rentals' || currentModule === 'active') && (
        <ActiveRentalsView
          requests={requests}
          onOpenRequest={handleOpenRequest}
        />
      )}

      {/* 6. Completed Rentals */}
      {(currentModule === 'completed-rentals' || currentModule === 'completed') && (
        <CompletedRentalsView
          requests={requests}
        />
      )}

      {/* 7. Earnings & Rental Value View */}
      {(currentModule === 'earnings' || currentModule === 'earnings-value' || currentModule === 'earnings-and-rental-value') && (
        <EarningsRentalValueView
          requests={requests}
          vendors={vendors}
          onOpenRequest={handleOpenRequest}
        />
      )}
    </div>
  );
}
