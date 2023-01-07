import { Collection } from 'discord.js';
import { model, Model } from 'mongoose';
import { UpdateResult } from 'mongodb';


import { trackingUsersSchema, User } from '../Schemas/usersToTrack';


export class TrackingUsers {
  trackingUsersModel!: Model<User>;
  cache: Collection<number, User> = new Collection();

  contructor() {
    this.trackingUsersModel = model<User>('trackingUsers', trackingUsersSchema);
    this.getAllUsers().then(users=> {
      users.forEach((user: User) => {
        this.cache.set(user.id, user);
      });
    })
  }

  insertUser(username: string, id: number): Promise<void> {
    return new Promise(async(resolve) => {
      await this.trackingUsersModel.create({
        username: username,
        id: id,
        mapsPlayed: []
      });
      if(!this.cache.has(id)) {
        this.cache.set(id, {
          username: username,
          id: id,
          mapsPlayed: [],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      resolve();
    });
  }

  findUser(args: {username?: string, id?: string}): Promise<User | null> {
    return new Promise(async(resolve, reject)=> {
      if ( args.username == undefined && args.id == undefined) {
        reject(new Error('[TrackingUsers] Error: Neither username nor id were provided'));
      }
      if (args.username) {
        resolve(await this.trackingUsersModel.findOne({ username: new RegExp(args.username, 'i') }));
      }
      else if (args.id) {
        resolve(await this.trackingUsersModel.findOne({ id: args.id }));
      }
    });
  }

  getAllUsers(): Promise<any> {
    return new Promise(async(resolve, reject)=> {
      let users = await this.trackingUsersModel.find();
      resolve(users);
    }).catch(err => {
      console.log(err);
      return [];
    }
    );
  }

  updateUsername(id: number, newUsername: string): Promise<boolean> {
    return new Promise(async(resolve)=> {
      let result = await this.trackingUsersModel.updateOne(
        { id: id },
        { username: newUsername }
      );
      let user = this.cache.get(id);
      if(user!=undefined) {
        user.username = newUsername;
        user.updatedAt = new Date();
      }
      resolve(result.modifiedCount > 0);
    });
  }

  insertMap(mapUrl: string, username?: string, id?: number ): Promise<boolean> {
    let result: UpdateResult;
    let user: User | undefined;
    return new Promise(async(resolve, reject)=> {
      if (username) {
        result = await this.trackingUsersModel.updateOne(
          { username: new RegExp(username, 'i') },
          { $push: { mapsPlayed: mapUrl }}
        );
        user = this.cache.find(u => u.username == username);
      }
      else if (id) {
        result = await this.trackingUsersModel.updateOne(
          { id: id }, 
          { $push: { mapsPlayed: mapUrl }}
        );
        user = this.cache.get(id);
      }
      else {
        reject(new Error('[TrackingUsers] Error: Neither username nor id were provided'));
        return;
      }
      if(user!=undefined) {
        user.mapsPlayed.push(mapUrl);
        user.updatedAt = new Date();
      }
      resolve(result.modifiedCount > 0);
    });
  }

  getUserMaps(username?: string, id?: number): Promise<string[]> {
    return new Promise(async(resolve, reject)=> {

      if( username == undefined && id == undefined) {
        reject(new Error('[TrackingUsers] Error: Neither username nor id were provided'));
      }

      if (username) {
        let user = await this.trackingUsersModel.findOne({ username: new RegExp(username, 'i') });
        if (user) {
          resolve(user.mapsPlayed);
        }
        else {
          reject(new Error('[TrackingUsers] Error: User not found'));
        }
      }
      else if (id) {
        let user = await this.trackingUsersModel.findOne({ id: id });
        if (user) {
          resolve(user.mapsPlayed);
        }
        else {
          reject(new Error('[TrackingUsers] Error: User not found'));
        }
      }
    });
  }

  exists (args: {username?: string, id?: number}): Promise<boolean> {
    return new Promise(async(resolve, reject)=> {
      if (args.username) {
        let user = await this.trackingUsersModel.exists({ username: new RegExp(args.username, 'i') });
        resolve(user != null);
      }
      else if (args.id) {
        let user = await this.trackingUsersModel.exists({ id: args.id });
        resolve(user != null);
      }
      reject(new Error('[TrackingUsers] Error: Neither username nor id were provided'));
    });
  }

  
}