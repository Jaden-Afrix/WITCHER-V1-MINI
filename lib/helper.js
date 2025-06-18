// lib/helper.js

/**
 * Format a Date object to DD/MM/YYYY string
 * @param {Date} date 
 * @returns {string}
 */
export function formatDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Format a Date object to hh:mm AM/PM string (24h format alternative)
 * @param {Date} date 
 * @returns {string}
 */
export function formatTime(date = new Date()) {
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`
}

/**
 * Sanitize a string input by trimming and removing excess spaces
 * @param {string} text
 * @returns {string}
 */
export function sanitizeText(text) {
  if (!text) return ''
  return text.trim().replace(/\s+/g, ' ')
}

/**
 * Format mentions from a list of user IDs to WhatsApp mention format
 * @param {string[]} users 
 * @returns {string[]}
 */
export function formatMentions(users = []) {
  return users.map(u => (u.includes('@s.whatsapp.net') ? u : `${u}@s.whatsapp.net`))
}

/**
 * Generate a random string of given length (alphanumeric)
 * @param {number} length 
 * @returns {string}
 */
export function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Simple delay function for async/await
 * @param {number} ms 
 * @returns {Promise<void>}
 */
export function delay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Clean up a URL by removing trailing slashes and whitespace
 * @param {string} url 
 * @returns {string}
 */
export function cleanUrl(url) {
  if (!url) return ''
  return url.trim().replace(/\/+$/, '')
}
