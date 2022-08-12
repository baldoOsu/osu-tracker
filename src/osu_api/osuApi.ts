import axios, { AxiosRequestHeaders } from 'axios';
import { OAuthCreds } from '../typings/osu_api/auth';


export class osuApi {
  BASE_URL: string; // Base URL for the API
  CID: number;      // Client Id
  SECRET: string;   // Client Secret
  // private ACCESS_TOKEN: string;



  constructor(creds: OAuthCreds) {
    this.BASE_URL = 'https://osu.ppy.sh/api/v2';
    this.CID = creds.clientId;
    this.SECRET = creds.clientSecret;
  }

  async _Auth() {
    return new Promise((resolve, reject) => {
      this._request('POST', `${this.BASE_URL}/oauth/token`, {
        grant_type: 'client_credentials',
        scope: 'public'
      }, {
        headers: {
          Accept: `application/json`,
          'Content-Type': 'application/json'
        }
      }).then()
    });
  }

  async _request(method: string, endpoint: string, data?: object, headers?: AxiosRequestHeaders) {
    return new Promise(async(resolve, reject) => {
      const resp = await axios.request({
        method: method,
        url: `${this.BASE_URL}${endpoint}`,
        data: data,
        headers: headers
      }).catch(err=>{
        console.error(`[osuApi] Error in ${method} request to ${endpoint}`, err);
        reject(err);
      });

      resolve(resp?.data);
    });
  }
}

