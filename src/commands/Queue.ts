import { Command, CommandoMessage } from 'discord.js-commando';
import TrackQueue from '../queue/TrackQueue';
import MusicBot from '../MusicBot';

export default class QueueCommand extends Command {
  private readonly trackQueue: TrackQueue;

  constructor(client: MusicBot) {
    super(client, {
      name: 'queue',
      group: 'music',
      memberName: 'queue',
      description: 'Show the queue of upcoming tracks',
      guildOnly: true,
    });

    this.trackQueue = client.trackQueue;
  }

  run(message: CommandoMessage) {
    return message.say(this.trackQueue.printQueue());
  }
}
