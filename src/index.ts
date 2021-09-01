import "./lib/env";
import { Client, Intents } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("Ready");
});

client.login(process.env.DISCORD_TOKEN);
