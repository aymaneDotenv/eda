import { spawn } from 'node:child_process'

const intervalHours = Number(process.env.BACKUP_INTERVAL_HOURS || 24)
if (!Number.isFinite(intervalHours) || intervalHours < 1) throw new Error('BACKUP_INTERVAL_HOURS must be at least 1.')

const runBackup = () => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, ['scripts/backup.mjs'], { stdio: 'inherit', env: process.env })
  child.on('error', reject)
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Backup process exited with code ${code}.`)))
})

const loop = async () => {
  for (;;) {
    try { await runBackup() } catch (error) { console.error(error.message) }
    await new Promise(resolve => setTimeout(resolve, intervalHours * 60 * 60 * 1000))
  }
}

loop().catch(error => { console.error(error); process.exit(1) })
