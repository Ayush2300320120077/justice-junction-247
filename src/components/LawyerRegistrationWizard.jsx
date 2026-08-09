import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import { useState } from 'react'
import { API } from '../api'
import { useToast } from '../context/ToastContext'
import StepProgressBar from './StepProgressBar'
import MultiSelectCheckbox from './MultiSelectCheckbox'
import ImageUpload from './ImageUpload'
import INDIAN_STATES from '../constants/indianStates'
import {
  PRACTICE_AREAS, COURT_TYPES, LANGUAGES, DESIGNATIONS,
  CONSULTATION_MODES, DAYS_OF_WEEK, GENDER_OPTIONS
} from '../constants/lawyerOptions'
import {
  User, Mail, Lock, Phone, Calendar, MapPin, Hash, Briefcase,
  Globe, ExternalLink, FileText, ChevronRight, ChevronLeft, Send, Eye
} from 'lucide-react'

const INITIAL_DATA = {
  // Step 1 — Personal
  name: '', email: '', password: '', role: 'lawyer',
  phone: '', dateOfBirth: '', gender: '', photo: '',
  city: '', state: '', address: '',
  // Step 2 — Professional
  barRegistrationNumber: '', barCouncilState: '',
  yearOfEnrollment: '', experience: '',
  designation: '', currentFirm: '',
  verificationDocuments: '',
  // Step 3 — Practice
  specializations: [], courts: [], languages: [],
  // Step 4 — Consultation & Availability
  consultationModes: [], consultationFee: '',
  availableDays: [], availableTimeFrom: '09:00', availableTimeTo: '18:00',
  // Step 5 — Online Presence
  linkedinUrl: '', websiteUrl: '', bio: '',
}

