import axios from 'axios';

export class osuApi {
  BASE_URL: string; // Base URL for the API
  CID: string;      // Client Id
  SECRET: string;   // Client Secret
  // private ACCESS_TOKEN: string;



  constructor(creds: ApiCreds) {
    this.BASE_URL = 'https://osu.ppy.sh/api/v2';
    this.CID = creds.clientId;
    this.SECRET = creds.clientSecret;
  }

  _Auth() {

  }
}

interface ApiCreds {
  clientId: string;
  clientSecret: string;
}