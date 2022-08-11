import { Client, Intents } from 'discord.js';

export default class ExtendedClient extends Client {
  constructor(intents: Intents[]) {
    super({intents: intents});
  }
}