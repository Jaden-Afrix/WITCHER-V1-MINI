import { banner, sound } from '../config.js'

export const name = 'repo'
export const command = ['repo']
export const description = 'Sends the official WITCHER-V1-MINI bot repository link'

const REPO_LINK = 'https://github.com/Jaden-Afrix/WITCHER-V1-MINI'

export async function execute(m, { client }) {
  const userMention = m.sender.includes('@s.whatsapp.net') ? `@${m.sender.split('@')[0]}` : ''

  await client.sendMessage(
    m.chat,
    {
      image: { url: banner },
      caption: `${userMention} here’s the official *𝐖𝐈𝐓𝐂𝐇𝐄𝐑 𝐕𝟏 𝐌𝐈𝐍𝐈* repository:\n\n${REPO_LINK}\n\nFeel free to check, contribute, or report issues!`,
      footer: '© ALPHA-BLAKE | WITCHER Bot',
      buttons: [
        {
          buttonId: 'repo_open',
          buttonText: { displayText: '📂 Open Repo' },
          type: 1
        }
      ],
      headerType: 4
    },
    { quoted: m }
  )

  await client.sendMessage(m.chat, { audio: { url: sound }, mimetype: 'audio/mpeg' }, { quoted: m })
}
