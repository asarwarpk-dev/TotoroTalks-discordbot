require("dotenv").config();

console.log(process.env.DISCORDJS_BOT_TOKEN);

const { Client, WebhookClient, GatewayIntentBits } = require('discord.js');
const PREFIX = "$";

const client = new Client({
  partials: ['MESSAGE', 'REACTION'],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,   // To receive message events
    GatewayIntentBits.MessageContent   // To read message text
  ],
});

const webhookClient = new WebhookClient({
  id: process.env.WEBHOOK_ID,
  token: process.env.WEBHOOK_TOKEN,
});

client.once('clientReady', () => {
  console.log(`${client.user.tag} has logged in.`);
});

client.on('messageCreate', async (message) => {
//   console.log(message.content)
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    console.log(CMD_NAME);
    console.log(...args);
    if (CMD_NAME === 'kick') {
      if (!message.member.permissions.has('KICK_MEMBERS'))
        return message.reply('You do not have permissions to use that command');
      if (args.length === 0)
        return message.reply('Please provide an ID');
      const member = message.guild.members.cache.get(args[0]);
      console.log(member);
      if (member) {
        member
          .kick()
          .then((member) => message.channel.send(`${member} was kicked.`))
          .catch((err) => message.channel.send('I cannot kick that user :('));
      } else {
        message.channel.send('That member was not found');
      }
    } else if (CMD_NAME === 'ban') {
      if (!message.member.permissions.has('BAN_MEMBERS'))
        return message.reply("You do not have permissions to use that command");
      if (args.length === 0) return message.reply("Please provide an ID");
      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send('User was banned successfully');
      } catch (err) {
        console.log(err);
        message.channel.send('An error occured. Either I do not have permissions or the user was not found');
      }
    } else if (CMD_NAME === 'announce') {
      console.log(args);
      const msg = args.join(' ');
      console.log(msg);
      webhookClient.send(msg);
    }
  }
});


client.login(process.env.DISCORDJS_BOT_TOKEN);