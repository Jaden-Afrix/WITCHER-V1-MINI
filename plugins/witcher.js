import axios from 'axios'
import { banner, sound, CHANNEL_BUTTON } from '../config.js'

export const name = 'witch'
export const command = ['witch']
export const description = 'ChatGPT-powered replies about WITCHER-V1-MINI only'
export const ownerOnly = false

const OPENAI_API_KEY = '7902cbef76b269e176'

export async function execute(m, { client, args }) {
  const prompt = args.join(' ').trim()
  if (!prompt) {
    return client.sendMessage(m.chat, {
      image: { url: banner },
      caption: `🤖 *WITCHER-V1-MINI ChatBot*\n\nPlease ask me something about the WhatsApp bot WITCHER-V1-MINI.`,
      buttons: [CHANNEL_BUTTON]
    }, { quoted: m })
  }

  // Restrict conversation only to WITCHER-V1-MINI topics
  const systemMessage = `You are a helpful assistant only answering questions about the WhatsApp bot WITCHER-V1-MINI. Do not answer anything else.`

  try {
    const res = await axios.post(
      'https://api.nexoracle.com/ai/chatgpt-v4',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': OPENAI_API_KEY
        }
      }
    )

    const reply = res.data.result || 'Sorry, I could not get a response.'

    await client.sendMessage(m.chat, { audio: { url: sound }, mimetype: 'audio/mp4' }, { quoted: m })

    return client.sendMessage(m.chat, {
      text: reply
    }, { quoted: m })

  } catch (e) {
    return client.sendMessage(m.chat, {
      image: { url: banner },
      caption: `❌ Failed to get response. Please try again later.`,
      buttons: [CHANNEL_BUTTON]
    }, { quoted: m })
  }
}
