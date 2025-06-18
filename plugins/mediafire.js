import axios from 'axios'
import { banner, sound, CHANNEL_BUTTON } from '../config.js'

export const name = 'mediafire'
export const command = ['mediafire']
export const tags = ['downloader']
export const description = 'Download file from Mediafire link'
export const ownerOnly = false

export async function execute(m, { client, args }) {
  if (!args[0]) {
    return client.sendMessage(m.chat, {
      image: { url: banner },
      caption: `*📥 𝐖𝐈𝐓𝐂𝐇𝐄𝐑-𝐕𝟏-𝐌𝐈𝐍𝐈 - Mediafire Downloader*\n\n💡 *Usage:* mediafire <mediafire-link>\n🔗 *Example:* mediafire https://www.mediafire.com/file/xxxx/file.zip`,
      buttons: [CHANNEL_BUTTON]
    }, { quoted: m })
  }

  try {
    const res = await axios.get(`https://api.nexoracle.com/downloader/media-fire?apikey=7902cbef76b269e176&url=${encodeURIComponent(args[0])}`)
    const result = res.data.result
    const { url, filename, filesize } = result

    await client.sendMessage(m.chat, { audio: { url: sound }, mimetype: 'audio/mp4' }, { quoted: m })

    await client.sendMessage(m.chat, {
      document: { url },
      fileName: filename,
      mimetype: 'application/octet-stream',
      caption: `✅ *Download Successful*\n\n📁 *File:* ${filename}\n📦 *Size:* ${filesize}\n\n🔗 *Source:* Mediafire`
    }, { quoted: m })

  } catch (e) {
    return client.sendMessage(m.chat, {
      image: { url: banner },
      caption: `❌ Failed to fetch the file.\n\nMake sure the Mediafire link is correct and try again.`,
      buttons: [CHANNEL_BUTTON]
    }, { quoted: m })
  }
}
