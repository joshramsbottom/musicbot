import ytdl from "ytdl-core-discord";

import QueueItem from "./QueueItem";

export default class TrackQueue {
  private queue: QueueItem[] = [];
  private currentTrack: QueueItem | null = null;

  public push(item: QueueItem) {
    this.queue.push(item);

    if (this.isStartable()) this.playNext();
  }

  private isStartable() {
    return this.currentTrack === null;
  }

  private async playNext() {
    this.currentTrack = this.queue.shift()!;
    const { channel, link } = this.currentTrack;

    // Join channel
    const connection = await channel.join();
    // Play track
    const dispatcher = connection.playOpusStream(await ytdl(link));
    // Set up handler when track ends
    dispatcher.on('end', () => this.onTrackFinished());
  }

  private onTrackFinished() {
    if (!this.isEmpty()) {
      this.playNext();
    }
  }

  private isEmpty() {
    return this.queue.length === 0;
  }
}
