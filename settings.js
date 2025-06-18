// settings.js
// Central configuration for WITCHER-V1-MINI bot

export const settings = {
  botName: 'WITCHER-V1-MINI',
  ownerName: 'ALPHA-BLAKE',
  ownerNumbers: ['+254780931677', '+263784812740'],
  prefix: '.',
  version: '1.0.0',
  apiKeys: {
    nexoracle: '7902cbef76b269e176',
  },
  defaultMessages: {
    unauthorized: '🚫 Only the supreme witcher can do that!',
    waiting: '⌛ Processing your command...',
    error: '❌ An error occurred, try again later.',
  },
  features: {
    autoReply: false,
    autoVoice: false,
    antiLink: true,
    antiLinkKick: false,
  },
  limits: {
    cooldown: 0, // milliseconds, 0 means no cooldown
  }
}
