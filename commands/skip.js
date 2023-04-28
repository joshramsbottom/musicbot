const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current track"),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (queue) {
      await interaction.reply(`⏭️ Skipping ${queue.currentTrack}`);
      queue.node.skip();
    }
  },
};
