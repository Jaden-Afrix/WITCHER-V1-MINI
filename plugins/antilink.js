const linkRegex = /https?:\/\/[^\s]+/gi;

module.exports = {
  name: "antilink",
  alias: [],
  desc: "Anti Link: Deletes group links and kicks offenders after 3 warnings",
  type: "group",
  start: async (killua, m, { isAdmin, isBotAdmin, isOwner }) => {
    try {
      if (!m.isGroup) return;

      const senderId = m.sender;
      const senderNum = senderId.split("@")[0];

      if (isAdmin || isOwner) return; // Admins & owners are exempted

      if (!isBotAdmin) {
        return await killua.sendMessage(m.chat, {
          text: "⚠️ *ANTI-LINK IS ACTIVE*\nBut I’m not an admin, so I can’t enforce the rules. Please promote me!",
        }, { quoted: m });
      }

      if (!m.text || !linkRegex.test(m.text)) return;

      // Initialize warnings cache
      if (!global.antilinkCache) global.antilinkCache = {};
      if (!global.antilinkCache[m.chat]) global.antilinkCache[m.chat] = {};

      const warns = global.antilinkCache[m.chat][senderId] || 0;

      // Delete offending message
      await killua.sendMessage(m.chat, { delete: m.key });

      if (warns >= 2) {
        await killua.sendMessage(m.chat, {
          text: `🔥 *NO MERCY* 🔥\n@${senderNum}, this is your *3rd warning* for sending links! You’ve been kicked from *${m.name || "this group"}*.`,
          mentions: [senderId]
        }, { quoted: m });

        await killua.groupParticipantsUpdate(m.chat, [senderId], "remove");

        delete global.antilinkCache[m.chat][senderId];

      } else {
        global.antilinkCache[m.chat][senderId] = warns + 1;

        const remaining = 3 - (warns + 1);

        await killua.sendMessage(m.chat, {
          text: `⚠️ *WARNING ${warns + 1}/3* ⚠️\n@${senderNum}, sending links is *not allowed*. You have *${remaining} warning(s)* left before you get kicked.`,
          mentions: [senderId]
        }, { quoted: m });

        await killua.sendMessage(m.chat, {
          react: {
            text: ["👀", "💢", "🔥"][warns] || "⚠️",
            key: m.key
          }
        });
      }

    } catch (err) {
      console.error("ANTILINK ERROR:", err);
      await killua.sendMessage(m.chat, {
        text: "🚨 Something went wrong with AntiLink. Please try again later.",
      }, { quoted: m });
    }
  }
};
