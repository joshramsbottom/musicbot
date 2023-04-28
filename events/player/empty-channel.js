module.exports = {
  name: "emptyChannel",
  execute(queue, error) {
    queue.metadata.channel.send("🍃 Leaving the channel due to inactivity");
  },
};
