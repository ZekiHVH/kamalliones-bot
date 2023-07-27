//#region Express.js
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  return res.send("🚀 Up and running...");
});

app.listen(3000, () => {});

//#endregion

//#region Discord.js

// Require the necessary discord.js classes
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
const token = process.env.TOKEN;

// Require node path and filesystem to handle commands
const fs = require("node:fs");
const path = require("node:path");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.error(
        `ERROR! The command file ${filePath} is missing a required property. ("data" or "execute")`
      );
    }
  }
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
      console.error(error);
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
      console.error(error);
    }
  }

  console.log(interaction);
});

client.on(Events.MessageCreate, async (interaction) => {
  if (interaction.member.roles.cache.some((role) => role.id === "323973273740247048")) {
    if (!interaction.member.permissions.has(PermissionsBitField.All)) await interaction.delete();
  }
  if (interaction.channelId == "1134119017062354954") {
    interaction.member.timeout(
      28 * 24 * 60 * 60 * 1000,
      "ANTI-SPAM | Message @zekihvh / @jaodrigo"
    );
    await interaction.delete();
  }
});

// Log in to Discord with your client's token
client.login(token);

//#endregion
