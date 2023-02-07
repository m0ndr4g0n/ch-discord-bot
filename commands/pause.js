const { SlashCommandBuilder} = require('@discordjs/builders')
const { EmbedBuilder } = require ('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausa a musica oni chan'),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild)

        if (!queue){
            await interaction.reply('Não tem música tocando')
            return
        }
        queue.setPaused(true)

        await interaction.reply('Pausei pra você ^^')
    }
}