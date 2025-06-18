const fs = require("fs");
const { default: generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");

module.exports = {
  name: "allmenu",
  alias: ["menu", "help"],
  desc: "Show all commands",
  type: "main",
  start: async (killua, m, { pushName, toReact }) => {
    try {
      await toReact("📜").catch(() => {});

      const BANNER_IMG = "https://files.catbox.moe/17jcwv.jpg";
      const MENU_SOUND = "https://files.catbox.moe/dav1ns.mp3";

      const channelButton = {
        index: 1,
        urlButton: {
          displayText: "🔮 Join Official Channel",
          url: "https://whatsapp.com/channel/0029VbAxoHNF6sn7hhz2Ss24"
        }
      };

      const menuText = `
╭──「 𝐖𝐈𝐓𝐂𝐇𝐄𝐑-𝐕𝟏-𝐌𝐈𝐍𝐈 」─
│
│ ⭒ *User* : ${pushName || "User"}
│ ⭒ *Prefix* : [ . /! ]
│ ⭒ *Commands* : 29
│
├───「 𝐎𝐖𝐍𝐄𝐑 」──
│ > .setpp
│ > .anticall
│ > .self
│ > .private
│ > .public
│ > .autoreact
│ > .autobio
│
├───「 𝐆𝐑𝐎𝐔𝐏 」──
│ > .antimention
│ > .antilink
│ > .add
│ > .join
│ > .leave
│ > .setgcname
│ > .linkgc
│
├───「 𝐁𝐔𝐆 」───
│ > .kill
│ > .bugx
│ > .potion
│ > .witchcraft
│ > .scambomb
│ > .alpha
│ > .allinone
│ > .ice
│
├───「 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 」──
│ > .apk
│ > .mediafire
│ > .play
│ > .play2
│ > .play3
│ > .gitclone
│
├───「 𝐀𝐈 」───
│ > .ai
│ > .deepseek
│ > .witch
│ > .magic
│
╰───「 𝐎𝐓𝐇𝐄𝐑𝐒 」──
   > .hack
   > .channel
   > .repo
   > .help

𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑳𝑷𝑯𝑨-𝑿`;

      await killua.sendMessage(m.chat, {
        image: { url: BANNER_IMG },
        caption: menuText,
        contextInfo: {
          externalAdReply: {
            title: "WITCHER-V1-MINI",
            body: "All Commands Menu",
            mediaType: 1,
            thumbnailUrl: BANNER_IMG,
            renderLargerThumbnail: true,
            sourceUrl: "https://github.com/Jaden-Afrix/WITCHER-V1-MINI"
          }
        }
      }, { quoted: m });

      await killua.sendMessage(m.chat, {
        audio: { url: MENU_SOUND },
        mimetype: "audio/mp4",
        ptt: false
      }, { quoted: m });

      await killua.sendMessage(m.chat, {
        text: "🔗 Join our official WhatsApp Channel for updates!",
        footer: "WITCHER-V1-MINI",
        templateButtons: [channelButton]
      }, { quoted: m });

    } catch (error) {
      console.error("Menu Error:", error);
      await killua.sendMessage(m.chat, { 
        text: "❌ Failed to display menu. Please try again later." 
      }, { quoted: m });
    }
  }
};
