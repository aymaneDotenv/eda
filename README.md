# EdA Don Milani Rovereto

A responsive public website and protected secretary workspace for Centro EdA Don Milani, Rovereto.

## What is included

- Public routes for the Centre, Italian and foreign-language courses, scuola media, CILS, cultural activities, contacts, and accessibility.
- A protected secretary route at `/segreteria` built around the live Nettuno registration fields: course, student identity, contact, residence, document and appointment data. The dashboard intentionally omits vaccination status because it is not needed to schedule or manage an appointment.
- Edit and reschedule appointments, permanently delete them as an administrator, export a `.ics` calendar event, queue email/SMS confirmations, and inspect a per-appointment audit history.
- Individual staff accounts with `segreteria` and `admin` roles. Passwords are salted and hashed with scrypt; session cookies are HTTP-only and signed.
- SQLite-backed data, request validation, login rate limiting, origin checks, security headers, a health endpoint, and Docker health checks.
- Accessibility foundations: skip link, semantic landmarks, keyboard operation, visible focus, reduced-motion support, labelled controls, and a feedback route.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set `INITIAL_ADMIN_USERNAME`, `INITIAL_ADMIN_PASSWORD`, and `SESSION_SECRET`. The development fallback password exists only to simplify local testing and must never be used in production.

3. Start the application:

   ```bash
   npm run dev
   ```

   - Public app: `http://localhost:5173`
   - API and production server: `http://localhost:8787`

## Production

Build and run locally:

```bash
npm run build
NODE_ENV=production INITIAL_ADMIN_PASSWORD="..." SESSION_SECRET="..." npm start
```

On PowerShell:

```powershell
$env:NODE_ENV='production'
$env:INITIAL_ADMIN_PASSWORD='use-a-long-unique-password'
$env:SESSION_SECRET='use-at-least-32-random-characters'
npm start
```

The included `Dockerfile` builds a production image and checks `/api/health` every 30 seconds. `docker compose --profile operations up -d --build` also runs an automated SQLite backup service every 24 hours by default, retaining 30 days in the separate `eda-backups` volume. Store and test a copy of that volume outside the server as part of the school's disaster-recovery process.

## Notifications and calendar

- **Calendar:** each appointment has an authenticated `.ics` export that can be imported into Microsoft Outlook, Google Calendar, Apple Calendar, or another calendar application.
- **Email/SMS:** the dashboard records the confirmation in an outbox. To send it automatically, configure `NOTIFICATION_WEBHOOK_URL` to a school-approved delivery adapter; that endpoint receives the channel, recipient, subject, and message. Do not configure it until the provider agreement, data-processing terms, sender identity, and opt-in process are approved.

## Operations

For a non-Docker deployment, run the backup explicitly with `npm run backup`, then schedule it through the chosen platform, Windows Task Scheduler, or cron. The backup uses SQLite's `VACUUM INTO` so the copied database is consistent. Configure an external uptime monitor to request `https://your-domain/api/health` and alert the responsible team when it is not `200`.

## Before publishing

- Confirm official contact/address details and all dates with the school.
- Change all production secrets and configure HTTPS on the hosting platform.
- Create named staff accounts and remove the initial bootstrap password from deployment notes after the first successful administrator login.
- Choose and configure the approved email/SMS provider, calendar ownership, backup destination, uptime monitor, escalation contacts, retention window, and restoration test. These require the school's provider accounts and authorisation.
- Replace externally hosted images and fonts with approved, locally hosted assets if required by the school’s privacy policy.
- Complete keyboard, screen-reader, zoom, contrast, mobile, and content/PDF accessibility testing. Have the RTD publish the official AgID accessibility statement and update it annually.
- Approve privacy, cookie, data-retention, and appointment-handling policies with the school’s data-protection owner.
