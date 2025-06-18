module.exports = {
  name: "join",
  alias: [],
  desc: "Join a group using an invite link",
  type: "group",
  start: async (killua, m, { args }) => {
    try {
      let link = "";

      if (m.quoted && m.quoted.text) {
        const text = m.quoted.text;
        const match = text.match(/(https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+)/);
        if (match) link = match[1];
      }

      if (!link && args.length > 0) {
        const text = args[0];
        const match = text.match(/(https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+)/);
        if (match) link = match[1];
      }

      if (!link) {
        return await killua.sendMessage(m.chat, { text: "❗️ Please reply to a group invite link or provide one.\n\nUsage: join <group link>" }, { quoted: m });
      }

      await killua.groupAcceptInvite(link);

      await killua.sendMessage(m.chat, { text: "✅ Successfully joined the group!" }, { quoted: m });
    } catch (error) {
      await killua.sendMessage(m.chat, { text: `❌ Failed to join the group:\n${error.message}` }, { quoted: m });
    }
  }
};
