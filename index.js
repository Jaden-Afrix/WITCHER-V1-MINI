/**
 * WITCHER-V1-MINI - Main Bot Entry (index.js)
 * Owner: ALPHA-BLAKE
 * Contacts: +254780931677, +263784812740
 * Repo: https://github.com/Jaden-Afrix/WITCHER-V1-MINI
 */

import { default as makeWASocket, DisconnectReason, useSingleFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore } from '@adiwajshing/baileys';
import P from 'pino';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Bot Config ===
const BOT_NAME = '𝐖𝐈𝐓𝐂𝐇𝐄𝐑 𝐕𝟏 𝐌𝐈𝐍𝐈';
const OWNER_NUMBERS = ['+254780931677', '+263784812740'];
const BOT_HEADER_IMAGE_URL = 'https://files.catbox.moe/17jcwv.jpg';
const BOT_SOUND_URL = 'https://files.catbox.moe/dav1ns.mp3';
const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const SESSION_PATH = './auth_info_multi.json';

// === Auth & Session ===
const { state, saveState } = useSingleFileAuthState(SESSION_PATH);
const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });

// Initialize Telegram bot only if token is provided
let telegramBot = null;
if (TELEGRAM_BOT_TOKEN) {
    try {
        const TelegramBot = (await import('node-telegram-bot-api')).default;
        telegramBot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
        
        telegramBot.onText(/\/start/, (msg) => {
            telegramBot.sendMessage(msg.chat.id, `🤖 ${BOT_NAME} Online!\nUse /pairingcode to generate WA pairing code.`);
        });
        
        telegramBot.onText(/\/pairingcode/, async (msg) => {
            telegramBot.sendMessage(msg.chat.id, '🧿 Generating pairing code... (Connect on WhatsApp)');
        });
    } catch (error) {
        console.error('Telegram bot initialization error:', error);
    }
}

// === WhatsApp Socket ===
const connectToWhatsApp = async () => {
    try {
        const { version } = await fetchLatestBaileysVersion();
        const sock = makeWASocket({
            version,
            logger: P({ level: 'silent' }),
            auth: state,
            printQRInTerminal: true
        });
        
        store.bind(sock.ev);
        sock.ev.on('creds.update', saveState);
        
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                console.log('📷 Scan this QR in WhatsApp to connect:');
            }
            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                if (shouldReconnect) {
                    setTimeout(connectToWhatsApp, 5000);
                } else {
                    console.log('🔌 Connection closed.');
                }
            } else if (connection === 'open') {
                console.log('✅ Connected to WhatsApp!');
            }
        });
        
        sock.ev.on('messages.upsert', async ({ messages, type }) => {
            if (!messages || type !== 'notify') return;
            const msg = messages[0];
            const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
            
            if (!text) return;
            
            try {
                if (text.toLowerCase() === 'menu') {
                    await sock.sendMessage(msg.key.remoteJid, {
                        image: { url: BOT_HEADER_IMAGE_URL },
                        caption: `🎃 *${BOT_NAME} - BOT MENU*\n\n1. .owner\n2. .groupmenu\n3. .downloadmenu\n4. .funmenu\n5. .tools\n6. .pair\n\n🧙‍♂️ Contact the owner for full access.`,
                        footer: BOT_NAME,
                        buttons: [
                            { buttonId: '.owner', buttonText: { displayText: '🧙 Owner' }, type: 1 },
                            { buttonId: '.pair', buttonText: { displayText: '🔗 Pair Device' }, type: 1 }
                        ],
                        headerType: 4
                    });
                    await sock.sendMessage(msg.key.remoteJid, {
                        audio: { url: BOT_SOUND_URL },
                        mimetype: 'audio/mp4',
                        ptt: true
                    });
                }
                
                if (text === '.owner') {
                    await sock.sendMessage(msg.key.remoteJid, {
                        text: `👑 Owner:\n${OWNER_NUMBERS.join('\n')}`
                    });
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });
        
    } catch (error) {
        console.error('WhatsApp connection error:', error);
        setTimeout(connectToWhatsApp, 10000);
    }
};

// Start WhatsApp connection
connectToWhatsApp();

// === Express Server ===
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`🤖 ${BOT_NAME} Bot is Running`);
});

app.listen(PORT, () => {
    console.log(`🌐 HTTP Server running on port ${PORT}`);
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});