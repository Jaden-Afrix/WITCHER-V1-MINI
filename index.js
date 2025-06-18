/**
 * WITCHER-V1-MINI - Main Bot Entry (index.js)
 * Owner: ALPHA-BLAKE
 * Contacts: +254780931677, +263784812740
 * Repo: https://github.com/Jaden-Afrix/WITCHER-V1-MINI
 */

import express from 'express'
import { Boom } from '@hapi/boom'
import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    useSingleFileAuthState,
} from '@adiwajshing/baileys'
import { readdirSync } from 'fs'
import path from 'path'
import Pino from 'pino'
import fs from 'fs'
import fetch from 'node-fetch'
import qrcode from 'qrcode-terminal'
import { fileURLToPath } from 'url'

// __dirname replacement in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const bannerImage = 'https://files.catbox.moe/17jcwv.jpg'
const connectSound = 'https://files.catbox.moe/dav1ns.mp3'
const ownerNumbers = ['+254780931677', '+263784812740']
const channelLink = 'https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24'

// Express Server
const app = express()
const PORT = process.env.PORT || 3000
app.get('/', (req, res) => {
    res.send(`
    <h1>💀 WITCHER-V1-MINI IS RUNNING 💀</h1>
    <p>Owner: ALPHA-BLAKE</p>
    <p><a href="${channelLink}" target="_blank">Join the WhatsApp Channel</a></p>
  `)
})
app.listen(PORT, () => {
    console.log(`🌐 Express server running at http://localhost:${PORT}`)
})

// WhatsApp Auth Setup
const { state, saveState } = useSingleFileAuthState('./session.json')
const store = makeInMemoryStore({ logger: Pino().child({ level: 'silent', stream: 'store' }) })
store.readFromFile('./store.json')
setInterval(() => store.writeToFile('./store.json'), 10_000)

let sock

const startBot = async () => {
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`📦 Using WhatsApp Version: ${version}, Latest: ${isLatest}`)
    
    sock = makeWASocket({
        version,
        logger: Pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: ['WITCHER-V1-MINI', 'Safari', '1.0.0'],
        getMessage: async (key) => ({ conversation: '📩 Message not found' }),
    })
    
    store.bind(sock.ev)
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr, pairingCode } = update
        
        if (qr) {
            console.log('📷 Scan this QR code to connect:')
            qrcode.generate(qr, { small: true })
        }
        
        if (pairingCode) {
            console.log(`🔗 Pairing Code: ${pairingCode}`)
        }
        
        if (connection === 'close') {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('❌ Disconnected. Reconnecting:', shouldReconnect)
            if (shouldReconnect) startBot()
        }
        
        if (connection === 'open') {
            console.log('✅ BOT CONNECTED SUCCESSFULLY!')
            sock.sendMessage(sock.user.id, {
                image: { url: bannerImage },
                caption: `💀 𝐖𝐈𝐓𝐂𝐇𝐄𝐑 𝐕𝟏 𝐌𝐈𝐍𝐈 IS ONLINE\n\nOwner: ALPHA-BLAKE\nChannel: ${channelLink}`,
            })
            sock.sendMessage(sock.user.id, {
                audio: { url: connectSound },
                mimetype: 'audio/mp4',
                ptt: true,
            })
        }
    })
    
    sock.ev.on('creds.update', saveState)
    
    // Handle messages
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return
        
        const from = msg.key.remoteJid
        const body =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            msg.message.imageMessage?.caption ||
            ''
        
        const isCmd = body.startsWith('.')
        const command = isCmd ? body.trim().split(' ')[0].slice(1).toLowerCase() : ''
        const args = body.trim().split(' ').slice(1)
        
        if (isCmd) {
            // Run plugins
            for (let plugin of plugins) {
                try {
                    if (plugin.command === command || plugin.aliases?.includes(command)) {
                        await plugin.run({ sock, msg, from, args, command, bannerImage, connectSound })
                        break
                    }
                } catch (e) {
                    console.log(`❌ Plugin Error in ${plugin.command}:`, e)
                    await sock.sendMessage(from, { text: `❌ Error in command *${command}*` }, { quoted: msg })
                }
            }
        }
    })
}

// Plugin Loader
const pluginFolder = path.join(__dirname, 'plugins')
const plugins = []

for (let file of readdirSync(pluginFolder)) {
    if (file.endsWith('.js')) {
        try {
            const plugin = await import(`file://${path.join(pluginFolder, file)}`)
            if (plugin.default) plugins.push(plugin.default)
        } catch (err) {
            console.log(`⚠️ Failed to load plugin ${file}:`, err)
        }
    }
}

startBot()