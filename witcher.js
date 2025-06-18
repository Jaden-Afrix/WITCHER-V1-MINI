import { owners, botName } from '../config.js'

export const name = 'witcher'
export const description = 'Info about WITCHER-V1-MINI bot'
export const command = ['witcher']
export const ownerOnly = false

export async function execute(m, { client }) {
  const user = m.sender.split('@')[0]

  const message = `
✨ *WITCHER-V1-MINI* ✨

Hello @${user} 👋
I am the legendary WhatsApp bot *WITCHER-V1-MINI*.
Created and powered by ALPHA-BLAKE.

Use .help to see all my powerful commands.

Stay safe and keep witching! 🧙‍♂️🪄
  `

  await client.sendMessage(m.chat, { text: message, mentions: [m.sender] }, { quoted: m })
}
