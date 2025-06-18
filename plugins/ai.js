import axios from 'axios'
import { banner, sound, CHANNEL_BUTTON } from '../config.js'

export const name = 'ai'
export const command = ['ai']
export const tags = ['ai']
export const description = 'Ask AI anything'
export const ownerOnly = false

export async function execute(m, { client, args }) {
  const prompt = args.join(' ')
  if (!prompt) {
    return client.sendMessage(m.chat, {
      image: { url: banner },
      caption: `*🤖 𝐖𝐈𝐓𝐂𝐇𝐄𝐑-𝐕𝟏-𝐌𝐈𝐍𝐈 - AI Chat*\n\n💡 *Usage:* ai <question>\n💬 *Example:* ai what is a black hole?`,
      buttons: [CHANNEL_BUTTON]
    }, { quoted: m })
  }

  try {
    const res = await axios.post(
      'https://api.nexoracle.com/ai/chatgpt-v4',
      { prompt },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': '7902cbef76b269e176'
        }
      }
    )

    await client.sendMessage(m.chat, { audio: { url: sound }, mimetype: 'audio/mp4' }, { quoted: m })

    return client.sendMessage(m.chat, {
      text: `💬 *Question:* ${prompt}\n\n🤖 *AI:* ${res.data.result}`
    }, { quoted: m })

  } catch (e) {
    return client.sendMessage(m.chat, {
      image: { url: banner },
      caption: `❌ AI failed to respond.\n\nCheck the prompt or try again later.`,
      buttons: [CHANNEL_BUTTON]
    }, { quoted: m })
  }
}
