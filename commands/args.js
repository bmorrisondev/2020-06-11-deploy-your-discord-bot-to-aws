module.exports = {
  // Define the prefix
  prefix: "!args",
  // Define a function to pass the message to
  fn: (msg) => {
    const args = msg.content.split(' ');
    let messageContent = '';
    if (args.includes('foo')) {
      messageContent += 'bar ';
    }
    if (args.includes('bar')) {
      messageContent += 'baz ';
    }
    if (args.includes('baz')) {
      messageContent += 'foo ';
    }
    msg.reply(messageContent);
  }
}