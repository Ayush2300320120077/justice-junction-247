const BASE = '/api'

export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('jj_token') : null
export const getUser  = () => typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('jj_user') || 'null') : null
export const setAuth  = (token, user) => {
  localStorage.setItem('jj_token', token)
  localStorage.setItem('jj_user', JSON.stringify(user))
}
export const clearAuth = () => {
  localStorage.removeItem('jj_token')
  localStorage.removeItem('jj_user')
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

export const API = {
  // Auth
  register:      (body)       => request('/auth/register', { method: 'POST', body }),
  login:         (body)       => request('/auth/login',    { method: 'POST', body }),
  me:            ()           => request('/auth/me'),

  // Lawyers
  getLawyers:    (params={})  => { const qs = new URLSearchParams(params).toString(); return request(`/lawyers${qs ? '?' + qs : ''}`) },
  getLawyer:     (id)         => request(`/lawyers/${id}`),
  addReview:     (id, body)   => request(`/lawyers/${id}/review`, { method: 'POST', body }),
  seedDemo:      ()           => request('/lawyers/seed/demo', { method: 'POST' }),
  updateProfile: (body)       => request('/lawyers/profile/update', { method: 'PUT', body }),

  // Bookings
  createBooking: (body)       => request('/bookings', { method: 'POST', body }),
  myBookings:    ()           => request('/bookings/my'),
  getBooking:    (id)         => request(`/bookings/${id}`),
  updateStatus:  (id, status) => request(`/bookings/${id}/status`, { method: 'PUT', body: { status } }),

  // Case updates
  postUpdate:    (body)       => request('/cases', { method: 'POST', body }),
  caseUpdates:   (bookingId)  => request(`/cases/booking/${bookingId}`),
  myUpdates:     ()           => request('/cases/my'),

  // Payments (called directly via fetch in components for Razorpay flow)
  createOrder:   (body)       => request('/payments/create-order',   { method: 'POST', body }),
  verifyPayment: (body)       => request('/payments/verify',          { method: 'POST', body }),
  subscribe:     (body)       => request('/payments/subscribe',       { method: 'POST', body }),
  verifySub:     (body)       => request('/payments/verify-subscription', { method: 'POST', body }),

  // Admin
  getAdminStats:   ()           => request('/admin/stats'),
  getAdminLawyers: ()           => request('/admin/lawyers'),
  getAdminUsers:   ()           => request('/admin/users'),
  getAdminBookings:()           => request('/admin/bookings'),
  verifyLawyer:    (id, isVerified) => request(`/admin/lawyers/${id}/verify`, { method: 'PUT', body: { isVerified } }),
  blockLawyer:     (id, isBlocked)  => request(`/admin/lawyers/${id}/block`, { method: 'PUT', body: { isBlocked } }),
  updateLawyerProfile: (id, body)   => request(`/admin/lawyers/${id}`, { method: 'PUT', body }),
  updateLawyerSubscription: (id, subscription) => request(`/admin/lawyers/${id}/subscription`, { method: 'PUT', body: { subscription } }),
  blockUser:       (id, isBlocked)  => request(`/admin/users/${id}/block`, { method: 'PUT', body: { isBlocked } }),
  cancelBooking:   (id)         => request(`/admin/bookings/${id}/cancel`, { method: 'PUT' }),
  deleteUser:      (id)         => request(`/admin/users/${id}`, { method: 'DELETE' }),
  deleteLawyer:    (id)         => request(`/admin/lawyers/${id}`, { method: 'DELETE' }),
  deleteBooking:   (id)         => request(`/admin/bookings/${id}`, { method: 'DELETE' }),
  promoteAdmin:    (email)      => request('/admin/promote', { method: 'PUT', body: { email } }),
  demoteAdmin:     (id)         => request(`/admin/demote/${id}`, { method: 'PUT' }),
}
