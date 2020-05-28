const Discord = require('discord.js');

module.exports = {
  // Define the prefix
  prefix: "!survey",
  // Define a function to pass the message to
  fn: (msg) => {
    // Create an empty 'survey' object to hold the fields for our survey
    let survey = {};
    // We're going to use this as an index for the reactions being used.
    let reactions = [
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣"
    ]
    // Send a message to the channel to start gathering the required info
    msg.channel
      .send(
        'Welcome to the !survey command. What would you like to ask the community?'
      )
      .then(() => {
        // After each question, we setup a collector just like we did previously
        let filter = (msg) => !msg.author.bot;
        let options = {
          max: 1,
          time: 15000
        };

        return msg.channel.awaitMessages(filter, options);
      })
      .then((collected) => {
        // Lets take the input from the user and store it in our 'survey' object
        survey.question = collected.array()[0].content;
        // Ask the next question
        return msg.channel.send(
          'Great! How long should it go? (specified in seconds)'
        );
      })
      .then(() => {
        let filter = (msg) => !msg.author.bot;
        let options = {
          max: 1,
          time: 15000
        };

        return msg.channel.awaitMessages(filter, options);
      })
      .then((collected) => {
        // Adding some checks here to ensure the user entered a number.
        if (!isNaN(collected.array()[0].content)) {
          survey.timeout = collected.array()[0].content;
          // Ask the final question 
          return msg.channel.send(
            'Excellent. Now enter up to four options, separated by commas.'
          );
        } else {
          throw 'timeout_format_error';
        }
      })
      .then(() => {
        let filter = (msg) => !msg.author.bot;
        let options = {
          max: 1,
          time: 15000
        };

        return msg.channel.awaitMessages(filter, options);
      })
      .then((collected) => {
        // Split the answers by commas so we have an array to work with
        survey.answers = collected.array()[0].content.split(',');

        let surveyDescription = ""
        // Loop through the questions and create the 'description' for the embed
        survey.answers.forEach((question, index) => {
          surveyDescription += `${reactions[index]}: ${question}\n`;
        })

        // Create the embed object and send it to the channel
        let surveyEmbed = new Discord.MessageEmbed()
          .setTitle(`Survey: ${survey.question}`)
          .setDescription(surveyDescription)
        return msg.channel.send(surveyEmbed)
      })
      .then(surveyEmbedMessage => {
        // Create the initial reactions to embed for the members to see
        for (var i = 0; i < survey.answers.length; i++) {
          surveyEmbedMessage.react(reactions[i])
        }

        // Set a filter to ONLY grab those reactions & discard the reactions from the bot
        const filter = (reaction, user) => {
          return reactions.includes(reaction.emoji.name) && !user.bot;
        };

        // Use the timeout from our survey
        const options = {
          time: survey.timeout * 1000
        }

        // Create the collector
        return surveyEmbedMessage.awaitReactions(filter, options);
      })
      .then(collected => {
        // Convert the collection to an array
        let collectedArray = collected.array()
        // Map the collection down to ONLY get the emoji names of the reactions
        let collectedReactions = collectedArray.map(item => item._emoji.name)
        let reactionCounts = {}

        // Loop through the reactions and build an object that contains the counts for each reaction
        // It will look something like this:
        // {
        //   1️⃣: 1
        //   2️⃣: 0
        //   3️⃣: 3
        //   4️⃣: 10
        // }
        collectedReactions.forEach(reaction => {
          if (reactionCounts[reaction]) {
            reactionCounts[reaction]++
          } else {
            reactionCounts[reaction] = 1
          }
        })

        // Using those results, rebuild the description from earlier with the vote counts
        let surveyResults = ""
        survey.answers.forEach((question, index) => {
          let voteCount = 0
          if (reactionCounts[reactions[index]]) {
            voteCount = reactionCounts[reactions[index]]
          }
          let voteCountContent = `(${voteCount} vote${voteCount !== 1 ? 's' : ''})`
          surveyResults += `${reactions[index]}: ${question} ${voteCountContent}\n`;
        })

        // Create the embed and send it to the channel
        let surveyResultsEmbed = new Discord.MessageEmbed()
          .setTitle(`Results for '${survey.question}' (${collectedArray.length} total votes)`)
          .setDescription(surveyResults)

        msg.channel.send(surveyResultsEmbed);
      })
      .catch((err) => {
        console.error('Something went wrong', err);
        if (err === 'timeout_format_error') {
          msg.channel.send("That doesn't seem to be a valid number...");
        } else {
          msg.channel.send('Sorry! Something went wrong...');
        }
      });
  }
}