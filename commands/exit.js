const { SlashCommandBuilder} = require('@discordjs/builders')
const { EmbedBuilder } = require ('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exit')
        .setDescription('Vou de berço'),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild)

        if (!queue){
            await interaction.reply('Não tem música tocando')
            return
        }
        queue.stop()

        await interaction.reply('tchauuuuuuu brigado, chama')
    }
}