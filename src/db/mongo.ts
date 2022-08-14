import dotenv from 'dotenv';
dotenv.config();

import { connect, model, Connection, Model } from 'mongoose';
import { TrackingUsers } from './wrappers/usersToTrack';



export class Mongo {
  connection!: Connection;
  TrackingUsers!: TrackingUsers;

  
  constructor() {
    connect(process.env.MONGO_URI!).then((mongo=>{
      this.connection = mongo.connection;
      this.TrackingUsers = new TrackingUsers();
    }))
  }

}
