import React, { useEffect, useState } from 'react'
import { I18nProvider, useI18n } from './i18n/I18n.jsx'
import { defaultLocale, hrefFor, localeNames, locales, parseRoute, rtlLocales } from './i18n/config.js'

const navigation = [
  ['home', 'nav.home'],
  ['about', 'nav.about'],
  ['italian', 'nav.italianCourses'],
  ['languages', 'nav.languageCourses'],
  ['school', 'nav.school'],
  ['exams', 'nav.exams'],
  ['culture', 'nav.activities'],
  ['contacts', 'nav.contact'],
]
const bookingUrl = 'https://registroelettronico.nettunopa.it/isccpia/?id=120101'
const pathCards = [
  { id: 'italian', no: '01', title: 'ui.pathItalian', text: 'ui.pathItalianText', tone: 'blue' },
  { id: 'school', no: '02', title: 'ui.pathSchool', text: 'ui.pathSchoolText', tone: 'sun' },
  { id: 'languages', no: '03', title: 'ui.pathLanguages', text: 'ui.pathLanguagesText', tone: 'rose' },
]
const starterAppointments = [
  { id: 1, time: '09:00', name: 'Amina El Mansouri', reason: 'Colloquio di iscrizione', language: 'Arabo', status: 'Confermato' },
  { id: 2, time: '10:15', name: 'Oleh Shevchenko', reason: 'Test di italiano', language: 'Italiano', status: 'Da confermare' },
  { id: 3, time: '11:30', name: 'Sofia Kodra', reason: 'Informazioni corsi', language: 'Albanese', status: 'Confermato' },
  { id: 4, time: '15:00', name: 'Mamadou Diallo', reason: 'Colloquio di iscrizione', language: 'Francese', status: 'Da confermare' },
]

function Arrow() { return <span aria-hidden="true">→</span> }

