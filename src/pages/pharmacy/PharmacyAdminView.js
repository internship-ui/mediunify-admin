import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  INITIAL_MEDICINES,
  INITIAL_BATCHES,
  INITIAL_STOCK_HISTORY,
  INITIAL_ORDERS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_DELIVERIES,
  PHARMACY_SUPPLIERS
} from '../../data/pharmacyData';

// Modals
import AddMedicineModal from './components/AddMedicineModal';
import AddStockModal from './components/AddStockModal';
import StockAdjustmentModal from './components/StockAdjustmentModal';
import MedicineDetailModal from './components/MedicineDetailModal';
import OrderDetailModal from './components/OrderDetailModal';
import PrescriptionDetailModal from './components/PrescriptionDetailModal';
import AddSupplierModal from './components/AddSupplierModal';
import ImportStockExcelModal from './components/ImportStockExcelModal';

// Views
import PharmacyDashboardView from './views/PharmacyDashboardView';
import PharmacyInventoryView from './views/PharmacyInventoryView';
import PharmacyOrdersView from './views/PharmacyOrdersView';
import PharmacyDeliveryView from './views/PharmacyDeliveryView';
import PharmacySuppliersView from './views/PharmacySuppliersView';
import PharmacyReportsView from './views/PharmacyReportsView';
import PharmacySettingsView from './views/PharmacySettingsView';

