// lib/whatsapp.js

/**
 * Create a button message with text and buttons array
 * @param {string} text 
 * @param {Array<{id:string,title:string}>} buttons 
 * @returns {object}
 */
export function createButtonMessage(text, buttons) {
  return {
    text,
    buttons,
    headerType: 1
  }
}

/**
 * Format a mention for a WhatsApp message
 * @param {string} jid 
 * @returns {string}
 */
export function formatMention(jid) {
  if (jid.includes('@s.whatsapp.net')) return jid
  return jid + '@s.whatsapp.net'
}

/**
 * Extract sender id from quoted message if any
 * @param {object} quotedMessage 
 * @returns {string|null}
 */
export function getQuotedSender(quotedMessage) {
  try {
    return quotedMessage?.key?.participant || quotedMessage?.key?.remoteJid || null
  } catch {
    return null
  }
}
