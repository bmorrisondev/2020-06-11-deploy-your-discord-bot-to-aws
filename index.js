require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')

// Create the empty commands object
const commands = {}
// Get the file names from the commands directory
const files = fs.readdirSync('./commands')
// Filter out any non-js files
const jsFiles = files.filter(file => file.endsWith('.js'))
// Foreach, require the file, check for the right exports, then add to the commands object
jsFiles.forEach(commandFile => {
  const command = require(`./commands/${commandFile}`)
  if (command.prefix && command.fn) {
    commands[command.prefix] = command.fn;
  }
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  // Grab the prefix, which should be the content before the first space
  const prefix = msg.content.split(' ')[0];
  // Filter out bad commands and bots
  if (commands[prefix] === undefined || msg.author.bot) {
    return
  }

  // Execute the fn of the prefix object, passing in the message
  commands[prefix](msg);
});

client.login(process.env.DISCORD_BOT_TOKEN);