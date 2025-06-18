const fs = require("fs");

module.exports = {
  name: "public",
  alias: [],
  desc: "Bot will respond to everyone",
  type: "owner",
  owner: true,
  start: async (killua, m, { toReact, sender }) => {
    try {
      await toReact("🌍").catch(() => {});

      const BANNER_IMG = "https://files.catbox.moe/17jcwv.jpg";
      const MENU_SOUND = "https://files.catbox.moe/dav1ns.mp3";
      const CHANNEL_URL = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

      const ownerNumber = killua.user?.id?.split(":")[0]?.replace(/\D/g, "");

      if (!sender.includes(ownerNumber)) {
        return killua.sendMessage(m.chat, {
          text: "🚫 Who tf gave you the right to run my bot? You're not the damn owner 💀",
        }, { quoted: m });
      }

      // Set to public mode
      killua.public = true;

      // Confirm to owner
      await killua.sendMessage(m.chat, {
        image: { url: BANNER_IMG },
        caption: "🌍 *PUBLIC MODE ENABLED*\nEveryone can now use me.",
        contextInfo: {
          externalAdReply: {
            title: "WITCHER-V1-MINI",
            body: "Public Mode Activated",
            mediaType: 1,
            thumbnailUrl: BANNER_IMG,
            renderLargerThumbnail: true,
            sourceUrl: "https://github.com/Jaden-Afrix/WITCHER-V1-MINI"
          }
        }
      }, { quoted: m });

      // Play sound
      await killua.sendMessage(m.chat, {
        audio: { url: MENU_SOUND },
        mimetype: "audio/mp4",
        ptt: false
      }, { quoted: m });

      // Channel link
      await killua.sendMessage(m.chat, {
        text: "🔗 Join our official WhatsApp Channel for updates!",
        footer: "WITCHER-V1-MINI",
        templateButtons: [{
          index: 1,
          urlButton: {
            displayText: "🔮 Join Official Channel",
            url: CHANNEL_URL
          }
        }]
      }, { quoted: m });

    } catch (err) {
      console.error("Public Command Error:", err);
      m.reply("❌ Failed to enable public mode.");
    }
  }
};
