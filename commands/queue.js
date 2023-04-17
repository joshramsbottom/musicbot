const { useQueue } = require("discord-player");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the first 10 songs in the queue"),
  async execute(interaction, client) {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
      return;
    }

    const tracks = queue.tracks.toArray();

    if (tracks.length === 0) {
      return interaction.reply({
        content: "There are no tracks in the queue",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle("Tracks")
      .setDescription(
        tracks
          .slice(0, 10)
          .map((track, idx) => `**${idx + 1}** [${track.title}](${track.url})`)
          .join("\n")
      )
      .setFooter({
        text: `${queue.tracks.size} tracks in total`,
      });

    return interaction.reply({
      embeds: [embed],
    });
  },
};
