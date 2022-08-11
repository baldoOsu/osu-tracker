import dotenv from 'dotenv'
dotenv.config();

import ExtendedClient from './structs/Client';

import { Intents } from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';

let intents: Intents[] = [];

const client = new ExtendedClient(intents);


client.on('ready', () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    featuresDir: path.join(__dirname, 'features'),
    testServers: ['346227820269273089']
  });
});

client.login(process.env.DISCORD_TOKEN);
