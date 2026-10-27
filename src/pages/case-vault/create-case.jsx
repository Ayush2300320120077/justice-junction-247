import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/admin/AdminLayout';
import CaseVaultRoute from '../../components/CaseVaultRoute';
import { ArrowLeft, FolderPlus, Building2, ChevronDown } from 'lucide-react';
import { API } from '../../api';

const DEPARTMENTS = [
  'CBI','State Police','NIA','ED','CID',
  'Cybercrime Cell','Anti-Corruption Bureau',
  'Narcotics Control Bureau','Court Registry','Other',
];

const STATUSES = [
  { value:'open',                 label:'Open' },
  { value:'under-investigation',  label:'Under Investigation' },
  { value:'sub-judice',           label:'Sub-Judice' },
  { value:'closed',               label:'Closed' },
  { value:'archived',             label:'Archived' },
];

const s = {
  wrap:    { maxWidth:640, margin:'0 auto' },
  card:    { background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'2rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },
  back:    { display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'none', border:'none', color:'#64748b', fontSize:'0.85rem', fontWeight:600, cursor:'pointer', marginBottom:'1.5rem', padding:0 },
  header:  { display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'2rem' },
  icon:    { width:48, height:48, borderRadius:12, background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  title:   { fontSize:'1.3rem', fontWeight:800, color:'#0f172a', margin:0 },
  sub:     { fontSize:'0.82rem', color:'#94a3b8', marginTop:'0.2rem' },
  field:   { marginBottom:'1.25rem' },
  label:   { display:'block', fontSize:'0.78rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'0.4rem' },
  input:   { width:'100%', padding:'0.65rem 0.9rem', borderRadius:8, border:'1px solid #cbd5e1', fontSize:'0.9rem', outline:'none', boxSizing:'border-box', fontFamily:'inherit', transition:'border 0.15s' },
  textarea:{ width:'100%', padding:'0.65rem 0.9rem', borderRadius:8, border:'1px solid #cbd5e1', fontSize:'0.9rem', outline:'none', resize:'vertical', minHeight:90, fontFamily:'inherit', boxSizing:'border-box' },
  select:  { width:'100%', padding:'0.65rem 0.9rem', borderRadius:8, border:'1px solid #cbd5e1', fontSize:'0.9rem', outline:'none', background:'#fff', fontFamily:'inherit', appearance:'none', boxSizing:'border-box' },
  selWrap: { position:'relative' },
  selIcon: { position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' },
  hint:    { fontSize:'0.75rem', color:'#94a3b8', marginTop:'0.3rem' },
  divider: { border:'none', borderTop:'1px solid #e2e8f0', margin:'1.5rem 0' },
  footer:  { display:'flex', gap:'0.75rem', justifyContent:'flex-end' },
  btnPrimary:  { padding:'0.65rem 1.6rem', borderRadius:8, border:'none', background:'#7B1D2E', color:'#fff', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', transition:'background 0.15s' },
  btnSecondary:{ padding:'0.65rem 1.2rem', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#475569', fontWeight:600, fontSize:'0.9rem', cursor:'pointer' },
};

const INITIAL = {
  caseNumber:  '',
  title:       '',
  description: '',
  department:  '',
  status:      'open',
  jurisdiction:'',
};

export default function CreateCase() {
  const { showToast } = useToast();
  const navigate      = useNavigate();
  const [form, setForm]         = useState(INITIAL);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.caseNumber.trim()) e.caseNumber = 'Case number is required';
    else if (form.caseNumber.length > 100) e.caseNumber = 'Max 100 characters';
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.length > 300) e.title = 'Max 300 characters';
    if (!form.department) e.department = 'Department is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    try {
      const data = await API.vault.createCase({
        caseNumber:   form.caseNumber.trim().toUpperCase(),
        title:        form.title.trim(),
        description:  form.description.trim() || undefined,
        department:   form.department,
        status:       form.status,
        jurisdiction: form.jurisdiction.trim() || undefined,
      });
      showToast(`Case ${data.data.caseNumber} created`, 'success');
      navigate(`/case-vault/cases/${data.data._id}`);
    } catch (err) {
      showToast(err.message || 'Failed to create case', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const focusStyle  = { borderColor: '#7B1D2E' };
  const focusProps  = (key) => ({
    onFocus: e => { e.target.style.borderColor = '#7B1D2E'; },
    onBlur:  e => { e.target.style.borderColor = errors[key] ? '#ef4444' : '#cbd5e1'; },
  });

  return (
    <CaseVaultRoute>
      <AdminLayout title="New Case">
        <Helmet>
          <title>New Case — Case Vault</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div style={s.wrap}>
          <button style={s.back} onClick={() => navigate('/case-vault/dashboard')}>
            <ArrowLeft size={15} /> Back to Cases
          </button>

          <div style={s.card}>
            <div style={s.header}>
              <div style={s.icon}><FolderPlus size={24} color="#7B1D2E" /></div>
              <div>
                <h1 style={s.title}>Create New Case</h1>
                <p style={s.sub}>SIH26190 · Case Vault · Ministry of Home Affairs</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Case Number */}
              <div style={s.field}>
                <label style={s.label}>Case Number *</label>
                <input
                  style={{ ...s.input, borderColor: errors.caseNumber ? '#ef4444' : '#cbd5e1' }}
                  placeholder="e.g. FIR-2024-DEL-00123"
                  value={form.caseNumber}
                  onChange={set('caseNumber')}
                  {...focusProps('caseNumber')}
                />
                {errors.caseNumber && <div style={{ ...s.hint, color:'#ef4444' }}>{errors.caseNumber}</div>}
                <div style={s.hint}>Will be stored in uppercase. Must be unique across the system.</div>
              </div>

              {/* Title */}
              <div style={s.field}>
                <label style={s.label}>Case Title *</label>
                <input
                  style={{ ...s.input, borderColor: errors.title ? '#ef4444' : '#cbd5e1' }}
                  placeholder="Brief description of the case"
                  value={form.title}
                  onChange={set('title')}
                  {...focusProps('title')}
                />
                {errors.title && <div style={{ ...s.hint, color:'#ef4444' }}>{errors.title}</div>}
              </div>

              {/* Department + Status (2 col) */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.25rem' }}>
                <div>
                  <label style={s.label}>Department *</label>
                  <div style={s.selWrap}>
                    <select
                      style={{ ...s.select, borderColor: errors.department ? '#ef4444' : '#cbd5e1' }}
                      value={form.department}
                      onChange={set('department')}
                    >
                      <option value="">— Select —</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <div style={s.selIcon}><ChevronDown size={14} color="#94a3b8" /></div>
                  </div>
                  {errors.department && <div style={{ ...s.hint, color:'#ef4444' }}>{errors.department}</div>}
                </div>

                <div>
                  <label style={s.label}>Initial Status</label>
                  <div style={s.selWrap}>
                    <select style={s.select} value={form.status} onChange={set('status')}>
                      {STATUSES.map(st => <option key={st.value} value={st.value}>{st.label}</option>)}
                    </select>
                    <div style={s.selIcon}><ChevronDown size={14} color="#94a3b8" /></div>
                  </div>
                </div>
              </div>

              {/* Jurisdiction */}
              <div style={s.field}>
                <label style={s.label}>Jurisdiction / Court</label>
                <input
                  style={s.input}
                  placeholder="e.g. Delhi High Court, Sessions Court Patna"
                  value={form.jurisdiction}
                  onChange={set('jurisdiction')}
                  onFocus={e => e.target.style.borderColor='#7B1D2E'}
                  onBlur={e => e.target.style.borderColor='#cbd5e1'}
                />
              </div>

              {/* Description */}
              <div style={s.field}>
                <label style={s.label}>Description (optional)</label>
                <textarea
                  style={s.textarea}
                  placeholder="Brief summary of the case background…"
                  value={form.description}
                  onChange={set('description')}
                  onFocus={e => e.target.style.borderColor='#7B1D2E'}
                  onBlur={e => e.target.style.borderColor='#cbd5e1'}
                />
                <div style={s.hint}>Max 2000 characters. Not visible to the public.</div>
              </div>

              <hr style={s.divider} />

              <div style={s.footer}>
                <button type="button" style={s.btnSecondary} onClick={() => navigate('/case-vault/dashboard')}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...s.btnPrimary, opacity: submitting ? 0.75 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                  disabled={submitting}
                  onMouseEnter={e => !submitting && (e.currentTarget.style.background='#5C1521')}
                  onMouseLeave={e => !submitting && (e.currentTarget.style.background='#7B1D2E')}
                >
                  {submitting ? 'Creating…' : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </CaseVaultRoute>
  );
}
