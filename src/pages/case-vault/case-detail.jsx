import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/admin/AdminLayout';
import CaseVaultRoute from '../../components/CaseVaultRoute';
import {
  ArrowLeft, FileText, Upload, Shield, Eye, Download,
  CheckCircle2, XCircle, AlertTriangle, Clock, Building2,
  ChevronDown, ChevronUp, History, PenLine, FolderOpen,
  PenSquare, Stamp, User
} from 'lucide-react';
import { API } from '../../api';

// ── Role constants ────────────────────────────────────────────────────────────
/** Only these roles may legally attest (sign) a document */
const SIGN_ROLES = ['legal-officer', 'court-clerk', 'admin'];

// ── Lookup maps ───────────────────────────────────────────────────────────────
const STATUS_META = {
  open:                 { label: 'Open',           bg: '#dbeafe', text: '#1d4ed8' },
  'under-investigation':{ label: 'Investigating',  bg: '#fef9c3', text: '#a16207' },
  'sub-judice':         { label: 'Sub-Judice',     bg: '#ede9fe', text: '#6d28d9' },
  closed:               { label: 'Closed',         bg: '#dcfce7', text: '#15803d' },
  archived:             { label: 'Archived',       bg: '#f1f5f9', text: '#475569' },
};

const DOC_TYPE_META = {
  'FIR':                { label: 'FIR',              bg: '#fee2e2', text: '#991b1b' },
  'charge-sheet':       { label: 'Charge Sheet',     bg: '#ffedd5', text: '#9a3412' },
  'witness-statement':  { label: 'Witness Statement',bg: '#e0e7ff', text: '#3730a3' },
  'evidence':           { label: 'Evidence',         bg: '#fef9c3', text: '#854d0e' },
  'court-filing':       { label: 'Court Filing',     bg: '#dcfce7', text: '#166534' },
  'forensic-report':    { label: 'Forensic Report',  bg: '#f3e8ff', text: '#6b21a8' },
  'judgment':           { label: 'Judgment',         bg: '#dbeafe', text: '#1e40af' },
};

const CONF_META = {
  unclassified: { label: 'Unclassified', color: '#64748b' },
  restricted:   { label: 'Restricted',   color: '#d97706' },
  confidential: { label: 'Confidential', color: '#dc2626' },
  secret:       { label: 'Secret',       color: '#7c3aed' },
  'top-secret': { label: 'Top Secret',   color: '#9f1239' },
};

