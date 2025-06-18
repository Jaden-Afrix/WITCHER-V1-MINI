module.exports = {
  name: "setgcname",
  alias: ["setgroupname", "gcname"],
  desc: "Change the group name",
  type: "group",
  start: async (killua, m, { args }) => {
    try {
      if (!m.isGroup) {
        return await killua.sendMessage(m.chat, { text: "❌ This command can only be used in groups." }, { quoted: m });
      }

      // Check if bot is admin
      const botNumber = killua.user.id.split(":")[0] + "@s.whatsapp.net";
      const groupMetadata = await killua.groupMetadata(m.chat);
      const botIsAdmin = groupMetadata.participants.find(user => user.id === botNumber)?.admin !== null;

      if (!botIsAdmin) {
        return await killua.sendMessage(m.chat, { text: "❌ I need to be an admin to change the group name." }, { quoted: m });
      }

      if (!args || args.length === 0) {
        return await killua.sendMessage(m.chat, { text: "❗ Please provide a new group name.\n\nUsage: .setgcname New Group Name" }, { quoted: m });
      }

      const newName = args.join(" ");

      await killua.groupUpdateSubject(m.chat, newName);

      await killua.sendMessage(m.chat, { text: `✅ Successfully changed the group name to:\n*${newName}*` }, { quoted: m });
    } catch (error) {
      await killua.sendMessage(m.chat, { text: `❌ Failed to change group name:\n${error.message}` }, { quoted: m });
    }
  }
};
