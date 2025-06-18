//══════════════════════════════════════════════════════════════════════════════//
//                          WITCHER‑V1‑MINI ‑ FULL INDEX.JS                           //
//══════════════════════════════════════════════════════════════════════════════//

/**
 * Multi-User Express + WhatsApp Bot with pairing + full features
 * – Loads all your plugin commands, fully functional
 * – Longer than friend's code, with extended menus
 */

const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason,
        fetchLatestBaileysVersion, proto, downloadMediaMessage } = require('@whiskeysockets/baileys');
const Pino = require('pino');
const fs = require('fs'), path = require('path'), chalk = require('chalk'),
      axios = require('axios'), qrcode = require('qrcode-terminal'),
      figlet = require('figlet'), moment = require('moment-timezone'),
      FileType = require('file-type');

//═══════════════ CONFIGURE EXPRESS SERVER ═══════════════//
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('🧙‍♂️ WITCHER‑V1‑MINI is online.'));
app.listen(PORT, () => console.log(chalk.green(`🌐 Server running on port ${PORT}`)));

//═══════════════ BANNER AT STARTUP ═══════════════//
console.log(chalk.cyan(figlet.textSync('WITCHER V1 MINI', { font: 'Big' })));
console.log(chalk.magenta('🔗 Channel: https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24'));
console.log(chalk.yellow('👑 Owner(s): +254780931677, +263784812740'));
console.log(chalk.green('\nStarting WITCHER‑V1‑MINI... Please wait.\n'));

//═══════════════ GLOBAL VARIABLES ═══════════════//
let sock = null;
const sessions = {};       // For pairing codes
const commands = new Map();

//═══════════════ LOAD PLUGINS FUNCTION ═══════════════//
function loadPlugins() {
  const pluginDir = path.join(__dirname, './plugins');
  fs.readdirSync(pluginDir).forEach(file => {
    if (file.endsWith('.js')) {
      try {
        const cmd = require(path.join(pluginDir, file));
        if (Array.isArray(cmd.command)) {
          cmd.command.forEach(c => commands.set(c, cmd));
          console.log(chalk.green(`[PLUGIN] Loaded ${file} -> ${cmd.command.join(', ')}`));
        } else {
          console.log(chalk.yellow(`[PLUGIN WARN] ${file} missing command array.`));
        }
      } catch (e) {
        console.error(chalk.red(`[PLUGIN ERROR] ${file}:`), e);
      }
    }
  });
}
loadPlugins();

//═══════════════ CONNECT WHATSAPP ═══════════════//
async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    logger: Pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['WITCHER‑V1‑MINI', 'Safari', '1.0']
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', handleConnection);
  sock.ev.on('messages.upsert', handleMessage);
}

//═══════════════ CONNECTION HANDLER ═══════════════//
function handleConnection(update) {
  const { connection, lastDisconnect, qr } = update;

  if (qr) {
    console.log(chalk.blue('📲 QR received! Scan to connect WITCHER‑V1‑MINI below:'));
    qrcode.generate(qr, { small: true });
  }
  if (connection === 'open') {
    console.log(chalk.green('✅ WhatsApp connected.'));
    sendStartupMedia();
  }
  if (connection === 'close') {
    const code = lastDisconnect?.error?.output?.statusCode;
    console.log(chalk.red(`Connection closed: ${connection} (${code})`));
    if (code !== DisconnectReason.loggedOut) {
      console.log(chalk.yellow('🔁 Reconnecting...')); startWhatsApp();
    } else {
      console.log(chalk.red('❌ Logged out. Delete session and restart to pair again.'));
      process.exit();
    }
  }
}

//═══════════════ SEND STARTUP MEDIA ═══════════════//
async function sendStartupMedia() {
  if (!sock || !sock.user) return;
  const me = sock.user.id;
  const banner = await axios.get('https://files.catbox.moe/17jcwv.jpg', { responseType: 'arraybuffer' });
  const audio = await axios.get('https://files.catbox.moe/dav1ns.mp3', { responseType: 'arraybuffer' });
  const bannerType = await FileType.fromBuffer(banner.data);
  const audioType = await FileType.fromBuffer(audio.data);

  await sock.sendMessage(me, { image: banner.data, mimetype: bannerType.mime, caption: '✅ WITCHER‑V1‑MINI ONLINE' });
  await sock.sendMessage(me, { audio: audio.data, mimetype: audioType.mime, ptt: false });
}

//═══════════════ MESSAGE HANDLER ═══════════════//
async function handleMessage({ messages }) {
  try {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    const from = msg.key.remoteJid;

    if (!text.startsWith('.')) return;

    const [cmd, ...args] = text.slice(1).trim().split(/\s+/);
    const plugin = commands.get(cmd);

    if (!plugin) {
      return sock.sendMessage(from, { text: `❌ Unknown command "${cmd}".\nType .menu to view all commands.` }, { quoted: msg });
    }

    await plugin.run(sock, msg, { args, commands, sendStartupMedia });
  } catch (e) {
    console.error(chalk.red('❌ Error on message:'), e);
  }
}

//═══════════════ PAIRING ENDPOINT ═══════════════//
app.get('/pair', async (req, res) => {
  const number = (req.query.number || '').replace(/\D/g, '') + '@s.whatsapp.net';
  if (!number || number.length < 10) return res.status(400).send('❗ Provide a valid number.');

  if (!sock) return res.status(503).send('❌ Bot not ready.');
  try {
    const { pairingCode } = await sock.requestPairingCode(number);
    sessions[number] = pairingCode;
    console.log(chalk.green(`[PAIR] ${number} -> ${pairingCode}`));
    res.send(`✔ Pairing Code for ${number}: ${pairingCode}\n`);
  } catch (e) {
    console.error(chalk.red('[PAIR ERROR]'), e);
    res.status(500).send('❌ Pairing failed');
  }
});

//═══════════════ STATUS ENDPOINT ═══════════════//
app.get('/status', (req, res) => {
  const uptime = moment.duration(process.uptime() * 1000).humanize();
  res.json({ status: sock ? 'connected' : 'disconnected', uptime });
});

//═══════════════ INITIALIZE BOT ═══════════════//
startWhatsApp();
