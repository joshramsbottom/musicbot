module.exports = {
  name: "error",
  execute(queue, error) {
    console.log(`General player error event: ${error.message}`);
    console.log(error);
  },
};
