const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Set playback volume")
    .addIntegerOption((option) =>
      option
        .setName("volume")
        .setDescription("The volume level % to set")
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true)
    ),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    const volume = interaction.options.getInteger("volume");

    if (queue) {
      queue.node.setVolume(volume);
      return interaction.reply(`🎚️ Volume changed to ${volume}`);
    }
  },
};
