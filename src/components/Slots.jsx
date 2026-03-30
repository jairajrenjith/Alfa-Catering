import { useState, useMemo } from 'react';
import { PhoneIcon, ClockIcon, CalendarIcon } from './Icons';
import BookingModal from './BookingModal';

// ── Helpers ────────────────────────────────────────────────────────────────

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun',
                     'Jul','Aug','Sep','Oct','Nov','Dec'];

// Slot data uses month name strings — convert to {year, monthIdx}
function slotMonthKey(slot) {
  // slot.month is e.g. "March", slot.date is "2026-03-28"
  if (slot.date) {
    const [y, m] = slot.date.split('-');
    return `${y}-${m}`;           // e.g. "2026-03"
  }
  // fallback: assume 2026
  const idx = MONTH_NAMES.indexOf(slot.month);
  return `2026-${String(idx + 1).padStart(2,'0')}`;
}

function keyToLabel(key) {
  const [y, m] = key.split('-');
  return { year: Number(y), monthIdx: Number(m) - 1 };
}

function buildCalendarCells(year, monthIdx) {
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function monthKey(year, monthIdx) {
  return `${year}-${String(monthIdx + 1).padStart(2,'0')}`;
}

// Generate N months starting from today's month
function generateMonths(count = 24) {
  const now = new Date();
  const result = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    result.push({ key: monthKey(d.getFullYear(), d.getMonth()), year: d.getFullYear(), monthIdx: d.getMonth() });
  }
  return result;
}

// ── Component ───────────────────────────────────────────────────────────────