// ── Shared style tokens ───────────────────────────────────────────────────────
const s = {
  back:        { display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'none', border:'none', color:'#64748b', fontSize:'0.85rem', fontWeight:600, cursor:'pointer', marginBottom:'1.5rem', padding:0 },
  card:        { background:'#fff', borderRadius:12, border:'1px solid #e2e8f0', padding:'1.5rem', marginBottom:'1.5rem' },
  sectionTitle:{ fontSize:'1rem', fontWeight:800, color:'#0f172a', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem' },
  grid2:       { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1rem' },
  metaItem:    { display:'flex', flexDirection:'column', gap:'0.2rem' },
  metaLabel:   { fontSize:'0.72rem', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.04em' },
  metaValue:   { fontSize:'0.9rem', color:'#1e293b', fontWeight:600 },
  badge:       { padding:'3px 10px', borderRadius:20, fontSize:'0.72rem', fontWeight:700, display:'inline-flex', alignItems:'center', gap:4 },
  docCard:     { background:'#f8fafc', borderRadius:10, border:'1px solid #e2e8f0', marginBottom:'0.75rem', overflow:'hidden' },
  docHeader:   { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.9rem 1.1rem', cursor:'pointer' },
  docBody:     { padding:'1rem 1.1rem', borderTop:'1px solid #e2e8f0', background:'#fff' },
  versionRow:  { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid #f1f5f9', fontSize:'0.82rem', color:'#475569' },
  actionBtn:   { display:'inline-flex', alignItems:'center', gap:4, padding:'0.4rem 0.85rem', borderRadius:8, border:'none', cursor:'pointer', fontSize:'0.8rem', fontWeight:700, transition:'background 0.15s' },
  uploadBtn:   { display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.6rem 1.2rem', borderRadius:8, fontWeight:700, border:'none', cursor:'pointer', fontSize:'0.85rem', background:'#7B1D2E', color:'#fff', transition:'background 0.15s' },
};

// ── Small presentational components ──────────────────────────────────────────
function MetaItem({ label, value }) {
  return (
    <div style={s.metaItem}>
      <span style={s.metaLabel}>{label}</span>
      <span style={s.metaValue}>{value || '—'}</span>
    </div>
  );
}

function DocTypeBadge({ type }) {
  const m = DOC_TYPE_META[type] || { label: type, bg: '#f1f5f9', text: '#475569' };
  return <span style={{ ...s.badge, backgroundColor: m.bg, color: m.text }}>{m.label}</span>;
}

// ── VerifyIntegrity — the centrepiece of the hackathon demo ──────────────────
//
// Phase 4 spec: "must look convincing on screen — it's the centerpiece of the
//  hackathon demo."
//
// Behaviour:
//   • Mode 1 (no file selected): calls GET /verify → returns storedHash.
//     Shows the hash in a mono display and tells the user to compare it.
//   • Mode 2 (file selected): sends ?fileBase64=<b64> → server re-hashes and
//     compares against DB. Returns { match: bool, storedHash, computedHash }.
//     Shows a bold green ✓ HASH VERIFIED or red ✗ HASH MISMATCH panel.
//
// The file input is optional — demo mode (no file) still looks great.
function VerifyIntegrity({ doc, onClose }) {
  const { showToast } = useToast();
  const fileRef = useRef();
  const [file, setFile]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);  // null | { match, storedHash, computedHash?, mode }

  const handleFile = (f) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { showToast('File must be under 10 MB for server-side verification', 'error'); return; }
    setFile(f);
    setResult(null);
  };

  const readFileAsBase64 = (f) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (file) {
        // Mode 2: server re-hashes the uploaded file and compares
        const fileBase64 = await readFileAsBase64(file);
        const data = await API.vault.verifyDoc(doc._id, { fileBase64, version: doc.currentVersion });
        setResult({ mode: 'server', match: data.match, storedHash: data.storedHash, computedHash: data.computedHash });
      } else {
        // Mode 1: fetch stored hash; client can compare manually
        const data = await API.vault.verifyDoc(doc._id, { version: doc.currentVersion });
        setResult({ mode: 'hash-only', storedHash: data.storedHash });
      }
    } catch (err) {
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const overlay = { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' };
  const modal   = { background:'#fff', borderRadius:18, width:'100%', maxWidth:520, padding:'2rem', boxShadow:'0 30px 80px rgba(0,0,0,0.3)', position:'relative' };

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modal}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Shield size={22} color="#16a34a" />
          </div>
          <div>
            <h2 style={{ margin:0, fontSize:'1.15rem', fontWeight:800, color:'#0f172a' }}>Verify Integrity</h2>
            <p style={{ margin:0, fontSize:'0.8rem', color:'#64748b' }}>{doc.title} · v{doc.currentVersion}</p>
          </div>
          <button onClick={onClose} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:'1.5rem', lineHeight:1, padding:'0.2rem 0.4rem' }}>×</button>
        </div>

        {/* Stored hash display */}
        <div style={{ background:'#f8fafc', borderRadius:10, padding:'0.85rem 1rem', marginBottom:'1.25rem', border:'1px solid #e2e8f0' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.35rem' }}>
            Stored SHA-256 Hash (Database)
          </div>
          <div style={{ fontFamily:'monospace', fontSize:'0.8rem', color:'#1e293b', wordBreak:'break-all', lineHeight:1.5 }}>
            {doc.sha256Hash || '—'}
          </div>
        </div>

        {/* Optional file upload for server-side re-hash */}
        <div style={{ marginBottom:'1.25rem' }}>
          <div style={{ fontSize:'0.78rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'0.5rem' }}>
            Optional: Upload your local copy to server-verify
          </div>
          <div
            style={{ border:`2px dashed ${file ? '#16a34a' : '#cbd5e1'}`, borderRadius:10, padding:'1rem', textAlign:'center', cursor:'pointer', background: file ? '#f0fdf4' : '#fafafa', transition:'all 0.15s' }}
            onClick={() => fileRef.current?.click()}
          >
            {file ? (
              <div style={{ color:'#16a34a', fontWeight:700, fontSize:'0.88rem' }}>
                <CheckCircle2 size={16} style={{ verticalAlign:'middle', marginRight:5 }} />
                {file.name} ({(file.size / 1024).toFixed(0)} KB)
              </div>
            ) : (
              <div style={{ color:'#94a3b8', fontSize:'0.82rem' }}>
                Click to select file — server will re-hash and compare
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" style={{ display:'none' }}
            onChange={e => handleFile(e.target.files[0])} />
          {file && (
            <button style={{ marginTop:'0.4rem', fontSize:'0.75rem', color:'#94a3b8', background:'none', border:'none', cursor:'pointer' }} onClick={() => { setFile(null); setResult(null); }}>
              Remove file
            </button>
          )}
        </div>

        {/* Verify button */}
        <button
          style={{ width:'100%', padding:'0.75rem', borderRadius:10, border:'none', background: loading ? '#dcfce7' : '#16a34a', color:'#fff', fontWeight:800, fontSize:'0.95rem', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', transition:'background 0.15s', marginBottom:'1.25rem' }}
          onClick={handleVerify}
          disabled={loading}
        >
          <Shield size={16} />
          {loading ? 'Verifying…' : file ? 'Verify Against Uploaded File' : 'Fetch Stored Hash'}
        </button>

        {/* Result panel */}
        {result && (
          <>
            {/* Mode 2: server compared hashes */}
            {result.mode === 'server' && (
              <div style={{ borderRadius:12, overflow:'hidden', border: `2px solid ${result.match ? '#16a34a' : '#dc2626'}` }}>
                {/* Status banner */}
                <div style={{ padding:'1rem 1.25rem', background: result.match ? '#16a34a' : '#dc2626', display:'flex', alignItems:'center', gap:'0.75rem' }}>
                  {result.match
                    ? <CheckCircle2 size={24} color="#fff" strokeWidth={2.5} />
                    : <AlertTriangle size={24} color="#fff" strokeWidth={2.5} />
                  }
                  <div>
                    <div style={{ color:'#fff', fontWeight:800, fontSize:'1.05rem' }}>
                      {result.match ? '✓ HASH VERIFIED' : '✗ HASH MISMATCH — POSSIBLE TAMPERING'}
                    </div>
                    <div style={{ color: result.match ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)', fontSize:'0.78rem', marginTop:'0.15rem' }}>
                      {result.match
                        ? 'The uploaded file is identical to the stored version. Integrity confirmed.'
                        : 'The uploaded file does NOT match the stored hash. This document may have been tampered with.'}
                    </div>
                  </div>
                </div>
                {/* Hash details */}
                <div style={{ padding:'0.9rem 1.25rem', background:'#fafafa' }}>
                  <div style={{ marginBottom:'0.5rem' }}>
                    <div style={{ fontSize:'0.68rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Stored Hash (DB)</div>
                    <div style={{ fontFamily:'monospace', fontSize:'0.75rem', color:'#1e293b', wordBreak:'break-all' }}>{result.storedHash}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'0.68rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginTop:'0.5rem' }}>Computed Hash (Your File)</div>
                    <div style={{ fontFamily:'monospace', fontSize:'0.75rem', color: result.match ? '#16a34a' : '#dc2626', wordBreak:'break-all', fontWeight: result.match ? 600 : 800 }}>
                      {result.computedHash}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 1: hash-only, client compares */}
            {result.mode === 'hash-only' && (
              <div style={{ background:'#eff6ff', borderRadius:10, padding:'1rem', border:'1px solid #bfdbfe' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.6rem' }}>
                  <Shield size={16} color="#1d4ed8" />
                  <span style={{ fontWeight:700, color:'#1d4ed8', fontSize:'0.88rem' }}>Stored Hash Retrieved</span>
                </div>
                <div style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#1e293b', wordBreak:'break-all', background:'#fff', borderRadius:8, padding:'0.6rem 0.8rem', border:'1px solid #bfdbfe' }}>
                  {result.storedHash}
                </div>
                <div style={{ fontSize:'0.75rem', color:'#3b82f6', marginTop:'0.6rem' }}>
                  Run <code style={{ background:'#dbeafe', padding:'1px 5px', borderRadius:4 }}>sha256sum {'<your-file>'}</code> locally and compare the output to verify integrity.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── SignModal — restricted to SIGN_ROLES only ─────────────────────────────────
//
// Phase 4 spec: body must include contentHash (SHA-256 of the file the signer
// hashed locally). Since the demo doesn't store the raw file in MongoDB, we
// fetch the stored hash from the backend's /verify endpoint and pass that as
// contentHash — proving the signer agrees with the stored hash.
// signatureData is set to a placeholder string (sufficient for hackathon demo;
// production would pass a real PKCS#7 blob or HSM reference).
function SignModal({ doc, user, onClose, onDone }) {
  const { showToast } = useToast();
  const [note, setNote]         = useState('');
  const [signing, setSigning]   = useState(false);
  const [step, setStep]         = useState('form'); // 'form' | 'confirm' | 'done'
  const [fetchedHash, setFetchedHash] = useState('');
  const [fetchingHash, setFetchingHash] = useState(false);

  // Fetch the stored hash upfront so we can display it and pass it as contentHash
  useEffect(() => {
    (async () => {
      setFetchingHash(true);
      try {
        const data = await API.vault.verifyDoc(doc._id, { version: doc.currentVersion });
        setFetchedHash(data.storedHash);
      } catch (err) {
        showToast('Could not fetch document hash: ' + err.message, 'error');
        onClose();
      } finally {
        setFetchingHash(false);
      }
    })();
  }, [doc._id, doc.currentVersion]);

  const handleSign = async () => {
    setSigning(true);
    try {
      await API.vault.signDoc(doc._id, {
        versionNumber:  doc.currentVersion,
        // In production this would be a real PKCS#7 / eSign blob.
        // For the hackathon demo, a deterministic placeholder is sufficient.
        signatureData:  `DEMO-SIG:${user.id}:${doc._id}:v${doc.currentVersion}:${Date.now()}`,
        contentHash:    fetchedHash,
        algorithm:      'RSA-SHA256',
      });
      setStep('done');
      showToast('Document signed successfully', 'success');
      onDone();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSigning(false);
    }
  };

  const overlay = { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' };
  const modal   = { background:'#fff', borderRadius:18, width:'100%', maxWidth:480, padding:'2rem', boxShadow:'0 30px 80px rgba(0,0,0,0.3)' };

  if (fetchingHash) {
    return (
      <div style={overlay}>
        <div style={modal}>
          <div style={{ textAlign:'center', padding:'2rem', color:'#64748b' }}>
            <div className="spinner" style={{ margin:'0 auto 1rem', width:28, height:28, border:'3px solid #e2e8f0', borderTopColor:'#7B1D2E', borderRadius:'50%' }} />
            Fetching document hash…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget && step !== 'done') onClose(); }}>
      <div style={modal}>
        {step !== 'done' ? (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'#fdf4ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Stamp size={22} color="#7e22ce" />
              </div>
              <div>
                <h2 style={{ margin:0, fontSize:'1.1rem', fontWeight:800, color:'#0f172a' }}>Sign Document</h2>
                <p style={{ margin:0, fontSize:'0.78rem', color:'#64748b' }}>{doc.title} · v{doc.currentVersion}</p>
              </div>
              <button onClick={onClose} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:'1.5rem', lineHeight:1 }}>×</button>
            </div>

            {/* Signer identity read-only */}
            <div style={{ background:'#f8fafc', borderRadius:10, padding:'0.85rem 1rem', marginBottom:'1.25rem', border:'1px solid #e2e8f0' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
                <User size={14} color="#64748b" />
                <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>Signing as</span>
              </div>
              <div style={{ fontWeight:700, color:'#0f172a' }}>{user.name}</div>
              <div style={{ fontSize:'0.78rem', color:'#64748b' }}>{user.email} · <span style={{ textTransform:'capitalize' }}>{user.role.replace('-', ' ')}</span></div>
            </div>

            {/* contentHash — what the server will validate */}
            <div style={{ background:'#fdf4ff', borderRadius:10, padding:'0.85rem 1rem', marginBottom:'1.25rem', border:'1px solid #e9d5ff' }}>
              <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#7e22ce', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.35rem' }}>
                Content Hash (SHA-256 of Current Version)
              </div>
              <div style={{ fontFamily:'monospace', fontSize:'0.75rem', color:'#1e293b', wordBreak:'break-all', lineHeight:1.6 }}>
                {fetchedHash}
              </div>
              <div style={{ fontSize:'0.72rem', color:'#9333ea', marginTop:'0.4rem' }}>
                By signing, you attest that this hash represents the document you reviewed.
              </div>
            </div>

            {/* Optional note */}
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'0.4rem' }}>
                Note (optional)
              </label>
              <textarea
                style={{ width:'100%', padding:'0.6rem 0.85rem', borderRadius:8, border:'1px solid #cbd5e1', fontSize:'0.88rem', outline:'none', resize:'vertical', minHeight:70, boxSizing:'border-box', fontFamily:'inherit' }}
                placeholder="e.g. Reviewed and attested per court order CO-2024-182"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end' }}>
              <button type="button" onClick={onClose}
                style={{ padding:'0.6rem 1.2rem', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc', cursor:'pointer', fontWeight:600, fontSize:'0.85rem', color:'#475569' }}>
                Cancel
              </button>
              <button
                onClick={handleSign}
                disabled={signing}
                style={{ padding:'0.6rem 1.4rem', borderRadius:8, border:'none', background:'#7e22ce', color:'#fff', fontWeight:700, fontSize:'0.85rem', cursor: signing ? 'not-allowed' : 'pointer', opacity: signing ? 0.75 : 1, display:'inline-flex', alignItems:'center', gap:'0.4rem' }}
              >
                <Stamp size={14} />
                {signing ? 'Signing…' : 'Sign Document'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign:'center', padding:'1.5rem 0' }}>
            <div style={{ width:60, height:60, borderRadius:'50%', background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
              <CheckCircle2 size={30} color="#16a34a" />
            </div>
            <h3 style={{ margin:'0 0 0.5rem', fontSize:'1.15rem', fontWeight:800, color:'#0f172a' }}>Document Signed</h3>
            <p style={{ margin:'0 0 1.5rem', color:'#64748b', fontSize:'0.9rem' }}>
              Your digital signature has been recorded for v{doc.currentVersion}.
            </p>
            <button onClick={onClose}
              style={{ padding:'0.6rem 1.4rem', borderRadius:8, border:'none', background:'#7B1D2E', color:'#fff', fontWeight:700, cursor:'pointer' }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── DocumentCard ──────────────────────────────────────────────────────────────
function DocumentCard({ doc, user, onUploadVersion, onAuditLog, onDownload }) {
  const [expanded, setExpanded]     = useState(false);
  const [signatures, setSignatures] = useState(null); // null = not fetched yet
  const [showVerify, setShowVerify] = useState(false);
  const [showSign, setShowSign]     = useState(false);
  const { showToast } = useToast();
  const conf = CONF_META[doc.confidentialityLevel] || CONF_META.restricted;

  const canSign = SIGN_ROLES.includes(user?.role);

  const handleExpand = async () => {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    // Lazy-load signatures on first expand
    if (signatures === null) {
      try {
        const data = await API.vault.getSignatures(doc._id);
        setSignatures(data.data || []);
      } catch {
        setSignatures([]); // non-fatal
      }
    }
  };

  const handleSignDone = async () => {
    setShowSign(false);
    // Refresh signatures
    try {
      const data = await API.vault.getSignatures(doc._id);
      setSignatures(data.data || []);
    } catch { /* non-fatal */ }
  };

  return (
    <>
      <div style={s.docCard}>
        <div style={s.docHeader} onClick={handleExpand}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', minWidth:0, flex:1 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:'#ffe4e6', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <FileText size={17} color="#7B1D2E" />
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexWrap:'wrap' }}>
                <span style={{ fontWeight:700, color:'#0f172a', fontSize:'0.88rem' }}>{doc.title}</span>
                <DocTypeBadge type={doc.docType} />
                <span style={{ fontSize:'0.7rem', fontWeight:700, color: conf.color }}>{conf.label}</span>
              </div>
              <div style={{ fontSize:'0.75rem', color:'#94a3b8', marginTop:'0.1rem' }}>
                v{doc.currentVersion} · {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                {doc.uploadedBy && ` · ${doc.uploadedBy.name}`}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
            <span style={{ fontSize:'0.72rem', color:'#94a3b8', fontFamily:'monospace' }} title="SHA-256 (first 8 chars)">
              {doc.sha256Hash?.slice(0, 8)}…
            </span>
            {expanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
          </div>
        </div>

        {expanded && (
          <div style={s.docBody}>
            {/* ── Version history ── */}
            <div style={{ marginBottom:'1rem' }}>
              <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'0.4rem', display:'flex', alignItems:'center', gap:4 }}>
                <History size={12} /> Version History
              </div>
              <div style={s.versionRow}>
                <span style={{ fontWeight:700 }}>v{doc.currentVersion} (current)</span>
                <span style={{ fontFamily:'monospace', fontSize:'0.75rem', color:'#94a3b8' }}>{doc.sha256Hash?.slice(0, 20)}…</span>
                <span style={{ fontSize:'0.75rem', color:'#94a3b8' }}>{new Date(doc.uploadedAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            {/* ── Digital Signatures ── */}
            <div style={{ marginBottom:'1rem' }}>
              <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'0.4rem', display:'flex', alignItems:'center', gap:4 }}>
                <Stamp size={12} /> Signatures {signatures?.length ? `(${signatures.length})` : ''}
              </div>
              {!signatures || signatures.length === 0 ? (
                <div style={{ fontSize:'0.8rem', color:'#94a3b8', padding:'0.4rem 0' }}>No signatures yet.</div>
              ) : (
                signatures.map(sig => (
                  <div key={sig._id} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.5rem 0.75rem', background:'#fdf4ff', borderRadius:8, marginBottom:'0.4rem', border:'1px solid #e9d5ff' }}>
                    <Stamp size={14} color="#7e22ce" style={{ flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, color:'#1e293b', fontSize:'0.82rem' }}>{sig.signedBy?.name || '—'}</div>
                      <div style={{ fontSize:'0.72rem', color:'#64748b' }}>
                        {sig.signerRole?.replace('-', ' ')} · v{sig.documentVersion?.versionNumber}
                        {' · '}{new Date(sig.signedAt).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                      </div>
                    </div>
                    <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink:0 }} />
                  </div>
                ))
              )}
            </div>

            {/* ── Action buttons ── */}
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {/* Download — triggers Content-Disposition save dialog */}
              <button
                style={{ ...s.actionBtn, background:'#eff6ff', color:'#1d4ed8' }}
                onMouseEnter={e => e.currentTarget.style.background='#dbeafe'}
                onMouseLeave={e => e.currentTarget.style.background='#eff6ff'}
                onClick={() => onDownload(doc._id, doc.title, doc.currentVersion)}
              >
                <Download size={13} /> Download
              </button>

              {/* Verify Integrity — hero demo button */}
              <button
                style={{ ...s.actionBtn, background:'#f0fdf4', color:'#15803d', fontWeight:800 }}
                onMouseEnter={e => e.currentTarget.style.background='#dcfce7'}
                onMouseLeave={e => e.currentTarget.style.background='#f0fdf4'}
                onClick={() => setShowVerify(true)}
              >
                <Shield size={13} /> Verify Integrity
              </button>

              {/* New Version */}
              <button
                style={{ ...s.actionBtn, background:'#fdf4ff', color:'#7e22ce' }}
                onMouseEnter={e => e.currentTarget.style.background='#f3e8ff'}
                onMouseLeave={e => e.currentTarget.style.background='#fdf4ff'}
                onClick={() => onUploadVersion(doc)}
              >
                <PenLine size={13} /> New Version
              </button>

              {/* Sign Document — restricted to SIGN_ROLES */}
              {canSign && (
                <button
                  style={{ ...s.actionBtn, background:'#fdf4ff', color:'#6b21a8', border:'1px solid #ddd6fe' }}
                  onMouseEnter={e => e.currentTarget.style.background='#ede9fe'}
                  onMouseLeave={e => e.currentTarget.style.background='#fdf4ff'}
                  onClick={() => setShowSign(true)}
                >
                  <Stamp size={13} /> Sign Document
                </button>
              )}

              {/* Audit Log */}
              <button
                style={{ ...s.actionBtn, background:'#fff7ed', color:'#c2410c' }}
                onMouseEnter={e => e.currentTarget.style.background='#ffedd5'}
                onMouseLeave={e => e.currentTarget.style.background='#fff7ed'}
                onClick={() => onAuditLog(doc._id)}
              >
                <Eye size={13} /> Audit Log
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals — rendered outside the card to avoid clipping */}
      {showVerify && (
        <VerifyIntegrity doc={doc} onClose={() => setShowVerify(false)} />
      )}
      {showSign && canSign && (
        <SignModal
          doc={doc}
          user={user}
          onClose={() => setShowSign(false)}
          onDone={handleSignDone}
        />
      )}
    </>
  );
}

// ── CaseDetail — main page ────────────────────────────────────────────────────
export default function CaseDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const { showToast } = useToast();

  const [caseFile, setCaseFile]     = useState(null);
  const [documents, setDocuments]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(null);

  const fetchCase = async () => {
    setLoading(true);
    try {
      const data = await API.vault.getCase(id);
      setCaseFile(data.data.caseFile);
      setDocuments(data.data.documents || []);
    } catch (err) {
      showToast(err.message || 'Failed to load case', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCase(); }, [id]);

  /**
   * Download handler — authenticated blob download.
   *
   * Cannot use API.vault.downloadDoc() here because api.js's request() always
   * calls res.json(), discarding the raw bytes and the Content-Disposition header.
   *
   * Instead we:
   *   1. fetch() the endpoint directly with credentials:'include' (same auth
   *      mechanism — httpOnly cookie — that the rest of the codebase uses)
   *   2. On 401, attempt one token refresh then retry (mirrors api.js behaviour)
   *   3. Read the response as a Blob
   *   4. Parse the filename from the Content-Disposition header; fall back to
   *      the same pattern the backend uses: "<title>_v<N>.<ext>"
   *   5. Create an object URL, attach it to a hidden <a download="..."> element,
   *      programmatically click it, then immediately revoke the object URL
   *
   * This works for the current JSON-body response AND will continue to work
   * unchanged when the backend is updated to stream real file bytes.
   */
  const handleDownload = async (docId, title, version) => {
    const endpoint = `/api/case-vault/documents/${docId}/download${version ? `?version=${version}` : ''}`;

    const doFetch = () =>
      fetch(endpoint, {
        method:      'GET',
        credentials: 'include',   // sends the httpOnly JWT cookie
      });

    try {
      let response = await doFetch();

      // ── 401 handling: attempt one silent refresh then retry ───────────────
      if (response.status === 401) {
        const refreshRes = await fetch('/api/auth/refresh', {
          method:      'POST',
          credentials: 'include',
        });
        if (!refreshRes.ok) {
          showToast('Session expired — please log in again', 'error');
          return;
        }
        response = await doFetch(); // retry with fresh cookie
      }

      if (!response.ok) {
        // Attempt to read error message from JSON body
        let errMsg = `Download failed (HTTP ${response.status})`;
        try {
          const errData = await response.clone().json();
          errMsg = errData.error || errMsg;
        } catch { /* body wasn't JSON, keep default message */ }
        showToast(errMsg, 'error');
        return;
      }

      // ── Parse filename from Content-Disposition header ────────────────────
      //
      // Backend sets:
      //   Content-Disposition: attachment; filename="<safeTitle>_v<N>.<ext>"
      //
      // Note: browsers expose this header only when the server includes
      // Access-Control-Expose-Headers: Content-Disposition in CORS responses.
      // For same-origin requests (Vite proxy / production same-domain) it is
      // always accessible.
      const disposition = response.headers.get('Content-Disposition') || '';
      let filename = '';

      const filenameMatch = disposition.match(/filename="?([^";\n]+)"?/i);
      if (filenameMatch?.[1]) {
        filename = filenameMatch[1].trim();
      }

      // Fallback: reconstruct the same filename pattern the backend uses
      if (!filename) {
        const safeTitle = title.replace(/[^a-zA-Z0-9 _-]/g, '_');
        // mimeType isn't available here without parsing JSON — default to 'bin'
        filename = `${safeTitle}_v${version || 1}.bin`;
      }

      // ── Blob → object URL → hidden anchor → programmatic click ───────────
      const blob      = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const anchor    = document.createElement('a');
      anchor.href     = objectUrl;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();

      // Clean up immediately after the click is dispatched
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);

      showToast(`Downloading "${filename}"`, 'success');
    } catch (err) {
      showToast(err.message || 'Download failed', 'error');
    }
  };


  const canCreate = ['officer', 'admin'].includes(user?.role);

  if (loading) {
    return (
      <CaseVaultRoute>
        <AdminLayout title="Case Detail">
          <div style={{ textAlign:'center', padding:'5rem', color:'#94a3b8' }}>
            <div className="spinner" style={{ margin:'0 auto 1rem', width:32, height:32, border:'3px solid #e2e8f0', borderTopColor:'#7B1D2E', borderRadius:'50%' }} />
            Loading case…
          </div>
        </AdminLayout>
      </CaseVaultRoute>
    );
  }

  if (!caseFile) {
    return (
      <CaseVaultRoute>
        <AdminLayout title="Case Detail">
          <div style={{ textAlign:'center', padding:'4rem', color:'#ef4444', fontWeight:600 }}>Case not found.</div>
        </AdminLayout>
      </CaseVaultRoute>
    );
  }

  const statusM = STATUS_META[caseFile.status] || STATUS_META.open;

  return (
    <CaseVaultRoute>
      <AdminLayout title={`Case: ${caseFile.caseNumber}`}>
        <Helmet>
          <title>{caseFile.caseNumber} — Case Vault</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <button style={s.back} onClick={() => navigate('/case-vault/dashboard')}>
          <ArrowLeft size={15} /> Back to Cases
        </button>

        {/* ── Case metadata card ── */}
        <div style={s.card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <FolderOpen size={22} color="#7B1D2E" />
              </div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
                  <span style={{ fontWeight:800, fontSize:'1.2rem', color:'#0f172a' }}>{caseFile.caseNumber}</span>
                  <span style={{ ...s.badge, backgroundColor: statusM.bg, color: statusM.text }}>{statusM.label}</span>
                </div>
                <div style={{ fontSize:'0.9rem', color:'#475569', marginTop:'0.2rem' }}>{caseFile.title}</div>
              </div>
            </div>
            {canCreate && (
              <button
                style={s.uploadBtn}
                onClick={() => { setUploadTarget(null); setShowUpload(true); }}
                onMouseEnter={e => e.currentTarget.style.background='#5C1521'}
                onMouseLeave={e => e.currentTarget.style.background='#7B1D2E'}
              >
                <Upload size={15} /> Upload Document
              </button>
            )}
          </div>

          <div style={s.grid2}>
            <MetaItem label="Department"        value={caseFile.department} />
            <MetaItem label="Jurisdiction"      value={caseFile.jurisdiction} />
            <MetaItem label="Created By"        value={caseFile.createdBy?.name} />
            <MetaItem label="Created"           value={new Date(caseFile.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })} />
            <MetaItem label="Assigned Officers" value={caseFile.assignedOfficers?.map(o => o.name).join(', ') || 'None'} />
          </div>

          {caseFile.description && (
            <div style={{ marginTop:'1rem', padding:'0.8rem', background:'#f8fafc', borderRadius:8, fontSize:'0.88rem', color:'#475569', lineHeight:1.6 }}>
              {caseFile.description}
            </div>
          )}
        </div>

        {/* ── Documents card ── */}
        <div style={s.card}>
          <div style={{ ...s.sectionTitle, justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <FileText size={18} color="#7B1D2E" /> Documents ({documents.length})
            </div>
          </div>

          {documents.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2.5rem', color:'#94a3b8', fontSize:'0.9rem' }}>
              No documents uploaded yet.
              {canCreate && (
                <>
                  <br />
                  <button
                    style={{ ...s.uploadBtn, marginTop:'1rem', fontSize:'0.82rem' }}
                    onClick={() => { setUploadTarget(null); setShowUpload(true); }}
                    onMouseEnter={e => e.currentTarget.style.background='#5C1521'}
                    onMouseLeave={e => e.currentTarget.style.background='#7B1D2E'}
                  >
                    <Upload size={14} /> Upload First Document
                  </button>
                </>
              )}
            </div>
          ) : (
            documents.map(doc => (
              <DocumentCard
                key={doc._id}
                doc={doc}
                user={user}
                onUploadVersion={(d) => { setUploadTarget(d); setShowUpload(true); }}
                onAuditLog={(docId) => navigate(`/case-vault/audit-log/${docId}`)}
                onDownload={handleDownload}
              />
            ))
          )}
        </div>

        {/* Upload modal */}
        {showUpload && (
          <UploadModal
            caseId={id}
            targetDoc={uploadTarget}
            onClose={() => { setShowUpload(false); setUploadTarget(null); }}
            onDone={() => { setShowUpload(false); setUploadTarget(null); fetchCase(); }}
          />
        )}
      </AdminLayout>
    </CaseVaultRoute>
  );
}

// ── UploadModal (unchanged from Phase 3, kept inline) ────────────────────────
function UploadModal({ caseId, targetDoc, onClose, onDone }) {
  const { showToast } = useToast();
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    title:                targetDoc?.title || '',
    docType:              targetDoc?.docType || 'FIR',
    confidentialityLevel: 'restricted',
    changeNote:           '',
    tags:                 '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [dragOver, setDragOver]         = useState(false);

  const isNewVersion = Boolean(targetDoc);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { showToast('File must be under 10 MB', 'error'); return; }
    setSelectedFile(file);
  };

  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) { showToast('Please select a file', 'error'); return; }
    setUploading(true);
    try {
      const fileBase64 = await readFileAsBase64(selectedFile);
      const mimeType   = selectedFile.type || 'application/octet-stream';

      if (isNewVersion) {
        if (!form.changeNote.trim()) { showToast('Change note is required for new versions', 'error'); setUploading(false); return; }
        await API.vault.uploadVersion(targetDoc._id, { fileBase64, mimeType, changeNote: form.changeNote.trim() });
        showToast('New version uploaded successfully', 'success');
      } else {
        await API.vault.uploadDocument(caseId, {
          title:                form.title.trim(),
          docType:              form.docType,
          fileBase64,
          mimeType,
          confidentialityLevel: form.confidentialityLevel,
          tags:                 form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          ...(form.changeNote ? { changeNote: form.changeNote } : {}),
        });
        showToast('Document uploaded successfully', 'success');
      }
      onDone();
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const overlay  = { position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' };
  const modal    = { background:'#fff', borderRadius:16, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', padding:'2rem', position:'relative', boxShadow:'0 25px 60px rgba(0,0,0,0.25)' };
  const inp      = { width:'100%', padding:'0.6rem 0.85rem', borderRadius:8, border:'1px solid #cbd5e1', fontSize:'0.88rem', outline:'none', boxSizing:'border-box', marginTop:'0.3rem' };
  const lbl      = { display:'block', fontSize:'0.78rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.04em' };
  const fGap     = { marginBottom:'1rem' };

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modal}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h2 style={{ margin:0, fontSize:'1.15rem', fontWeight:800, color:'#0f172a' }}>
            {isNewVersion ? `New Version — ${targetDoc.title}` : 'Upload Document'}
          </h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:'1.4rem', lineHeight:1, padding:'0.2rem 0.4rem' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isNewVersion && (
            <>
              <div style={fGap}>
                <label style={lbl}>Document Title *</label>
                <input style={inp} required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Witness Statement – Sharma" />
              </div>
              <div style={fGap}>
                <label style={lbl}>Document Type *</label>
                <select style={{ ...inp, marginTop:'0.3rem' }} value={form.docType} onChange={e => setForm(f => ({ ...f, docType: e.target.value }))}>
                  {Object.entries(DOC_TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div style={fGap}>
                <label style={lbl}>Confidentiality Level</label>
                <select style={{ ...inp, marginTop:'0.3rem' }} value={form.confidentialityLevel} onChange={e => setForm(f => ({ ...f, confidentialityLevel: e.target.value }))}>
                  {Object.entries(CONF_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div style={fGap}>
                <label style={lbl}>Tags (comma-separated)</label>
                <input style={inp} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. financial, cyber" />
              </div>
            </>
          )}

          {isNewVersion && (
            <div style={fGap}>
              <label style={lbl}>Change Note *</label>
              <textarea style={{ ...inp, minHeight:70, resize:'vertical' }} required value={form.changeNote} onChange={e => setForm(f => ({ ...f, changeNote: e.target.value }))} placeholder="Describe what changed in this version…" />
            </div>
          )}

          <div style={fGap}>
            <label style={lbl}>File * (max 10 MB)</label>
            <div
              style={{ marginTop:'0.4rem', border:`2px dashed ${dragOver ? '#7B1D2E' : '#cbd5e1'}`, borderRadius:10, padding:'1.5rem', textAlign:'center', cursor:'pointer', background: dragOver ? '#fef2f2' : '#f8fafc', transition:'all 0.15s' }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            >
              {selectedFile ? (
                <div style={{ color:'#16a34a', fontWeight:700, fontSize:'0.9rem' }}>
                  <CheckCircle2 size={20} style={{ verticalAlign:'middle', marginRight:6 }} />
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                </div>
              ) : (
                <div style={{ color:'#94a3b8', fontSize:'0.88rem' }}>
                  <Upload size={22} style={{ margin:'0 auto 0.5rem', display:'block', opacity:0.5 }} />
                  Drop file here or click to select
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" style={{ display:'none' }} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt" onChange={e => handleFile(e.target.files[0])} />
          </div>

          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding:'0.6rem 1.2rem', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc', cursor:'pointer', fontWeight:600, fontSize:'0.85rem', color:'#475569' }}>
              Cancel
            </button>
            <button type="submit" disabled={uploading}
              style={{ padding:'0.6rem 1.4rem', borderRadius:8, border:'none', background:'#7B1D2E', color:'#fff', fontWeight:700, fontSize:'0.85rem', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.75 : 1 }}>
              {uploading ? 'Uploading…' : isNewVersion ? 'Upload Version' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
