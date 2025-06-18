const fs = require("fs");
const path = require("path");

const AUTO_BIO_FILE = path.join(__dirname, "../database/autobio.json");

// Elite, mature, all caps and bold bios
const BIOS = [
  "*WITCHER-V1-MINI IS DOMINATING THE CHAT 🔥*",
  "*POWERED BY ALPHA-BLAKE, THE MASTERMIND 👑*",
  "*YOUR ELITE WHATSAPP COMPANION 🤖*",
  "*GUARDING THIS CHANNEL WITH STEEL AND CODE 🛡️*",
  "*MAGIC AND TECH FUSED INTO PERFECTION ✨*",
  "*JOIN THE ELITE CIRCLE FOR EXCLUSIVE UPDATES 🔮*",
  "*ALWAYS ALERT, ALWAYS READY, ALWAYS WITCHER ⚡*"
];

// Helper to load autobio state from JSON
function loadAutoBio() {
  try {
    return JSON.parse(fs.readFileSync(AUTO_BIO_FILE, "utf-8"));
  } catch {
    return {
      enabled: false,
      currentIndex: 0,
      lastUpdate: 0
    };
  }
}

// Helper to save autobio state
function saveAutoBio(data) {
  fs.writeFileSync(AUTO_BIO_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "autobio",
  alias: [],
  desc: "Auto update bot bio every 3 hours (Owner only)",
  type: "owner",

  start: async (killua, m, { text, isOwner, toReact }) => {
    if (!isOwner) {
      return m.reply("❌ Only the owner can use this command.");
    }

    if (!text) {
      return m.reply("❌ Please specify 'on' or 'off'. Example: .autobio on");
    }

    const arg = text.toLowerCase();
    if (arg !== "on" && arg !== "off") {
      return m.reply("❌ Invalid option. Use 'on' or 'off'.");
    }

    const autobioState = loadAutoBio();
    autobioState.enabled = arg === "on";
    if (autobioState.enabled) {
      autobioState.lastUpdate = 0; // reset timer so it updates immediately
    }
    saveAutoBio(autobioState);

    await toReact(arg === "on" ? "✅" : "❌");
    return m.reply(`Auto Bio is now *${arg.toUpperCase()}*.`);
  },

  // Call this in your main loop/tick (every few minutes) to check and update bio if needed
  autoUpdateBio: async (killua) => {
    const autobioState = loadAutoBio();
    if (!autobioState.enabled) return;

    const now = Date.now();
    // 3 hours = 10800000 ms
    if (now - autobioState.lastUpdate < 10800000) return; // not time yet

    // Cycle to next bio message
    autobioState.currentIndex = (autobioState.currentIndex + 1) % BIOS.length;
    const newBio = BIOS[autobioState.currentIndex];

    try {
      // Set the bot's own status (bio)
      await killua.updateProfileStatus(newBio);
      autobioState.lastUpdate = now;
      saveAutoBio(autobioState);
      console.log(`[AutoBio] Updated bio to: "${newBio}"`);
    } catch (e) {
      console.error("[AutoBio] Failed to update bio:", e);
    }
  }
};
