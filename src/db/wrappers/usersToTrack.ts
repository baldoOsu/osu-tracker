import { model, Model } from 'mongoose';


import { trackingUsersSchema, User } from '../Schemas/usersToTrack';


export class TrackingUsers {
  trackingUsersModel!: Model<User>;

  contructor() {
    this.trackingUsersModel = model<User>('trackingUsers', trackingUsersSchema);
  }

  insertUser(username: string, id: number): Promise<void> {
    return new Promise(async(resolve) => {
      await this.trackingUsersModel.create({
        username: username,
        id: id,
        mapsPlayed: []
      });
      resolve();
    });
  }

  findUser(username?: string, id?: number): Promise<User | null> {
    return new Promise(async(resolve, reject)=> {
      if ( username == undefined && id == undefined) {
        reject(new Error('[TrackingUsers] Error: Neither username nor id were provided'));
      }
      if (username) {
        resolve(await this.trackingUsersModel.findOne({ username: new RegExp(username, 'i') }));
      }
      else if (id) {
        resolve(await this.trackingUsersModel.findOne({ id: id }));
      }
    });
  }

  updateUsername(id: number, newUsername: string): Promise<boolean> {
    return new Promise(async(resolve)=> {
      let result = await this.trackingUsersModel.updateOne(
        { id: id },
        { username: newUsername }
      );
      resolve(result.modifiedCount > 0);
    })
  }

  insertMap(mapUrl: string, username?: string, id?: number ): Promise<boolean> {
    return new Promise(async(resolve, reject)=> {
      if (username) {
        let result = await this.trackingUsersModel.updateOne(
          { username: new RegExp(username, 'i') },
          { $push: { mapsPlayed: mapUrl }}
        );
        resolve(result.modifiedCount > 0);
      }
      else if (id) {
        let result = await this.trackingUsersModel.updateOne(
          { id: id }, 
          { $push: { mapsPlayed: mapUrl }}
        );
        resolve(result.modifiedCount > 0);
      }
      reject(new Error('[TrackingUsers] Error: Neither username nor id were provided'));
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

  exists (username?: string, id?: number): Promise<boolean> {
    return new Promise(async(resolve, reject)=> {
      if (username) {
        let user = await this.trackingUsersModel.exists({ username: new RegExp(username, 'i') });
        resolve(user != null);
      }
      else if (id) {
        let user = await this.trackingUsersModel.exists({ id: id });
        resolve(user != null);
      }
      reject(new Error('[TrackingUsers] Error: Neither username nor id were provided'));
    });
  }

  
}