function Header({ page, setPage, locale, setLocale }) {
  const { t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const go = (next) => { setPage(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return <header className="header">
    <button className="identity" onClick={() => go('home')} aria-label={`${t('home.title')}, ${t('nav.home')}`}><span className="identity-dot">EdA</span><span><b>Don Milani</b><small>{t('ui.brandSmall')}</small></span></button>
    <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="primary-navigation">{t('nav.menu')} <span>≡</span></button>
    <nav className={menuOpen ? 'nav open' : 'nav'} id="primary-navigation">{navigation.map(([id, key]) => <button className={page === id ? 'selected' : ''} aria-current={page === id ? 'page' : undefined} onClick={() => go(id)} key={id}>{t(key)}</button>)}</nav>
    <label className="lang-switch">
      <span className="sr-only">{t('ui.language')}</span>
      <select value={locale} onChange={event => setLocale(event.target.value)} aria-label={t('ui.language')}>
        {locales.map(code => <option value={code} key={code} lang={code}>{localeNames[code]}</option>)}
      </select>
    </label>
    <button className="staff-button" onClick={() => go('dashboard')}>{t('ui.staff')} <Arrow /></button>
  </header>
}

function Home({ setPage }) {
  const { t, messages } = useI18n()
  const go = (next) => { setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const bookLabel = `${t('home.bookInterview')}: ${t('ui.newWindow')}`
  return <main className="home" id="main-content" tabIndex="-1">
    <section className="welcome">
      <div className="welcome-copy"><p className="kicker">{t('home.subtitle')}</p><h1>{t('ui.heroTitle')}<br /><em>{t('ui.heroEm')}</em></h1><p className="welcome-lead">{t('home.intro')}</p><div className="welcome-actions"><a className="primary-action" href={bookingUrl} target="_blank" rel="noreferrer" aria-label={bookLabel}>{t('home.bookInterview')} <Arrow /></a><button className="quiet-action" onClick={() => go('italian')}>{t('home.exploreCourses')} <Arrow /></button></div></div>
      <div className="welcome-image"><img src="https://lh3.googleusercontent.com/docsubipk/AP9E6xUkvbgEcJRFGObyFR3Fwdw8sQXT2ZUUTX8OPuUEm61P1tx9hzePeqsT0aWaJ5JyjtKormGnjHhTVCoUaMHV4LRz-kG-C34nW9GK2ejU1dNdhCs91yMNp8DPOqxSpTPIRzlVwTtV7iWZm9tONyq3Oi96QE-S1rFhe6bUZ9N_rWc" alt={t('ui.heroImageAlt')} /><p>{t('ui.heroCaption')}</p></div>
    </section>
    <section className="quick-start"><p>{t('ui.startHere')}</p>{pathCards.map(path => <button onClick={() => go(path.id)} key={path.id}><span>{path.no}</span>{t(path.title)}<Arrow /></button>)}</section>
    <section className="intro"><div><p className="kicker">{t('ui.listenKicker')}</p><h2>{t('ui.listenTitle')}</h2></div><div><p>{t('ui.listenBody')}</p><button className="inline-link" onClick={() => go('about')}>{t('ui.knowCenter')} <Arrow /></button></div></section>
    <section className="pathways"><div className="section-heading"><p className="kicker">{t('ui.pathsKicker')}</p><h2>{t('ui.pathsTitle')}</h2></div><div className="path-grid">{pathCards.map(path => <button className={`path-card ${path.tone}`} onClick={() => go(path.id)} key={path.id}><span>{path.no}</span><h3>{t(path.title)}</h3><p>{t(path.text)}</p><i><Arrow /></i></button>)}</div></section>
    <section className="notice-board"><div className="notice-intro"><p className="kicker">{t('ui.nowKicker')}</p><h2>{t('ui.nowTitle')}</h2><button className="inline-link" onClick={() => go('contacts')}>{t('ui.allContacts')} <Arrow /></button></div><div className="notice-list"><article><p className="notice-tag">{messages.news.enrollment.badge}</p><h3>{messages.news.enrollment.title}</h3><p>{messages.news.enrollment.body}</p><a href={bookingUrl} target="_blank" rel="noreferrer" aria-label={`${messages.news.enrollment.linkLabel}: ${t('ui.newWindow')}`}>{messages.news.enrollment.linkLabel} <Arrow /></a></article><article><p className="notice-tag">{t('exams.cilsTitle')}</p><h3>{messages.news.cilsOct.title}</h3><p>{messages.news.cilsOct.body}</p><button onClick={() => go('exams')}>{t('exams.viewNews')} <Arrow /></button></article></div></section>
    <section className="community"><div className="community-photo"><img src="https://lh3.googleusercontent.com/sitesv/AG8ngQU6mJc-r-6gzKQWdtbZgwt99fWOY19awBxUFzCpMM1HFa3txNH1Iq-KAhcFxp0e7gDplXDSjkDs6LZUA12lnj2V_EjR9vYyTEnW5IH3rJOExykPR1VQ1YqFNI_GLsYclb4fO89MXgbVP-1ipNvZUOTRLZ8DgasS6aj7Okvu-u5hTnVZAJ3A5HtuZE6X03I663_zJJRek7nVXbB290bXUZs881G5nTAZ9nPPYZ4H=w1280" alt={t('ui.schoolImageAlt')} /></div><div className="community-copy"><p className="kicker">{t('ui.beyondKicker')}</p><h2>{t('ui.beyondTitle')}</h2><p>{t('ui.beyondBody')}</p><button className="inline-link" onClick={() => go('culture')}>{t('ui.discoverActivities')} <Arrow /></button></div></section>
    <section className="visit"><div><p className="kicker">{t('ui.visitKicker')}</p><h2>{t('ui.visitTitle')}</h2></div><div><p><b>{t('ui.institute')}</b><br />{t('contact.mainAddress')}</p><p><a href="tel:+390464485511">{t('contact.phone')}</a><br /><a href={`mailto:${t('contact.email')}`}>{t('contact.email')}</a></p></div><button onClick={() => go('contacts')}>{t('nav.contact')} <Arrow /></button></section>
  </main>
}

function ContentPage({ page, setPage }) {
  const { t, messages } = useI18n()
  const go = (next) => { setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const quote = messages.about.testimonials[1]
  const pages = {
    about: { eyebrow: t('about.title'), title: t('about.communityTitle'), lead: t('ui.aboutLead'), body: <><div className="quote">“{quote.quote}”<small>{quote.name} · {t('ui.studentQuoteBy')}</small></div><div className="body-columns"><p>{t('ui.aboutBody')}</p><p>{t('about.coordinatorTitle')}: {t('about.coordinatorName')}</p></div><ul className="teacher-list">{messages.about.teachers.map(teacher => <li key={teacher}>{teacher}</li>)}</ul></> },
    italian: { eyebrow: t('italianCourses.title'), title: t('italianCourses.title'), lead: t('ui.italianLead'), body: <div className="course-catalog">{messages.italianCourses.courses.map(course => <article key={course.title}><h3>{course.title}</h3><p>{course.description}</p></article>)}</div> },
    languages: { eyebrow: t('languageCourses.title'), title: t('languageCourses.courseTitle'), lead: t('ui.languagesLead'), body: <><p>{t('languageCourses.description')}</p><div className="feature-stack"><article><b>{t('ui.modules')}</b><p>{t('ui.modulesText')}</p></article><article><b>{t('ui.weekly')}</b><p>{t('ui.weeklyText')}</p></article><article><b>{t('ui.paidLevels')}</b><p>{t('ui.paidLevelsText')}</p></article></div></> },
    school: { eyebrow: t('school.title'), title: t('school.title'), lead: t('ui.schoolLead'), body: <><p>{t('school.intro')}</p><p>{t('school.facilities')}</p><div className="body-columns"><div><h3>{t('ui.howItWorks')}</h3><p>{t('ui.howItWorksText')}</p></div><div><h3>{t('ui.beforeStart')}</h3><p>{t('ui.beforeStartText')}</p></div></div><h3>{t('school.holidaysTitle')}</h3><ul>{messages.school.holidays.map(day => <li key={day}>{day}</li>)}</ul></> },
    exams: { eyebrow: t('exams.cilsTitle'), title: t('exams.title'), lead: t('ui.examsLead'), body: <><p>{t('exams.description')}</p><div className="level-row">{t('exams.levels').split('—').map(level => <span key={level}>{level.trim()}</span>)}</div><div className="exam-dates"><article><p>{t('ui.octDate')}</p><h3>{messages.news.cilsOct.level}</h3><span>{t('ui.octWindow')}</span></article><article><p>{t('ui.decDate')}</p><h3>{messages.news.cilsDec.levels}</h3><span>{t('ui.decWindow')}</span></article></div><p className="call-note">{t('common.phoneRoberto')}: <a href="tel:+390464485511">{t('contact.phone')}</a></p></> },
    culture: { eyebrow: t('activities.title'), title: t('activities.title'), lead: t('ui.cultureLead'), body: <div className="activity-grid">{messages.activities.items.map((activity, index) => <article key={activity.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{activity.title}</h3><p>{activity.description}</p></div></article>)}</div> },
    contacts: { eyebrow: t('contact.title'), title: t('contact.title'), lead: t('ui.contactsLead'), body: <div className="contact-cards"><article><span>{t('ui.whereWeAre')}</span><h3>{t('contact.mainAddress')}</h3></article><article><span>{t('ui.office')}</span><h3><a href="tel:+390464485511">{t('contact.phone')}</a><br /><a href={`mailto:${t('contact.email')}`}>{t('contact.email')}</a></h3></article><article><span>{t('ui.anAppointment')}</span><h3>{t('ui.startConversation')}</h3><a className="primary-action" href={bookingUrl} target="_blank" rel="noreferrer" aria-label={`${t('ui.bookCta')}: ${t('ui.newWindow')}`}>{t('ui.bookCta')} <Arrow /></a></article></div> },
    accessibility: { eyebrow: t('ui.accessibility'), title: t('accessibility.title'), lead: t('accessibility.lead'), body: <div className="accessibility-content"><section><h3>{t('accessibility.designedTitle')}</h3><ul>{messages.accessibility.items.map(item => <li key={item}>{item}</li>)}</ul></section><section><h3>{t('accessibility.statementTitle')}</h3><p>{t('accessibility.statement1')}</p><p>{t('accessibility.statement2')}</p></section><section><h3>{t('accessibility.reportTitle')}</h3><p>{t('accessibility.reportBody')}</p><a className="primary-action" href={`mailto:${t('contact.email')}?subject=${encodeURIComponent(t('ui.accessibility'))}`}>{t('accessibility.reportCta')} <Arrow /></a></section></div> },
  }
  const current = pages[page]
  return <main className="content-page" id="main-content" tabIndex="-1"><p className="kicker">{current.eyebrow}</p><h1>{current.title}</h1><p className="page-lead">{current.lead}</p><div className="page-body">{current.body}</div>{page !== 'accessibility' && <section className="page-next"><p>{t('ui.needHelp')}</p><button onClick={() => go('contacts')}>{t('ui.talkStaff')} <Arrow /></button></section>}</main>
}

function LegacyDashboard({ setPage }) {
  const [appointments, setAppointments] = useState(() => { try { return JSON.parse(localStorage.getItem('eda-appointments')) || starterAppointments } catch { return starterAppointments } })
  const [filter, setFilter] = useState('Tutti')
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState({ name: '', reason: 'Colloquio di iscrizione', language: 'Italiano', time: '09:00' })
  useEffect(() => localStorage.setItem('eda-appointments', JSON.stringify(appointments)), [appointments])
  const visible = appointments.filter(item => filter === 'Tutti' || item.status === filter)
  const setStatus = (id, status) => setAppointments(items => items.map(item => item.id === id ? { ...item, status } : item))
  const create = event => { event.preventDefault(); if (!form.name.trim()) return; setAppointments(items => [...items, { ...form, id: Date.now(), status: 'Da confermare' }].sort((a, b) => a.time.localeCompare(b.time))); setForm({ name: '', reason: 'Colloquio di iscrizione', language: 'Italiano', time: '09:00' }); setIsCreating(false) }
  return <main className="dashboard" id="main-content" tabIndex="-1"><div className="dashboard-top"><div><button className="back" onClick={() => setPage('home')}>← Torna al sito</button><p className="kicker">Area riservata</p><h1>La giornata<br />in segreteria.</h1></div><button className="primary-action" onClick={() => setIsCreating(true)}>+ Nuovo appuntamento</button></div><section className="dashboard-summary"><article><span>Appuntamenti</span><b>{appointments.length}</b><p>in programma oggi</p></article><article><span>Da confermare</span><b>{appointments.filter(a => a.status === 'Da confermare').length}</b><p>richiedono un contatto</p></article><article><span>Prossimo</span><b>09:00</b><p>colloquio di iscrizione</p></article></section><section className="agenda"><div className="agenda-head"><div><p className="kicker">Lunedì, 7 settembre</p><h2>Appuntamenti</h2></div><div className="filter-row" aria-label="Filtra gli appuntamenti">{['Tutti', 'Da confermare', 'Confermato', 'Annullato'].map(value => <button className={filter === value ? 'selected' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)} key={value}>{value}</button>)}</div></div><div className="agenda-list">{visible.length ? visible.map(item => <article key={item.id}><time>{item.time}</time><div><h3>{item.name}</h3><p>{item.reason} · {item.language}</p></div><span className={`appointment-status ${item.status.toLowerCase().replaceAll(' ', '-')}`}>{item.status}</span><div className="agenda-actions">{item.status !== 'Confermato' && <button onClick={() => setStatus(item.id, 'Confermato')}>Conferma</button>}{item.status !== 'Annullato' && <button onClick={() => setStatus(item.id, 'Annullato')}>Annulla</button>}</div></article>) : <p className="empty-state">Nessun appuntamento in questa vista.</p>}</div></section>{isCreating && <div className="dialog-backdrop"><form className="appointment-dialog" onSubmit={create} role="dialog" aria-modal="true" aria-labelledby="appointment-title"><button className="dialog-close" type="button" onClick={() => setIsCreating(false)} aria-label="Chiudi finestra">×</button><p className="kicker">Nuovo appuntamento</p><h2 id="appointment-title">Prendiamoci<br />un momento.</h2><label>Nome e cognome<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><div className="form-split"><label>Ora<input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></label><label>Lingua<select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}><option>Italiano</option><option>English</option><option>Français</option><option>Albanese</option><option>Arabo</option><option>Urdu</option></select></label></div><label>Motivo<select value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}><option>Colloquio di iscrizione</option><option>Test di italiano</option><option>Informazioni corsi</option><option>Iscrizione esame CILS</option></select></label><button className="primary-action" type="submit">Salva appuntamento <Arrow /></button></form></div>}</main>
}

async function apiRequest(pathname, options = {}) {
  const response = await fetch(pathname, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.error || 'Non è stato possibile completare l’operazione.')
  return body
}

const formattedDate = value => new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${value}T12:00:00`))

function LegacyApiDashboard({ setPage }) {
  const [authenticated, setAuthenticated] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [selectedDate, setSelectedDate] = useState('2026-09-07')
  const [filter, setFilter] = useState('Tutti')
  const [password, setPassword] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ date: '2026-09-07', time: '09:00', name: '', phone: '', reason: 'Colloquio di iscrizione', language: 'Italiano' })

  const loadAppointments = async (date = selectedDate) => {
    const data = await apiRequest(`/api/appointments?date=${encodeURIComponent(date)}`)
    setAppointments(data)
  }
  useEffect(() => {
    let active = true
    const initialise = async () => {
      try {
        const session = await apiRequest('/api/session')
        if (!active) return
        setAuthenticated(session.authenticated)
        if (session.authenticated) await loadAppointments(selectedDate)
      } catch (requestError) { if (active) { setAuthenticated(false); setError('Il servizio appuntamenti non è disponibile in questo momento.') } }
    }
    initialise()
    return () => { active = false }
  }, [selectedDate])

  const login = async event => {
    event.preventDefault()
    setIsBusy(true); setError('')
    try { await apiRequest('/api/session', { method: 'POST', body: JSON.stringify({ password }) }); setAuthenticated(true); setPassword(''); await loadAppointments() }
    catch (requestError) { setError(requestError.message) }
    finally { setIsBusy(false) }
  }
  const logout = async () => { await apiRequest('/api/session', { method: 'DELETE' }); setAuthenticated(false); setAppointments([]); setError('') }
  const updateStatus = async (id, status) => {
    try { const changed = await apiRequest(`/api/appointments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); setAppointments(items => items.map(item => item.id === id ? changed : item)) }
    catch (requestError) { setError(requestError.message) }
  }
  const create = async event => {
    event.preventDefault(); setIsBusy(true); setError('')
    try { const created = await apiRequest('/api/appointments', { method: 'POST', body: JSON.stringify(form) }); setAppointments(items => [...items, created].sort((a, b) => a.time.localeCompare(b.time))); setIsCreating(false); setForm({ date: selectedDate, time: '09:00', name: '', phone: '', reason: 'Colloquio di iscrizione', language: 'Italiano' }) }
    catch (requestError) { setError(requestError.message) }
    finally { setIsBusy(false) }
  }
  const switchDate = value => { setSelectedDate(value); setForm(current => ({ ...current, date: value })); setError('') }
  const visible = appointments.filter(item => filter === 'Tutti' || item.status === filter)

  if (authenticated === null) return <main className="dashboard dashboard-loading" id="main-content" tabIndex="-1"><p>Caricamento dell’area segreteria…</p></main>
  if (!authenticated) return <main className="dashboard login-page" id="main-content" tabIndex="-1"><section className="login-card"><button className="back" onClick={() => setPage('home')}>← Torna al sito</button><p className="kicker">Area riservata</p><h1>Benvenuta<br />in segreteria.</h1><p>Accedi per gestire appuntamenti e colloqui in modo sicuro.</p>{error && <p className="form-error" role="alert">{error}</p>}<form onSubmit={login}><label>Password<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label><button className="primary-action" type="submit" disabled={isBusy}>{isBusy ? 'Accesso in corso…' : 'Accedi'} <Arrow /></button></form></section></main>
  return <main className="dashboard" id="main-content" tabIndex="-1"><div className="dashboard-top"><div><button className="back" onClick={() => setPage('home')}>← Torna al sito</button><p className="kicker">Area riservata · Segreteria</p><h1>La giornata<br />in segreteria.</h1></div><div className="dashboard-tools"><button className="logout" onClick={logout}>Esci</button><button className="primary-action" onClick={() => setIsCreating(true)}>+ Nuovo appuntamento</button></div></div><section className="dashboard-summary"><article><span>Appuntamenti</span><b>{appointments.length}</b><p>in programma oggi</p></article><article><span>Da confermare</span><b>{appointments.filter(a => a.status === 'Da confermare').length}</b><p>richiedono un contatto</p></article><article><span>Prossimo</span><b>{appointments[0]?.time || '—'}</b><p>{appointments[0]?.reason?.toLowerCase() || 'nessun appuntamento'}</p></article></section>{error && <p className="form-error" role="alert">{error}</p>}<section className="agenda"><div className="agenda-head"><div><p className="kicker">Agenda</p><h2>{formattedDate(selectedDate)}</h2></div><div className="agenda-controls"><label>Data<input type="date" value={selectedDate} onChange={event => switchDate(event.target.value)} /></label><div className="filter-row" aria-label="Filtra gli appuntamenti">{['Tutti', 'Da confermare', 'Confermato', 'Annullato'].map(value => <button className={filter === value ? 'selected' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)} key={value}>{value}</button>)}</div></div></div><div className="agenda-list">{visible.length ? visible.map(item => <article key={item.id}><time>{item.time}</time><div><h3>{item.name}</h3><p>{item.reason} · {item.language} · <a href={`tel:${item.phone.replaceAll(' ', '')}`}>{item.phone}</a></p></div><span className={`appointment-status ${item.status.toLowerCase().replaceAll(' ', '-')}`}>{item.status}</span><div className="agenda-actions">{item.status !== 'Confermato' && <button onClick={() => updateStatus(item.id, 'Confermato')}>Conferma</button>}{item.status !== 'Annullato' && <button onClick={() => updateStatus(item.id, 'Annullato')}>Annulla</button>}</div></article>) : <p className="empty-state">Nessun appuntamento in questa vista.</p>}</div></section>{isCreating && <div className="dialog-backdrop"><form className="appointment-dialog" onSubmit={create} role="dialog" aria-modal="true" aria-labelledby="appointment-title"><button className="dialog-close" type="button" onClick={() => setIsCreating(false)} aria-label="Chiudi finestra">×</button><p className="kicker">Nuovo appuntamento</p><h2 id="appointment-title">Nuovo<br />appuntamento.</h2><label>Nome e cognome<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label><label>Telefono<input required type="tel" autoComplete="tel" value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} /></label><div className="form-split"><label>Data<input required type="date" value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} /></label><label>Ora<input required type="time" value={form.time} onChange={event => setForm({ ...form, time: event.target.value })} /></label></div><div className="form-split"><label>Lingua<select value={form.language} onChange={event => setForm({ ...form, language: event.target.value })}><option>Italiano</option><option>English</option><option>Français</option><option>Albanese</option><option>Arabo</option><option>Urdu</option></select></label><label>Motivo<select value={form.reason} onChange={event => setForm({ ...form, reason: event.target.value })}><option>Colloquio di iscrizione</option><option>Test di italiano</option><option>Informazioni corsi</option><option>Iscrizione esame CILS</option></select></label></div><button className="primary-action" type="submit" disabled={isBusy}>{isBusy ? 'Salvataggio…' : 'Salva appuntamento'} <Arrow /></button></form></div>}</main>
}

