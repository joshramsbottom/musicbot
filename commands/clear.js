const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears all tracks in the queue"),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (queue) {
      queue.tracks.clear();
      return interaction.reply("🧹 Queue cleared");
    }
  },
};
