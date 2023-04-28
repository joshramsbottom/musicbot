const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a track")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The search query to use on youtube")
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply({
        content: "You are not connected to a voice channel",
        ephemeral: true,
      });
    }
    const query = interaction.options.getString("query", true);

    await interaction.deferReply();

    try {
      const { track } = await interaction.client.player.play(channel, query, {
        nodeOptions: {
          metadata: interaction,
          leaveOnStop: true,
          leaveOnStopCooldown: 300000,
          leaveOnEnd: true,
          leaveOnEndCooldown: 300000,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 300000,
          volume: 25,
        },
      });

      return interaction.followUp(`💽 **${track}** added to queue`);
    } catch (error) {
      return interaction.followUp(`Something went wrong: ${error}`);
    }
  },
};
