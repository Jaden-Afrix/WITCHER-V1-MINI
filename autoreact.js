const fs = require("fs");

const AUTO_REACT_FILE = "./database/autoreact.json";

// List of emojis to react with randomly
const REACT_EMOJIS = [
  "🔥", "😎", "✨", "💥", "💫", "💀", "👻", "😈", "👑", "🎉",
  "🎊", "💣", "🎯", "🚀", "🌟", "🌈", "⚡", "💎", "🐉", "🕷️",
  "🦇", "🧙‍♂️", "🧛‍♂️", "🧟‍♂️", "🦄", "🍀", "🎭", "🎮", "🎵",
  "🎤", "🎧", "🎬", "💥", "🌪️", "🌌", "☠️", "🛡️"
];

// Helper to load the autoreact state from JSON file
function loadAutoReact() {
  try {
    return JSON.parse(fs.readFileSync(AUTO_REACT_FILE, "utf-8"));
  } catch {
    return {};
  }
}

// Helper to save the autoreact state
function saveAutoReact(data) {
  fs.writeFileSync(AUTO_REACT_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "autoreact",
  alias: [],
  desc: "Toggle auto react to every message (Owner only)",
  type: "owner",

  start: async (killua, m, { text, isOwner, toReact }) => {
    if (!isOwner) {
      return m.reply("❌ Only the owner can use this command.");
    }

    if (!text) {
      return m.reply("❌ Please specify 'on' or 'off'. Example: .autoreact on");
    }

    const arg = text.toLowerCase();
    if (arg !== "on" && arg !== "off") {
      return m.reply("❌ Invalid option. Use 'on' or 'off'.");
    }

    const autoReactData = loadAutoReact();
    autoReactData[m.chat] = arg === "on";
    saveAutoReact(autoReactData);

    await toReact(arg === "on" ? "✅" : "❌");
    return m.reply(`Auto React is now *${arg.toUpperCase()}* for this chat.`);
  },

  // Call this function from your main message handler on every new message
  reactIfEnabled: async (killua, m) => {
    const autoReactData = loadAutoReact();
    if (autoReactData[m.chat]) {
      const emoji = REACT_EMOJIS[Math.floor(Math.random() * REACT_EMOJIS.length)];
      try {
        await killua.sendMessage(m.chat, { react: { text: emoji, key: m.key } });
      } catch (e) {
        console.error("Failed to react:", e);
      }
    }
  }
};
