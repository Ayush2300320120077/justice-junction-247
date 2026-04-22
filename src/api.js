const BASE = '/api'

export const getToken = () => localStorage.getItem('jj_token')
export const getUser  = () => JSON.parse(localStorage.getItem('jj_user') || 'null')
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
}
