module.exports = {
  // Define the prefix
  prefix: "!collector",
  // Define a function to pass the message to
  fn: (msg) => {
    // Filters define what kinds of messages should be collected
    let filter = (msg) => !msg.author.bot;
    // Options define how long the collector should remain open
    //    or the max number of messages it will collect
    let options = {
      max: 2,
      time: 15000
    };
    let collector = msg.channel.createMessageCollector(filter, options);

    // The 'collect' event will fire whenever the collector receives input
    collector.on('collect', (m) => {
      console.log(`Collected ${m.content}`);
    });

    // The 'end' event will fire when the collector is finished.
    collector.on('end', (collected) => {
      console.log(`Collected ${collected.size} items`);
    });

    msg.reply('What is your favorite color?');
  }
}