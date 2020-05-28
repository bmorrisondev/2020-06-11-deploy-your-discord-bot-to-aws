module.exports = {
  // Define the prefix
  prefix: "!dm",
  // Define a function to pass the message to
  fn: (msg) => {
    let messageContent = msg.content.replace('!dm', '');
    msg.member.send(messageContent);
  }
}