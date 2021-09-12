import { Command, CommandInteraction } from "discord.js";

const ping: Command = {
    name: "ping",
    description: "Replies with Pong!",
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply("Pong!");
    },
};

export default ping;
