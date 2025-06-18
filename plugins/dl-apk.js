import fetch from 'node-fetch'
import { banner, sound, CHANNEL_BUTTON } from '../config.js'

export const name = 'dl-apks'
export const command = ['apk']
export const tags = ['download']
export const description = 'Download APK files directly'
export const ownerOnly = false

export async function execute(m, { client, args }) {
  if (!args[0]) return client.sendMessage(m.chat, {
    image: { url: banner },
    caption: `*🧪 𝐖𝐈𝐓𝐂𝐇𝐄𝐑-𝐕𝟏-𝐌𝐈𝐍𝐈 - APK Downloader*\n\n💡 *Usage:* apk <app name>\n📥 *Example:* apk facebook lite`,
    footer: '',
    buttons: [CHANNEL_BUTTON],
  }, { quoted: m })

  const query = encodeURIComponent(args.join(' '))
  const API_KEY = "7902cbef76b269e176"
  const url = `https://api.nexoracle.com/downloader/apk?apikey=${API_KEY}&q=${query}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (!data || !data.url) {
      return client.sendMessage(m.chat, { text: '❌ APK not found or failed to fetch.' }, { quoted: m })
    }

    await client.sendMessage(m.chat, { audio: { url: sound }, mimetype: 'audio/mp4' }, { quoted: m })
    await client.sendMessage(m.chat, {
      document: { url: data.url },
      fileName: `${data.name || 'APK'}.apk`,
      mimetype: 'application/vnd.android.package-archive',
      caption: `✅ *APK Downloaded:*\n📦 *Name:* ${data.name || 'Unknown'}\n📥 *Size:* ${data.size || 'Unknown'}`
    }, { quoted: m })

  } catch (err) {
    client.sendMessage(m.chat, { text: '⚠️ Failed to download APK.' }, { quoted: m })
  }
}