const localToday = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const blankAppointment = (date = localToday()) => ({ date, time: '09:00', status: 'Da confermare', request_code: '', course: 'Licenza media', first_name: '', last_name: '', gender: '', birth_date: '', birth_country: '', birth_province: '', birth_town: '', nationality: '', second_nationality: '', fiscal_code: '', residence_country: 'Italia', residence_province: '', residence_town: '', postal_code: '', address: '', phone: '', email: '', employment_status: '', asylum_status: 'NO', document_type: '', document_number: '', document_expiry: '', residence_permit_number: '', residence_permit_type: '', residence_permit_expiry: '', other_identifier: '', other_identifier_expiry: '', registration_notes: '', privacy_acknowledged: false, reason: 'Colloquio di iscrizione', language: 'Italiano', source: 'Inserimento segreteria' })
const appointmentReasons = ['Colloquio di iscrizione', 'Test di italiano', 'Informazioni corsi', 'Iscrizione esame CILS']
const appointmentLanguages = ['Italiano', 'English', 'Français', 'Albanese', 'Arabo', 'Urdu']
const registrationCourses = ['Italiano – base / A1 / A2 / patente', 'Licenza media', 'Lingue straniere', 'Italiano CILS', 'Altro']

function RegistrationField({ label, name, value, onChange, type = 'text', required = false, children, hint }) {
  return <label className="registration-field">{label}{required && <span aria-hidden="true"> *</span>}{children ? <select value={value || ''} onChange={event => onChange(name, event.target.value)} required={required}>{children}</select> : <input type={type} value={value || ''} onChange={event => onChange(name, event.target.value)} required={required} />}{hint && <small>{hint}</small>}</label>
}

