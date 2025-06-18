import { banner, sound, CHANNEL_BUTTON } from '../config.js'
import { spawn } from 'child_process'
import fs from 'fs'

export const name = 'gitclone'
export const command = ['gitclone']
export const tags = ['tools']
export const description = 'Clone a GitHub repository and get it as a zip file'
export const ownerOnly = false

export async function execute(m, { client, args }) {
  if (!args[0] || !args[0].includes('github.com')) {
    return client.sendMessage(m.chat, {
      image: { url: banner },
      caption: `*🔧 𝐖𝐈𝐓𝐂𝐇𝐄𝐑-𝐕𝟏-𝐌𝐈𝐍𝐈 - GitHub Clone Tool*\n\n💡 *Usage:* gitclone <github-link>\n🔗 *Example:* gitclone https://github.com/user/repo`,
      buttons: [CHANNEL_BUTTON],
    }, { quoted: m })
  }

  const repoUrl = args[0]
  const repoName = repoUrl.split('/').pop()?.replace(/\.git$/, '') || `repo_${Date.now()}`
  const zipPath = `/tmp/${repoName}.zip`

  client.sendMessage(m.chat, { audio: { url: sound }, mimetype: 'audio/mp4' }, { quoted: m })
  client.sendMessage(m.chat, { text: `⏳ Cloning repository: ${repoName}...\nPlease wait...` }, { quoted: m })

  const git = spawn('git', ['clone', '--depth=1', repoUrl, `/tmp/${repoName}`])

  git.on('close', (code) => {
    if (code !== 0) {
      return client.sendMessage(m.chat, { text: '❌ Failed to clone. Check the URL and try again.' }, { quoted: m })
    }

    // Zip the cloned folder
    const zip = spawn('zip', ['-r', zipPath, '.'], { cwd: `/tmp/${repoName}` })

    zip.on('close', async () => {
      const fileSize = fs.statSync(zipPath).size
      if (fileSize > 50 * 1024 * 1024) {
        fs.unlinkSync(zipPath)
        return client.sendMessage(m.chat, { text: '⚠️ File too large to send. Try a smaller repo.' }, { quoted: m })
      }

      await client.sendMessage(m.chat, {
        document: { url: `file://${zipPath}` },
        mimetype: 'application/zip',
        fileName: `${repoName}.zip`,
        caption: `✅ GitHub repo cloned successfully: *${repoName}*`,
      }, { quoted: m })

      // Cleanup
      fs.rmSync(`/tmp/${repoName}`, { recursive: true, force: true })
      fs.unlinkSync(zipPath)
    })
  })
}
