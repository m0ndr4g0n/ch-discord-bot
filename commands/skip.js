const { SlashCommandBuilder} = require('@discordjs/builders')
const { EmbedBuilder } = require ('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula essa música de merda'),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild)

        if (!queue){
            await interaction.reply('Não tem música tocando')
            return
        }

        const currentSong = queue.current

        queue.skip()

        await interaction.reply({
            embeds: [
               new EmbedBuilder()
                    .setDescription(`Pulei ** ${currentSong.title}** xDDD`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}