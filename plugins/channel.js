import { banner, sound } from '../config.js'

export const name = 'channel'
export const command = ['channel']
export const description = 'Sends the official WITCHER-V1-MINI WhatsApp channel link with a button'

const CHANNEL_LINK = 'https://chat.whatsapp.com/0029VbAxoHNF6sn7hhz2Ss24'

export async function execute(m, { client }) {
  await client.sendMessage(
    m.chat,
    {
      image: { url: banner },
      caption: `✨ *Join the official* 𝐖𝐈𝐓𝐂𝐇𝐄𝐑 𝐕𝟏 𝐌𝐈𝐍𝐈 *WhatsApp Channel!*\n\nStay updated with the latest bugs, commands, and exclusive content.\n\n🔗 Tap the button below to join now!`,
      footer: '© ALPHA-BLAKE | Stay safe, stay powerful',
      buttons: [
        {
          buttonId: 'channel_join',
          buttonText: { displayText: '📢 Join Channel' },
          type: 1
        }
      ],
      headerType: 4
    },
    { quoted: m }
  )

  await client.sendMessage(m.chat, { audio: { url: sound }, mimetype: 'audio/mpeg' }, { quoted: m })
}
