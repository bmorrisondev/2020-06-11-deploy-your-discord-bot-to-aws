const axios = require('axios')
const Discord = require('discord.js')

module.exports = {
  // Define the prefix
  prefix: "!gists",
  // Define a function to pass the message to
  fn: (msg) => {
    let args = msg.content.split(' ')
    let username = args[1];
    // Check to make sure a username is provided
    if (!username) {
      msg.reply("Please provide a username.");
    } else {
      // Setup our Axios options. Perform a GET request to the url specified
      let axiosOptions = {
        method: "get",
        url: `https://api.github.com/users/${username}/gists`
      }

      // Pass in the options to Axios to make the request
      axios(axiosOptions)
        .then(response => {
          console.log(response.data)
          // Map our data to grab only the description
          let gists = response.data.map(el => el.description)

          // Loop through the descriptions and add a line to the embed
          let embedDescription = "";
          gists.forEach(el => {
            embedDescription += `- ${el}\n`
          });

          // Create the embed & send it to the channel
          let embed = new Discord.MessageEmbed()
            .setTitle(`Gists for ${username}`)
            .setDescription(embedDescription)
            .setURL(`https://www.github.com/users/${username}/gists`)
          msg.channel.send(embed);
        })
    }
  }
}