export default function LawyerRegistrationWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(INITIAL_DATA)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const navigate = useNavigate(); const location = useLocation(); const [searchParams] = useSearchParams(); const params = useParams();

  const set = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  // ── VALIDATION PER STEP ──
  const validateStep = (s) => {
    const e = {}
    if (s === 1) {
      if (!formData.name.trim()) e.name = 'Full name is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email'
      if (formData.password.length < 6) e.password = 'Password must be at least 6 characters'
      if (!/^\d{10}$/.test(formData.phone)) e.phone = 'Enter a valid 10-digit phone number'
      if (!formData.city.trim()) e.city = 'City is required'
      if (!formData.state) e.state = 'State is required'
    }
    if (s === 2) {
      if (!formData.barRegistrationNumber.trim()) e.barRegistrationNumber = 'Bar Council Registration Number is required'
      if (!formData.barCouncilState) e.barCouncilState = 'Bar Council State is required'
      if (!formData.verificationDocuments.trim()) e.verificationDocuments = 'Verification Document URL is required'
      if (formData.experience && (isNaN(formData.experience) || parseInt(formData.experience) < 0)) e.experience = 'Enter valid years'
    }
    if (s === 3) {
      if (formData.specializations.length === 0) e.specializations = 'Select at least one practice area'
    }
    if (s === 4) {
      if (!formData.consultationFee || parseFloat(formData.consultationFee) <= 0) e.consultationFee = 'Enter a valid consultation fee'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 5))
  }
  const back = () => setStep(s => Math.max(s - 1, 1))

  // Auto-calculate experience from enrollment year
  const handleYearOfEnrollment = (val) => {
    set('yearOfEnrollment', val)
    if (val && parseInt(val) > 1950 && parseInt(val) <= new Date().getFullYear()) {
      const calc = new Date().getFullYear() - parseInt(val)
      if (!formData.experience) set('experience', String(calc))
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) return
    setLoading(true)
    try {
      await API.register(formData)
      showToast('Account created! Please login.', 'success')
      navigate('/login')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const Err = ({ field }) => errors[field] ? <span className="wizard-err">{errors[field]}</span> : null

  return (
    <div className="wizard-container">
      <StepProgressBar currentStep={step} />

      <div className="wizard-body">
        {/* ────────── STEP 1: Personal ────────── */}
        {step === 1 && (
          <div className="step-content">
            <div className="step-header">
              <h2 className="step-title">Personal Information</h2>
              <p className="step-desc">Let's start with your basic details.</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-wrap"><User size={16} className="input-icon" />
                  <input value={formData.name} onChange={e => set('name', e.target.value)} placeholder="Adv. John Doe" required />
                </div>
                <Err field="name" />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-wrap"><Mail size={16} className="input-icon" />
                  <input type="email" value={formData.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" required />
                </div>
                <Err field="email" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <div className="input-wrap"><Lock size={16} className="input-icon" />
                  <input type="password" value={formData.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" minLength={6} required />
                </div>
                <Err field="password" />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <div className="input-wrap"><Phone size={16} className="input-icon" />
                  <input value={formData.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit mobile" maxLength={10} />
                </div>
                <Err field="phone" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <div className="input-wrap"><Calendar size={16} className="input-icon" />
                  <input type="date" value={formData.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select value={formData.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="">Select...</option>
                  {GENDER_OPTIONS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Profile Photo</label>
              <ImageUpload value={formData.photo} onChange={v => set('photo', v)} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <div className="input-wrap"><MapPin size={16} className="input-icon" />
                  <input value={formData.city} onChange={e => set('city', e.target.value)} placeholder="e.g. New Delhi" />
                </div>
                <Err field="city" />
              </div>
              <div className="form-group">
                <label>State *</label>
                <select value={formData.state} onChange={e => set('state', e.target.value)}>
                  <option value="">Select State...</option>
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
                <Err field="state" />
              </div>
            </div>

            <div className="form-group">
              <label>Full Address / Chamber Address</label>
              <textarea rows={2} value={formData.address} onChange={e => set('address', e.target.value)}
                placeholder="Office or chamber address..." />
            </div>
          </div>
        )}

        {/* ────────── STEP 2: Professional ────────── */}
        {step === 2 && (
          <div className="step-content">
            <div className="step-header">
              <h2 className="step-title">Professional Information</h2>
              <p className="step-desc">Your bar council and experience details.</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bar Council Registration Number *</label>
                <div className="input-wrap"><Hash size={16} className="input-icon" />
                  <input value={formData.barRegistrationNumber} onChange={e => set('barRegistrationNumber', e.target.value)} placeholder="e.g. D/1234/2010" />
                </div>
                <Err field="barRegistrationNumber" />
              </div>
              <div className="form-group">
                <label>Bar Council State *</label>
                <select value={formData.barCouncilState} onChange={e => set('barCouncilState', e.target.value)}>
                  <option value="">Select State...</option>
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
                <Err field="barCouncilState" />
              </div>
            </div>

            <div className="form-group">
              <label>Verification Document URL *</label>
              <div className="input-wrap"><FileText size={16} className="input-icon" />
                <input value={formData.verificationDocuments} onChange={e => set('verificationDocuments', e.target.value)} placeholder="e.g. Google Drive link to Bar Council ID" />
              </div>
              <Err field="verificationDocuments" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Year of Enrollment</label>
                <input type="number" min="1950" max={new Date().getFullYear()} value={formData.yearOfEnrollment}
                  onChange={e => handleYearOfEnrollment(e.target.value)} placeholder="e.g. 2015" />
              </div>
              <div className="form-group">
                <label>Years of Experience</label>
                <div className="input-wrap"><Briefcase size={16} className="input-icon" />
                  <input type="number" min="0" max="60" value={formData.experience}
                    onChange={e => set('experience', e.target.value)} placeholder="e.g. 8" />
                </div>
                <Err field="experience" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Designation</label>
                <select value={formData.designation} onChange={e => set('designation', e.target.value)}>
                  <option value="">Select...</option>
                  {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Current Firm / Chamber Name</label>
                <input value={formData.currentFirm} onChange={e => set('currentFirm', e.target.value)} placeholder="Optional" />
              </div>
            </div>
          </div>
        )}

        {/* ────────── STEP 3: Practice ────────── */}
        {step === 3 && (
          <div className="step-content">
            <div className="step-header">
              <h2 className="step-title">Practice Details</h2>
              <p className="step-desc">Select your areas of expertise.</p>
            </div>

            <div className="form-group">
              <label>Practice Areas * <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(select at least one)</span></label>
              <MultiSelectCheckbox options={PRACTICE_AREAS} selected={formData.specializations} onChange={v => set('specializations', v)} columns={3} />
              <Err field="specializations" />
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Court(s) Practiced In</label>
              <MultiSelectCheckbox options={COURT_TYPES} selected={formData.courts} onChange={v => set('courts', v)} columns={2} />
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Languages Known</label>
              <MultiSelectCheckbox options={LANGUAGES} selected={formData.languages} onChange={v => set('languages', v)} columns={4} />
            </div>
          </div>
        )}

        {/* ────────── STEP 4: Consultation & Availability ────────── */}
        {step === 4 && (
          <div className="step-content">
            <div className="step-header">
              <h2 className="step-title">Consultation & Availability</h2>
              <p className="step-desc">Set your consultation preferences and schedule.</p>
            </div>

            <div className="form-group">
              <label>Consultation Modes</label>
              <MultiSelectCheckbox options={CONSULTATION_MODES} selected={formData.consultationModes} onChange={v => set('consultationModes', v)} columns={3} />
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Consultation Fee (₹ per session) *</label>
              <div className="input-wrap">
                <span className="input-icon" style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--txt-2)' }}>₹</span>
                <input type="number" min="0" value={formData.consultationFee} onChange={e => set('consultationFee', e.target.value)} placeholder="e.g. 2000" />
              </div>
              <Err field="consultationFee" />
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Available Days</label>
              <MultiSelectCheckbox options={DAYS_OF_WEEK} selected={formData.availableDays} onChange={v => set('availableDays', v)} columns={7} />
            </div>

            <div className="form-row" style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Available From</label>
                <input type="time" value={formData.availableTimeFrom} onChange={e => set('availableTimeFrom', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Available To</label>
                <input type="time" value={formData.availableTimeTo} onChange={e => set('availableTimeTo', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ────────── STEP 5: Online Presence + Review ────────── */}
        {step === 5 && (
          <div className="step-content">
            <div className="step-header">
              <h2 className="step-title">Online Presence & Review</h2>
              <p className="step-desc">Add your online links and review your information.</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>LinkedIn Profile URL</label>
                <div className="input-wrap"><ExternalLink size={16} className="input-icon" />
                  <input value={formData.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
              <div className="form-group">
                <label>Personal Website URL</label>
                <div className="input-wrap"><Globe size={16} className="input-icon" />
                  <input value={formData.websiteUrl} onChange={e => set('websiteUrl', e.target.value)} placeholder="https://..." />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Brief Bio / About <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(max 500 characters)</span></label>
              <textarea rows={3} maxLength={500} value={formData.bio} onChange={e => set('bio', e.target.value)}
                placeholder="Tell clients about your expertise, approach, and what makes you stand out..." />
              <div style={{ textAlign: 'right', fontSize: '.75rem', color: 'var(--txt-3)', marginTop: 4 }}>{formData.bio.length}/500</div>
            </div>

            {/* Review Summary */}
            <div className="review-summary">
              <div className="review-summary-header">
                <Eye size={18} /> Review Your Information
              </div>

              <div className="review-section">
                <h4>Personal Information</h4>
                <div className="review-grid">
                  <ReviewItem label="Name" value={formData.name} />
                  <ReviewItem label="Email" value={formData.email} />
                  <ReviewItem label="Phone" value={formData.phone} />
                  <ReviewItem label="Gender" value={formData.gender} />
                  <ReviewItem label="Date of Birth" value={formData.dateOfBirth} />
                  <ReviewItem label="City" value={formData.city} />
                  <ReviewItem label="State" value={formData.state} />
                  {formData.photo && <div className="review-item" style={{ gridColumn: 'span 2' }}><span className="review-label">Photo</span><span className="review-value">✓ Uploaded</span></div>}
                </div>
              </div>

              <div className="review-section">
                <h4>Professional Information</h4>
                <div className="review-grid">
                  <ReviewItem label="Bar Reg. No." value={formData.barRegistrationNumber} />
                  <ReviewItem label="Bar Council State" value={formData.barCouncilState} />
                  <ReviewItem label="Year of Enrollment" value={formData.yearOfEnrollment} />
                  <ReviewItem label="Experience" value={formData.experience ? `${formData.experience} years` : ''} />
                  <ReviewItem label="Designation" value={formData.designation} />
                  <ReviewItem label="Firm/Chamber" value={formData.currentFirm} />
                </div>
              </div>

              <div className="review-section">
                <h4>Practice Details</h4>
                <div className="review-grid">
                  <div className="review-item" style={{ gridColumn: 'span 2' }}>
                    <span className="review-label">Practice Areas</span>
                    <span className="review-value review-tags">{formData.specializations.map(s => <span key={s} className="review-tag">{s}</span>)}</span>
                  </div>
                  {formData.courts.length > 0 && (
                    <div className="review-item" style={{ gridColumn: 'span 2' }}>
                      <span className="review-label">Courts</span>
                      <span className="review-value review-tags">{formData.courts.map(c => <span key={c} className="review-tag">{c}</span>)}</span>
                    </div>
                  )}
                  {formData.languages.length > 0 && (
                    <div className="review-item" style={{ gridColumn: 'span 2' }}>
                      <span className="review-label">Languages</span>
                      <span className="review-value">{formData.languages.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="review-section">
                <h4>Consultation & Availability</h4>
                <div className="review-grid">
                  <ReviewItem label="Fee" value={formData.consultationFee ? `₹${formData.consultationFee}` : ''} />
                  <ReviewItem label="Modes" value={formData.consultationModes.join(', ')} />
                  <ReviewItem label="Days" value={formData.availableDays.join(', ')} />
                  <ReviewItem label="Time" value={formData.availableTimeFrom && formData.availableTimeTo ? `${formData.availableTimeFrom} – ${formData.availableTimeTo}` : ''} />
                </div>
              </div>

              {(formData.linkedinUrl || formData.websiteUrl || formData.bio) && (
                <div className="review-section">
                  <h4>Online Presence</h4>
                  <div className="review-grid">
                    <ReviewItem label="LinkedIn" value={formData.linkedinUrl} />
                    <ReviewItem label="Website" value={formData.websiteUrl} />
                    {formData.bio && <div className="review-item" style={{ gridColumn: 'span 2' }}><span className="review-label">Bio</span><span className="review-value">{formData.bio.slice(0, 100)}{formData.bio.length > 100 ? '...' : ''}</span></div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="wizard-nav">
        {step > 1 && (
          <button type="button" className="btn btn-outline btn-lg" onClick={back}>
            <ChevronLeft size={18} /> Back
          </button>
        )}
        <div style={{ flex: 1 }} />
        {step < 5 ? (
          <button type="button" className="btn btn-primary btn-lg" onClick={next}>
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating Account...' : <><Send size={16} /> Create Account</>}
          </button>
        )}
      </div>
    </div>
  )
}

function ReviewItem({ label, value }) {
  if (!value) return null
  return (
    <div className="review-item">
      <span className="review-label">{label}</span>
      <span className="review-value">{value}</span>
    </div>
  )
}
