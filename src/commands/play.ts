import { Command, CommandoClient, CommandMessage } from 'discord.js-commando';
import youtubeSearch, { YouTubeSearchResults } from 'youtube-search';

const ytOptions: youtubeSearch.YouTubeSearchOptions = {
  maxResults: 1,
  key: process.env.YOUTUBE_API_KEY,
};

class PlayCommand extends Command {

  constructor(client: CommandoClient) {
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
  }

  async run(message: CommandMessage, { searchQuery }: { searchQuery: string }) {
    // Get top result from YouTube data API
    const { results } = await youtubeSearch(searchQuery, ytOptions);
    const result: YouTubeSearchResults = results[0];
    const { link, title } = result;

    // Add track to queue

    return message.say(`Playing ${title}`);
  }
}

export default PlayCommand;
