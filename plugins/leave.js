module.exports = {
  name: "leave",
  alias: ["exit", "bye"],
  desc: "Make the bot leave the current group with a cool farewell message",
  type: "group",
  start: async (killua, m) => {
    try {
      if (!m.isGroup) {
        return await killua.sendMessage(m.chat, { text: "❌ Sorry, this command only works inside groups." }, { quoted: m });
      }

      const groupMetadata = await killua.groupMetadata(m.chat);
      const groupName = groupMetadata.subject || "this group";

      const farewellMessage = `
👋 *Goodbye, everyone!*

I’m the mighty 𝐖𝐈𝐓𝐂𝐇𝐄𝐑 𝐕𝟏 𝐌𝐈𝐍𝐈 bot, and it’s time for me to leave *${groupName}*.

Thank you all for having me here. It was an honor to serve you with commands and magic!

If you need me again, just summon me back. Until then, stay awesome and take care! ⚡️✨
`;

      // Send the farewell message
      await killua.sendMessage(m.chat, { text: farewellMessage.trim() }, { quoted: m });

      // Wait a bit before leaving so message is seen
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Leave the group
      await killua.groupLeave(m.chat);

      // Optionally, send a log or confirmation to owner (can be added here if you want)

    } catch (error) {
      await killua.sendMessage(m.chat, { text: `❌ Oops! Couldn't leave the group due to an error:\n${error.message}` }, { quoted: m });
    }
  }
};