function RegistrationDialog({ appointment, onClose, onSave, busy }) {
  const [form, setForm] = useState({ ...appointment, privacy_acknowledged: Boolean(appointment.privacy_acknowledged) })
  const update = (name, value) => setForm(current => ({ ...current, [name]: value }))
  const editing = Boolean(appointment.id)
  return <div className="dialog-backdrop"><form className="appointment-dialog registration-dialog" onSubmit={event => { event.preventDefault(); onSave(form) }} role="dialog" aria-modal="true" aria-labelledby="registration-title"><button className="dialog-close" type="button" onClick={onClose} aria-label="Chiudi finestra">×</button><p className="kicker">{editing ? 'Scheda di iscrizione' : 'Nuova richiesta'}</p><h2 id="registration-title">{editing ? 'Modifica appuntamento' : 'Inserisci richiesta'}</h2><p className="dialog-intro">I campi seguono la domanda di iscrizione. Lo stato vaccinale non viene raccolto qui: non è necessario per la gestione dell’appuntamento.</p><fieldset><legend>Appuntamento</legend><div className="form-grid three"><RegistrationField label="Codice richiesta" name="request_code" value={form.request_code} onChange={update} /><RegistrationField label="Percorso" name="course" value={form.course} onChange={update} required>{registrationCourses.map(value => <option key={value}>{value}</option>)}</RegistrationField><RegistrationField label="Stato" name="status" value={form.status} onChange={update}>{['Da confermare', 'Confermato', 'Annullato'].map(value => <option key={value}>{value}</option>)}</RegistrationField><RegistrationField label="Data" name="date" value={form.date} onChange={update} type="date" required /><RegistrationField label="Ora" name="time" value={form.time} onChange={update} type="time" required /><RegistrationField label="Motivo" name="reason" value={form.reason} onChange={update}>{appointmentReasons.map(value => <option key={value}>{value}</option>)}</RegistrationField><RegistrationField label="Lingua di supporto" name="language" value={form.language} onChange={update}>{appointmentLanguages.map(value => <option key={value}>{value}</option>)}</RegistrationField></div></fieldset><fieldset><legend>Dati dello studente</legend><div className="form-grid three"><RegistrationField label="Cognome" name="last_name" value={form.last_name} onChange={update} required /><RegistrationField label="Nome" name="first_name" value={form.first_name} onChange={update} required /><RegistrationField label="Sesso" name="gender" value={form.gender} onChange={update}><option value="">Non indicato</option><option value="M">Maschio</option><option value="F">Femmina</option><option value="Altro">Altro</option><option value="Preferisco non indicarlo">Preferisco non indicarlo</option></RegistrationField><RegistrationField label="Data di nascita" name="birth_date" value={form.birth_date} onChange={update} type="date" /><RegistrationField label="Nazione di nascita" name="birth_country" value={form.birth_country} onChange={update} /><RegistrationField label="Provincia di nascita" name="birth_province" value={form.birth_province} onChange={update} /><RegistrationField label="Comune di nascita" name="birth_town" value={form.birth_town} onChange={update} /><RegistrationField label="Cittadinanza" name="nationality" value={form.nationality} onChange={update} /><RegistrationField label="Seconda cittadinanza" name="second_nationality" value={form.second_nationality} onChange={update} /><RegistrationField label="Codice fiscale" name="fiscal_code" value={form.fiscal_code} onChange={update} /></div></fieldset><fieldset><legend>Contatti e residenza</legend><div className="form-grid three"><RegistrationField label="Cellulare" name="phone" value={form.phone} onChange={update} type="tel" required /><RegistrationField label="Email" name="email" value={form.email} onChange={update} type="email" /><RegistrationField label="Occupazione" name="employment_status" value={form.employment_status} onChange={update} /><RegistrationField label="Nazione di residenza" name="residence_country" value={form.residence_country} onChange={update} /><RegistrationField label="Provincia di residenza" name="residence_province" value={form.residence_province} onChange={update} /><RegistrationField label="Comune di residenza" name="residence_town" value={form.residence_town} onChange={update} /><RegistrationField label="CAP" name="postal_code" value={form.postal_code} onChange={update} /><RegistrationField label="Indirizzo e numero civico" name="address" value={form.address} onChange={update} /></div></fieldset><fieldset><legend>Documento e situazione di soggiorno</legend><div className="form-grid three"><RegistrationField label="Richiedente asilo" name="asylum_status" value={form.asylum_status} onChange={update}><option value="NO">No</option><option value="SI">Sì</option><option value="MSNA">MSNA</option></RegistrationField><RegistrationField label="Tipo documento" name="document_type" value={form.document_type} onChange={update}><option value="">Non indicato</option><option value="Passaporto">Passaporto</option><option value="Carta d'identità">Carta d'identità</option></RegistrationField><RegistrationField label="Numero documento" name="document_number" value={form.document_number} onChange={update} /><RegistrationField label="Scadenza documento" name="document_expiry" value={form.document_expiry} onChange={update} type="date" /><RegistrationField label="Numero permesso di soggiorno" name="residence_permit_number" value={form.residence_permit_number} onChange={update} /><RegistrationField label="Tipo permesso" name="residence_permit_type" value={form.residence_permit_type} onChange={update}><option value="">Non indicato</option><option value="Con scadenza">Con scadenza</option><option value="Senza scadenza">Senza scadenza</option></RegistrationField><RegistrationField label="Scadenza permesso" name="residence_permit_expiry" value={form.residence_permit_expiry} onChange={update} type="date" /><RegistrationField label="Altro identificativo" name="other_identifier" value={form.other_identifier} onChange={update} /><RegistrationField label="Scadenza altro identificativo" name="other_identifier_expiry" value={form.other_identifier_expiry} onChange={update} type="date" /></div></fieldset><fieldset><legend>Note e privacy</legend><label className="registration-field">Note<textarea value={form.registration_notes || ''} onChange={event => update('registration_notes', event.target.value)} rows="3" /></label><label className="checkbox-field"><input type="checkbox" checked={Boolean(form.privacy_acknowledged)} onChange={event => update('privacy_acknowledged', event.target.checked)} />Informativa privacy presa in carico</label></fieldset><button className="primary-action" type="submit" disabled={busy}>{busy ? 'Salvataggio…' : editing ? 'Salva modifiche' : 'Crea richiesta'} <Arrow /></button></form></div>
}

