import dotenv from 'dotenv';
dotenv.config();

import { ICommand } from "wokcommands";

module.exports = {
  category: 'tracking',
  description: 'Track a user\'s played maps',

  slash: true,
  guildOnly: true,

  options: [
    {
      name: 'player',
      description: 'The player to track',
      required: true,
      type: 'STRING'
    }
  ],

  // init: async() => {

  // },

  callback: async({interaction, client}) => {
    const player = interaction.options.getString('player');

    
  }
} as ICommand;