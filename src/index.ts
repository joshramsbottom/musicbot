import "./lib/env";
import fs from "fs";
import { Client, Command, Intents } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".ts"));

client.commands = Object.fromEntries(
    commandFiles.map((file) => {
        const command: Command = require(`./commands/${file}`);
        return [command.name, command];
    })
);

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
});

client.once("ready", () => {
    console.log("Ready");
});

client.login(process.env.DISCORD_TOKEN);
