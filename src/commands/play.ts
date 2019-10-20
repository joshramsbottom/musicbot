import { Command, CommandMessage } from 'discord.js-commando';
import youtubeSearch, { YouTubeSearchResults } from 'youtube-search';

import MusicBot from '../MusicBot';
import QueueItem from '../queue/QueueItem';
import TrackQueue from '../queue/TrackQueue';

const ytOptions: youtubeSearch.YouTubeSearchOptions = {
  maxResults: 1,
  key: process.env.YOUTUBE_API_KEY,
};

export default class PlayCommand extends Command {
  private readonly trackQueue: TrackQueue;

  constructor(client: MusicBot) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Search YouTube and play a track',
      guildOnly: true,
      args: [
        {
          key: 'searchQuery',
          prompt: 'What track would you like to search for?',
          type: 'string',
        },
      ],
    });

    this.trackQueue = client.trackQueue;
  }

  async run(message: CommandMessage, { searchQuery }: { searchQuery: string }) {
    // Make sure author is in a voice channel
    const { voiceChannel } = message.member;
    if (!voiceChannel) {
      return message.say('You must be in a voice channel to use this command');
    }

    // Get top result from YouTube data API
    const { results } = await youtubeSearch(searchQuery, ytOptions);
    const result: YouTubeSearchResults = results[0];
    const { link, title } = result;

    // Add track to queue
    this.trackQueue.push(new QueueItem(title, link, voiceChannel))

    return message.say(`Playing ${title}`);
  }
}
