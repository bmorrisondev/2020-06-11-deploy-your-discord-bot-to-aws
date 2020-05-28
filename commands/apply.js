require('dotenv').config();
require('azure-app-service-keepalive').keepalive();
const azure = require('azure-storage');
// Create the service used to connect to our storage table with the connection string
const tableService = azure.createTableService(
  process.env.STORAGE_CONNECTION_STRING
);

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

        // Add the PartitionKey & RowKey, the only two required fields for saving the object
        application.PartitionKey = new Date().toISOString();
        application.RowKey = new Date().toISOString();

        // Insert the entity
        tableService.insertEntity('applications', application, (error) => {
          if (!error) {
            // Finally, return a message to the user stating that the app was saved
            return msg.member.send(
              "We've successfully received your application. We'll be in touch 😊."
            );
          } else {
            throw 'Unable to save record, err' + error;
          }
        });
      });
  }
};
