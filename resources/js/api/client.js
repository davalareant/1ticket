const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('1tiket_token');

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(data?.message || 'Terjadi kesalahan pada server');
        error.status = response.status;
        error.errors = data?.errors;
        throw error;
    }

    return data;
}

export const api = {
    // Auth
    login: (credentials) => apiRequest('/login', { method: 'POST', body: credentials }),
    register: (userData) => apiRequest('/register', { method: 'POST', body: userData }),
    logout: () => apiRequest('/logout', { method: 'POST' }),
    me: () => apiRequest('/me'),

    // Airports & Flights
    getAirports: (q = '') => apiRequest(`/airports?q=${encodeURIComponent(q)}`),
    searchFlights: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/flights/search?${query}`);
    },
    getFlightSeats: (id, cabin = 'economy') => apiRequest(`/flights/${id}/seats?cabin=${cabin}`),
    getSeatMap: (id, cabin = 'economy') => apiRequest(`/flights/${id}/seats?cabin=${cabin}`),

    // Bookings
    createBooking: (payload) => apiRequest('/bookings', { method: 'POST', body: payload }),
    getBookings: () => apiRequest('/bookings'),
    getBooking: (code) => apiRequest(`/bookings/${code}`),
    cancelBooking: (code) => apiRequest(`/bookings/${code}/cancel`, { method: 'POST' }),
    checkInBooking: (code, flightType = 'outbound') => apiRequest(`/bookings/${code}/check-in`, { method: 'POST', body: { flight_type: flightType } }),

    // Vouchers
    getActiveVouchers: () => apiRequest('/vouchers/active'),
    validateVoucher: (code, subtotal) => apiRequest('/vouchers/validate', {
        method: 'POST',
        body: { code, subtotal },
    }),

    // Payments
    getPaymentMethods: () => apiRequest('/payment-methods'),
    initiatePayment: (code, methodId) => apiRequest(`/bookings/${code}/pay`, {
        method: 'POST',
        body: { payment_method_id: methodId },
    }),
    simulatePayment: (reference, action) => apiRequest(`/payments/${reference}/simulate`, {
        method: 'POST',
        body: { action },
    }),

    // Admin Portal
    getAdminStats: () => apiRequest('/admin/stats'),
    getAdminMeta: () => apiRequest('/admin/meta'),
    getAdminFlights: () => apiRequest('/admin/flights'),
    createAdminFlight: (payload) => apiRequest('/admin/flights', {
        method: 'POST',
        body: payload,
    }),
    updateAdminFlight: (id, payload) => apiRequest(`/admin/flights/${id}`, {
        method: 'PUT',
        body: payload,
    }),
    deleteAdminFlight: (id) => apiRequest(`/admin/flights/${id}`, {
        method: 'DELETE',
    }),
    getAdminVouchers: () => apiRequest('/admin/vouchers'),
    createAdminVoucher: (payload) => apiRequest('/admin/vouchers', {
        method: 'POST',
        body: payload,
    }),
    updateAdminVoucher: (id, payload) => apiRequest(`/admin/vouchers/${id}`, {
        method: 'PUT',
        body: payload,
    }),
    deleteAdminVoucher: (id) => apiRequest(`/admin/vouchers/${id}`, {
        method: 'DELETE',
    }),
    getAdminBookings: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/admin/bookings?${query}`);
    },
    updateAdminBookingStatus: (code, status) => apiRequest(`/admin/bookings/${code}/status`, {
        method: 'PUT',
        body: { status },
    }),
};
