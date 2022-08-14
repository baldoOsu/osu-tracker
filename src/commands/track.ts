import { ICommand } from "wokcommands";
import ExtendedClient from "../structs/Client";

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

  callback: async({ interaction, client }) => {
    await interaction.deferReply({ephemeral: true});

    let player = interaction.options.getString('player')!;
    let key: 'id' | 'username' = 'username';
    let playerId;

    let isPlayerId = parseInt(player);
    if(isPlayerId) {
      playerId = isPlayerId;
      key = 'id';
    }

    // @ts-ignore: Unreachable code error
    let ExtendedClient = <ExtendedClient>(<unknown>client);

    let exists = await ExtendedClient.mongo.TrackingUsers.exists(player);
    if(exists) {
      interaction.reply('User already tracked');
      return;
    }
    else {
      let user = await ExtendedClient.osuClient.getUser(player, key);

      // await ExtendedClient.mongo.TrackingUsers.insertUser(player);
      interaction.reply('User tracked');
    }

  }
} as ICommand;