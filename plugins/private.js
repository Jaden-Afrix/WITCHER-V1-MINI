const fs = require("fs");

module.exports = {
  name: "private",
  alias: [],
  desc: "Bot will respond only to the owner",
  type: "owner",
  owner: true,
  start: async (killua, m, { toReact, sender }) => {
    try {
      await toReact("🔐").catch(() => {});

      const BANNER_IMG = "https://files.catbox.moe/17jcwv.jpg";
      const MENU_SOUND = "https://files.catbox.moe/dav1ns.mp3";
      const CHANNEL_URL = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

      // Check if the command is used by the real owner
      const ownerNumber = killua.user?.id?.split(":")[0]?.replace(/\D/g, "");

      if (!sender.includes(ownerNumber)) {
        return killua.sendMessage(m.chat, {
          text: "🖕🏽 You ain't my f*cking owner, dumbass. Go bark somewhere else 💀💩",
        }, { quoted: m });
      }

      // Set to private mode
      killua.public = false;

      // Send confirmation with banner
      await killua.sendMessage(m.chat, {
        image: { url: BANNER_IMG },
        caption: "🔐 *PRIVATE MODE ENABLED*\nNow only the owner can use me.",
        contextInfo: {
          externalAdReply: {
            title: "WITCHER-V1-MINI",
            body: "Private Mode Activated",
            mediaType: 1,
            thumbnailUrl: BANNER_IMG,
            renderLargerThumbnail: true,
            sourceUrl: "https://github.com/Jaden-Afrix/WITCHER-V1-MINI"
          }
        }
      }, { quoted: m });

      // Play bot sound
      await killua.sendMessage(m.chat, {
        audio: { url: MENU_SOUND },
        mimetype: "audio/mp4",
        ptt: false
      }, { quoted: m });

      // Send channel invite
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
      console.error("Private Command Error:", err);
      m.reply("❌ Failed to enable private mode.");
    }
  }
};
