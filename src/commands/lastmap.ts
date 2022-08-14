import dotenv from 'dotenv';
dotenv.config();

import FormData from 'form-data';

import { MessageAttachment } from "discord.js";
import { ICommand } from "wokcommands";
import ExtendedClient from "../structs/Client";

import axios from "axios";


module.exports = {
  category: 'Tracking',
  description: 'Get last played map of player',

  slash: true,

  options: [{
    name: 'player',
    description: 'Target player',
    required: true,
    type: 'STRING'
  }],
  
  callback: async({ interaction, client }) => {
    await interaction.deferReply();
    const player = interaction.options.getString('player')!;

    let beatmap = await (<ExtendedClient>(<unknown>client)).osuClient.getLastMapInfo(player);

    let mapLength = (<ExtendedClient>(<unknown>client)).formatToMMSS(beatmap.total_length);


    let embed = {
      author: {
        name: `${beatmap.beatmapset.title} [${beatmap.version}]`,
        url: beatmap.url,

      },
      thumbnail: {
        url: `https://b.ppy.sh/thumb/${beatmap.beatmapset_id}l.jpg`
      },
      description: `
      > **Length**: ${mapLength}
      > [Download](${beatmap.url})
      > **Star Rating**: ${beatmap.difficulty_rating} \u200b \u200b - \u200b \u200b **Max Combo**: ${beatmap.max_combo}
      > **BPM**: ${beatmap.bpm} - **AR**: ${beatmap.ar} - **OD**: ${beatmap.accuracy} - **CS**: ${beatmap.cs} - **HP**: ${beatmap.drain}`,

      image: {
        url: beatmap.beatmapset.covers['cover@2x']
      }
    }

    let my_big_cock_discord = await interaction.editReply({
      embeds: [embed],
      // files: [bgAttachment],
    });

    // embed.image = {
    //   url: (my_big_cock_discord.attachments as Array<any>)[0].url // fuck my life
    // }

    // interaction.editReply({
    //   embeds: [embed],
    //   files: []
    // })
    

  }
} as ICommand;