import fs from 'fs'
import path from 'path'

const SESSION_FILE = path.resolve('./session.json')

let sessionData = {}

// Load session from file
export function loadSession() {
  if (fs.existsSync(SESSION_FILE)) {
    try {
      const raw = fs.readFileSync(SESSION_FILE, 'utf-8')
      sessionData = JSON.parse(raw)
      console.log('Session loaded successfully')
    } catch (e) {
      console.error('Failed to load session:', e)
    }
  } else {
    console.log('No session file found, starting fresh')
  }
  return sessionData
}

// Save session to file
export function saveSession(data) {
  sessionData = data
  try {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionData, null, 2))
    console.log('Session saved successfully')
  } catch (e) {
    console.error('Failed to save session:', e)
  }
}

// Get current session data
export function getSession() {
  return sessionData
}

// Clear session (delete file and memory)
export function clearSession() {
  sessionData = {}
  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE)
  }
  console.log('Session cleared')
}
