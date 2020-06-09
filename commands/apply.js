require('dotenv').config();
const AWS = require('aws-sdk');
// Update our AWS Connection Details
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
// Create the service used to connect to DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  // Define the prefix
  prefix: '!apply',
  // Define a function to pass the message to
  fn: (msg) => {
    let application = {};
    let filter = (msg) => !msg.author.bot;
    let options = {
      max: 1,
      time: 15000
    };

    msg.member
      .send(
        'Thanks for your interest in the position! First, what is your name?'
      )
      .then((dm) => {
        // After each question, we'll setup a collector on the DM channel
        return dm.channel.awaitMessages(filter, options);
      })
      .then((collected) => {
        // Convert the collection to an array & get the content from the first element
        application.name = collected.array()[0].content;
        // Ask the next question
        return msg.member.send("Got it, now what's your email address?");
      })
      .then((dm) => {
        return dm.channel.awaitMessages(filter, options);
      })
      .then((collected) => {
        application.emailAddress = collected.array()[0].content;
        return msg.member.send(
          "Excellent. Finally, tell us why you'd be a good fit."
        );
      })
      .then((dm) => {
        return dm.channel.awaitMessages(filter, options);
      })
      .then((collected) => {
        application.pitch = collected.array()[0].content;

        // Setup the parameters required to save to Dynamo
        const params = {
          TableName: 'demo-discord-bot',
          Item: {
            // Use Date.now().toString() just to generate a unique value
            id: Date.now().toString(),
            // `info` is used to save the actual data
            info: application
          }
        }

        docClient.put(params, (error) => {
          if (!error) {
            // Finally, return a message to the user stating that the app was saved
            return msg.member.send("We've successfully received your application. We'll be in touch 😊.")
          } else {
            throw "Unable to save record, err" + error
          }
        })
      });
  }
};