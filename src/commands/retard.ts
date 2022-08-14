import { ICommand } from "wokcommands";

module.exports = {
  category: 'retard',
  description: 'Night is retarded!',

  slash: true,
  
  callback: ({ interaction }) => {
    interaction.reply('Night is retarded <:steamhappy:975141265559670874>');
  }
} as ICommand;