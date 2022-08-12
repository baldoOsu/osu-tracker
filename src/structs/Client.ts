import { Client, Intents } from 'discord.js';
import { OAuthCreds } from '../typings/osu_api/auth';

export default class ExtendedClient extends Client {
  currentlyTracking: string[] = [];
  

  constructor(intents: Intents[], creds: OAuthCreds) {
    super({intents: intents});
  }

  _auth() {

  }
}