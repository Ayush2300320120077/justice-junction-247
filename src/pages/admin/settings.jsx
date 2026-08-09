import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminRoute from '../../components/admin/AdminRoute';
import { Settings, ShieldAlert, Power, Save, PauseCircle, Trash2 } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    registrationsPaused: false,
    dangerZoneEnabled: false,
    aiProvider: 'mock',
    aiApiKey: '',
    platformFeePercentage: 10
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        credentials: 'include'
      });
      if (res.ok) {
        const json = await res.json();
        setSettings(json.data || json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/admin/settings', { credentials: 'include',
        method: 'PUT',
        headers: { 
          
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSuccessMsg('Settings saved successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminRoute>
      <AdminLayout title="Platform Settings">
        
        <div style={s.container}>
          <div style={s.mainColumn}>
            
            {successMsg && (
              <div style={s.successBanner}>{successMsg}</div>
            )}

            <form onSubmit={handleSave} style={s.card}>
              <div style={s.cardHeader}>
                <h2 style={s.cardTitle}><Settings size={20}/> General Settings</h2>
              </div>
              <div style={s.cardBody}>
                <div style={s.inputGroup}>
                  <label style={s.label}>Support Email Address</label>
                  <input 
                    type="email" 
                    value={settings.supportEmail} 
                    onChange={e => setSettings({...settings, supportEmail: e.target.value})} 
                    style={s.input}
                  />
                  <p style={s.helpText}>Used for reply-to in contact forms and platform emails.</p>
                </div>
                
                <div style={s.inputGroup}>
                  <label style={s.label}>Platform Fee Percentage (%)</label>
                  <input 
                    type="number" 
                    value={settings.platformFeePercentage} 
                    onChange={e => setSettings({...settings, platformFeePercentage: Number(e.target.value)})} 
                    style={s.input}
                    min="0" max="100"
                  />
                  <p style={s.helpText}>The cut taken from successful lawyer bookings.</p>
                </div>

                <button type="submit" style={s.saveBtn} disabled={saving}>
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>

            <div style={s.card}>
              <div style={s.cardHeader}>
                <h2 style={s.cardTitle}><Power size={20}/> Platform Controls</h2>
              </div>
              <div style={s.cardBody}>
                
                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Maintenance Mode</div>
                    <div style={s.toggleDesc}>Disables the public site and shows a "We'll be right back" page.</div>
                  </div>
                  <button 
                    onClick={() => { setSettings(s => ({...s, maintenanceMode: !s.maintenanceMode})); setTimeout(handleSave, 100); }}
                    style={{...s.toggleBtn, backgroundColor: settings.maintenanceMode ? '#ef4444' : '#e2e8f0'}}
                  >
                    <div style={{...s.toggleKnob, transform: settings.maintenanceMode ? 'translateX(24px)' : 'translateX(0)'}}></div>
                  </button>
                </div>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Pause New Registrations</div>
                    <div style={s.toggleDesc}>Prevents new lawyers and clients from signing up.</div>
                  </div>
                  <button 
                    onClick={() => { setSettings(s => ({...s, registrationsPaused: !s.registrationsPaused})); setTimeout(handleSave, 100); }}
                    style={{...s.toggleBtn, backgroundColor: settings.registrationsPaused ? '#f59e0b' : '#e2e8f0'}}
                  >
                    <div style={{...s.toggleKnob, transform: settings.registrationsPaused ? 'translateX(24px)' : 'translateX(0)'}}></div>
                  </button>
                </div>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>AI Provider</div>
                    <div style={s.toggleDesc}>Select the AI model for the Legal Assistant bot.</div>
                  </div>
                  <select 
                    style={s.selectInput}
                    value={settings.aiProvider || 'mock'}
                    onChange={(e) => setSettings({...settings, aiProvider: e.target.value})}
                  >
                    <option value="mock">Demo Template (No API Key)</option>
                    <option value="gemini">Google Gemini (Recommended)</option>
                    <option value="anthropic">Anthropic Claude</option>
                  </select>
                </div>

                {settings.aiProvider !== 'mock' && (
                  <div style={{...s.toggleRow, flexDirection: 'column', alignItems: 'flex-start', gap: 12}}>
                    <div>
                      <div style={s.toggleTitle}>AI API Key</div>
                      <div style={s.toggleDesc}>Enter your {settings.aiProvider === 'gemini' ? 'Google Gemini' : 'Anthropic'} API key here. It is saved securely.</div>
                    </div>
                    <input 
                      type="password" 
                      style={s.textInput}
                      value={settings.aiApiKey || ''}
                      onChange={(e) => setSettings({...settings, aiApiKey: e.target.value})}
                      placeholder={`Enter ${settings.aiProvider} API key...`}
                    />
                  </div>
                )}

              </div>
            </div>

            <div style={{...s.card, border: '1px solid #fecaca'}}>
              <div style={{...s.cardHeader, backgroundColor: '#fef2f2', borderBottom: '1px solid #fecaca'}}>
                <h2 style={{...s.cardTitle, color: '#ef4444'}}><ShieldAlert size={20}/> Danger Zone</h2>
              </div>
              <div style={s.cardBody}>
                <div style={s.toggleRow}>
                  <div>
                    <div style={{...s.toggleTitle, color: '#ef4444'}}>Enable Destructive Actions</div>
                    <div style={s.toggleDesc}>Must be enabled to permanently delete users or lawyers from the platform. Use extreme caution.</div>
                  </div>
                  <button 
                    onClick={() => { setSettings(s => ({...s, dangerZoneEnabled: !s.dangerZoneEnabled})); setTimeout(handleSave, 100); }}
                    style={{...s.toggleBtn, backgroundColor: settings.dangerZoneEnabled ? '#ef4444' : '#e2e8f0'}}
                  >
                    <div style={{...s.toggleKnob, transform: settings.dangerZoneEnabled ? 'translateX(24px)' : 'translateX(0)'}}></div>
                  </button>
                </div>

                {settings.dangerZoneEnabled && (
                  <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px solid #fecaca', borderRadius: '8px', backgroundColor: '#fff5f5' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#b91c1c' }}>System Wipes</h4>
                    <button style={s.dangerBtn} onClick={() => window.alert('This action requires superadmin CLI access.')}>
                      <Trash2 size={16}/> Wipe All Test Data
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </AdminLayout>
    </AdminRoute>
  );
}

const s = {
  container: { maxWidth: '800px', margin: '0 auto' },
  successBanner: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600, border: '1px solid #bbf7d0', textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  cardHeader: { padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  cardTitle: { margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  cardBody: { padding: '1.5rem' },
  
  inputGroup: { marginBottom: '1.5rem' },
  label: { display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', ':focus': { borderColor: '#4f46e5' } },
  helpText: { margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#475569' },
  
  saveBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' },
  
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f1f5f9', ':last-child': { borderBottom: 'none', paddingBottom: 0 } },
  toggleTitle: { fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' },
  toggleDesc: { fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' },
  toggleBtn: { position: 'relative', width: '52px', height: '28px', borderRadius: '14px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', padding: 0 },
  toggleKnob: { width: '24px', height: '24px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', transition: 'transform 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' },
  selectInput: { width: '100%', maxWidth: '300px', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#1e293b', outline: 'none' },
  textInput: { width: '100%', maxWidth: '400px', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#1e293b', outline: 'none' },
  dangerBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#fff', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', ':hover': { backgroundColor: '#fee2e2' } }
};
