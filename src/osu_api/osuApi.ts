import dotenv from 'dotenv';
dotenv.config();

import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { OAuthCreds, OAuthResponse } from '../typings/osu_api/auth';
import { RecentResponse, Beatmap } from '../typings/osu_api/maps';



const isOAuthResponse = (response: unknown): response is OAuthResponse => 
  (response as OAuthResponse).access_token !== undefined;

const isCredsDefined = (creds: { access_token: string, expires_in: number }): boolean =>
  creds.access_token !== undefined && creds.expires_in !== undefined;

const isAxiosResponse = (response: unknown): response is AxiosResponse =>
  (response as AxiosResponse).data !== undefined;

const isDataNonEmptyArray = (response: unknown): response is { data: unknown[] } =>
  (response as { data: unknown[] }).data !== undefined && (response as { data: unknown[] }).data.length > 0;

const isRecentResponse = (response: unknown): response is RecentResponse =>
  (response as RecentResponse).beatmap !== undefined && (response as RecentResponse).beatmapset !== undefined;

const isBeatmap = (response: unknown): response is Beatmap =>
  (response as Beatmap).id !== undefined;

export class osuApi {
  BASE_URL: string; // Base URL for the API
  CID: number;      // Client Id
  SECRET: string;   // Client Secret
  private ACCESS_TOKEN?: string;
  private EXPIRES_IN?: number;



  constructor(creds: OAuthCreds) {
    this.BASE_URL = 'https://osu.ppy.sh/api/v2';
    this.CID = creds.client_id;
    this.SECRET = creds.client_secret;

    // auth
    this._Auth().then(resp => {
      this.ACCESS_TOKEN = resp.access_token;
    });
  }

  async getUser(player: string, key: 'id' | 'username' = 'username'): Promise<any> {
    let endpoint = `/users/${player}`;
    return new Promise(async(resolve, reject) => {
      const resp = await this._request('GET', endpoint, {
        params: {
          key: key
        },
        headers: this._buildDefaultHeaders()
      }).catch(err => {
        console.error(`[osuApi] Error in getUser request`, err);
        reject(err);
      } );
      resolve(resp);
    } );
  }

  async getUsers(playerIds: string[]): Promise<any> {
    let endpoint = `/users`;
    return new Promise(async(resolve, reject) => {
      const resp = await this._request('GET', endpoint, {
        params: {
          "ids[]": playerIds.join(',')
        },
        headers: this._buildDefaultHeaders()
      }).catch(err => {
        console.error(`[osuApi] Error in getUsers request`, err);
        reject(err);
      } );
      resolve(resp?.data);
    } );
  }

  async getLastMapInfo(player: string): Promise<Beatmap> {
    let endpoint = `/users/${player}/scores/recent?limit=1&include_fails=true&mode=osu`;
    // let failError = new Error('[osuApi] getLastMapInfo request failed');
    return new Promise(async(resolve, reject) => {
      let recentScore = await this._request('GET', endpoint, {
        headers: this._buildDefaultHeaders()
      }).catch(err => {
        console.error(new Error('[osuApi] getLastMapInfo request failed'), err);
        reject(err);
      } );

      if(!isAxiosResponse(recentScore)) {
        reject(new Error('[osuApi] getLastMapInfo request failed'));
        return;
      }

      if(!isDataNonEmptyArray(recentScore)) {
        reject(new Error('[osuApi] getLastMapInfo request failed, no data'));
      }


      if(!isRecentResponse(recentScore.data[0])) {
        reject(new Error('[osuApi] getLastMapInfo request failed, recent score is not a valid response'));
      }

      let beatmap = await this.getBeatmap(recentScore.data[0].beatmap.id);
      
      resolve(beatmap);


    });
  }

  async getRecentActivity(player: string, args?: { limit: number, offset: number }): Promise<any> {
    let params = '';
    if(args) {
      params = this._buildQueryParams(args);
    }
    let endpoint = `/users/${player}/recent_activity?${params}`;
    return new Promise(async(resolve, reject) => {
      const resp = await this._request('GET', endpoint, {
        headers: this._buildDefaultHeaders()
      }).catch(err => {
        console.error(`[osuApi] Error in getRecentActivity request`, err);
        reject(err);
      } );
      resolve(resp);
    });
  }

  async getBeatmap(id: string): Promise<Beatmap> {
    let endpoint = `/beatmaps/${id}`;
    let failError = new Error('[osuApi] getBeatmap request failed');
    return new Promise(async(resolve, reject) => {
      const resp = await this._request('GET', endpoint, {
        headers: this._buildDefaultHeaders()
      }).catch(err => {
        console.error(failError, err);
        reject(err);
      } );
      if(!isAxiosResponse(resp)) {
        reject(failError);
        return;
      }
      if(!isBeatmap(resp.data)) {
        reject(failError);
      }

      resolve(resp.data);
    } );
  }

  // peppy said no
  // async downloadBeatmap(mapsetId: string): Promise<any> {
  //   let url = `https://osu.ppy.sh/beatmapsets/${mapsetId}/download`;

  //   let headers = {
  //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  //     'Referer': `https://osu.ppy.sh/beatmapsets/${mapsetId}`,
  //     'Cookie': process.env.OSU_DOWNLOAD_COOKIE!,
  //     'Accept-Encoding': 'gzip, deflate'
  //   }

  //   return new Promise(async(resolve, reject) => {
  //     const resp = await axios.get(url, 
  //       {
  //         headers: headers,
  //         responseType: 'stream'
  //       }
  //     ).catch(err => {
  //       console.error(`[osuApi] Error in downloadBeatmap request`, err);
  //       reject(err);
  //     });


  //     resolve(resp?.data);
  //   })


  // }

  async _Auth(): Promise<OAuthResponse> {
    return new Promise(async(resolve, reject) => {
      const resp = await axios.post(`https://osu.ppy.sh/oauth/token`,
        {
          client_id: this.CID,
          client_secret: this.SECRET,
          grant_type: 'client_credentials',
          scope: 'public'
        }
        , {
          headers: {
            Accept: `application/json`,
            'Content-Type': 'application/json'
          }
      }).catch(err => {
        console.error(`[osuApi] Error in Auth request`, err);
        reject(err);
      });
      if(!isOAuthResponse(resp?.data)) {
        reject(new Error('[osuApi] Auth request failed'));
      }
      else resolve(resp!.data);
    });
  }

  async _request(method: string, endpoint: string, args: { data?: object, params?: object,  headers?: AxiosRequestHeaders } ): Promise<AxiosResponse> {
    return new Promise(async(resolve, reject) => {
      const resp = await axios.request({
        method: method,
        url: `${this.BASE_URL}${endpoint}`,
        data: args.data,
        params: args.params,
        headers: args.headers
      }).catch(err=>{
        console.error(`[osuApi] Error in ${method} request to ${endpoint}`, err);
        reject(err);
      });
      if(!resp) reject(new Error(`[osuApi] ${method} request to ${endpoint} failed`));
      else {
        resolve(resp);
      }
    });
  }

  _buildDefaultHeaders(extraHeaders?: object): AxiosRequestHeaders {
    return {
      Accept: `application/json`,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.ACCESS_TOKEN}`,
      ...extraHeaders
    };
  }

  _buildQueryParams(params: { [key: string]: string | number }): string {
    return Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
  }

  
}

