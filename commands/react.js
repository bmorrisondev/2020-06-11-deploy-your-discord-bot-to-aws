module.exports = {
  // Define the prefix
  prefix: "!react",
  // Define a function to pass the message to
  fn: (msg) => {
    // Use a promise to wait for the question to reach Discord first
    msg.channel.send('Which emoji do you prefer?').then((question) => {
      // Have our bot guide the user by reacting with the correct reactions
      question.react('👍');
      question.react('👎');

      // Set a filter to ONLY grab those reactions & discard the reactions from the bot
      const filter = (reaction, user) => {
        return ['👍', '👎'].includes(reaction.emoji.name) && !user.bot;
      };

      // Create the collector
      const collector = question.createReactionCollector(filter, {
        max: 1,
        time: 15000
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          msg.channel.send('Ran out of time ☹...');
        } else {
          // Grab the first reaction in the array
          let userReaction = collected.array()[0];
          // Grab the name of the reaction (which is the emoji itself)
          let emoji = userReaction._emoji.name;

          // Handle accordingly
          if (emoji === '👍') {
            msg.channel.send('Glad your reaction is 👍!');
          } else if (emoji === '👎') {
            msg.channel.send('Sorry your reaction is 👎');
          } else {
            // This should be filtered out, but handle it just in case
            msg.channel.send(`I dont understand ${emoji}...`);
          }
        }
      });
    });
  }
}