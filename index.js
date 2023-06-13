require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Player } = require("discord-player");
const fs = require("node:fs");
const path = require("node:path");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.player = new Player(client);
client.player.extractors.loadDefault();
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    }
  });

const eventsPath = path.join(__dirname, "events");
fs.readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });

const playerEventsPath = path.join(__dirname, "events", "player");
fs.readdirSync(playerEventsPath)
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const filePath = path.join(playerEventsPath, file);
    const event = require(filePath);
    if (event.once) {
      client.player.events.once(event.name, (...args) => event.execute(...args));
    } else {
      client.player.events.on(event.name, (...args) => event.execute(...args));
    }
  });

client.login(process.env.TOKEN);
