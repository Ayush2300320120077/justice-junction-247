import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, Star, Zap, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Subscriptions() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/subscriptions/plans')
      .then(r => r.json())
      .then(data => { setPlans(data.plans || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSubscribe = async (plan) => {
    if (!isLoggedIn) { navigate('/login'); return }
    try {
      const token = localStorage.getItem('jj_token')
      const res = await fetch('/api/subscriptions/subscribe', { credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan._id })
      })
      const data = await res.json()
      if (data.orderId) {
        const Razorpay = window.Razorpay
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: 'INR',
          name: 'Justice Junction',
          description: `${plan.name} Plan`,
          order_id: data.orderId,
          handler: async (response) => {
            const verifyRes = await fetch('/api/subscriptions/verify', { credentials: 'include',
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, planId: plan._id })
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) alert('Subscription activated!')
          },
          theme: { color: '#7B1D2E' }
        }
        new Razorpay(options).open()
      }
    } catch (e) {
      alert('Error: ' + e.message)
    }
  }

  const FALLBACK_PLANS = [
    { _id: 'basic', name: 'Basic', price: 999, billingCycle: 'monthly', features: ['Up to 20 bookings/month', 'Standard listing', 'Email support'], maxBookingsPerMonth: 20 },
    { _id: 'pro', name: 'Pro', price: 2499, billingCycle: 'monthly', features: ['Up to 60 bookings/month', 'Featured listing', 'Priority support', 'Analytics dashboard'], maxBookingsPerMonth: 60 },
    { _id: 'enterprise', name: 'Enterprise', price: 4999, billingCycle: 'monthly', features: ['Unlimited bookings', 'Top listing placement', '24/7 dedicated support', 'Advanced analytics', 'Custom profile'], maxBookingsPerMonth: 999 },
  ]

  const displayPlans = plans.length > 0 ? plans : FALLBACK_PLANS

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }}>
      <Helmet>
        <title>Subscription Plans — Justice Junction</title>
        <meta name="description" content="Choose the right plan for your legal practice. Grow your client base with Justice Junction." />
      </Helmet>
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-block' }}>For Lawyers</span>
          <h1 className="section-title">Choose Your Plan</h1>
          <p className="section-sub">Grow your legal practice with the right subscription tier</p>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {displayPlans.map((plan, i) => (
              <div key={plan._id} className="card" style={{ padding: '2rem', position: 'relative', border: i === 1 ? '2px solid #7B1D2E' : '1px solid #EDD5BE' }}>
                {i === 1 && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#7B1D2E', color: '#fff', padding: '.3rem 1.2rem', borderRadius: 20, fontSize: '.8rem', fontWeight: 700 }}>Most Popular</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(123,29,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {i === 0 ? <Shield size={22} color="#7B1D2E" /> : i === 1 ? <Star size={22} color="#7B1D2E" /> : <Zap size={22} color="#7B1D2E" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1A0A0D' }}>{plan.name}</div>
                    <div style={{ fontSize: '.8rem', color: '#888' }}>{plan.billingCycle}</div>
                  </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7B1D2E', marginBottom: '1.5rem' }}>
                  ₹{plan.price?.toLocaleString()}<span style={{ fontSize: '1rem', fontWeight: 500, color: '#888' }}>/mo</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(plan.features || []).map((f, fi) => (
                    <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '.9rem', color: '#333' }}>
                      <CheckCircle size={16} color="#22c55e" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`btn btn-lg ${i === 1 ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%' }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        )}
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#888', fontSize: '.85rem' }}>
          All plans include a 7-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  )
}