function StaffPanel({ staff, onCreate, onUpdate, busy }) {
  const [form, setForm] = useState({ username: '', password: '', role: 'segreteria' })
  return <section className="staff-panel" aria-labelledby="staff-title"><div><p className="kicker">Amministrazione</p><h2 id="staff-title">Account del personale</h2><p>Ogni persona usa il proprio account. Gli amministratori possono gestire ruoli e disattivare l’accesso.</p></div><form className="staff-create" onSubmit={event => { event.preventDefault(); onCreate(form).then(() => setForm({ username: '', password: '', role: 'segreteria' })) }}><RegistrationField label="Nome utente" name="username" value={form.username} onChange={(name, value) => setForm(current => ({ ...current, [name]: value }))} required /><RegistrationField label="Password iniziale" name="password" value={form.password} onChange={(name, value) => setForm(current => ({ ...current, [name]: value }))} type="password" required hint="Almeno 12 caratteri." /><RegistrationField label="Ruolo" name="role" value={form.role} onChange={(name, value) => setForm(current => ({ ...current, [name]: value }))}><option value="segreteria">Segreteria</option><option value="admin">Amministratore</option></RegistrationField><button className="primary-action" type="submit" disabled={busy}>Aggiungi account</button></form><div className="staff-list">{staff.map(person => <article key={person.id}><div><b>{person.username}</b><span>{person.role === 'admin' ? 'Amministratore' : 'Segreteria'}</span></div><label>Ruolo<select value={person.role} onChange={event => onUpdate(person.id, { role: event.target.value })}><option value="segreteria">Segreteria</option><option value="admin">Amministratore</option></select></label><label className="staff-active"><input type="checkbox" checked={Boolean(person.active)} onChange={event => onUpdate(person.id, { active: event.target.checked })} />Attivo</label></article>)}</div></section>
}

