import { ICommand } from "wokcommands";
import ExtendedClient from "../structs/Client";

module.exports = {
  category: 'tracking',
  description: 'Get a players recent activity',

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
    const player = interaction.options.getString('player')!;

    let recentActivity = await (<ExtendedClient>(<unknown>client)).osuClient.getRecentActivity(player);
    console.log(recentActivity);

    interaction.editReply(`Done!`);

  }
} as ICommand;