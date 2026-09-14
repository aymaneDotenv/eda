import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { existsSync, mkdirSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const here = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 8787)
const developmentPassword = 'change-me-before-production'
const sessionSecret = process.env.SESSION_SECRET || (!isProduction ? 'development-session-secret-change-me' : '')
const initialAdminUsername = process.env.INITIAL_ADMIN_USERNAME || 'admin'
const initialAdminPassword = process.env.INITIAL_ADMIN_PASSWORD || process.env.SECRETARY_PASSWORD || (!isProduction ? developmentPassword : '')

if (!sessionSecret || !initialAdminPassword || (isProduction && (sessionSecret === 'development-session-secret-change-me' || initialAdminPassword === developmentPassword))) {
  throw new Error('Set INITIAL_ADMIN_PASSWORD (or SECRETARY_PASSWORD) and SESSION_SECRET to unique values before starting in production.')
}

const dataDirectory = process.env.DATA_DIRECTORY || path.join(here, 'data')
const databasePath = process.env.DATABASE_PATH || path.join(dataDirectory, 'eda.sqlite')
if (databasePath !== ':memory:') mkdirSync(path.dirname(path.resolve(databasePath)), { recursive: true })
const database = new DatabaseSync(databasePath)
database.exec('PRAGMA foreign_keys = ON;')

database.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL, time TEXT NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL,
    reason TEXT NOT NULL, language TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Da confermare',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS staff_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, password_salt TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'segreteria')),
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT, actor_id INTEGER REFERENCES staff_users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id INTEGER,
    metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS notification_outbox (
    id INTEGER PRIMARY KEY AUTOINCREMENT, appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')), recipient TEXT NOT NULL,
    subject TEXT NOT NULL, body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
    provider_response TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, delivered_at TEXT
  );