function Dashboard({ setPage }) {
  const [session, setSession] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [selectedDate, setSelectedDate] = useState(localToday())
  const [filter, setFilter] = useState('Tutti')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [editing, setEditing] = useState(null)
  const [staff, setStaff] = useState([])
  const [staffOpen, setStaffOpen] = useState(false)
  const [auditEvents, setAuditEvents] = useState([])
  const [auditFor, setAuditFor] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const user = session?.user

  const loadAppointments = async (date = selectedDate) => setAppointments(await apiRequest(`/api/appointments?date=${encodeURIComponent(date)}`))
  const loadStaff = async () => { if (user?.role === 'admin') setStaff(await apiRequest('/api/staff')) }
  useEffect(() => {
    let active = true
    const initialise = async () => {
      try {
        const current = await apiRequest('/api/session')
        if (!active) return
        setSession(current)
        if (current.authenticated) {
          const data = await apiRequest(`/api/appointments?date=${encodeURIComponent(selectedDate)}`)
          if (active) setAppointments(data)
          if (current.user?.role === 'admin') { const accounts = await apiRequest('/api/staff'); if (active) setStaff(accounts) }
        }
      } catch { if (active) { setSession({ authenticated: false, user: null }); setError('Il servizio appuntamenti non è disponibile in questo momento.') } }
    }
    initialise()
    return () => { active = false }
  }, [selectedDate])
  const run = async (task, success) => { setBusy(true); setError(''); setNotice(''); try { await task(); if (success) setNotice(success) } catch (requestError) { setError(requestError.message) } finally { setBusy(false) } }
  const login = event => { event.preventDefault(); run(async () => { await apiRequest('/api/session', { method: 'POST', body: JSON.stringify(credentials) }); const current = await apiRequest('/api/session'); setSession(current); setCredentials({ username: '', password: '' }); await loadAppointments(); if (current.user.role === 'admin') setStaff(await apiRequest('/api/staff')) }) }
  const logout = () => run(async () => { await apiRequest('/api/session', { method: 'DELETE' }); setSession({ authenticated: false, user: null }); setAppointments([]); setStaff([]) })
  const saveAppointment = form => run(async () => { const saved = form.id ? await apiRequest(`/api/appointments/${form.id}`, { method: 'PATCH', body: JSON.stringify(form) }) : await apiRequest('/api/appointments', { method: 'POST', body: JSON.stringify(form) }); setEditing(null); if (saved.date === selectedDate) await loadAppointments(); else setAppointments(current => current.filter(item => item.id !== saved.id)) }, 'Appuntamento salvato e registrato nello storico.')
  const changeStatus = (id, status) => run(async () => { await apiRequest(`/api/appointments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); await loadAppointments() }, 'Stato aggiornato.')
  const removeAppointment = id => { if (window.confirm('Eliminare definitivamente questo appuntamento? L’azione sarà registrata nello storico.')) run(async () => { await apiRequest(`/api/appointments/${id}`, { method: 'DELETE' }); await loadAppointments() }, 'Appuntamento eliminato.') }
  const queueNotification = (id, channel) => run(async () => { const result = await apiRequest(`/api/appointments/${id}/notifications`, { method: 'POST', body: JSON.stringify({ channel }) }); setNotice(result.delivery === 'sent' ? 'Notifica inviata al provider configurato.' : result.delivery === 'failed' ? 'Notifica registrata ma il provider non ha risposto.' : 'Notifica accodata: configura il provider per l’invio automatico.') })
  const showAudit = id => run(async () => { setAuditEvents(await apiRequest(`/api/appointments/${id}/audit`)); setAuditFor(id) })
  const createStaff = form => run(async () => { await apiRequest('/api/staff', { method: 'POST', body: JSON.stringify(form) }); await loadStaff() }, 'Account creato.')
  const updateStaff = (id, changes) => run(async () => { await apiRequest(`/api/staff/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }); await loadStaff() }, 'Account aggiornato.')
  const visible = appointments.filter(item => filter === 'Tutti' || item.status === filter)

  if (session === null) return <main className="dashboard dashboard-loading" id="main-content" tabIndex="-1"><p>Caricamento dell’area segreteria…</p></main>
  if (!session.authenticated) return <main className="dashboard login-page" id="main-content" tabIndex="-1"><section className="login-card"><button className="back" onClick={() => setPage('home')}>← Torna al sito</button><p className="kicker">Area riservata</p><h1>Accesso segreteria</h1><p>Usa il tuo account personale. Le attività vengono registrate per la sicurezza del servizio.</p>{error && <p className="form-error" role="alert">{error}</p>}<form onSubmit={login}><RegistrationField label="Nome utente" name="username" value={credentials.username} onChange={(name, value) => setCredentials(current => ({ ...current, [name]: value }))} required /><RegistrationField label="Password" name="password" value={credentials.password} onChange={(name, value) => setCredentials(current => ({ ...current, [name]: value }))} type="password" required /><button className="primary-action" type="submit" disabled={busy}>{busy ? 'Accesso in corso…' : 'Accedi'} <Arrow /></button></form></section></main>
  return <main className="dashboard" id="main-content" tabIndex="-1"><div className="dashboard-top"><div><button className="back" onClick={() => setPage('home')}>← Torna al sito</button><p className="kicker">Segreteria · {user.role === 'admin' ? 'amministratore' : 'operatore'} · {user.username}</p><h1>Agenda e richieste</h1></div><div className="dashboard-tools"><button className="logout" onClick={logout}>Esci</button>{user.role === 'admin' && <button className="secondary-action" onClick={() => setStaffOpen(value => !value)}>{staffOpen ? 'Chiudi account' : 'Gestisci account'}</button>}<button className="primary-action" onClick={() => setEditing(blankAppointment(selectedDate))}>+ Nuova richiesta</button></div></div><section className="dashboard-summary"><article><span>Appuntamenti</span><b>{appointments.length}</b><p>nella data selezionata</p></article><article><span>Da confermare</span><b>{appointments.filter(item => item.status === 'Da confermare').length}</b><p>richiedono un contatto</p></article><article><span>Prossimo</span><b>{appointments[0]?.time || '—'}</b><p>{appointments[0]?.name || 'nessun appuntamento'}</p></article></section>{error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-notice" role="status">{notice}</p>}{staffOpen && user.role === 'admin' && <StaffPanel staff={staff} onCreate={createStaff} onUpdate={updateStaff} busy={busy} />}<section className="agenda"><div className="agenda-head"><div><p className="kicker">Agenda</p><h2>{formattedDate(selectedDate)}</h2></div><div className="agenda-controls"><label>Data<input type="date" value={selectedDate} onChange={event => { setSelectedDate(event.target.value); setError(''); setNotice('') }} /></label><div className="filter-row" aria-label="Filtra gli appuntamenti">{['Tutti', 'Da confermare', 'Confermato', 'Annullato'].map(value => <button className={filter === value ? 'selected' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)} key={value}>{value}</button>)}</div></div></div><div className="agenda-list">{visible.length ? visible.map(item => <article key={item.id}><time>{item.time}</time><div className="appointment-main"><h3>{item.name}</h3><p>{item.course || item.reason} · {item.language} · <a href={`tel:${item.phone.replaceAll(' ', '')}`}>{item.phone}</a></p>{item.request_code && <small>Richiesta {item.request_code}</small>}</div><span className={`appointment-status ${item.status.toLowerCase().replaceAll(' ', '-')}`}>{item.status}</span><div className="agenda-actions">{item.status !== 'Confermato' && <button onClick={() => changeStatus(item.id, 'Confermato')}>Conferma</button>}{item.status !== 'Annullato' && <button onClick={() => changeStatus(item.id, 'Annullato')}>Annulla</button>}<button onClick={() => setEditing(item)}>Modifica</button><button onClick={() => queueNotification(item.id, 'email')}>Email</button><button onClick={() => queueNotification(item.id, 'sms')}>SMS</button><a href={`/api/appointments/${item.id}/calendar.ics`}>Calendario</a><button onClick={() => showAudit(item.id)}>Storico</button>{user.role === 'admin' && <button className="danger-action" onClick={() => removeAppointment(item.id)}>Elimina</button>}</div></article>) : <p className="empty-state">Nessun appuntamento in questa vista.</p>}</div></section>{auditFor && <section className="audit-panel" aria-labelledby="audit-title"><div><p className="kicker">Tracciabilità</p><h2 id="audit-title">Storico richiesta #{auditFor}</h2></div><button className="dialog-close audit-close" onClick={() => setAuditFor(null)} aria-label="Chiudi storico">×</button>{auditEvents.length ? <ol>{auditEvents.map(event => <li key={event.id}><b>{event.action}</b><span>{event.actor} · {new Date(`${event.created_at}Z`).toLocaleString('it-IT')}</span>{event.metadata.fields && <small>Campi aggiornati: {event.metadata.fields.join(', ')}</small>}</li>)}</ol> : <p>Nessuna attività registrata.</p>}</section>}{editing && <RegistrationDialog appointment={editing} onClose={() => setEditing(null)} onSave={saveAppointment} busy={busy} />}</main>
}

