const fs = require("fs");

// Replace with real storage later if needed
let antiCallEnabled = false;

module.exports = {
  name: "anticall",
  alias: ["antical", "anticaller"],
  desc: "Enable or disable Anti-Call feature",
  type: "owner",
  owner: true,
  start: async (killua, m, { text, toReact }) => {
    try {
      await toReact("📵").catch(() => {});

      const BANNER_IMG = "https://files.catbox.moe/17jcwv.jpg";
      const MENU_SOUND = "https://files.catbox.moe/dav1ns.mp3";
      const CHANNEL_URL = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

      const input = text?.trim().toLowerCase();

      if (input !== "on" && input !== "off") {
        return killua.sendMessage(m.chat, {
          image: { url: BANNER_IMG },
          caption: `⚙️ *Usage:* \n.anticall on\n.anticall off\n\nChoose whether to enable or disable Anti-Call.`,
          contextInfo: {
            externalAdReply: {
              title: "WITCHER-V1-MINI",
              body: "Anti-Call Usage",
              mediaType: 1,
              thumbnailUrl: BANNER_IMG,
              renderLargerThumbnail: true,
              sourceUrl: "https://github.com/Jaden-Afrix/WITCHER-V1-MINI"
            }
          }
        }, { quoted: m });
      }

      antiCallEnabled = input === "on";

      const statusMsg = antiCallEnabled
        ? "✅ Anti-Call has been *ENABLED*. Bot will block or warn callers."
        : "❌ Anti-Call has been *DISABLED*. Bot will allow incoming calls.";

      await killua.sendMessage(m.chat, {
        image: { url: BANNER_IMG },
        caption: statusMsg,
        contextInfo: {
          externalAdReply: {
            title: "WITCHER-V1-MINI",
            body: "Anti-Call Setting Updated",
            mediaType: 1,
            thumbnailUrl: BANNER_IMG,
            renderLargerThumbnail: true,
            sourceUrl: "https://github.com/Jaden-Afrix/WITCHER-V1-MINI"
          }
        }
      }, { quoted: m });

      // Send sound
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
      console.error("Anticall Error:", err);
      m.reply("❌ Failed to set Anti-Call. Try again.");
    }
  }
};
