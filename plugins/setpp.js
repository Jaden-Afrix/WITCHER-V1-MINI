const fs = require("fs");
const { writeFile } = require("fs/promises");

module.exports = {
  name: "setpp",
  alias: ["setprofilepic", "setppbot"],
  desc: "Set bot's profile picture",
  type: "owner",
  owner: true,
  start: async (killua, m, { toReact, quoted, mime, prefix }) => {
    try {
      await toReact("🖼️").catch(() => {});

      const BANNER_IMG = "https://files.catbox.moe/17jcwv.jpg";
      const MENU_SOUND = "https://files.catbox.moe/dav1ns.mp3";

      // Ensure there's an image
      const qimg = m.quoted || m;
      const imgMime = qimg.mimetype || "";

      if (!imgMime.startsWith("image/")) {
        return m.reply(`❌ Please reply to or send an image with the command.`);
      }

      const media = await killua.downloadAndSaveMediaMessage(qimg, "ppbot.jpg");

      await killua.updateProfilePicture(killua.user.id, {
        url: media,
      });

      await killua.sendMessage(m.chat, {
        image: { url: BANNER_IMG },
        caption: `✅ Successfully updated profile picture.`,
        contextInfo: {
          externalAdReply: {
            title: "WITCHER-V1-MINI",
            body: "Profile Picture Updated",
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

      fs.unlinkSync(media); // cleanup temp image

    } catch (err) {
      console.error("SetPP Error:", err);
      m.reply("❌ Failed to set profile picture. Make sure you replied to a valid image.");
    }
  }
};
