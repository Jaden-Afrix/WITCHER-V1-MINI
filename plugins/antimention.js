const fs = require("fs");

module.exports = {
  name: "antimention",
  alias: [],
  desc: "Anti Mention: Deletes @mentions and punishes repeat offenders",
  type: "group",
  start: async (killua, m, { isAdmin, isBotAdmin, isOwner }) => {
    try {
      if (!m.isGroup) return;

      const botId = killua.user.id.split(":")[0] + "@s.whatsapp.net";

      if (!m.mentionedJid || !m.mentionedJid.includes(botId)) return;

      const senderId = m.sender;
      const senderNum = senderId.split("@")[0];

      if (isAdmin || isOwner || senderId === botId) return;

      if (!isBotAdmin) {
        return await killua.sendMessage(m.chat, {
          text: "🧨 *ANTIMENTION ACTIVE* 🧨\nBut I can’t act because I’m *not an admin*. Promote me to enforce the rules.",
        }, { quoted: m });
      }

      // In-memory cache (you can make persistent later)
      if (!global.antimentionCache) global.antimentionCache = {};
      if (!global.antimentionCache[m.chat]) global.antimentionCache[m.chat] = {};

      const warns = global.antimentionCache[m.chat][senderId] || 0;

      // Delete mention message
      await killua.sendMessage(m.chat, { delete: m.key });

      if (warns >= 2) {
        await killua.sendMessage(m.chat, {
          text: `💀 *EXECUTED WITHOUT MERCY* 💀\n@${senderNum}, you reached *3/3 warnings*. You’ve been kicked for *tagging the demon*.`,
          mentions: [senderId]
        }, { quoted: m });

        await killua.groupParticipantsUpdate(m.chat, [senderId], "remove");

        delete global.antimentionCache[m.chat][senderId];

      } else {
        global.antimentionCache[m.chat][senderId] = warns + 1;

        const remaining = 3 - (warns + 1);

        await killua.sendMessage(m.chat, {
          text: `⚠️ *WARNING ${warns + 1}/3* ⚠️\n@${senderNum}, you dared to mention the *WITCHER-V1-MINI*. You have *${remaining} chance(s)* left.`,
          mentions: [senderId]
        }, { quoted: m });

        await killua.sendMessage(m.chat, {
          react: {
            text: ["😐", "💢", "👹"][warns] || "⚠️",
            key: m.key
          }
        });
      }

    } catch (err) {
      console.error("ANTIMENTION ERROR:", err);
      await killua.sendMessage(m.chat, {
        text: "🚨 Something went wrong with AntiMention. Please try again later.",
      }, { quoted: m });
    }
  }
};
