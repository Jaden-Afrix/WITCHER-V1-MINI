import fs from 'fs'
import path from 'path'

const DB_PATH = path.resolve('./database.json')

let db = { users: {}, settings: {} }

// Load database from file
export function loadDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8')
      db = JSON.parse(data)
    }
  } catch (e) {
    console.error('Failed to load database:', e)
  }
}

// Save current database to file
export function saveDatabase() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
  } catch (e) {
    console.error('Failed to save database:', e)
  }
}

// Get user data by ID
export function getUser(id) {
  if (!db.users[id]) db.users[id] = {}
  return db.users[id]
}

// Set user data by ID
export function setUser(id, data) {
  db.users[id] = { ...db.users[id], ...data }
  saveDatabase()
}

// Get bot settings
export function getSettings() {
  return db.settings
}

// Update bot settings
export function setSettings(newSettings) {
  db.settings = { ...db.settings, ...newSettings }
  saveDatabase()
}

// Initialize DB on import
loadDatabase()
