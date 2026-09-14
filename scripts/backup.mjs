import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const root = path.resolve(process.cwd())
const dataDirectory = path.resolve(process.env.DATA_DIRECTORY || path.join(root, 'data'))
const databasePath = path.resolve(process.env.DATABASE_PATH || path.join(dataDirectory, 'eda.sqlite'))
const backupDirectory = path.resolve(process.env.BACKUP_DIRECTORY || path.join(root, 'backups'))
const retentionDays = Number(process.env.BACKUP_RETENTION_DAYS || 30)

if (!existsSync(databasePath)) throw new Error(`Database not found at ${databasePath}`)
if (!Number.isFinite(retentionDays) || retentionDays < 1) throw new Error('BACKUP_RETENTION_DAYS must be at least 1.')
mkdirSync(backupDirectory, { recursive: true })

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '')
const destination = path.resolve(backupDirectory, `eda-${timestamp}.sqlite`)
if (!destination.startsWith(`${backupDirectory}${path.sep}`)) throw new Error('Resolved backup destination is outside the backup directory.')

const database = new DatabaseSync(databasePath)
try {
  database.exec(`VACUUM INTO '${destination.replaceAll("'", "''")}';`)
} finally {
  database.close()
}

const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000
for (const entry of readdirSync(backupDirectory, { withFileTypes: true })) {
  const candidate = path.resolve(backupDirectory, entry.name)
  if (entry.isFile() && entry.name.startsWith('eda-') && entry.name.endsWith('.sqlite') && candidate.startsWith(`${backupDirectory}${path.sep}`) && statSync(candidate).mtimeMs < cutoff) unlinkSync(candidate)
}

console.log(`Backup created: ${destination}`)
