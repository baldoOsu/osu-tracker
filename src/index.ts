import dotenv from 'dotenv'
dotenv.config();

import ExtendedClient from './structs/Client';
import { OAuthCreds } from './typings/osu_api/auth';

import { Intents, Client } from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';

let intents: Intents[] = [];
let osuCredentials: OAuthCreds = {
  client_id: parseInt(process.env.OSU_CLIENT_ID!),
  client_secret: process.env.OSU_CLIENT_SECRET!,
  grant_type: 'client_credentials',
  scope: 'public'
}

const client = new ExtendedClient(intents, osuCredentials);

client.on('ready', () => {
  // @ts-ignore: Unreachable code error
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    featuresDir: path.join(__dirname, 'features'),
    testServers: ['346227820269273089']
  });
});

client.login(process.env.DISCORD_TOKEN);
