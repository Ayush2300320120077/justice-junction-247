const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  })

  // Handle 401 — token expired, try to refresh once
  if (res.status === 401 && path !== '/auth/refresh' && path !== '/auth/login') {
    try {
      const refreshRes = await fetch(BASE + '/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      })
      if (refreshRes.ok) {
        // Retry original request with fresh token
        const retryRes = await fetch(BASE + path, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
          },
          ...options,
          body: options.body ? JSON.stringify(options.body) : undefined
        })
        const retryData = await retryRes.json()
        if (!retryRes.ok) throw new Error(retryData.error || 'Something went wrong')
        return retryData
      }
    } catch (_) {
      // Refresh failed — let original error propagate
    }
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

export const API = {
  // Auth
  register:      (body)       => request('/auth/register', { method: 'POST', body }),
  login:         (body)       => request('/auth/login',    { method: 'POST', body }),
  logout:        ()           => request('/auth/logout',   { method: 'POST' }),
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
  createOrder:   (body)       => request('/payments/create-order',       { method: 'POST', body }),
  verifyPayment: (body)       => request('/payments/verify',             { method: 'POST', body }),
  subscribe:     (body)       => request('/payments/subscribe',          { method: 'POST', body }),
  verifySub:     (body)       => request('/payments/verify-subscription', { method: 'POST', body }),

  // Admin — BUG 8+9 FIX: corrected endpoints to match actual backend routes
  getAdminStats:     ()           => request('/admin/dashboard/stats'),            // was /admin/stats
  getAdminUsers:     (params={})  => { const qs = new URLSearchParams(params).toString(); return request(`/admin/users${qs ? '?' + qs : ''}`) },
  getAdminLawyers:   (params={})  => { const qs = new URLSearchParams(params).toString(); return request(`/admin/lawyers/pending${qs ? '?' + qs : ''}`) }, // was /admin/lawyers
  getAdminPayments:  (params={})  => { const qs = new URLSearchParams(params).toString(); return request(`/admin/payments${qs ? '?' + qs : ''}`) },
  getAdminReviews:   (params={})  => { const qs = new URLSearchParams(params).toString(); return request(`/admin/reviews/pending${qs ? '?' + qs : ''}`) },
  getAdminArticles:  (params={})  => { const qs = new URLSearchParams(params).toString(); return request(`/admin/articles${qs ? '?' + qs : ''}`) },
  getAdminTemplates: (params={})  => { const qs = new URLSearchParams(params).toString(); return request(`/admin/document-templates${qs ? '?' + qs : ''}`) },
  getAdminChatQueries:(params={}) => { const qs = new URLSearchParams(params).toString(); return request(`/admin/chat-queries${qs ? '?' + qs : ''}`) },

  // Lawyer management
  verifyLawyer:    (id, approved, reason) => request(`/admin/lawyers/${id}/verify`, { method: 'PATCH', body: { approved, reason } }),  // was PUT, now PATCH
  blockUser:       (id, isBlocked)        => request(`/admin/users/${id}/status`,  { method: 'PATCH', body: { isBlocked } }),           // was PUT /admin/users/:id/block

  // Article management
  createArticle:   (body)  => request('/admin/articles',        { method: 'POST', body }),
  updateArticle:   (id, body) => request(`/admin/articles/${id}`, { method: 'PUT', body }),
  deleteArticle:   (id)    => request(`/admin/articles/${id}`,  { method: 'DELETE' }),

  // Review moderation
  moderateReview:  (id, status) => request(`/admin/reviews/${id}/moderate`, { method: 'PATCH', body: { status } }),

  // Document templates (admin)
  createTemplate:  (body)       => request('/admin/document-templates',        { method: 'POST', body }),
  updateTemplate:  (id, body)   => request(`/admin/document-templates/${id}`,  { method: 'PUT', body }),
  deleteTemplate:  (id)         => request(`/admin/document-templates/${id}`,  { method: 'DELETE' }),

  // AI Chat & Classifier
  chat:            (body)       => request('/ai/chat',      { method: 'POST', body }),
  assistant:       (body)       => request('/ai/assistant', { method: 'POST', body }),
  rateInteraction: (body)       => request('/ai/feedback',  { method: 'PATCH', body }),
  classify:        (body)       => request('/ai/classify',  { method: 'POST', body }),
}
