import React, { useState } from 'react';
import {
  Dna,
  Activity,
  Stethoscope,
  UserCheck,
  Calendar,
  HeartHandshake,
  Gift,
  Receipt,
  Sliders,
  Plus,
  CheckCircle2,
  Sparkles,
  Users
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import SelectInput from '../../components/forms/SelectInput';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  FERTILITY_IVF_STATS,
  FERTILITY_SPECIALISTS,
  FERTILITY_PROTOCOLS,
  FERTILITY_CYCLES,
  FERTILITY_PACKAGES
} from '../../data/fertilityIvfData';

export default function FertilityIvfAdminView() {
  const { activeModule, setActiveModule } = useAuth();
  const { addToast } = useToast();

  const [cycles, setCycles] = useState(FERTILITY_CYCLES);
  const [specialists, setSpecialists] = useState(FERTILITY_SPECIALISTS);
  const [protocols, setProtocols] = useState(FERTILITY_PROTOCOLS);
  const [packages, setPackages] = useState(FERTILITY_PACKAGES);

  const [isAddCycleOpen, setIsAddCycleOpen] = useState(false);
  const [cycleForm, setCycleForm] = useState({
    coupleName: '',
    femaleAge: '',
    maleAge: '',
    primaryDoctor: 'Dr. Nandita Palshetkar',
    protocol: 'Self IVF + ICSI with Blastocyst Culture',
    currentStage: 'Ovarian Stimulation & Follicular Scan',
    stageProgress: 20,
    cycleDay: 'Day 3',
    scheduledAction: 'Initial Baseline Scan & Estradiol level',
    status: 'In Progress'
  });

  const [viewingItem, setViewingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleOpenAddCycle = () => {
    setCycleForm({
      coupleName: '',
      femaleAge: '',
      maleAge: '',
      primaryDoctor: 'Dr. Nandita Palshetkar',
      protocol: 'Self IVF + ICSI with Blastocyst Culture',
      currentStage: 'Ovarian Stimulation & Follicular Scan',
      stageProgress: 20,
      cycleDay: 'Day 3',
      scheduledAction: 'Initial Baseline Scan & Estradiol level',
      status: 'In Progress'
    });
    setIsAddCycleOpen(true);
  };

  const handleSaveCycle = (e) => {
    e.preventDefault();
    if (!cycleForm.coupleName || !cycleForm.femaleAge) {
      addToast('Please provide couple names and age', 'warning');
      return;
    }

    const newCycle = {
      ...cycleForm,
      cycleId: `CYC-2026-${Math.floor(100 + Math.random() * 900)}`,
      femaleAge: Number(cycleForm.femaleAge),
      maleAge: Number(cycleForm.maleAge || 30),
      oocytesRetrieved: null,
      fertilizedCount: null
    };

    setCycles((prev) => [newCycle, ...prev]);
    addToast(`Initiated treatment cycle for ${cycleForm.coupleName}`, 'success');
    setIsAddCycleOpen(false);
  };

  // Cycle Columns
  const cycleColumns = [
    {
      header: 'Cycle ID & Couple',
      accessor: 'coupleName',
      render: (_, row) => (
        <div>
          <p className="font-bold text-brand-navy-900 text-sm">{row.coupleName}</p>
          <p className="text-xs text-brand-slate-400">
            ID: <span className="font-mono text-brand-teal-700 font-semibold">{row.cycleId}</span> • F:{row.femaleAge}y / M:{row.maleAge}y
          </p>
        </div>
      )
    },
    {
      header: 'Protocol',
      accessor: 'protocol',
      render: (val) => <span className="text-xs font-semibold text-brand-slate-800">{val}</span>
    },
    {
      header: 'Current Stage & Progress',
      accessor: 'currentStage',
      render: (_, row) => (
        <div className="w-48 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-navy-900 truncate">{row.currentStage}</span>
            <span className="font-bold text-brand-teal-600 ml-2">{row.stageProgress}%</span>
          </div>
          <div className="w-full bg-brand-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-teal-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${row.stageProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-brand-slate-400 truncate">{row.cycleDay} • {row.scheduledAction}</p>
        </div>
      )
    },
    { header: 'Primary Doctor', accessor: 'primaryDoctor' },
    { header: 'Cycle Status', accessor: 'status', isStatus: true }
  ];

  return (
    <div className="space-y-6">
      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-brand-slate-200">
        {[
          { id: 'dashboard', label: 'Fertility & IVF Dashboard', icon: Dna },
          { id: 'cycles', label: 'Treatment Cycles', icon: Activity },
          { id: 'services', label: 'Protocols & ART', icon: Stethoscope },
          { id: 'specialists', label: 'Specialists & Embryologists', icon: UserCheck },
          { id: 'packages', label: 'IVF Packages & Plans', icon: Gift },
          { id: 'settings', label: 'Center Settings', icon: Sliders }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-teal-600 text-white shadow-sm'
                  : 'text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. DASHBOARD */}
      {activeModule === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active IVF/IUI Cycles"
              value={FERTILITY_IVF_STATS.activeCycles}
              subtitle="Under active stimulation & culture"
              iconName="Activity"
              trend="+8 new this month"
              trendPositive={true}
              colorScheme="teal"
            />
            <StatCard
              title="Embryo Transfers"
              value={FERTILITY_IVF_STATS.embryoTransfersMonth}
              subtitle="Scheduled & fresh/frozen"
              iconName="HeartHandshake"
              trend="4 this week"
              trendPositive={true}
              colorScheme="teal"
            />
            <StatCard
              title="Clinical Pregnancy Rate"
              value={FERTILITY_IVF_STATS.clinicalSuccessRate}
              subtitle="Cumulative euploid blastocyst rate"
              iconName="Sparkles"
              trend="Top tier national benchmark"
              trendPositive={true}
              colorScheme="green"
            />
            <StatCard
              title="Cryobank Embryos"
              value={FERTILITY_IVF_STATS.cryoStorageEmbryos}
              subtitle="Vitrified in LN2 storage"
              iconName="Boxes"
              trend="100% LN2 telemetry OK"
              trendPositive={true}
              colorScheme="navy"
            />
          </div>

          {/* Active Cycles Table */}
          <DataTable
            title="Active Patient Treatment Cycles"
            subtitle="Real-time multi-stage monitoring from ovarian stimulation to embryo transfer and pregnancy test"
            columns={cycleColumns}
            data={cycles}
            searchKeys={['coupleName', 'cycleId', 'primaryDoctor']}
            onAddNew={handleOpenAddCycle}
            addNewLabel="Start Treatment Cycle"
            onView={(c) => setViewingItem({ type: 'cycle', data: c })}
          />
        </div>
      )}

      {/* 2. CYCLES */}
      {activeModule === 'cycles' && (
        <DataTable
          title="IVF, ICSI, & IUI Cycle Registry"
          subtitle="Comprehensive tracking of stimulation, egg collection, embryology, and pregnancy milestones"
          columns={cycleColumns}
          data={cycles}
          searchKeys={['coupleName', 'cycleId', 'primaryDoctor', 'protocol']}
          onAddNew={handleOpenAddCycle}
          addNewLabel="Enroll Couple into Cycle"
          onView={(c) => setViewingItem({ type: 'cycle', data: c })}
        />
      )}

      {/* 3. PROTOCOLS */}
      {activeModule === 'services' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-brand-navy-900">Assisted Reproductive Protocols & Clinical Services</h2>
            <p className="text-xs text-brand-slate-500">Established standard operating procedures for IVF, ICSI, and fertility preservation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {protocols.map((prt) => (
              <div
                key={prt.id}
                className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-sm hover:shadow-card transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200">
                    {prt.id}
                  </span>
                  <StatusBadge status={prt.status} size="xs" />
                </div>

                <h3 className="font-bold text-brand-navy-900 text-sm leading-snug">{prt.name}</h3>
                <p className="text-xs text-brand-slate-500">{prt.indication}</p>

                <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-brand-slate-400 block">Est. Cost</span>
                    <span className="font-bold text-brand-navy-900">₹{prt.baseCost.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-brand-slate-400 block">Benchmark</span>
                    <span className="font-semibold text-brand-teal-700">{prt.successRate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SPECIALISTS */}
      {activeModule === 'specialists' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-brand-navy-900">Reproductive Specialists & Embryologists</h2>
            <p className="text-xs text-brand-slate-500">Clinical faculty, senior embryology staff, and andrologists</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {specialists.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-teal-50 border border-brand-teal-100 text-brand-teal-600 flex items-center justify-center font-bold text-sm">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-navy-900 text-sm">{doc.name}</h3>
                      <p className="text-xs text-brand-slate-500">{doc.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={doc.status} size="xs" />
                </div>

                <div className="text-xs space-y-1 bg-brand-slate-50 p-3 rounded-xl border border-brand-slate-100">
                  <p><span className="text-brand-slate-400">Specialization:</span> {doc.specialization}</p>
                  <p><span className="text-brand-slate-400">Availability:</span> {doc.availability}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-brand-slate-400 pt-2 border-t border-brand-slate-100">
                  <span>{doc.experience}</span>
                  <span className="font-bold text-brand-teal-700">{doc.activePatientsCount} Active Cycles</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PACKAGES */}
      {activeModule === 'packages' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-brand-navy-900">IVF Packages & Financial Protection Plans</h2>
            <p className="text-xs text-brand-slate-500">Comprehensive cycle plans with transparent pricing and zero hidden add-ons</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <h3 className="font-bold text-brand-navy-900 text-sm mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-2xl font-black text-brand-teal-600">₹{pkg.price.toLocaleString()}</span>
                    <span className="text-xs text-brand-slate-400 ml-1">/ all-inclusive</span>
                  </div>

                  <div className="space-y-2 text-xs text-brand-slate-600">
                    {pkg.includes.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-between text-xs text-brand-slate-500">
                  <span className="text-brand-green-700 font-semibold">0% Interest EMI Available</span>
                  <button
                    onClick={() => addToast(`Package details printed for ${pkg.name}`, 'info')}
                    className="font-bold text-brand-teal-600 hover:underline"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SETTINGS */}
      {activeModule === 'settings' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-sm max-w-3xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-brand-navy-900">ART & Embryology Center Compliance</h2>
            <p className="text-xs text-brand-slate-500">National ART Bank Registry registration, cryo tank alarms, and double-witness protocols</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="ART Clinic Registration No (National Registry)" value="ART-REG-2026-IND-0041" disabled />
            <FormInput label="Embryology Lab Director" value="Dr. Rohan Bhattacharya, PhD" disabled />
            <FormInput label="Liquid Nitrogen Telemetry" value="Tank A: -196.2°C • Tank B: -195.8°C (Normal)" disabled />
            <FormInput label="Electronic Witnessing System" value="RI Witness RFID Active & Verified" disabled />
          </div>
        </div>
      )}

      {/* Add Cycle Modal */}
      <Modal
        isOpen={isAddCycleOpen}
        onClose={() => setIsAddCycleOpen(false)}
        title="Start New Fertility / IVF Treatment Cycle"
        subtitle="Register couple demographics, clinical protocol, and primary specialist"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddCycleOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCycle}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs"
            >
              Initiate Cycle
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveCycle} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Couple Full Names"
              id="coupleName"
              value={cycleForm.coupleName}
              onChange={(e) => setCycleForm({ ...cycleForm, coupleName: e.target.value })}
              placeholder="e.g. Pooja & Vikram Joshi"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <FormInput
                label="Female Age"
                id="femaleAge"
                type="number"
                value={cycleForm.femaleAge}
                onChange={(e) => setCycleForm({ ...cycleForm, femaleAge: e.target.value })}
                placeholder="32"
                required
              />
              <FormInput
                label="Male Age"
                id="maleAge"
                type="number"
                value={cycleForm.maleAge}
                onChange={(e) => setCycleForm({ ...cycleForm, maleAge: e.target.value })}
                placeholder="35"
              />
            </div>

            <SelectInput
              label="Primary IVF Consultant"
              id="primaryDoctor"
              value={cycleForm.primaryDoctor}
              onChange={(e) => setCycleForm({ ...cycleForm, primaryDoctor: e.target.value })}
              options={specialists.map((s) => s.name)}
              required
            />

            <SelectInput
              label="Treatment Protocol"
              id="protocol"
              value={cycleForm.protocol}
              onChange={(e) => setCycleForm({ ...cycleForm, protocol: e.target.value })}
              options={protocols.map((p) => p.name)}
              required
            />
          </div>
        </form>
      </Modal>

      {/* View Item Modal */}
      {viewingItem && (
        <Modal
          isOpen={true}
          onClose={() => setViewingItem(null)}
          title={`Detailed View • ${viewingItem.type.toUpperCase()}`}
          footer={
            <button
              onClick={() => setViewingItem(null)}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-600 rounded-xl"
            >
              Close
            </button>
          }
        >
          <pre className="p-4 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs font-mono text-brand-navy-900 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(viewingItem.data, null, 2)}
          </pre>
        </Modal>
      )}
    </div>
  );
}
