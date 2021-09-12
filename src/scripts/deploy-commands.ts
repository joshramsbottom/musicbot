import fs from "fs";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Command } from "discord.js";

require("../lib/env");

const { token, clientId, guildId } = process.env;

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".ts"));

const commands = commandFiles.map((file) => {
    const command: Command = require(`./commands/${file}`);
    return new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .toJSON();
});

const rest = new REST({ version: "9" }).setToken(token!);

(async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log("Successfully registered application commands.");
    } catch (error) {
        console.error(error);
    }
})();
