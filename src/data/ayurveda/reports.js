export const AYURVEDA_REPORTS_DATA = {
  kpis: {
    totalCentres: 24,
    totalBookings: 284,
    totalCallbacks: 96,
    completedAppointments: 242,
    cancelledAppointments: 11,
    mostRequestedService: 'Classical Shirodhara Therapy',
    conversionRate: '86.4%',
    avgRating: 4.8
  },
  monthlyTrends: [
    { month: 'Apr', directBookings: 32, callbacks: 14, completed: 28 },
    { month: 'May', directBookings: 41, callbacks: 18, completed: 37 },
    { month: 'Jun', directBookings: 48, callbacks: 19, completed: 44 },
    { month: 'Jul', directBookings: 54, callbacks: 22, completed: 50 },
    { month: 'Aug', directBookings: 60, callbacks: 26, completed: 55 },
    { month: 'Sep (MTD)', directBookings: 49, callbacks: 21, completed: 46 }
  ],
  centrePerformance: [
    { name: 'Sanjeevani Ayurveda Wellness Centre', location: 'Mysuru', bookings: 68, rating: 4.8, callbacksHandled: 24, revenueEst: '₹1,84,000' },
    { name: 'Kottakkal Arya Vaidya Sala Branch', location: 'Bengaluru', bookings: 62, rating: 4.9, callbacksHandled: 21, revenueEst: '₹1,96,000' },
    { name: 'Somatheeram Holistic Ayurvedic Retreat', location: 'Thiruvananthapuram', bookings: 44, rating: 4.9, callbacksHandled: 16, revenueEst: '₹3,40,000' },
    { name: 'Soukya Holistic Health Centre', location: 'Bengaluru', bookings: 38, rating: 4.9, callbacksHandled: 12, revenueEst: '₹2,80,000' },
    { name: 'AyurVaid Integrative Care Center', location: 'Mysuru', bookings: 35, rating: 4.8, callbacksHandled: 11, revenueEst: '₹1,24,000' },
    { name: 'Vaidyaratnam Oushadhasala Centre', location: 'Bengaluru', bookings: 37, rating: 4.7, callbacksHandled: 12, revenueEst: '₹1,15,000' }
  ],
  servicePerformance: [
    { service: 'Classical Shirodhara Therapy', category: 'Panchakarma', enquiries: 310, bookings: 245, avgDuration: '60 mins', share: '28%' },
    { service: 'Full Body Abhyanga & Steam', category: 'Panchakarma', enquiries: 290, bookings: 230, avgDuration: '60 mins', share: '24%' },
    { service: 'Senior Vaidya Consultation', category: 'Ayurveda Consultation', enquiries: 220, bookings: 180, avgDuration: '30 mins', share: '18%' },
    { service: 'Kati Basti (Spine Therapy)', category: 'Panchakarma', enquiries: 195, bookings: 160, avgDuration: '45 mins', share: '14%' },
    { service: 'Njavara Kizhi Rice Massage', category: 'Ayurvedic Therapies', enquiries: 175, bookings: 145, avgDuration: '60 mins', share: '10%' },
    { service: 'Netra Tarpana Eye Care', category: 'Ayurvedic Therapies', enquiries: 95, bookings: 75, avgDuration: '40 mins', share: '6%' }
  ],
  callbackResolution: {
    avgResponseMinutes: 18,
    convertedToBooking: '76%',
    closedWithoutBooking: '14%',
    pendingResponse: '10%'
  }
};