export default function Slots({ slots }) {
  const today     = new Date();
  const todayKey  = monthKey(today.getFullYear(), today.getMonth());

  // Build list of months: today + 23 future + any past months that have bookings
  const allMonths = useMemo(() => {
    const future = generateMonths(24); // today → 24 months ahead
    const futureKeys = new Set(future.map(m => m.key));

    // Collect any slot months that are before today and not already in future list
    const extraKeys = new Set();
    slots.forEach(s => {
      const k = slotMonthKey(s);
      if (!futureKeys.has(k)) extraKeys.add(k);
    });

    const extras = [...extraKeys].sort().map(k => {
      const { year, monthIdx } = keyToLabel(k);
      return { key: k, year, monthIdx };
    });

    return [...extras, ...future];
  }, [slots]);

  // Which months have any slots (booked or added)
  const slotMonthKeys = useMemo(() => {
    const s = new Set();
    slots.forEach(sl => s.add(slotMonthKey(sl)));
    return s;
  }, [slots]);

  // Default: today's month
  const [activeKey,   setActiveKey]   = useState(todayKey);
  const [activeShift, setActiveShift] = useState('all');
  const [viewMode,    setViewMode]    = useState('list');
  const [bookingInfo, setBookingInfo] = useState(null);

  // Visible month window: show 6 months at a time, page through them
  const [windowStart, setWindowStart] = useState(0);
  const WINDOW = 6;

  const visibleMonths = allMonths.slice(windowStart, windowStart + WINDOW);
  const canPrev = windowStart > 0;
  const canNext = windowStart + WINDOW < allMonths.length;

  // Active month meta
  const active = allMonths.find(m => m.key === activeKey) || allMonths[0];
  const { year: aYear, monthIdx: aMIdx } = active;

  // Slots for active month
  const monthSlots = useMemo(() =>
    slots.filter(s => slotMonthKey(s) === activeKey),
  [slots, activeKey]);

  const filtered = useMemo(() =>
    monthSlots.filter(s => activeShift === 'all' || s.shift === activeShift),
  [monthSlots, activeShift]);

  // Booked days map for calendar
  const bookedDays = useMemo(() => {
    const map = {};
    monthSlots.forEach(s => {
      if (!map[s.day]) map[s.day] = [];
      map[s.day].push(s.shift);
    });
    return map;
  }, [monthSlots]);

  const calCells = useMemo(() => buildCalendarCells(aYear, aMIdx), [aYear, aMIdx]);

  const openBooking = (day, shift) => {
    const dateStr = new Date(aYear, aMIdx, day)
      .toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
    setBookingInfo({ date: dateStr, shift });
  };

  const selectMonth = (key) => {
    setActiveKey(key);
    // If selected month not in current window, slide window
    const idx = allMonths.findIndex(m => m.key === key);
    if (idx < windowStart) setWindowStart(Math.max(0, idx));
    else if (idx >= windowStart + WINDOW) setWindowStart(Math.min(allMonths.length - WINDOW, idx - WINDOW + 1));
  };

  // Group visible months by year for display
  const yearGroups = useMemo(() => {
    const groups = {};
    visibleMonths.forEach(m => {
      if (!groups[m.year]) groups[m.year] = [];
      groups[m.year].push(m);
    });
    return Object.entries(groups).map(([year, months]) => ({ year: Number(year), months }));
  }, [visibleMonths]);

  return (
    <section className="slots-section" id="slots">
      <div className="container">
        <span className="section-label">Availability</span>
        <h2 className="section-title">Booking Slots</h2>
        <p className="malayalam" style={{ color:'var(--text-mid)', marginTop:'0.5rem', fontSize:'0.95rem' }}>
          ഏത് ദിവസം ബുക്ക്‌ ചെയ്തിട്ടുണ്ടെന്ന് ഇവിടെ കാണാം
        </p>
        <div className="divider" />

        {/* Legend */}
        <div className="slots-legend">
          <div className="legend-dot"><span className="dot booked" />Booked</div>
          <div className="legend-dot"><span className="dot available" />Available</div>
          <div className="legend-dot">
            <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
              <span style={{ width:12,height:12,borderRadius:'50%',background:'#E67E22',display:'inline-block' }}/>Morning
            </span>
          </div>
          <div className="legend-dot">
            <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
              <span style={{ width:12,height:12,borderRadius:'50%',background:'#8E44AD',display:'inline-block' }}/>Afternoon
            </span>
          </div>
        </div>

        {/* ── Month Navigator ── */}
        <div className="month-nav">
          <button
            className="month-nav-arrow"
            onClick={() => setWindowStart(w => Math.max(0, w - WINDOW))}
            disabled={!canPrev}
            aria-label="Previous months"
          >
            ‹
          </button>

          <div className="month-nav-body">
            {yearGroups.map(({ year, months }) => (
              <div key={year} className="month-nav-year-group">
                <span className="month-nav-year-label">{year}</span>
                <div className="month-nav-pills">
                  {months.map(m => {
                    const isActive  = m.key === activeKey;
                    const hasSlots  = slotMonthKeys.has(m.key);
                    const isToday   = m.key === todayKey;
                    return (
                      <button
                        key={m.key}
                        className={[
                          'month-pill',
                          isActive  ? 'month-pill-active'  : '',
                          hasSlots  ? 'month-pill-booked'  : '',
                          isToday   ? 'month-pill-today'   : '',
                        ].join(' ')}
                        onClick={() => selectMonth(m.key)}
                      >
                        {MONTH_SHORT[m.monthIdx]}
                        {hasSlots && !isActive && <span className="month-pill-dot" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            className="month-nav-arrow"
            onClick={() => setWindowStart(w => Math.min(allMonths.length - WINDOW, w + WINDOW))}
            disabled={!canNext}
            aria-label="Next months"
          >
            ›
          </button>
        </div>

        {/* Active month heading */}
        <div style={{ marginBottom:'1rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
          <h3 style={{ fontFamily:'Playfair Display, serif', color:'var(--green)', fontSize:'1.3rem', fontWeight:600 }}>
            {MONTH_NAMES[aMIdx]} {aYear}
            {monthSlots.length > 0 && (
              <span style={{ marginLeft:'0.6rem', fontSize:'0.75rem', fontWeight:700,
                background:'var(--red-light)', color:'var(--red)',
                padding:'2px 10px', borderRadius:20, verticalAlign:'middle' }}>
                {monthSlots.length} booked
              </span>
            )}
          </h3>

          {/* Shift + View controls */}
          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', alignItems:'center' }}>
            {/* Shift filter */}
            {[['all','All'],['morning','AM'],['afternoon','PM']].map(([val, lbl]) => (
              <button key={val}
                onClick={() => setActiveShift(val)}
                style={{
                  padding:'0.35rem 0.8rem', borderRadius:30,
                  fontSize:'0.78rem', fontWeight:700,
                  background: activeShift===val
                    ? (val==='morning' ? '#E67E22' : val==='afternoon' ? '#8E44AD' : 'var(--green)')
                    : 'var(--white)',
                  color: activeShift===val ? '#fff' : 'var(--text-mid)',
                  border:'1.5px solid',
                  borderColor: activeShift===val
                    ? (val==='morning' ? '#E67E22' : val==='afternoon' ? '#8E44AD' : 'var(--green)')
                    : 'var(--cream-dark)',
                  cursor:'pointer'
                }}
              >{lbl}</button>
            ))}

            <div style={{ width:1, height:22, background:'var(--cream-dark)', margin:'0 0.2rem' }} />

            {/* View toggle */}
            {[['list','List'],['calendar','Cal']].map(([v,l]) => (
              <button key={v} onClick={() => setViewMode(v)}
                style={{
                  padding:'0.35rem 0.8rem', borderRadius:30, fontSize:'0.78rem', fontWeight:700,
                  background: viewMode===v ? 'var(--green)' : 'var(--white)',
                  color: viewMode===v ? '#fff' : 'var(--text-mid)',
                  border:'1.5px solid', borderColor: viewMode===v ? 'var(--green)' : 'var(--cream-dark)',
                  cursor:'pointer'
                }}>{l}</button>
            ))}
          </div>
        </div>

        {/* ── CALENDAR VIEW ── */}
        {viewMode === 'calendar' && (
          <div className="cal-wrap">
            <div className="cal-header">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="cal-dow">{d}</div>
              ))}
            </div>
            <div className="cal-grid">
              {calCells.map((day, i) => {
                if (!day) return <div key={i} className="cal-cell cal-empty" />;
                const shifts       = bookedDays[day] || [];
                const hasMorning   = shifts.includes('morning');
                const hasAfternoon = shifts.includes('afternoon');
                const fullyBooked  = hasMorning && hasAfternoon;
                const free         = shifts.length === 0;

                // Dim past days
                const cellDate = new Date(aYear, aMIdx, day);
                const isPast   = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                return (
                  <div key={i}
                    className={`cal-cell ${fullyBooked ? 'cal-full' : free ? 'cal-free' : 'cal-partial'} ${isPast ? 'cal-past' : ''}`}>
                    <span className="cal-day-num">{day}</span>
                    <div className="cal-shifts">
                      {hasMorning   && <span className="cal-shift cal-morning">AM</span>}
                      {hasAfternoon && <span className="cal-shift cal-afternoon">PM</span>}
                    </div>
                    {!isPast && (
                      <div className="cal-book-btns">
                        {!hasMorning && (
                          <button className="cal-book-btn" onClick={() => openBooking(day, 'morning')}>AM</button>
                        )}
                        {!hasAfternoon && (
                          <button className="cal-book-btn cal-book-pm" onClick={() => openBooking(day, 'afternoon')}>PM</button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {viewMode === 'list' && (() => {
          const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

          // Days in this month that have at least one free shift
          const daysInMonth = new Date(aYear, aMIdx + 1, 0).getDate();
          const freeSlotsRows = [];
          for (let d = 1; d <= daysInMonth; d++) {
            const cellDate = new Date(aYear, aMIdx, d);
            if (cellDate < today0) continue;
            const shifts = bookedDays[d] || [];
            const hasMorning   = shifts.includes('morning');
            const hasAfternoon = shifts.includes('afternoon');
            if (!hasMorning || !hasAfternoon) {
              freeSlotsRows.push({ day: d, freeMorning: !hasMorning, freeAfternoon: !hasAfternoon });
            }
          }

          return (
            <>
              {/* Booked slots */}
              {filtered.length === 0 ? (
                <div style={{ textAlign:'center', padding:'2rem', background:'var(--white)',
                  borderRadius:'var(--radius)', color:'var(--text-light)', marginBottom:'1rem' }}>
                  <CalendarIcon size={36} color="var(--cream-dark)" />
                  <p style={{ marginTop:'0.6rem' }}>
                    No booked slots for {MONTH_NAMES[aMIdx]} {aYear}
                    {activeShift !== 'all' ? ` (${activeShift})` : ''}.
                  </p>
                </div>
              ) : (
                <div className="slots-grid" style={{ marginBottom:'1.25rem' }}>
                  {filtered.map(slot => {
                    const slotDate = new Date(aYear, aMIdx, slot.day);
                    const isPast   = slotDate < today0;
                    // Which opposite shift is free on this same day?
                    const shiftsOnDay = bookedDays[slot.day] || [];
                    const oppFree = !isPast && (
                      slot.shift === 'morning'   ? !shiftsOnDay.includes('afternoon') :
                      slot.shift === 'afternoon' ? !shiftsOnDay.includes('morning')   : false
                    );
                    const oppShift = slot.shift === 'morning' ? 'afternoon' : 'morning';
                    return (
                      <div key={slot.id} className={`slot-card ${slot.status}`}>
                        <div className="slot-date">
                          <span className="day">{slot.day}</span>
                          <span className="mon">{MONTH_SHORT[aMIdx]}</span>
                        </div>
                        <div className="slot-info">
                          <div className="venue" title={slot.venue || 'Venue TBD'}>{slot.venue || 'Venue TBD'}</div>
                          <div className="time">
                            <span style={{
                              display:'inline-flex', alignItems:'center', gap:3,
                              background: slot.shift==='morning' ? '#FEF3E8' : '#F5EEF8',
                              color: slot.shift==='morning' ? '#E67E22' : '#8E44AD',
                              padding:'1px 7px', borderRadius:10, fontSize:'0.72rem', fontWeight:700
                            }}>
                              <ClockIcon size={10} color={slot.shift==='morning' ? '#E67E22':'#8E44AD'} />
                              {slot.shift==='morning' ? 'Morning':'Afternoon'}
                              {slot.time ? ` · ${slot.time}` : ''}
                            </span>
                          </div>
                          {/* Book opposite shift if free */}
                          {oppFree && (
                            <button
                              onClick={() => openBooking(slot.day, oppShift)}
                              style={{
                                marginTop: 5,
                                padding: '2px 10px',
                                borderRadius: 20,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                background: oppShift === 'morning' ? '#E67E22' : '#8E44AD',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                              }}
                            >
                              Book {oppShift === 'morning' ? 'AM' : 'PM'}
                            </button>
                          )}
                        </div>
                        <span className={`slot-badge ${slot.status}`}>
                          {slot.status==='booked' ? 'Booked':'Open'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Available dates to book */}
              {freeSlotsRows.length > 0 && (
                <div style={{ background:'var(--available-light)', borderRadius:'var(--radius)',
                  padding:'1rem 1.25rem', border:'1px solid rgba(39,174,96,0.2)' }}>
                  <p style={{ fontWeight:700, color:'var(--available)', fontSize:'0.88rem',
                    marginBottom:'0.6rem', letterSpacing:'0.03em' }}>
                    Available dates — Book Now
                  </p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                    {freeSlotsRows.map(({ day, freeMorning, freeAfternoon }) => (
                      <div key={day} style={{ display:'flex', alignItems:'center', gap:'0.3rem',
                        background:'var(--white)', borderRadius:8, padding:'0.3rem 0.6rem',
                        border:'1px solid rgba(39,174,96,0.25)' }}>
                        <span style={{ fontFamily:'Playfair Display, serif', fontWeight:700,
                          fontSize:'0.9rem', color:'var(--green)', minWidth:20, textAlign:'center' }}>
                          {day}
                        </span>
                        {freeMorning && (
                          <button onClick={() => openBooking(day, 'morning')}
                            style={{ padding:'2px 8px', borderRadius:20, fontSize:'0.68rem',
                              fontWeight:700, background:'#E67E22', color:'#fff',
                              border:'none', cursor:'pointer' }}>
                            AM
                          </button>
                        )}
                        {freeAfternoon && (
                          <button onClick={() => openBooking(day, 'afternoon')}
                            style={{ padding:'2px 8px', borderRadius:20, fontSize:'0.68rem',
                              fontWeight:700, background:'#8E44AD', color:'#fff',
                              border:'none', cursor:'pointer' }}>
                            PM
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          );
        })()}

        {/* Bottom CTA */}
        <div style={{ marginTop:'2rem', background:'var(--white)', borderRadius:'var(--radius)',
          padding:'1.5rem 2rem', border:'1px solid var(--cream-dark)',
          display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:700, color:'var(--green)', marginBottom:'0.2rem' }}>Want to book a date?</p>
            <p className="malayalam" style={{ color:'var(--text-mid)', fontSize:'0.9rem' }}>
              ഇന്ന് തന്നെ ബഷിർ വലിയാണ്ടിയെ ബന്ധപ്പെടൂ
            </p>
          </div>
          <a href="tel:+919745575826" className="btn-primary"
            style={{ fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <PhoneIcon size={16} color="var(--green)" />
            97455 75826
          </a>
        </div>
      </div>

      {bookingInfo && (
        <BookingModal
          selectedDate={bookingInfo.date}
          selectedShift={bookingInfo.shift}
          onClose={() => setBookingInfo(null)}
        />
      )}
    </section>
  );
}
