import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';

class PlayCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Search YouTube and play a track',
    })
  }

  run(message: CommandMessage) {
    return message.say('Not ready yet!');
  }
}

export default PlayCommand;
