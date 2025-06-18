const fs = require("fs");

module.exports = {
  name: "owner",
  alias: [],
  desc: "Sends the real owner's contact",
  type: "main",
  start: async (killua, m, { toReact, pushName }) => {
    try {
      await toReact("👑").catch(() => {});

      const BANNER_IMG = "https://files.catbox.moe/17jcwv.jpg";
      const MENU_SOUND = "https://files.catbox.moe/dav1ns.mp3";
      const CHANNEL_URL = "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24";

      // Owner numbers
      const owners = [
        { number: "254780931677", name: "ALPHA-BLAKE 🇰🇪" },
        { number: "263784812740", name: "ALPHA-BLAKE 🇿🇼" }
      ];

      // Create vCard contacts array
      const contacts = owners.map(({ number, name }) => ({
        displayName: name,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${number}:${number}\nEND:VCARD`
      }));

      // Tag the user who sent the command
      const mentionUser = `@${m.sender.split("@")[0]}`;
      const tagMsg = {
        text: `Yo ${mentionUser}! Meet the legends behind 𝐖𝐈𝐓𝐂𝐇𝐄𝐑 𝐕𝟏 𝐌𝐈𝐍𝐈 — my epic owners, the true kings of this realm 👑🔥`,
        mentions: [m.sender]
      };

      await killua.sendMessage(m.chat, tagMsg, { quoted: m });

      // Send owner contact(s)
      for (const contact of contacts) {
        await killua.sendMessage(m.chat, {
          contacts: {
            displayName: contact.displayName,
            contacts: [contact]
          }
        }, { quoted: m });
      }

      // Banner image
      await killua.sendMessage(m.chat, {
        image: { url: BANNER_IMG },
        caption: `👑 *ALPHA-BLAKE*\nThese are the legendary developers of WITCHER-V1-MINI.`,
        contextInfo: {
          externalAdReply: {
            title: "WITCHER-V1-MINI",
            body: "Bot Developer Contact",
            mediaType: 1,
            thumbnailUrl: BANNER_IMG,
            renderLargerThumbnail: true,
            sourceUrl: "https://github.com/Jaden-Afrix/WITCHER-V1-MINI"
          }
        }
      }, { quoted: m });

      // Sound after contact
      await killua.sendMessage(m.chat, {
        audio: { url: MENU_SOUND },
        mimetype: "audio/mp4",
        ptt: false
      }, { quoted: m });

      // Channel Button
      await killua.sendMessage(m.chat, {
        text: "🔗 Stay Updated – Join the Official Channel:",
        footer: "WITCHER-V1-MINI",
        templateButtons: [{
          index: 1,
          urlButton: {
            displayText: "🔮 Join Channel",
            url: CHANNEL_URL
          }
        }]
      }, { quoted: m });

    } catch (err) {
      console.error("Owner Command Error:", err);
      m.reply("❌ Failed to send owner's contact.");
    }
  }
};
