module.exports = {
  name: "playerError",
  execute(queue, error) {
    console.log(`Player stream error event: ${error.message}`);
    console.log(error);
  },
};