function Footer({ setPage }) {
  const { t } = useI18n()
  return <footer><button className="identity footer-identity" onClick={() => setPage('home')}><span className="identity-dot">EdA</span><span><b>Don Milani</b><small>{t('ui.brandSmall')}</small></span></button><p>{t('ui.footerLine')}</p><button className="accessibility-link" onClick={() => { setPage('accessibility'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{t('ui.accessibility')}</button><span>{t('footer.rights')}</span></footer>
}

function App() {
  const [{ locale }, setRoute] = useState(() => parseRoute(window.location.pathname))
  return <I18nProvider locale={locale}><TrackedApp onLocalePath={setRoute} /></I18nProvider>
}

function TrackedApp({ onLocalePath }) {
  const initial = parseRoute(window.location.pathname)
  const [locale, setLocaleState] = useState(initial.locale)
  const [page, setPage] = useState(initial.page)
  const { t } = useI18n()

  const apply = (nextLocale, nextPage, mode = 'push') => {
    const target = hrefFor(nextLocale, nextPage)
    if (window.location.pathname !== target) window.history[mode === 'replace' ? 'replaceState' : 'pushState']({}, '', target)
    setLocaleState(nextLocale)
    setPage(nextPage)
    onLocalePath({ locale: nextLocale, page: nextPage })
  }

  const navigate = next => apply(locale, next)
  const setLocale = nextLocale => apply(nextLocale, page)

  useEffect(() => {
    const route = parseRoute(window.location.pathname)
    if (!route.hasLocale) apply(route.locale || defaultLocale, route.page, 'replace')
    const onPopState = () => {
      const next = parseRoute(window.location.pathname)
      setLocaleState(next.locale)
      setPage(next.page)
      onLocalePath(next)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr'
    document.title = t('meta.title')
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', t('meta.description'))
  }, [locale, t])

  useEffect(() => { if (page !== 'home') document.getElementById('main-content')?.focus() }, [page])

  return <><a className="skip-link" href="#main-content">{t('ui.skip')}</a><Header page={page} setPage={navigate} locale={locale} setLocale={setLocale} />{page === 'home' ? <Home setPage={navigate} /> : page === 'dashboard' ? <Dashboard setPage={navigate} /> : <ContentPage page={page} setPage={navigate} />}<Footer setPage={navigate} /></>
}

export default App
