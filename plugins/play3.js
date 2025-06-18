import fetch from 'node-fetch'
import { banner, sound, CHANNEL_BUTTON } from '../config.js'

export const name = 'play3'
export const command = ['play3']
export const tags = ['download']
export const description = 'Download and send music/audio (variant 3)'
export const ownerOnly = false

export async function execute(m, { client, args }) {
  if (!args[0]) return client.sendMessage(m.chat, {
    image: { url: banner },
    caption: `*🎧 𝐖𝐈𝐓𝐂𝐇𝐄𝐑-𝐕𝟏-𝐌𝐈𝐍𝐈 - Music Downloader 3*\n\n💡 *Usage:* play3 <song name>\n🔍 *Example:* play3 burna boy last last`,
    buttons: [CHANNEL_BUTTON],
  }, { quoted: m })

  const query = encodeURIComponent(args.join(' '))
  const API_KEY = "7902cbef76b269e176"
  const url = `https://api.nexoracle.com/downloader/yt-audio2?apikey=${API_KEY}&q=${query}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (!data?.url) return client.sendMessage(m.chat, { text: '❌ Audio not found. Try again.' }, { quoted: m })

    await client.sendMessage(m.chat, { audio: { url: sound }, mimetype: 'audio/mp4' }, { quoted: m })

    await client.sendMessage(m.chat, {
      audio: { url: data.url },
      mimetype: 'audio/mp4',
      caption: `✅ Download successful: ${data.title || 'Audio file'}`,
    }, { quoted: m })

  } catch {
    client.sendMessage(m.chat, { text: '⚠️ Failed to download. Please try again.' }, { quoted: m })
  }
}
