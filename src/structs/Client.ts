import { Client, Intents } from 'discord.js';
import { Mongo } from '../db/mongo';

import { osuApi } from '../osu_api/osuApi';
import { OAuthCreds } from '../typings/osu_api/auth';

export default class ExtendedClient extends Client {
  currentlyTracking: string[] = [];
  osuClient: osuApi;
  regExps = {
    "mm:ss": /([^0])([0-9]*|:){4,}/g
  };
  mongo: Mongo;
  

  constructor(intents: Intents[], osuCredentials: OAuthCreds) {
    super({intents: intents});

    this.osuClient = new osuApi(osuCredentials);
    this.mongo = new Mongo();
  }

  formatToMMSS(seconds: number): string {
    let result = new Date(seconds * 1000).toISOString().slice(11, 19);
    result.match(this.regExps["mm:ss"]);
    if(result.startsWith(':')) result = '0' + result;
    
    return result;
  }
}