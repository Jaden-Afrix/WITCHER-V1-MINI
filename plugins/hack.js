import { banner, sound, CHANNEL_BUTTON, prefix } from '../config.js'

export const name = 'hack'
export const command = ['hack']
export const description = 'Realistic hacking prank with loading effects and payload'
export const ownerOnly = false

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Loading dots animation (e.g. "Connecting.", "Connecting..", "Connecting...")
async function sendLoadingDots(client, chatId, quoted, text, duration = 4000, interval = 500) {
  const steps = Math.floor(duration / interval)
  for (let i = 0; i < steps; i++) {
    const dots = '.'.repeat((i % 3) + 1)
    await client.sendMessage(chatId, { text: `${text}${dots}` }, { quoted })
    await sleep(interval)
  }
}

// Smooth 0% to 100% progress updates
async function sendProgress(client, chatId, quoted, text, duration = 5000) {
  const steps = 20
  const delay = duration / steps
  for (let i = 0; i <= steps; i++) {
    const percent = Math.floor((i / steps) * 100)
    await client.sendMessage(chatId, { text: `${text} ${percent}%` }, { quoted })
    await sleep(delay)
  }
}

// Random fake IP generator
function randomIP() {
  return `${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}`
}

// Random fake port generator
function randomPort() {
  return Math.floor(Math.random() * (65535 - 1024) + 1024)
}

export async function execute(m, { client, text }) {
  if (!text) {
    return client.sendMessage(m.chat, {
      image: { url: banner },
      caption: `💻 Usage: ${prefix}hack <target>\n\nProvide a target to initiate the hack.`,
      buttons: [CHANNEL_BUTTON]
    }, { quoted: m })
  }

  const target = text.trim()

  // Start prank
  await client.sendMessage(m.chat, { audio: { url: sound }, mimetype: 'audio/mp4' }, { quoted: m })

  await client.sendMessage(m.chat, { text: `💻 Initializing hack on ${target}...` }, { quoted: m })

  // Step 1: Connecting to target with dots animation
  await sendLoadingDots(client, m.chat, m, '🔗 Connecting to target network')

  // Step 2: Show fake IP & port
  const ip = randomIP()
  const port = randomPort()
  await client.sendMessage(m.chat, { text: `🌐 Target IP: ${ip}:${port}` }, { quoted: m })

  // Step 3: Firewall bypass with progress
  await client.sendMessage(m.chat, { text: '🛡️ Bypassing firewall security...' }, { quoted: m })
  await sendProgress(client, m.chat, m, '🚧 Firewall bypass progress')

  // Step 4: Accessing target files
  await client.sendMessage(m.chat, { text: '📁 Accessing confidential files...' }, { quoted: m })
  await sendLoadingDots(client, m.chat, m, '📂 Loading files')

  // Step 5: Injecting virus payload
  await client.sendMessage(m.chat, { text: '💉 Injecting virus payload...' }, { quoted: m })
  await sendProgress(client, m.chat, m, '⚠️ Payload injection progress')

  // Step 6: Extracting data
  await client.sendMessage(m.chat, { text: '🔑 Extracting passwords and messages...' }, { quoted: m })
  await sendLoadingDots(client, m.chat, m, '🔍 Extracting data', 6000, 600)

  // Step 7: Tracing location
  await client.sendMessage(m.chat, { text: '📍 Tracing target location...' }, { quoted: m })
  await sendProgress(client, m.chat, m, '📡 Location trace progress')

  // Step 8: Finalizing
  await client.sendMessage(m.chat, { text: '⚠️ Warning: Security systems detecting intrusion!' }, { quoted: m })
  await sleep(3000)

  // Step 9: Hack complete
  await client.sendMessage(m.chat, { text: `✅ Hack complete.\nTarget ${target} compromised successfully.` }, { quoted: m })
}