export default function PharmacyAdminView({ isThirdParty = false }) {
  const { activeModule, setActiveModule, currentService } = useAuth();
  const { addToast } = useToast();

  const isExternal = Boolean(isThirdParty || currentService?.id === 'third-party-pharmacy');

  // If previous route was suppliers or prescriptions, default to dashboard
  useEffect(() => {
    if (activeModule === 'suppliers' || activeModule === 'prescriptions') {
      setActiveModule('dashboard');
    }
  }, [activeModule, setActiveModule]);

  // Centralized State
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES);
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [stockHistory, setStockHistory] = useState(INITIAL_STOCK_HISTORY);
  const [suppliers, setSuppliers] = useState(PHARMACY_SUPPLIERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);

  // Sub-tab control for inventory
  const [inventorySubTab, setInventorySubTab] = useState('all');

  // Modal states
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [addStockTargetMedicine, setAddStockTargetMedicine] = useState(null);

  const [isStockAdjustmentOpen, setIsStockAdjustmentOpen] = useState(false);
  const [adjustmentTargetMedicine, setAdjustmentTargetMedicine] = useState(null);

  const [isMedicineDetailOpen, setIsMedicineDetailOpen] = useState(false);
  const [detailTargetMedicine, setDetailTargetMedicine] = useState(null);

  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [detailTargetOrder, setDetailTargetOrder] = useState(null);

  const [isPrescriptionDetailOpen, setIsPrescriptionDetailOpen] = useState(false);
  const [detailTargetPrescription, setDetailTargetPrescription] = useState(null);

  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [isImportExcelOpen, setIsImportExcelOpen] = useState(false);

  // 1. ADD MEDICINE HANDLER
  const handleSaveMedicine = (medicineData) => {
    const newId = `MED${String(medicines.length + 1).padStart(3, '0')}`;
    const initialStock = Number(medicineData.initialStock || 0);
    const minStock = Number(medicineData.minimumStock || 50);
    const status =
      initialStock === 0 ? 'Out of Stock' : initialStock <= minStock ? 'Low Stock' : 'In Stock';

    const newMed = {
      id: newId,
      name: medicineData.name,
      genericName: medicineData.genericName,
      category: medicineData.category,
      medicineType: medicineData.medicineType || 'Allopathic',
      strength: medicineData.strength,
      dosageForm: medicineData.dosageForm,
      manufacturer: medicineData.manufacturer,
      description: medicineData.description,
      image: medicineData.image || null,
      prescriptionRequired: Boolean(medicineData.prescriptionRequired),
      availableStock: initialStock,
      minimumStock: minStock,
      reorderLevel: Number(medicineData.reorderLevel || 100),
      batchNumber: medicineData.batchNumber || `BAT26-${Math.floor(100 + Math.random() * 900)}`,
      mfgDate: medicineData.mfgDate || 'Sep 2026',
      expiryDate: medicineData.expiryDate || 'Aug 2028',
      daysRemaining: 700,
      supplier: medicineData.supplier || 'ABC Pharma Distributors',
      purchasePrice: Number(medicineData.purchasePrice || 0),
      sellingPrice: Number(medicineData.sellingPrice || 0),
      status
    };

    setMedicines((prev) => [newMed, ...prev]);

    // If initial batch info is provided, add to batch list & history
    if (newMed.batchNumber) {
      const newBatch = {
        batchNumber: newMed.batchNumber,
        medicineId: newMed.id,
        medicineName: newMed.name,
        quantity: initialStock,
        mfgDate: newMed.mfgDate,
        expiryDate: newMed.expiryDate,
        daysRemaining: newMed.daysRemaining,
        supplier: newMed.supplier,
        purchasePrice: newMed.purchasePrice,
        status: initialStock === 0 ? 'Empty' : 'Active'
      };
      setBatches((prev) => [newBatch, ...prev]);

      if (initialStock > 0) {
        const historyEntry = {
          id: `TXN-${Date.now().toString().slice(-4)}`,
          date: '29 Sep 2026, Just now',
          medicineName: newMed.name,
          batch: newMed.batchNumber,
          transactionType: 'Stock Added',
          quantity: `+${initialStock}`,
          previousStock: 0,
          updatedStock: initialStock,
          reason: 'Initial SKU Registration Stock',
          performedBy: 'Pharmacy Admin'
        };
        setStockHistory((prev) => [historyEntry, ...prev]);
      }
    }

    addToast(`Successfully added medicine: ${newMed.name}`, 'success');
  };

  // 1B. BULK STOCK UPDATE HANDLER (Excel Import)
  const handleBulkStockUpdate = ({ items, importMode, fileName }) => {
    let totalAdded = 0;
    const nowTime = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // 1. Update medicines
    setMedicines((prev) =>
      prev.map((med) => {
        const matchingItem = items.find(
          (item) => item.medicineId === med.id || item.medicineName?.toLowerCase() === med.name?.toLowerCase()
        );

        if (!matchingItem) return med;

        const previousStock = Number(med.availableStock || 0);
        const qty = Number(matchingItem.inputQuantity || 0);
        const updatedStock = importMode === 'ADD' ? previousStock + qty : qty;
        const minStock = Number(med.minimumStock || 50);
        const status = updatedStock === 0 ? 'Out of Stock' : updatedStock <= minStock ? 'Low Stock' : 'In Stock';

        totalAdded += qty;

        // Log transaction in stockHistory
        const historyEntry = {
          id: `TXN-${Date.now().toString().slice(-4)}-${Math.floor(10 + Math.random() * 90)}`,
          date: `${nowTime}, Just now`,
          medicineName: med.name,
          batch: matchingItem.batchNumber || med.batchNumber,
          transactionType: 'Excel Bulk Intake',
          quantity: importMode === 'ADD' ? `+${qty}` : `${updatedStock - previousStock >= 0 ? '+' : ''}${updatedStock - previousStock}`,
          previousStock,
          updatedStock,
          reason: `Bulk stock intake via ${fileName || 'Excel spreadsheet'}. Invoice #${matchingItem.invoiceNumber || 'EXCEL-INV'}`,
          performedBy: 'Pharmacy Admin'
        };
        setStockHistory((h) => [historyEntry, ...h]);

        return {
          ...med,
          availableStock: updatedStock,
          batchNumber: matchingItem.batchNumber || med.batchNumber,
          expiryDate: matchingItem.expiryDate || med.expiryDate,
          purchasePrice: matchingItem.purchasePrice ? Number(matchingItem.purchasePrice) : med.purchasePrice,
          sellingPrice: matchingItem.sellingPrice ? Number(matchingItem.sellingPrice) : med.sellingPrice,
          status
        };
      })
    );

    // 2. Update batches
    setBatches((prev) => {
      let updatedBatches = [...prev];
      items.forEach((item) => {
        const existingIdx = updatedBatches.findIndex((b) => b.batchNumber === item.batchNumber);
        if (existingIdx >= 0) {
          updatedBatches[existingIdx] = {
            ...updatedBatches[existingIdx],
            quantity: importMode === 'ADD'
              ? Number(updatedBatches[existingIdx].quantity || 0) + item.inputQuantity
              : item.inputQuantity,
            status: 'Active'
          };
        } else {
          updatedBatches.unshift({
            batchNumber: item.batchNumber,
            medicineId: item.medicineId,
            medicineName: item.medicineName,
            quantity: item.inputQuantity,
            mfgDate: item.mfgDate || 'Sep 2026',
            expiryDate: item.expiryDate || 'Dec 2028',
            daysRemaining: 680,
            supplier: item.supplier || 'ABC Pharma Distributors',
            purchasePrice: Number(item.purchasePrice || 0),
            status: 'Active'
          });
        }
      });
      return updatedBatches;
    });

    addToast(`Successfully updated stock for ${items.length} medicines via Excel (+${totalAdded.toLocaleString()} units)!`, 'success');
  };

  // 2. ADD STOCK HANDLER (Requirement 7: Existing Stock + New Stock = Updated Stock)
  const handleAddStock = ({ medicineId, batchNumber, quantity, mfgDate, expiryDate, supplier, purchasePrice, sellingPrice, invoiceNumber, notes }) => {
    const qtyToAdd = Number(quantity);
    let updatedMedName = '';

    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId || med.name === medicineId) {
          updatedMedName = med.name;
          const previousStock = Number(med.availableStock || 0);
          const updatedStock = previousStock + qtyToAdd;
          const minStock = Number(med.minimumStock || 50);
          const status =
            updatedStock === 0 ? 'Out of Stock' : updatedStock <= minStock ? 'Low Stock' : 'In Stock';

          // Add history entry
          const historyEntry = {
            id: `TXN-${Date.now().toString().slice(-4)}`,
            date: '29 Sep 2026, Just now',
            medicineName: med.name,
            batch: batchNumber,
            transactionType: 'Stock Added',
            quantity: `+${qtyToAdd}`,
            previousStock,
            updatedStock,
            reason: `Stock received via Invoice #${invoiceNumber || 'INV-DIRECT'}. ${notes || ''}`.trim(),
            performedBy: 'Pharmacy Admin'
          };
          setStockHistory((h) => [historyEntry, ...h]);

          return {
            ...med,
            availableStock: updatedStock,
            batchNumber,
            expiryDate: expiryDate || med.expiryDate,
            purchasePrice: purchasePrice ? Number(purchasePrice) : med.purchasePrice,
            sellingPrice: sellingPrice ? Number(sellingPrice) : med.sellingPrice,
            status
          };
        }
        return med;
      })
    );

    // Update or add batch
    setBatches((prev) => {
      const existingIdx = prev.findIndex((b) => b.batchNumber === batchNumber);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: Number(updated[existingIdx].quantity || 0) + qtyToAdd,
          status: 'Active'
        };
        return updated;
      } else {
        return [
          {
            batchNumber,
            medicineId,
            medicineName: updatedMedName || medicineId,
            quantity: qtyToAdd,
            mfgDate: mfgDate || 'Sep 2026',
            expiryDate: expiryDate || 'Aug 2028',
            daysRemaining: 680,
            supplier: supplier || 'ABC Pharma Distributors',
            purchasePrice: Number(purchasePrice || 0),
            status: 'Active'
          },
          ...prev
        ];
      }
    });

    addToast(`Successfully added ${qtyToAdd} units to stock!`, 'success');
  };

  // 3. STOCK ADJUSTMENT HANDLER (Requirement 8)
  const handleStockAdjustment = ({ medicineId, batchNumber, adjustmentType, quantity, reason, notes }) => {
    const qty = Number(quantity);
    let isReduction = ['Remove Stock', 'Damaged Stock', 'Expired Stock'].includes(adjustmentType);
    let diff = isReduction ? -qty : qty;

    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId || med.name === medicineId) {
          const previousStock = Number(med.availableStock || 0);
          const updatedStock = Math.max(0, previousStock + diff);
          const minStock = Number(med.minimumStock || 50);
          const status =
            updatedStock === 0 ? 'Out of Stock' : updatedStock <= minStock ? 'Low Stock' : 'In Stock';

          // Audit record
          const historyEntry = {
            id: `TXN-${Date.now().toString().slice(-4)}`,
            date: '29 Sep 2026, Just now',
            medicineName: med.name,
            batch: batchNumber || med.batchNumber || 'BAT-MAIN',
            transactionType: adjustmentType,
            quantity: diff > 0 ? `+${diff}` : `${diff}`,
            previousStock,
            updatedStock,
            reason: `${reason}. ${notes || ''}`.trim(),
            performedBy: 'Pharmacy Admin'
          };
          setStockHistory((h) => [historyEntry, ...h]);

          return {
            ...med,
            availableStock: updatedStock,
            status
          };
        }
        return med;
      })
    );

    // Update batch quantity
    setBatches((prev) =>
      prev.map((b) => {
        if (b.batchNumber === batchNumber) {
          const newQty = Math.max(0, Number(b.quantity || 0) + diff);
          return {
            ...b,
            quantity: newQty,
            status: newQty === 0 ? 'Empty' : b.status
          };
        }
        return b;
      })
    );

    addToast(`Stock adjustment recorded (${adjustmentType}: ${diff > 0 ? `+${diff}` : diff} units)`, 'success');
  };

  // 4. SUPPLIER HANDLERS
  const handleSaveSupplier = (supplierData) => {
    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingSupplier.id ? { ...supplierData, id: s.id } : s))
      );
      addToast(`Updated supplier: ${supplierData.name}`, 'success');
    } else {
      const newSup = {
        ...supplierData,
        id: `SUP${String(suppliers.length + 1).padStart(3, '0')}`,
        status: 'Active'
      };
      setSuppliers((prev) => [newSup, ...prev]);
      addToast(`Added supplier: ${supplierData.name}`, 'success');
    }
  };

  const handleToggleSupplierStatus = (supplierId) => {
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === supplierId) {
          const nextStatus = s.status === 'Active' ? 'Inactive' : 'Active';
          addToast(`Supplier ${s.name} set to ${nextStatus}`, 'info');
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  // Navigation Helper
  const handleNavigateModule = (moduleId, subTab = 'all') => {
    setActiveModule(moduleId);
    if (moduleId === 'inventory') {
      setInventorySubTab(subTab);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. DASHBOARD VIEW */}
      {(activeModule === 'dashboard' || !activeModule) && (
        <PharmacyDashboardView
          medicines={medicines}
          orders={orders}
          prescriptions={prescriptions}
          deliveries={deliveries}
          stockHistory={stockHistory}
          onNavigateModule={handleNavigateModule}
          onOpenAddStock={(med) => {
            setAddStockTargetMedicine(med);
            setIsAddStockOpen(true);
          }}
          onOpenAdjustStock={(med) => {
            setAdjustmentTargetMedicine(med);
            setIsStockAdjustmentOpen(true);
          }}
          onOpenMedicineDetails={(med) => {
            setDetailTargetMedicine(med);
            setIsMedicineDetailOpen(true);
          }}
          onOpenOrderDetails={(order) => {
            setDetailTargetOrder(order);
            setIsOrderDetailOpen(true);
          }}
          onOpenPrescriptionDetails={(rx) => {
            setDetailTargetPrescription(rx);
            setIsPrescriptionDetailOpen(true);
          }}
        />
      )}

      {/* 2. INVENTORY VIEW */}
      {activeModule === 'inventory' && (
        <PharmacyInventoryView
          medicines={medicines}
          batches={batches}
          stockHistory={stockHistory}
          suppliers={suppliers}
          initialSubTab={inventorySubTab}
          isThirdParty={isExternal}
          onOpenAddMedicine={isExternal ? null : () => setIsAddMedicineOpen(true)}
          onOpenAddStock={isExternal ? null : (med) => {
            setAddStockTargetMedicine(med);
            setIsAddStockOpen(true);
          }}
          onOpenAdjustStock={isExternal ? null : (med) => {
            setAdjustmentTargetMedicine(med);
            setIsStockAdjustmentOpen(true);
          }}
          onOpenMedicineDetails={(med) => {
            setDetailTargetMedicine(med);
            setIsMedicineDetailOpen(true);
          }}
          onOpenImportExcel={() => setIsImportExcelOpen(true)}
        />
      )}

      {/* 3. ORDERS VIEW */}
      {activeModule === 'orders' && (
        <PharmacyOrdersView
          orders={orders}
          onOpenOrderDetails={(order) => {
            setDetailTargetOrder(order);
            setIsOrderDetailOpen(true);
          }}
        />
      )}

      {/* 4. DELIVERY VIEW */}
      {activeModule === 'delivery' && (
        <PharmacyDeliveryView
          deliveries={deliveries}
          onOpenOrderDetails={(orderRef) => {
            const found = orders.find((o) => o.orderId === orderRef.orderId);
            setDetailTargetOrder(found || orderRef);
            setIsOrderDetailOpen(true);
          }}
        />
      )}

      {/* 6. REPORTS VIEW */}
      {activeModule === 'reports' && (
        <PharmacyReportsView
          medicines={medicines}
          orders={orders}
          deliveries={deliveries}
          stockHistory={stockHistory}
        />
      )}

      {/* 8. SETTINGS VIEW */}
      {activeModule === 'settings' && <PharmacySettingsView />}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Add Medicine SKU Modal */}
      <AddMedicineModal
        isOpen={isAddMedicineOpen}
        onClose={() => setIsAddMedicineOpen(false)}
        onSave={handleSaveMedicine}
        suppliers={suppliers}
      />

      {/* 2. Add Stock Modal */}
      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => {
          setIsAddStockOpen(false);
          setAddStockTargetMedicine(null);
        }}
        onSave={handleAddStock}
        medicines={medicines}
        suppliers={suppliers}
        selectedMedicine={addStockTargetMedicine}
      />

      {/* 3. Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isStockAdjustmentOpen}
        onClose={() => {
          setIsStockAdjustmentOpen(false);
          setAdjustmentTargetMedicine(null);
        }}
        onSave={handleStockAdjustment}
        medicines={medicines}
        selectedMedicine={adjustmentTargetMedicine}
      />

      {/* 3B. Bulk Stock Intake Excel Modal */}
      <ImportStockExcelModal
        isOpen={isImportExcelOpen}
        onClose={() => setIsImportExcelOpen(false)}
        medicines={medicines}
        onConfirmBulkStockUpdate={handleBulkStockUpdate}
      />

      {/* 4. Medicine Details Modal */}
      <MedicineDetailModal
        isOpen={isMedicineDetailOpen}
        onClose={() => {
          setIsMedicineDetailOpen(false);
          setDetailTargetMedicine(null);
        }}
        medicine={detailTargetMedicine}
        batches={batches}
        stockHistory={stockHistory}
        onAddStockClick={isExternal ? null : (med) => {
          setIsMedicineDetailOpen(false);
          setAddStockTargetMedicine(med);
          setIsAddStockOpen(true);
        }}
        onAdjustStockClick={isExternal ? null : (med) => {
          setIsMedicineDetailOpen(false);
          setAdjustmentTargetMedicine(med);
          setIsStockAdjustmentOpen(true);
        }}
      />

      {/* 5. Order Detail Modal */}
      <OrderDetailModal
        isOpen={isOrderDetailOpen}
        onClose={() => {
          setIsOrderDetailOpen(false);
          setDetailTargetOrder(null);
        }}
        order={detailTargetOrder}
        medicines={medicines}
        prescriptions={prescriptions}
      />

      {/* 6. Prescription Detail Modal */}
      <PrescriptionDetailModal
        isOpen={isPrescriptionDetailOpen}
        onClose={() => {
          setIsPrescriptionDetailOpen(false);
          setDetailTargetPrescription(null);
        }}
        prescription={detailTargetPrescription}
      />

      {/* 7. Add / Edit Supplier Modal */}
      <AddSupplierModal
        isOpen={isAddSupplierOpen}
        onClose={() => {
          setIsAddSupplierOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        editingSupplier={editingSupplier}
      />
    </div>
  );
}
