import { useState, useEffect, useMemo } from 'react';
import { SettingsIcon, ListIcon, PlusIcon, TrashIcon, SaveIcon, CheckIcon, XIcon, PhoneIcon } from './Icons';
import { getBookings, updateBookingStatus, deleteBooking } from '../data/bookingService';

const BellIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

export default function AdminPanel({ slots, onSlotsChange, onClose }) {
  const [localSlots, setLocalSlots] = useState(slots);
  const [newSlot, setNewSlot] = useState({ day:'', month:'March', venue:'', shift:'morning', time:'', status:'booked' });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  const [filterMonth, setFilterMonth] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const ALL_MONTHS = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
  const MONTH_NUMS = { January:'01',February:'02',March:'03',April:'04',May:'05',June:'06',
                       July:'07',August:'08',September:'09',October:'10',November:'11',December:'12' };

  // Build dynamic month list: all months that appear in slots + next 12 from today
  const dynamicMonths = useMemo(() => {
    const now = new Date();
    // Months from TODAY onwards (next 24 months) as {month, year} objects
    const futureSet = new Set();
    for (let i = 0; i < 24; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      futureSet.add(`${d.getFullYear()}-${ALL_MONTHS[d.getMonth()]}`);
    }
    // Past months that have actual slots — keep them visible
    const pastWithSlots = new Set();
    localSlots.forEach(s => {
      if (!s.date) return;
      const [y, m] = s.date.split('-');
      const slotDate = new Date(Number(y), Number(m) - 1, 1);
      const todayMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      if (slotDate < todayMonth) pastWithSlots.add(`${y}-${ALL_MONTHS[Number(m)-1]}`);
    });
    const allKeys = [...pastWithSlots, ...futureSet];
    // Convert to unique month names in calendar order for display
    // Group by month name (if same month name appears in multiple years, show all)
    const result = allKeys.map(k => {
      const [yr, mn] = k.split('-');
      return { year: Number(yr), month: mn, idx: ALL_MONTHS.indexOf(mn) };
    });
    result.sort((a,b) => a.year !== b.year ? a.year - b.year : a.idx - b.idx);
    // Deduplicate by year+month
    const seen = new Set();
    const deduped = result.filter(r => {
      const key = `${r.year}-${r.month}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    // For the filter tabs, use "Month Year" label when year differs from current
    return ['All', ...deduped.map(r => r.year === now.getFullYear() ? r.month : `${r.month} ${r.year}`)];
  }, [localSlots]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoadingBookings(true);
    const data = await getBookings();
    setBookings(data);
    setLoadingBookings(false);
  };

  const handleBookingAction = async (id, status) => {
    const b = bookings.find(x => x.id === id);
    const updated = await updateBookingStatus(id, status);
    setBookings(updated);

    // When confirmed — auto-add as a booked slot so calendar updates immediately
    if (status === 'confirmed' && b) {
      // Parse the date string back to day/month/year
      // b.date is like "25 March 2026"
      const parts = b.date.split(' ');
      const day   = Number(parts[0]);
      const monthName = parts[1];   // e.g. "March"
      const year  = Number(parts[2]);
      const mNums = { January:'01',February:'02',March:'03',April:'04',May:'05',June:'06',
                      July:'07',August:'08',September:'09',October:'10',November:'11',December:'12' };
      const dateStr = `${year}-${mNums[monthName]}-${String(day).padStart(2,'0')}`;
      const timeLabel = b.shift === 'morning' ? '10 AM' : '3 PM';

      const newSlotEntry = {
        id: Date.now(),
        date: dateStr,
        day,
        month: monthName,
        venue: b.venue || '',
        shift: b.shift,
        time: timeLabel,
        status: 'booked',
      };

      const updatedSlots = [...localSlots, newSlotEntry];
      setLocalSlots(updatedSlots);
      onSlotsChange(updatedSlots); // saves to shared storage + updates parent

      // WhatsApp confirmation to customer
      const msg = `*Alfa Catering BKD — Booking Confirmed* %0A%0ADear ${b.name},%0A%0AYour catering booking has been confirmed!%0ADate: *${b.date}*%0AShift: *${b.shiftLabel}*%0A${b.notes ? 'Notes: ' + b.notes + '%0A' : ''}%0AFor further details, our coordinator will contact you shortly.%0A%0A— Basheer Valiyandi%0A97455 75826`;
      window.open(`https://wa.me/${b.phone.replace(/\D/g,'')}?text=${msg}`, '_blank');
    }
  };

  const handleDeleteBooking = async (id) => {
    const updated = await deleteBooking(id);
    setBookings(updated);
  };

  const toggleStatus = (id) => {
    setLocalSlots(prev => prev.map(s => s.id === id
      ? { ...s, status: s.status === 'booked' ? 'available' : 'booked' }
      : s
    ));
  };

  const deleteSlot = (id) => setLocalSlots(prev => prev.filter(s => s.id !== id));

  const addSlot = () => {
    if (!newSlot.day || !newSlot.month) return;
    const id = Date.now();
    // Parse "Month" or "Month YEAR" from newSlot.month
    const parts = newSlot.month.split(' ');
    const mName = parts[0];
    const slotYear = parts[1] ? Number(parts[1]) : new Date().getFullYear();
    const date = `${slotYear}-${MONTH_NUMS[mName]}-${String(newSlot.day).padStart(2,'0')}`;
    const timeLabel = newSlot.shift === 'morning' ? '10 AM' : '3 PM';
    const monthNameOnly = mName;
    setLocalSlots(prev => [...prev, { ...newSlot, id, date, day: Number(newSlot.day), month: monthNameOnly, time: newSlot.time || timeLabel }]);
    setNewSlot({ day:'', month:'March', venue:'', shift:'morning', time:'', status:'booked' });
  };

  const saveChanges = () => {
    onSlotsChange(localSlots);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const displayed = useMemo(() => {
    if (filterMonth === 'All') return localSlots;
    // filterMonth can be "March" or "March 2027"
    const parts = filterMonth.split(' ');
    const mName = parts[0];
    const mYear = parts[1] ? Number(parts[1]) : null;
    return localSlots.filter(s => {
      if (s.month !== mName) return false;
      if (mYear && s.date) {
        const slotYear = Number(s.date.split('-')[0]);
        return slotYear === mYear;
      }
      return true;
    });
  }, [localSlots, filterMonth]);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const tabs = [
    { key:'bookings', Icon: BellIcon,  label:'Requests', badge: pendingCount },
    { key:'manage',   Icon: ListIcon,  label:'Slots'    },
    { key:'add',      Icon: PlusIcon,  label:'Add'      },
  ];

  const statusColor = { pending:'#E67E22', confirmed:'var(--available)', rejected:'var(--red)' };
  const statusBg    = { pending:'#FEF3E8', confirmed:'var(--available-light)', rejected:'var(--red-light)' };

  return (
    <div className="admin-panel">
      <div className="admin-overlay" onClick={onClose} />
      <div className="admin-drawer">

        {/* Header */}
        <div className="admin-header">
          <div>
            <h2 style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <SettingsIcon size={18} color="var(--gold)" />
              Admin Panel
            </h2>
            <p>Alfa Catering BKD</p>
          </div>
          <button className="admin-close" onClick={onClose}>
            <XIcon size={16} color="#fff" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'2px solid var(--cream-dark)', flexShrink:0 }}>
          {tabs.map(({ key, Icon, label, badge }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{
                flex:1, padding:'0.75rem 0.4rem',
                background: activeTab === key ? 'var(--green)' : 'var(--white)',
                color: activeTab === key ? 'var(--white)' : 'var(--text-mid)',
                fontWeight:700, fontSize:'0.8rem',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'0.35rem',
                position:'relative'
              }}>
              <Icon size={14} color={activeTab === key ? '#fff' : 'var(--text-mid)'} />
              {label}
              {badge > 0 && (
                <span style={{
                  background:'var(--red)', color:'#fff',
                  borderRadius:'50%', width:16, height:16,
                  fontSize:'0.65rem', fontWeight:700,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  position:'absolute', top:6, right:8
                }}>{badge}</span>
              )}
            </button>
          ))}
        </div>

        <div className="admin-body">

          {/* ── BOOKINGS TAB ── */}
          {activeTab === 'bookings' && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                <div className="admin-section-title" style={{ marginBottom:0 }}>
                  Customer Booking Requests
                </div>
                <button onClick={loadBookings}
                  style={{ fontSize:'0.78rem', color:'var(--green)', fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>
                  Refresh
                </button>
              </div>

              {loadingBookings ? (
                <p style={{ color:'var(--text-light)', textAlign:'center', padding:'2rem' }}>Loading...</p>
              ) : bookings.length === 0 ? (
                <div style={{ textAlign:'center', padding:'2.5rem', color:'var(--text-light)' }}>
                  <BellIcon />
                  <p style={{ marginTop:'0.5rem', fontSize:'0.9rem' }}>No booking requests yet.</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  {[...bookings].reverse().map(b => (
                    <div key={b.id} style={{
                      background: statusBg[b.status] || 'var(--cream)',
                      borderRadius:'var(--radius-sm)',
                      padding:'1rem',
                      border:`1px solid ${statusColor[b.status] || 'var(--cream-dark)'}22`
                    }}>
                      {/* Top row */}
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
                        <div>
                          <div style={{ fontWeight:700, color:'var(--text-dark)', fontSize:'0.95rem' }}>{b.name}</div>
                          <div style={{ fontSize:'0.78rem', color:'var(--text-light)' }}>
                            {b.date} · <span style={{ color: b.shift==='morning' ? '#E67E22':'#8E44AD', fontWeight:700 }}>{b.shiftLabel}</span>
                          </div>
                        </div>
                        <span style={{
                          padding:'0.2rem 0.65rem', borderRadius:20,
                          fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase',
                          background: statusBg[b.status], color: statusColor[b.status]
                        }}>{b.status}</span>
                      </div>

                      {/* Details */}
                      <div style={{ fontSize:'0.82rem', color:'var(--text-mid)', marginBottom:'0.6rem', display:'flex', flexDirection:'column', gap:3 }}>
                        {b.notes && <span><strong>Notes:</strong> {b.notes}</span>}
                      </div>

                      {/* Actions */}
                      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                        <a href={`tel:${b.phone}`}
                          style={{
                            display:'flex', alignItems:'center', gap:4,
                            padding:'0.35rem 0.8rem', borderRadius:20,
                            background:'var(--green)', color:'#fff',
                            fontSize:'0.78rem', fontWeight:700
                          }}>
                          <PhoneIcon size={12} color="#fff" /> {b.phone}
                        </a>
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => handleBookingAction(b.id, 'confirmed')}
                              style={{
                                display:'flex', alignItems:'center', gap:4,
                                padding:'0.35rem 0.8rem', borderRadius:20,
                                background:'var(--available)', color:'#fff',
                                fontSize:'0.78rem', fontWeight:700, cursor:'pointer', border:'none'
                              }}>
                              <CheckIcon size={12} color="#fff" /> Confirm
                            </button>
                            <button onClick={() => handleBookingAction(b.id, 'rejected')}
                              style={{
                                padding:'0.35rem 0.8rem', borderRadius:20,
                                background:'var(--red)', color:'#fff',
                                fontSize:'0.78rem', fontWeight:700, cursor:'pointer', border:'none'
                              }}>
                              Reject
                            </button>
                          </>
                        )}
                        <button onClick={() => handleDeleteBooking(b.id)}
                          style={{
                            padding:'0.35rem 0.6rem', borderRadius:20,
                            background:'none', color:'var(--text-light)',
                            fontSize:'0.78rem', cursor:'pointer', border:'1px solid var(--cream-dark)'
                          }}>
                          <TrashIcon size={13} color="var(--text-light)" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── MANAGE SLOTS TAB ── */}
          {activeTab === 'manage' && (
            <>
              <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1rem' }}>
                {dynamicMonths.map(m => (
                  <button key={m} className={`month-tab${filterMonth===m?' active':''}`}
                    onClick={() => setFilterMonth(m)}
                    style={{ fontSize:'0.78rem', padding:'0.35rem 0.9rem' }}>{m}</button>
                ))}
              </div>

              <div className="admin-slots-list">
                {displayed.map(slot => (
                  <div key={slot.id} className="admin-slot-row">
                    <div style={{
                      background: slot.status==='booked' ? 'var(--red)' : 'var(--available)',
                      color:'#fff', borderRadius:'6px', padding:'4px 8px',
                      fontSize:'0.75rem', fontWeight:700, textAlign:'center', minWidth:36
                    }}>
                      {slot.day}<br />
                      <span style={{ fontSize:'0.6rem', opacity:0.85 }}>{slot.month.slice(0,3)}</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="slot-venue malayalam" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {slot.venue || 'Venue TBD'}
                      </div>
                      <div style={{ fontSize:'0.72rem', marginTop:2 }}>
                        <span style={{
                          color: slot.shift==='morning' ? '#E67E22':'#8E44AD',
                          fontWeight:700
                        }}>
                          {slot.shift==='morning' ? 'Morning' : 'Afternoon'}
                        </span>
                        {slot.time && <span style={{ color:'var(--text-light)' }}> · {slot.time}</span>}
                      </div>
                    </div>
                    <button className={`toggle-btn ${slot.status}`} onClick={() => toggleStatus(slot.id)}>
                      {slot.status==='booked' ? 'Booked':'Open'}
                    </button>
                    <button onClick={() => deleteSlot(slot.id)}
                      style={{ background:'none', color:'var(--text-light)', padding:'4px', display:'flex', alignItems:'center' }}>
                      <TrashIcon size={15} color="var(--text-light)" />
                    </button>
                  </div>
                ))}
              </div>

              <button className="admin-save-btn" onClick={saveChanges}
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', marginTop:'1rem' }}>
                {saved
                  ? <><CheckIcon size={16} color="#fff" /> Saved!</>
                  : <><SaveIcon  size={16} color="#fff" /> Save All Changes</>}
              </button>
            </>
          )}

          {/* ── ADD SLOT TAB ── */}
          {activeTab === 'add' && (
            <div className="add-slot-form">
              <div className="admin-section-title">
                <PlusIcon size={15} color="var(--green)" /> Add New Slot
              </div>

              <div className="contact-form" style={{ gap:'0.75rem' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Day</label>
                    <input type="number" placeholder="e.g. 15" min="1" max="31"
                      value={newSlot.day} onChange={e => setNewSlot(s => ({...s, day:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label>Month</label>
                    <select value={newSlot.month} onChange={e => setNewSlot(s => ({...s, month:e.target.value}))}>
                      {dynamicMonths.filter(m => m !== 'All').map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Venue (Malayalam)</label>
                  <input type="text" placeholder="e.g. കോഴിക്കോട്" className="malayalam"
                    value={newSlot.venue} onChange={e => setNewSlot(s => ({...s, venue:e.target.value}))} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Shift</label>
                    <select value={newSlot.shift} onChange={e => setNewSlot(s => ({...s, shift:e.target.value}))}>
                      <option value="morning">Morning (10 AM)</option>
                      <option value="afternoon">Afternoon (3 PM)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={newSlot.status} onChange={e => setNewSlot(s => ({...s, status:e.target.value}))}>
                      <option value="booked">Booked</option>
                      <option value="available">Available</option>
                    </select>
                  </div>
                </div>

                <button className="admin-save-btn" onClick={addSlot}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                  <PlusIcon size={15} color="#fff" /> Add Slot
                </button>

                {localSlots.length !== slots.length && (
                  <button className="admin-save-btn" onClick={saveChanges}
                    style={{ background:'var(--gold-dark)', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                    {saved
                      ? <><CheckIcon size={15} color="#fff" /> Saved!</>
                      : <><SaveIcon  size={15} color="#fff" /> Save to Website</>}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
