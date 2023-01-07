import { ICommand } from "wokcommands";
import ExtendedClient from "../structs/Client";

import { User } from "../db/Schemas/usersToTrack";

module.exports = {
  category: 'Tracking',
  description: 'Track a player\'s played maps',

  slash: true,
  guildOnly: true,

  options: [{
    name: 'player',
    description: 'Target player',
    required: true,
    type: 'STRING'
  }],

  init: async(client: ExtendedClient) => {
    setInterval(()=>{
      let arr = [...(client.mongo.TrackingUsers.cache)];
      
      const chunkSize = 50;
      for(let i = 0; i < arr.length; i += chunkSize) {
        let chunk = arr.slice(i, i + chunkSize);
        // client.osuClient.
      }

    }, 1000*60*5);

  },

  callback: async({ interaction, client }) => {
    await interaction.deferReply({ephemeral: true});

    let player = interaction.options.getString('player')!;
    let key: 'id' | 'username' = 'username';
    let playerId;
    let exists;

    

    // @ts-ignore: Unreachable code error
    let ExtendedClient = <ExtendedClient>(<unknown>client);

    let isPlayerId = parseInt(player);
    if(isPlayerId) {
      playerId = isPlayerId;
      key = 'id';
      exists = await ExtendedClient.mongo.TrackingUsers.exists({
        id: playerId
      });
    }
    else {
      exists = await ExtendedClient.mongo.TrackingUsers.exists({
        username: player
      });
    }

    
    if(exists) {
      interaction.reply('User already tracked');
      return;
    }
    else {
      let user = await ExtendedClient.osuClient.getUser(player, key);
      await ExtendedClient.mongo.TrackingUsers.insertUser(user.username, user.id);

      interaction.reply('User tracked');
    }

  }
} as ICommand;