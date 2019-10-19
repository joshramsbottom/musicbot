import { CommandoClient } from 'discord.js-commando';
import * as path from 'path';

import './util/secrets';

const client = new CommandoClient({
  commandPrefix: '!',
  owner: '183873160779792385',
});

client.registry
  .registerDefaultTypes()
  .registerGroup(['music', 'Music commands'])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
  client.user.setActivity('!help');
});

client.on('error', console.error);

client.login(process.env.DISCORD_TOKEN);
