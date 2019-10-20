import { VoiceChannel } from "discord.js";

export default class QueueItem {
  public readonly title: string;
  public readonly link: string;
  public readonly channel: VoiceChannel;

  constructor(title: string, link: string, channel: VoiceChannel) {
    this.title = title;
    this.link = link;
    this.channel = channel;
  }
}
