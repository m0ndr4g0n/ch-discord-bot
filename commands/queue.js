const { SlashCommandBuilder} = require('@discordjs/builders')
const { EmbedBuilder } = require ('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Mostra as primeiras músicas na fila'),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild)

        if(!queue || ! queue.playing ) {
            await interaction.reply('Não tem nada tocando')
            return
        }

        const queueString = queue.tracks.slice(0,10).map((song, i) => {
            return `${i + 1}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
        }).joing('\n')

        const currentSong = queue.current

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Tocando: **\n\` ${currentSong.title} - <@${currentSong.requestedBy.id}>\n\n**Queue: **\n${queueString}`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}