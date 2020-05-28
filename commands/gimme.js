module.exports = {
  // Define the prefix
  prefix: "!gimme",
  // Define a function to pass the message to
  fn: (msg) => {
    // Split the arguments
    const args = msg.content.split(' ');

    // Check the first argument (skipping the command itself)
    if (args[1] === 'smiley') {
      if (args.length < 3) {
        // Filter out any bot messages
        let filter = (msg) => !msg.author.bot;
        // Set our options to expect 1 message, and timeout after 15 seconds
        let options = {
          max: 1,
          time: 15000
        };
        let collector = msg.channel.createMessageCollector(filter, options);

        collector.on('end', (collected, reason) => {
          // If the collector ends for 'time', display a message to the user
          if (reason === 'time') {
            msg.reply('Ran out of time ☹...');
          } else {
            // Convert the collection to an array and check the content of the message.
            //   Repsond accordingly
            switch (collected.array()[0].content) {
              case 'happy':
                msg.reply('😀');
                break;
              case 'sad':
                msg.reply('😢');
                break;
              default:
                msg.reply('I dont know that smiley...');
                break;
            }
          }
        });

        msg.reply('What kind of smiley do you like? (happy or sad)');
      } else {
        // If all arguments are already there, respond with the requested item
        switch (args[2]) {
          case 'happy':
            msg.reply('😀');
            break;
          case 'sad':
            msg.reply('😢');
            break;
          default:
            msg.reply('I dont know that smiley...');
            break;
        }
      }
    }

    if (args[1] === 'circle') {
      if (args.length < 3) {
        let filter = (msg) => !msg.author.bot;
        let options = {
          max: 1,
          time: 15000
        };
        let collector = msg.channel.createMessageCollector(filter, options);

        collector.on('end', (collected, reason) => {
          if (reason === 'time') {
            msg.reply('Ran out of time ☹...');
          } else {
            switch (collected.array()[0].content) {
              case 'red':
                msg.reply('🔴');
                break;
              case 'blue':
                msg.reply('🔵');
                break;
              default:
                msg.reply('I dont know that color...');
                break;
            }
          }
        });

        msg.reply('What color circle would you like? (blue or red)');
      } else {
        switch (args[2]) {
          case 'red':
            msg.reply('🔴');
            break;
          case 'blue':
            msg.reply('🔵');
            break;
          default:
            msg.reply('I dont know that color...');
            break;
        }
      }
    }
  }
}