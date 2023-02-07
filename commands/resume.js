const { SlashCommandBuilder} = require('@discordjs/builders')
const { EmbedBuilder } = require ('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Mim de minha música'),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild)

        if (!queue){
            await interaction.reply('Não tem música tocando')
            return
        }
        queue.setPaused(false)

        await interaction.reply('Despausa a música')
    }
}