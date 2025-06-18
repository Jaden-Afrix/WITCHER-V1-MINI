import axios from 'axios'
import { banner, sound, CHANNEL_BUTTON } from '../config.js'

export const name = 'deepseek'
export const command = ['deepseek']
export const tags = ['ai', 'code']
export const description = 'AI coding assistant (DeepSeek 6.7B)'
export const ownerOnly = false

export async function execute(m, { client, args }) {
  const query = args.join(' ')
  if (!query) {
    return client.sendMessage(m.chat, {
      image: { url: banner },
      caption: `*💻 𝐖𝐈𝐓𝐂𝐇𝐄𝐑-𝐕𝟏-𝐌𝐈𝐍𝐈 - DeepSeek Coder*\n\n🔧 *Usage:* deepseek <code question>\n🧠 *Example:* deepseek write a python code to scrape a website`,
      buttons: [CHANNEL_BUTTON]
    }, { quoted: m })
  }

  try {
    const res = await axios.post(
      'https://api.nexoracle.com/ai/deepseek-coder-6.7b-base',
      { prompt: query },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': '7902cbef76b269e176'
        }
      }
    )

    await client.sendMessage(m.chat, { audio: { url: sound }, mimetype: 'audio/mp4' }, { quoted: m })

    return client.sendMessage(m.chat, {
      text: `🧠 *Prompt:* ${query}\n\n💻 *DeepSeek:* ${res.data.result}`
    }, { quoted: m })

  } catch (e) {
    return client.sendMessage(m.chat, {
      image: { url: banner },
      caption: `❌ DeepSeek failed to respond.\n\nCheck your prompt or try again later.`,
      buttons: [CHANNEL_BUTTON]
    }, { quoted: m })
  }
}
