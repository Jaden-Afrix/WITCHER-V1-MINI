module.exports = {
  name: "add",
  alias: [],
  desc: "Add a user to the group by reply or number",
  type: "group",
  start: async (killua, m, { args, isBotAdmin }) => {
    try {
      if (!m.isGroup) return await killua.sendMessage(m.chat, { text: "⚠️ This command can only be used in groups." }, { quoted: m });
      if (!isBotAdmin) return await killua.sendMessage(m.chat, { text: "❌ I need to be an admin to add users to the group." }, { quoted: m });

      let userToAdd;

      if (m.quoted) {
        userToAdd = m.quoted.sender;
      } else if (args.length > 0) {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.length < 8) return await killua.sendMessage(m.chat, { text: "❌ Please provide a valid phone number." }, { quoted: m });
        userToAdd = number.includes("@s.whatsapp.net") ? number : number + "@s.whatsapp.net";
      } else {
        return await killua.sendMessage(m.chat, { text: "❗️ Reply to a user or provide their number to add.\n\nExample: .add 263771234567" }, { quoted: m });
      }

      await killua.groupParticipantsUpdate(m.chat, [userToAdd], "add");

      await killua.sendMessage(m.chat, { text: `✅ Added @${userToAdd.split("@")[0]} to the group!`, mentions: [userToAdd] }, { quoted: m });

    } catch (error) {
      if (error.status === 403) {
        await killua.sendMessage(m.chat, { text: "❌ I don't have permission to add this user, or they have privacy settings blocking adds." }, { quoted: m });
      } else {
        await killua.sendMessage(m.chat, { text: `❌ Failed to add user: ${error.message}` }, { quoted: m });
      }
    }
  }
};
