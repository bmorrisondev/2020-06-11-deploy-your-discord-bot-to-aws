module.exports = {
  // Define the prefix
  prefix: "!hello",
  // Define a function to pass the message to
  fn: (msg) => {
    msg.reply("world!")
  }
}