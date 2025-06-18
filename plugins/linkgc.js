module.exports = {
  name: "linkgc",
  alias: ["gclink", "grouplink"],
  desc: "Get the invite link and description of the current group",
  type: "group",
  start: async (killua, m) => {
    try {
      if (!m.isGroup) {
        return await killua.sendMessage(m.chat, { text: "❌ This command works only inside groups." }, { quoted: m });
      }

      // Fetch group metadata
      const groupMetadata = await killua.groupMetadata(m.chat);

      // Check if invite link is accessible
      if (!groupMetadata.inviteCode) {
        return await killua.sendMessage(m.chat, { text: "❌ Unable to retrieve group invite link. I might not have enough permissions." }, { quoted: m });
      }

      const inviteLink = `https://chat.whatsapp.com/${groupMetadata.inviteCode}`;
      const groupDescription = groupMetadata.desc?.toString() || "No description set for this group.";

      const message = `
🔗 *Group Invite Link & Description*

Group: *${groupMetadata.subject}*

Description:
${groupDescription}

Invite Link:
${inviteLink}

Share this link to invite others to join this awesome group!
`;

      await killua.sendMessage(m.chat, { text: message.trim() }, { quoted: m });

    } catch (error) {
      await killua.sendMessage(m.chat, { text: `❌ Failed to get group info:\n${error.message}` }, { quoted: m });
    }
  }
};