`)

const appointmentColumns = {
  request_code: 'TEXT', course: 'TEXT', first_name: 'TEXT', last_name: 'TEXT', gender: 'TEXT', birth_date: 'TEXT', birth_country: 'TEXT', birth_province: 'TEXT', birth_town: 'TEXT', nationality: 'TEXT', second_nationality: 'TEXT', fiscal_code: 'TEXT',
  residence_country: 'TEXT', residence_province: 'TEXT', residence_town: 'TEXT', postal_code: 'TEXT', address: 'TEXT', email: 'TEXT', employment_status: 'TEXT', asylum_status: 'TEXT', document_type: 'TEXT', document_number: 'TEXT', document_expiry: 'TEXT', residence_permit_number: 'TEXT', residence_permit_type: 'TEXT', residence_permit_expiry: 'TEXT', other_identifier: 'TEXT', other_identifier_expiry: 'TEXT', registration_notes: 'TEXT', privacy_acknowledged: 'INTEGER NOT NULL DEFAULT 0', source: "TEXT NOT NULL DEFAULT 'Manuale'",
}
const existingColumns = new Set(database.prepare('PRAGMA table_info(appointments)').all().map(column => column.name))
for (const [column, definition] of Object.entries(appointmentColumns)) if (!existingColumns.has(column)) database.exec(`ALTER TABLE appointments ADD COLUMN ${column} ${definition};`)

const clean = (value, max = 160) => typeof value === 'string' ? value.trim().slice(0, max) : ''
const asBoolean = value => value === true || value === 1 || value === '1'
const safeEqual = (first, second) => {
  const a = Buffer.from(first || ''); const b = Buffer.from(second || '')
  return a.length === b.length && timingSafeEqual(a, b)
}
const passwordRecord = password => {
  const salt = randomBytes(16).toString('base64url')
  return { salt, hash: scryptSync(password, salt, 64).toString('base64url') }
}
const passwordMatches = (password, user) => safeEqual(scryptSync(password, user.password_salt, 64).toString('base64url'), user.password_hash)
const usernameIsValid = username => /^[a-z0-9._-]{3,50}$/i.test(username)
const passwordIsValid = password => typeof password === 'string' && password.length >= 12 && password.length <= 300

if (database.prepare('SELECT COUNT(*) AS count FROM staff_users').get().count === 0) {
  if (!usernameIsValid(initialAdminUsername) || !passwordIsValid(initialAdminPassword)) throw new Error('INITIAL_ADMIN_USERNAME must be valid and INITIAL_ADMIN_PASSWORD must contain at least 12 characters.')
  const credentials = passwordRecord(initialAdminPassword)
  database.prepare('INSERT INTO staff_users (username, password_hash, password_salt, role) VALUES (?, ?, ?, ?)').run(initialAdminUsername.toLowerCase(), credentials.hash, credentials.salt, 'admin')
}

const statuses = new Set(['Da confermare', 'Confermato', 'Annullato'])
const courses = new Set(['Italiano – base / A1 / A2 / patente', 'Licenza media', 'Lingue straniere', 'Italiano CILS', 'Altro'])
const reasons = new Set(['Colloquio di iscrizione', 'Test di italiano', 'Informazioni corsi', 'Iscrizione esame CILS'])
const languages = new Set(['Italiano', 'English', 'Français', 'Albanese', 'Arabo', 'Urdu'])
const genders = new Set(['', 'M', 'F', 'Altro', 'Preferisco non indicarlo'])
const asylumStatuses = new Set(['', 'NO', 'SI', 'MSNA'])
const permitTypes = new Set(['', 'Con scadenza', 'Senza scadenza'])
const datePattern = /^\d{4}-\d{2}-\d{2}$/
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const appointmentFields = ['date', 'time', 'name', 'phone', 'reason', 'language', 'status', 'request_code', 'course', 'first_name', 'last_name', 'gender', 'birth_date', 'birth_country', 'birth_province', 'birth_town', 'nationality', 'second_nationality', 'fiscal_code', 'residence_country', 'residence_province', 'residence_town', 'postal_code', 'address', 'email', 'employment_status', 'asylum_status', 'document_type', 'document_number', 'document_expiry', 'residence_permit_number', 'residence_permit_type', 'residence_permit_expiry', 'other_identifier', 'other_identifier_expiry', 'registration_notes', 'privacy_acknowledged', 'source']

const appointmentData = payload => {
  const data = {
    date: clean(payload.date, 10), time: clean(payload.time, 5), reason: clean(payload.reason, 60), language: clean(payload.language, 30), status: clean(payload.status || 'Da confermare', 30),
    request_code: clean(payload.request_code, 30).toUpperCase(), course: clean(payload.course, 70), first_name: clean(payload.first_name, 80), last_name: clean(payload.last_name, 80), gender: clean(payload.gender, 30), birth_date: clean(payload.birth_date, 10), birth_country: clean(payload.birth_country, 80), birth_province: clean(payload.birth_province, 60), birth_town: clean(payload.birth_town, 80), nationality: clean(payload.nationality, 80), second_nationality: clean(payload.second_nationality, 80), fiscal_code: clean(payload.fiscal_code, 16).toUpperCase(),
    residence_country: clean(payload.residence_country, 80), residence_province: clean(payload.residence_province, 60), residence_town: clean(payload.residence_town, 80), postal_code: clean(payload.postal_code, 12), address: clean(payload.address, 160), phone: clean(payload.phone, 30), email: clean(payload.email, 120).toLowerCase(), employment_status: clean(payload.employment_status, 80), asylum_status: clean(payload.asylum_status, 12), document_type: clean(payload.document_type, 40), document_number: clean(payload.document_number, 50), document_expiry: clean(payload.document_expiry, 10), residence_permit_number: clean(payload.residence_permit_number, 30), residence_permit_type: clean(payload.residence_permit_type, 30), residence_permit_expiry: clean(payload.residence_permit_expiry, 10), other_identifier: clean(payload.other_identifier, 30), other_identifier_expiry: clean(payload.other_identifier_expiry, 10), registration_notes: clean(payload.registration_notes, 1200), privacy_acknowledged: asBoolean(payload.privacy_acknowledged) ? 1 : 0, source: clean(payload.source || 'Manuale', 40),
  }
  data.name = clean(`${data.first_name} ${data.last_name}`, 160) || clean(payload.name, 160)
  const dateValues = [data.birth_date, data.document_expiry, data.residence_permit_expiry, data.other_identifier_expiry]
  const valid = datePattern.test(data.date) && timePattern.test(data.time) && data.name.length >= 2 && data.phone.length >= 5 && (!data.email || emailPattern.test(data.email)) && reasons.has(data.reason) && languages.has(data.language) && statuses.has(data.status) && courses.has(data.course || 'Altro') && genders.has(data.gender) && asylumStatuses.has(data.asylum_status) && permitTypes.has(data.residence_permit_type) && dateValues.every(value => !value || datePattern.test(value))
  return valid ? data : null
}
const readAppointment = id => database.prepare('SELECT * FROM appointments WHERE id = ?').get(id)
const audit = (actorId, action, entityType, entityId, metadata = {}) => database.prepare('INSERT INTO audit_log (actor_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?)').run(actorId || null, action, entityType, entityId || null, JSON.stringify(metadata))

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '128kb' }))
app.use((_, response, next) => {
  response.set({
    'Content-Security-Policy': "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' https://fonts.gstatic.com; form-action 'self'; frame-ancestors 'none'; img-src 'self' https://lh3.googleusercontent.com; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Resource-Policy': 'same-origin', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  })
  next()
})
app.use('/api', (request, response, next) => {
  const origin = request.get('origin')
  if (origin) {
    try { if (new URL(origin).host !== request.get('host')) return response.status(403).json({ error: 'Origine della richiesta non consentita.' }) } catch { return response.status(403).json({ error: 'Origine della richiesta non consentita.' }) }
  }
  response.setHeader('Cache-Control', 'no-store')
  return next()
})

const cookieValue = (request, name) => request.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1)
const createSession = user => {
  const payload = Buffer.from(JSON.stringify({ expires: Date.now() + 1000 * 60 * 60 * 8, nonce: randomBytes(12).toString('hex'), user: { id: user.id, username: user.username, role: user.role } })).toString('base64url')
  return `${payload}.${createHmac('sha256', sessionSecret).update(payload).digest('base64url')}`
}
const sessionFromRequest = request => {
  const value = cookieValue(request, 'eda_session')
  if (!value || !value.includes('.')) return null
  const [payload, signature] = value.split('.')
  if (!safeEqual(signature, createHmac('sha256', sessionSecret).update(payload).digest('base64url'))) return null
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (session.expires <= Date.now() || !session.user?.id || !['admin', 'segreteria'].includes(session.user.role)) return null
    const user = database.prepare('SELECT id, username, role, active FROM staff_users WHERE id = ?').get(session.user.id)
    return user?.active ? { id: user.id, username: user.username, role: user.role } : null
  } catch { return null }
}
const sessionCookie = value => `eda_session=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800${isProduction ? '; Secure' : ''}`
const requireAuth = (request, response, next) => {
  const user = sessionFromRequest(request)
  if (!user) return response.status(401).json({ error: 'Autenticazione richiesta.' })
  request.user = user
  return next()
}
const requireRole = (...roles) => (request, response, next) => roles.includes(request.user?.role) ? next() : response.status(403).json({ error: 'Permesso insufficiente per questa operazione.' })

const attempts = new Map()
const allowAttempt = ip => {
  const now = Date.now(); const record = attempts.get(ip) || { started: now, count: 0 }
  if (now - record.started > 15 * 60 * 1000) { attempts.set(ip, { started: now, count: 0 }); return true }
  return record.count < 5
}
const recordFailure = ip => { const record = attempts.get(ip) || { started: Date.now(), count: 0 }; attempts.set(ip, { ...record, count: record.count + 1 }) }

app.get('/api/health', (_, response) => { try { database.prepare('SELECT 1').get(); response.json({ status: 'ok', database: 'ok' }) } catch { response.status(503).json({ status: 'degraded', database: 'unavailable' }) } })
app.get('/api/session', (request, response) => { const user = sessionFromRequest(request); response.json({ authenticated: Boolean(user), user: user || null }) })
app.post('/api/session', (request, response) => {
  const ip = request.ip || 'unknown'
  if (!allowAttempt(ip)) return response.status(429).json({ error: 'Troppi tentativi. Riprova tra qualche minuto.' })
  const username = clean(request.body?.username, 50).toLowerCase(); const password = typeof request.body?.password === 'string' ? request.body.password : ''
  const user = usernameIsValid(username) ? database.prepare('SELECT * FROM staff_users WHERE username = ?').get(username) : null
  if (!user || !user.active || !passwordMatches(password, user)) { recordFailure(ip); return response.status(401).json({ error: 'Credenziali non valide.' }) }
  attempts.delete(ip); audit(user.id, 'auth.login', 'staff_user', user.id)
  response.setHeader('Set-Cookie', sessionCookie(createSession(user)))
  return response.status(204).end()
})
app.delete('/api/session', requireAuth, (request, response) => { audit(request.user.id, 'auth.logout', 'staff_user', request.user.id); response.setHeader('Set-Cookie', `eda_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProduction ? '; Secure' : ''}`); response.status(204).end() })

app.get('/api/appointments', requireAuth, (request, response) => {
  const date = clean(request.query.date, 10)
  const rows = datePattern.test(date) ? database.prepare('SELECT * FROM appointments WHERE date = ? ORDER BY time, id').all(date) : database.prepare('SELECT * FROM appointments ORDER BY date, time, id').all()
  response.json(rows)
})
app.post('/api/appointments', requireAuth, (request, response) => {
  const data = appointmentData(request.body || {})
  if (!data) return response.status(400).json({ error: 'Controlla i dati obbligatori dell’appuntamento e dello studente.' })
  const result = database.prepare(`INSERT INTO appointments (${appointmentFields.join(', ')}) VALUES (${appointmentFields.map(() => '?').join(', ')})`).run(...appointmentFields.map(field => data[field]))
  const appointment = readAppointment(result.lastInsertRowid); audit(request.user.id, 'appointment.create', 'appointment', appointment.id, { source: appointment.source })
  response.status(201).json(appointment)
})
app.patch('/api/appointments/:id', requireAuth, (request, response) => {
  const id = Number(request.params.id); const existing = Number.isInteger(id) && readAppointment(id)
  if (!existing) return response.status(404).json({ error: 'Appuntamento non trovato.' })
  const data = appointmentData({ ...existing, ...request.body })
  if (!data) return response.status(400).json({ error: 'Controlla i dati dell’appuntamento.' })
  const changed = appointmentFields.filter(field => String(existing[field] ?? '') !== String(data[field] ?? ''))
  if (!changed.length) return response.json(existing)
  database.prepare(`UPDATE appointments SET ${appointmentFields.map(field => `${field} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...appointmentFields.map(field => data[field]), id)
  const appointment = readAppointment(id); audit(request.user.id, 'appointment.update', 'appointment', id, { fields: changed })
  response.json(appointment)
})
app.delete('/api/appointments/:id', requireAuth, requireRole('admin'), (request, response) => {
  const id = Number(request.params.id); const appointment = Number.isInteger(id) && readAppointment(id)
  if (!appointment) return response.status(404).json({ error: 'Appuntamento non trovato.' })
  database.prepare('DELETE FROM appointments WHERE id = ?').run(id); audit(request.user.id, 'appointment.delete', 'appointment', id, { request_code: appointment.request_code || null })
  response.status(204).end()
})

const icsEscape = value => String(value || '').replaceAll('\\', '\\\\').replaceAll(';', '\\;').replaceAll(',', '\\,').replaceAll(/\r?\n/g, '\\n')
app.get('/api/appointments/:id/calendar.ics', requireAuth, (request, response) => {
  const id = Number(request.params.id); const appointment = Number.isInteger(id) && readAppointment(id)
  if (!appointment) return response.status(404).json({ error: 'Appuntamento non trovato.' })
  const start = `${appointment.date.replaceAll('-', '')}T${appointment.time.replace(':', '')}00`
  const endAt = new Date(`${appointment.date}T${appointment.time}:00`); endAt.setMinutes(endAt.getMinutes() + 30)
  const end = `${endAt.getFullYear()}${String(endAt.getMonth() + 1).padStart(2, '0')}${String(endAt.getDate()).padStart(2, '0')}T${String(endAt.getHours()).padStart(2, '0')}${String(endAt.getMinutes()).padStart(2, '0')}00`
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//EdA Don Milani//Segreteria//IT', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:eda-appointment-${appointment.id}@donmilani.local`, `DTSTAMP:${stamp}`, `DTSTART;TZID=Europe/Rome:${start}`, `DTEND;TZID=Europe/Rome:${end}`, `SUMMARY:${icsEscape(`Colloquio EdA — ${appointment.name}`)}`, `DESCRIPTION:${icsEscape(`${appointment.reason}. Corso: ${appointment.course || 'non indicato'}.`)}`, 'LOCATION:Centro EdA Don Milani, Rovereto', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n')
  response.set({ 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="appuntamento-${appointment.id}.ics"` }).send(content)
})

const notificationText = (appointment, channel) => ({ recipient: channel === 'email' ? appointment.email : appointment.phone, subject: 'Conferma appuntamento — Centro EdA Don Milani', body: `Gentile ${appointment.name}, il suo appuntamento presso il Centro EdA Don Milani è fissato per ${appointment.date} alle ${appointment.time}. Per informazioni: 0464 485511.` })
app.post('/api/appointments/:id/notifications', requireAuth, async (request, response) => {
  const id = Number(request.params.id); const channel = clean(request.body?.channel, 10); const appointment = Number.isInteger(id) && readAppointment(id)
  if (!appointment) return response.status(404).json({ error: 'Appuntamento non trovato.' })
  if (!['email', 'sms'].includes(channel)) return response.status(400).json({ error: 'Canale di notifica non valido.' })
  const notification = notificationText(appointment, channel)
  if (!notification.recipient) return response.status(400).json({ error: `Manca ${channel === 'email' ? 'l’indirizzo email' : 'il numero di cellulare'} dello studente.` })
  const result = database.prepare('INSERT INTO notification_outbox (appointment_id, channel, recipient, subject, body) VALUES (?, ?, ?, ?, ?)').run(id, channel, notification.recipient, notification.subject, notification.body)
  const queued = database.prepare('SELECT * FROM notification_outbox WHERE id = ?').get(result.lastInsertRowid); audit(request.user.id, 'notification.queue', 'appointment', id, { channel })
  if (!process.env.NOTIFICATION_WEBHOOK_URL) return response.status(202).json({ ...queued, delivery: 'queued' })
  try {
    const provider = await fetch(process.env.NOTIFICATION_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ channel, recipient: notification.recipient, subject: notification.subject, body: notification.body }) })
    if (!provider.ok) throw new Error(`HTTP ${provider.status}`)
    database.prepare("UPDATE notification_outbox SET status = 'sent', delivered_at = CURRENT_TIMESTAMP, provider_response = ? WHERE id = ?").run(`HTTP ${provider.status}`, queued.id); audit(request.user.id, 'notification.send', 'appointment', id, { channel })
    return response.status(202).json({ ...database.prepare('SELECT * FROM notification_outbox WHERE id = ?').get(queued.id), delivery: 'sent' })
  } catch (error) {
    database.prepare("UPDATE notification_outbox SET status = 'failed', provider_response = ? WHERE id = ?").run(clean(error.message, 240), queued.id); audit(request.user.id, 'notification.fail', 'appointment', id, { channel })
    return response.status(202).json({ ...database.prepare('SELECT * FROM notification_outbox WHERE id = ?').get(queued.id), delivery: 'failed' })
  }
})
app.get('/api/appointments/:id/audit', requireAuth, (request, response) => {
  const id = Number(request.params.id)
  if (!Number.isInteger(id) || !readAppointment(id)) return response.status(404).json({ error: 'Appuntamento non trovato.' })
  const events = database.prepare("SELECT audit_log.id, audit_log.action, audit_log.entity_type, audit_log.entity_id, audit_log.metadata, audit_log.created_at, COALESCE(staff_users.username, 'Sistema') AS actor FROM audit_log LEFT JOIN staff_users ON staff_users.id = audit_log.actor_id WHERE audit_log.entity_type = 'appointment' AND audit_log.entity_id = ? ORDER BY audit_log.id DESC LIMIT 100").all(id)
  response.json(events.map(event => ({ ...event, metadata: JSON.parse(event.metadata || '{}') })))
})

app.get('/api/staff', requireAuth, requireRole('admin'), (_, response) => response.json(database.prepare('SELECT id, username, role, active, created_at, updated_at FROM staff_users ORDER BY username').all()))
app.post('/api/staff', requireAuth, requireRole('admin'), (request, response) => {
  const username = clean(request.body?.username, 50).toLowerCase(); const password = request.body?.password; const role = clean(request.body?.role, 20)
  if (!usernameIsValid(username) || !passwordIsValid(password) || !['admin', 'segreteria'].includes(role)) return response.status(400).json({ error: 'Inserisci utente valido, password di almeno 12 caratteri e ruolo.' })
  try {
    const credentials = passwordRecord(password); const result = database.prepare('INSERT INTO staff_users (username, password_hash, password_salt, role) VALUES (?, ?, ?, ?)').run(username, credentials.hash, credentials.salt, role)
    const user = database.prepare('SELECT id, username, role, active, created_at, updated_at FROM staff_users WHERE id = ?').get(result.lastInsertRowid); audit(request.user.id, 'staff.create', 'staff_user', user.id, { role })
    response.status(201).json(user)
  } catch { response.status(409).json({ error: 'Questo nome utente è già in uso.' }) }
})
app.patch('/api/staff/:id', requireAuth, requireRole('admin'), (request, response) => {
  const id = Number(request.params.id); const existing = Number.isInteger(id) && database.prepare('SELECT * FROM staff_users WHERE id = ?').get(id)
  if (!existing) return response.status(404).json({ error: 'Account non trovato.' })
  const role = request.body?.role === undefined ? existing.role : clean(request.body.role, 20); const active = request.body?.active === undefined ? existing.active : (asBoolean(request.body.active) ? 1 : 0); const password = request.body?.password
  if (!['admin', 'segreteria'].includes(role) || (password !== undefined && !passwordIsValid(password))) return response.status(400).json({ error: 'Dati account non validi.' })
  if (id === request.user.id && (!active || role !== 'admin')) return response.status(400).json({ error: 'Non puoi disattivare o privare dei privilegi il tuo account durante la sessione.' })
  if (existing.role === 'admin' && existing.active && (role !== 'admin' || !active) && database.prepare("SELECT COUNT(*) AS count FROM staff_users WHERE role = 'admin' AND active = 1 AND id != ?").get(id).count === 0) return response.status(400).json({ error: 'Deve rimanere almeno un amministratore attivo.' })
  if (password !== undefined) { const credentials = passwordRecord(password); database.prepare('UPDATE staff_users SET role = ?, active = ?, password_hash = ?, password_salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(role, active, credentials.hash, credentials.salt, id) } else database.prepare('UPDATE staff_users SET role = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(role, active, id)
  const user = database.prepare('SELECT id, username, role, active, created_at, updated_at FROM staff_users WHERE id = ?').get(id); audit(request.user.id, 'staff.update', 'staff_user', id, { role, active: Boolean(active), passwordChanged: password !== undefined })
  response.json(user)
})

const dist = path.join(here, 'dist')
if (existsSync(dist)) {
  app.use(express.static(dist, { index: false, maxAge: isProduction ? '1h' : 0 }))
  app.use((request, response, next) => request.method === 'GET' && request.accepts('html') ? response.sendFile(path.join(dist, 'index.html')) : next())
}

app.listen(port, () => console.log(`EdA API listening on http://127.0.0.1:${port}`))
