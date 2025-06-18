const fs = require("fs");

module.exports = {
  name: "self",
  alias: [],
  desc: "Set bot to self mode (only responds to owner)",
  type: "owner",
  owner: true,
  start: async (killua, m, { toReact }) => {
    try {
      await toReact("🔒").catch(() => {});

      const BANNER_IMG = "https://files.catbox.moe/17jcwv.jpg";
      const MENU_SOUND = "https://files.catbox.moe/dav1ns.mp3";
      const CHANNEL_URL = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

      // Activate self mode
      killua.public = false;

      // Send banner with confirmation
      await killua.sendMessage(m.chat, {
        image: { url: BANNER_IMG },
        caption: "🔒 *Bot is now in SELF MODE!*\nOnly the owner can use commands.",
        contextInfo: {
          externalAdReply: {
            title: "WITCHER-V1-MINI",
            body: "Self Mode Activated",
            mediaType: 1,
            thumbnailUrl: BANNER_IMG,
            renderLargerThumbnail: true,
            sourceUrl: "https://github.com/Jaden-Afrix/WITCHER-V1-MINI"
          }
        }
      }, { quoted: m });

      // Send menu sound
      await killua.sendMessage(m.chat, {
        audio: { url: MENU_SOUND },
        mimetype: "audio/mp4",
        ptt: false
      }, { quoted: m });

      // Send channel button
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
      console.error("Self Command Error:", err);
      m.reply("❌ Failed to set self mode.");
    }
  }
};
