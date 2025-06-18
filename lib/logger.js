import fs from 'fs'
import path from 'path'

const LOG_FILE = path.resolve('./logs.txt')

function getTimestamp() {
  return new Date().toISOString()
}

function logToFile(message) {
  try {
    fs.appendFileSync(LOG_FILE, message + '\n')
  } catch (e) {
    console.error('Failed to write to log file:', e)
  }
}

export const logger = {
  info: (msg) => {
    const message = `[INFO] [${getTimestamp()}] ${msg}`
    console.log(message)
    logToFile(message)
  },

  warn: (msg) => {
    const message = `[WARN] [${getTimestamp()}] ${msg}`
    console.warn(message)
    logToFile(message)
  },

  error: (msg) => {
    const message = `[ERROR] [${getTimestamp()}] ${msg}`
    console.error(message)
    logToFile(message)
  },

  debug: (msg) => {
    const message = `[DEBUG] [${getTimestamp()}] ${msg}`
    // Optional: only show debug in dev mode
    if (process.env.NODE_ENV === 'development') {
      console.debug(message)
      logToFile(message)
    }
  }
}
