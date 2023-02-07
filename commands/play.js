const { SlashCommandBuilder} = require('@discordjs/builders')
const { EmbedBuilder } = require ('discord.js')
const { QueryType } = require ('discord-player')


module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("p")
    .setDescription("Escolha uma música, masqueico")
    .addSubcommand(subcommand => {
        return subcommand
            .setName("search")
            .setDescription("Descubra uma música")
            .addStringOption(option => {
                return option
                    .setName("searchterms")
                    .setDescription("Procure por palavra chave")
                    .setRequired(true)
            })
    })
    .addSubcommand(subcommand => {
        return subcommand
            .setName("playlist")
            .setDescription("Playlist do youtube")
            .addStringOption(option => {
                return option
                    .setName("url")
                    .setDescription("link do youtube")
                    .setRequired(true)
            })
    }),
    execute: async ({client, interaction}) => {
        if (!interaction.member.voice.channel){
            await interaction.reply("Entre em um canal de voz para tocar a música, Sr.Masqueico")
            return
        }

        const queue = await client.player.createQueue(interaction.guild)

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder()
        if(interaction.options.getSubcommand() === "song"){
            let url = interaction.options.getString("url")

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            })

            if (result.tracks.lenght === 0){
                await interaction.reply ("Não achei sua música men")
                return
            }

            const song = result.tracks
            await queue.addTracks(song)

            embed
                .setDescription(`Adicionei **[${song.title}](${song.url})** na queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duração: ${song.duration}`})
        }
        else if(interaction.options.getSubcommand() === "playlist"){
            let url = interaction.options.getString("url")

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            })

            if (result.tracks.lenght === 0){
                await interaction.reply ("Não achei sua playlist men")
                return
            }

            const playlist = result.playlist
            await queue.addTracks(playlist)

            embed
                .setDescription(`Adicionei **[${playlist.title}](${playlist.url})** na queue`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({text: `Duração: ${playlist.duration}`})
        }
        else if(interaction.options.getSubcommand() === "search"){
            let url = interaction.options.getString("searchterms")

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            })

            if (result.tracks.lenght === 0){
                await interaction.reply ("Não achei nada men")
                return
            }

            const song = result.tracks
            await queue.addTracks(song)

            embed
                .setDescription(`Adicionei **[${song.title}](${song.url})** na queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duração: ${song.duration}`})
        }

        if (!queue.playing) await queue.play()
        await interaction.reply({
            embeds: [embed]
        })
    }
}