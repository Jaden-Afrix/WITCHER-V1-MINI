import { banner, sound } from '../config.js'

export const name = 'help'
export const command = ['help', 'menu', 'commands']
export const description = 'Shows all bot menus and info'

const WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24'

function formatDateTime() {
  const now = new Date()
  const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' }
  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true }
  const date = now.toLocaleDateString('en-GB', optionsDate)
  const time = now.toLocaleTimeString('en-US', optionsTime)
  return { date, time }
}

export async function execute(m, { client }) {
  const { date, time } = formatDateTime()

  // Get username (part before @)
  const user = m.pushName || m.sender.split('@')[0]

  const helpText = `
｟ 𝑾𝑰𝑻𝑪𝑯𝑬𝑹-𝑽1-𝑴𝑰𝑵𝑰 ｠  

⪨ 𝑾𝒆𝒍𝒄𝒐𝒎𝒆, @${user}!  
⪨ ᴅᴀᴛᴇ: ${date}  
⪨ ᴛɪᴍᴇ: ${time}  
⪨ ᴠᴇʀsɪᴏɴ: 1.0.0  

━━━━━━━━━━━━━━━

𝑬𝒙𝒑𝒍𝒐𝒓𝒆 𝒕𝒉𝒆 𝑷𝒐𝒘𝒆𝒓:

> 𝑶𝑾𝑵𝑬𝑹 𝑴𝑬𝑵𝑼  
> .ownermenu

> 𝑮𝑹𝑶𝑼𝑷 𝑴𝑬𝑵𝑼  
> .groupmenu

> 𝑩𝑼𝑮 𝑴𝑬𝑵𝑼  
> .bugmenu

> 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫 𝑴𝑬𝑵𝑼  
> .downloadmenu

> 𝑨𝑰 𝑴𝑬𝑵𝑼  
> .aimenu

> 𝑶𝑻𝑯𝑬𝑹 𝑴𝑬𝑵𝑼  
> .othermenu

> 𝑨𝑳𝑳 𝑴𝑬𝑵𝑼  
> .allmenu

━━━━━━━━━━━━━━━

𝑼𝒏𝒍𝒆𝒂𝒔𝒉 𝒕𝒉𝒆 𝒍𝒆𝒈𝒆𝒏𝒅. 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑳𝑷𝑯𝑨-𝑿
`

  const buttons = [
    {
      buttonId: 'channel',
      buttonText: { displayText: '📢 Official Channel' },
      type: 1
    }
  ]

  await client.sendMessage(
    m.chat,
    {
      image: { url: banner },
      caption: helpText.trim(),
      footer: '𝐖𝐈𝐓𝐂𝐇𝐄𝐑 𝐕𝟏 𝐌𝐈𝐍𝐈 | ALPHA-BLAKE',
      buttons,
      headerType: 4
    },
    { quoted: m }
  )

  await client.sendMessage(m.chat, { audio: { url: sound }, mimetype: 'audio/mpeg' }, { quoted: m })
}
