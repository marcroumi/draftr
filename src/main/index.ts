import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { writeFile, unlink } from 'fs/promises'
import { tmpdir } from 'os'
import Database from 'better-sqlite3'

// ── SQLite setup ───────────────────────────────────────────────────────────────
let db: Database.Database

function initDb(): void {
  const dbPath = join(app.getPath('userData'), 'draftr.db')
  db = new Database(dbPath)
  db.exec(`
    CREATE TABLE IF NOT EXISTS proposals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT 'New Proposal',
      status TEXT NOT NULL DEFAULT 'Draft',
      client_name TEXT NOT NULL DEFAULT '',
      value REAL NOT NULL DEFAULT 0,
      sections_json TEXT NOT NULL DEFAULT '[]',
      active_theme_id TEXT NOT NULL DEFAULT 'modern',
      font_size TEXT NOT NULL DEFAULT 'medium',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `)
}

// ── DB IPC handlers ────────────────────────────────────────────────────────────
ipcMain.handle('db:proposals:list', () => {
  return db.prepare('SELECT * FROM proposals ORDER BY updated_at DESC').all()
})

ipcMain.handle('db:proposals:get', (_event, id: string) => {
  return db.prepare('SELECT * FROM proposals WHERE id = ?').get(id) ?? null
})

ipcMain.handle('db:proposals:upsert', (_event, payload: {
  id: string; title: string; status: string; client_name: string
  value: number; sections_json: string; active_theme_id: string
  font_size: string; created_at: number; updated_at: number
}) => {
  db.prepare(`
    INSERT INTO proposals (id, title, status, client_name, value, sections_json, active_theme_id, font_size, created_at, updated_at)
    VALUES (@id, @title, @status, @client_name, @value, @sections_json, @active_theme_id, @font_size, @created_at, @updated_at)
    ON CONFLICT(id) DO UPDATE SET
      title        = excluded.title,
      status       = excluded.status,
      client_name  = excluded.client_name,
      value        = excluded.value,
      sections_json = excluded.sections_json,
      active_theme_id = excluded.active_theme_id,
      font_size    = excluded.font_size,
      updated_at   = excluded.updated_at
  `).run(payload)
  return { success: true }
})

ipcMain.handle('db:proposals:delete', (_event, id: string) => {
  db.prepare('DELETE FROM proposals WHERE id = ?').run(id)
  return { success: true }
})

ipcMain.handle('db:proposals:duplicate', (_event, id: string) => {
  const row = db.prepare('SELECT * FROM proposals WHERE id = ?').get(id) as Record<string, unknown> | undefined
  if (!row) return { success: false }
  const newId = crypto.randomUUID()
  const now = Date.now()
  db.prepare(`
    INSERT INTO proposals (id, title, status, client_name, value, sections_json, active_theme_id, font_size, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    newId,
    `${row.title} (Copy)`,
    'Draft',
    row.client_name,
    row.value,
    row.sections_json,
    row.active_theme_id,
    row.font_size,
    now,
    now
  )
  return { success: true, id: newId }
})

ipcMain.handle('db:proposals:rename', (_event, id: string, title: string) => {
  db.prepare('UPDATE proposals SET title = ?, updated_at = ? WHERE id = ?').run(title, Date.now(), id)
  return { success: true }
})

// ── Window ─────────────────────────────────────────────────────────────────────
function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ── PDF Export ─────────────────────────────────────────────────────────────────
ipcMain.handle('export-pdf', async (_event, html: string, filename: string) => {
  // 1. Ask user where to save
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Export PDF',
    defaultPath: `${filename}.pdf`,
    filters: [{ name: 'PDF Document', extensions: ['pdf'] }],
  })

  if (canceled || !filePath) return { success: false }

  // 2. Write HTML to a temp file (data URLs have length limits)
  const tmpPath = join(tmpdir(), `draftr-${Date.now()}.html`)
  await writeFile(tmpPath, html, 'utf-8')

  // 3. Create a hidden BrowserWindow to render the HTML
  const pdfWin = new BrowserWindow({
    show: false,
    width: 794,   // A4 at 96 dpi
    height: 1123,
    webPreferences: { sandbox: false },
  })

  await pdfWin.loadFile(tmpPath)

  // 4. Wait for fonts and images to finish loading
  await pdfWin.webContents.executeJavaScript('document.fonts.ready')
  await new Promise((r) => setTimeout(r, 800))

  // 5. Print to PDF
  const pdfBuffer = await pdfWin.webContents.printToPDF({
    printBackground: true,
    pageSize: 'A4',
  })

  pdfWin.close()

  // 6. Write PDF and clean up temp file
  await writeFile(filePath, pdfBuffer)
  unlink(tmpPath).catch(() => {})

  return { success: true, filePath }
})

// ── App lifecycle ──────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  initDb()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
