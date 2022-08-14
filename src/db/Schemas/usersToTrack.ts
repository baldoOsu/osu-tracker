import { Schema } from 'mongoose';

export interface User {
  username: string;
  id: number;
  mapsPlayed: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const trackingUsersSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    mapsPlayed: {
      type: [String],
      required: false,
      default: []
    },
  },
  {
    timestamps: true,
    statics: {
      async findByUsername(username: string) {
        return await this.findOne( { username: new RegExp(username, 'i')} );
      },
      async findById(id: number) {
        return await this.findOne({ id: id });
      },
      insertNewMap(mapUrl: string, username?: string, id?: number): Promise<void> {
        return new Promise(async(resolve, reject)=> {
          if (username) {
            this.findOneAndUpdate({ username: username })
          }
          else if (id) {
            this.findOneAndUpdate({ id: id }, {})

          }


          reject(new Error('User not found'));
        });
        
      }
    }
  }
);

trackingUsersSchema.post('save', async(doc: User)=> {
  console.log(`Saved user ${doc.username}`);
});
