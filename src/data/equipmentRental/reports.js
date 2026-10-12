export const RENTAL_REPORTS_DATA = {
  kpis: {
    totalRentalRequests: 184,
    completedRentals: 132,
    activeRentals: 42,
    cancelledRentals: 10,
    totalRentalValue: '₹3,48,500',
    vendorPayout: '₹2,98,200',
    mediunifyCommission: '₹50,300',
    onTimeDeliveryAvg: '97.2%',
    installationSuccessRate: '98.5%'
  },
  monthlyTrends: [
    { month: 'Apr', requests: 22, active: 16, completed: 18, revenue: 42000 },
    { month: 'May', requests: 28, active: 22, completed: 24, revenue: 54000 },
    { month: 'Jun', requests: 31, active: 26, completed: 28, revenue: 62000 },
    { month: 'Jul', requests: 36, active: 32, completed: 30, revenue: 71000 },
    { month: 'Aug', requests: 40, active: 38, completed: 35, revenue: 78500 },
    { month: 'Sep (MTD)', requests: 27, active: 42, completed: 22, revenue: 58000 }
  ],
  categoryDemand: [
    { category: 'Hospital Beds', share: '34%', volume: 62, avgDuration: '45 Days' },
    { category: 'Oxygen Equipment', share: '28%', volume: 51, avgDuration: '30 Days' },
    { category: 'Wheelchairs', share: '18%', volume: 33, avgDuration: '21 Days' },
    { category: 'Monitoring Equipment', share: '12%', volume: 22, avgDuration: '14 Days' },
    { category: 'Patient Care Equipment', share: '8%', volume: 16, avgDuration: '30 Days' }
  ],
  topVendors: [
    { name: 'MedEquip Logistics & Healthcare Hub', city: 'Bengaluru', orders: 142, rating: 4.9, onTime: '98.2%', commissionPaid: '₹14,200' },
    { name: 'Apex Healthcare Fleet Solutions', city: 'Bengaluru', orders: 120, rating: 4.8, onTime: '96.8%', commissionPaid: '₹11,800' },
    { name: 'Cauvery Home Medix Solutions', city: 'Mysuru', orders: 94, rating: 4.9, onTime: '97.5%', commissionPaid: '₹9,400' },
    { name: 'RespiCare Oxygen & Ventilator Hub', city: 'Bengaluru', orders: 88, rating: 4.9, onTime: '99.1%', commissionPaid: '₹8,800' }
  ]
};
